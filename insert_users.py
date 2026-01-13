
import requests
import random
import string
import json

# Configuration
# Try Gateway port first, then Auth Service port
URLS = [
    "http://localhost:8080/v1/auth/register",
    "http://localhost:8001/v1/auth/register"
]

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def create_user(index):
    username = f"user_{generate_random_string(5)}_{index}"
    email = f"{username}@example.com"
    password = "password123"
    
    payload = {
        "username": username,
        "email": email,
        "password": password
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    success = False
    for url in URLS:
        try:
            print(f"Attempting to register user {username} via {url}...")
            response = requests.post(url, json=payload, headers=headers, timeout=5)
            
            if response.status_code == 200:
                print(f"✅ User {username} created successfully!")
                try:
                    print(f"   Response: {response.json()}")
                except:
                    pass
                success = True
                break
            else:
                print(f"❌ Failed to create user {username}. Status: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print(f"⚠️ Connection refused to {url}. Service might be down or port is wrong.")
        except Exception as e:
            print(f"❌ Error: {e}")
            
    return success

def main():
    print("🚀 Starting user insertion...")
    count = 0
    for i in range(1, 11):
        if create_user(i):
            count += 1
    
    print(f"\n✨ Finished! Created {count}/10 users.")

if __name__ == "__main__":
    main()
