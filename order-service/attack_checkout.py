import requests
import json
import time
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor
from requests.adapters import HTTPAdapter

# --- CONFIG ---
GATEWAY_URL = "http://localhost:8080"
ORDER_URL = f"{GATEWAY_URL}/order-service/v1/order/create-from-cart"
TOTAL_REQUESTS = 400
CONCURRENT_THREADS = 100 
REQUESTS_PER_THREAD = TOTAL_REQUESTS // CONCURRENT_THREADS

class Metrics:
    def __init__(self):
        self.success = 0
        self.failed = 0
        self.latencies = []
        self.start_time = 0
        self.end_time = 0

    def record(self, success, latency):
        if success: self.success += 1
        else: self.failed += 1
        self.latencies.append(latency)
    
    def merge(self, other):
        self.success += other.success
        self.failed += other.failed
        self.latencies.extend(other.latencies)

# Global metrics to aggregate results
global_metrics = Metrics()

def load_users():
    with open("user_data.json", "r") as f:
        return json.load(f)

def run_worker_thread(users_subset):
    """
    Simulates a worker (or a group of users) keeping a persistent connection.
    """
    local_metrics = Metrics()
    
    # Init Session ONCE per thread -> Reuses TCP Connection (Keep-Alive)
    session = requests.Session()
    adapter = HTTPAdapter(pool_connections=1, pool_maxsize=1)
    session.mount('http://', adapter)
    
    # Cycle through assigned users for this thread
    user_count = len(users_subset)
    
    for i in range(REQUESTS_PER_THREAD):
        user = users_subset[i % user_count]
        
        payload = {
            "userId": user["userId"],
            "addressId": user["addressId"],
            "paymentMethod": "COD",
            "selectedItems": [{
                "productId": user["targetProduct"]["productId"],
                "sizeId": user["targetProduct"]["sizeId"],
                "quantity": 1
            }]
        }
        headers = {
            "Authorization": f"Bearer {user['token']}",
            "Content-Type": "application/json"
        }
        
        start = time.time()
        try:
            # First try Gateway
            resp = session.post(ORDER_URL, json=payload, headers=headers, timeout=10)
            
            # Fallback handling (logic copied from original)
            if resp.status_code == 404:
                 fallback_url = "http://localhost:8005/v1/order/create-from-cart"
                 resp = session.post(fallback_url, json=payload, headers=headers, timeout=10)

            latency = (time.time() - start) * 1000
            
            if resp.status_code in [200, 201]:
                local_metrics.record(True, latency)
            else:
                # print(f"Failed: {resp.status_code} - {resp.text}")
                local_metrics.record(False, latency)
                
        except Exception as e:
            # print(f"Exception: {e}")
            local_metrics.record(False, 0)
            
    return local_metrics

def main():
    print("🚀 LOADING USERS...")
    users = load_users()
    if not users:
        print("❌ No users found in user_data.json. Run prepare_data.py first!")
        return
    print(f"✓ Loaded {len(users)} users.")

    print(f"🔥 STARTING ATTACK CORRECTLY (Keep-Alive):")
    print(f"   Total Requests: {TOTAL_REQUESTS}")
    print(f"   Threads: {CONCURRENT_THREADS}")
    print(f"   Requests/Thread: {REQUESTS_PER_THREAD}")
    
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=CONCURRENT_THREADS) as executor:
        futures = []
        for _ in range(CONCURRENT_THREADS):
            # Each worker runs REQUESTS_PER_THREAD loops.
            # We pass the full user list, and let it cycle inside.
            futures.append(executor.submit(run_worker_thread, users))
            
        for future in concurrent.futures.as_completed(futures):
            result_metrics = future.result()
            global_metrics.merge(result_metrics)

    end_time = time.time()
    duration = end_time - start_time
    throughput = global_metrics.success / duration if duration > 0 else 0
    
    print(f"\n\n==================================================")
    print(f"✅ ATTACK COMPLETED")
    print(f"   Duration: {duration:.2f}s")
    print(f"   Total Requests: {TOTAL_REQUESTS}")
    print(f"   Success: {global_metrics.success}")
    print(f"   Failed: {global_metrics.failed}")
    print(f"   ⚡ THROUGHPUT: {throughput:.2f} req/sec")
    
    if global_metrics.latencies:
        global_metrics.latencies.sort()
        p50 = global_metrics.latencies[int(len(global_metrics.latencies) * 0.5)]
        p95 = global_metrics.latencies[int(len(global_metrics.latencies) * 0.95)]
        print(f"   📊 Latency: p50={p50:.0f}ms, p95={p95:.0f}ms")
    print(f"==================================================")

if __name__ == "__main__":
    main()
