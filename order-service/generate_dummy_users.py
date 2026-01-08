import uuid
import datetime

# Configuration
NUM_USERS = 100
PASSWORD_HASH = "$2a$10$mSqRLDmAXlUyN24pd5NoJ.w.7xnlzLwkfflhFhLcCkj8hM1mEzfnq"
BASE_EMAIL = "thuannguyen{}@gmail.com"
TIMESTAMP = "2026-01-07 15:09:26.818429"

# Output file
OUTPUT_FILE = "dummy_users.sql"

def generate_sql():
    sql = []
    
    # Header
    sql.append("-- Bulk insert 100 users and addresses for Load Test")
    sql.append("USE shopee;")
    sql.append("")
    
    for i in range(1, NUM_USERS + 1):
        user_uuid = str(uuid.uuid4())
        address_uuid = str(uuid.uuid4())
        email = BASE_EMAIL.format(i)
        
        # INSERT USER
        # Schema guessed from User.java and sample: 
        # id, created_at, updated_at, active (enum), email, password, primary_role (enum), role (element collection?), user_details...
        # Wait, the sample was:
        # created_at, updated_at, active, email, password, role...
        # Let's assume standard BaseEntity ID is first or implied.
        # User.java extends BaseEntity -> ID is UUID string.
        
        # We'll use a standard INSERT statement with column names to be safe.
        # REMOVED created_at, updated_at because user reported "Unknown column"
        # ADDED username because user reported "Field 'username' doesn't have a default value"
        username = f"thuannguyen{i}"
        insert_user =f"INSERT INTO users (id, active, email, password, primary_role, username) VALUES ('{user_uuid}', 'ACTIVE', '{email}', '{PASSWORD_HASH}', 'USER', '{username}');"
        sql.append(insert_user)
        
        # INSERT ADDRESS
        # REMOVED created_at, updated_at
        insert_address = (
            f"INSERT INTO addresses (id, user_id, address_name, recipient_name, recipient_phone, "
            f"province_id, province_name, district_id, district_name, ward_code, ward_name, street_address, is_default) "
            f"VALUES ('{address_uuid}', '{user_uuid}', 'Nhà Riêng', 'User {i}', '0388509046', "
            f"202, 'Hồ Chí Minh', 1533, 'Huyện Bình Chánh', '22011', 'Xã Quy Đức', '123 Street {i}', {1 if i==1 else 0});"
        )
        sql.append(insert_address)
        sql.append("")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(sql))
    
    print(f"Generated {NUM_USERS} users in {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_sql()
