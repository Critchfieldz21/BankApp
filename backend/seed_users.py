#!/usr/bin/env python3
"""
Script to seed the database with sample users
"""

from app import app, db, User
from werkzeug.security import generate_password_hash

# Sample users to add to the database
FIRST_NAMES = [
    "John", "Sarah", "Michael", "Emily", "James", "Jessica", "David", "Angela", "Robert", "Lisa",
    "Chris", "Amanda", "Daniel", "Jennifer", "Mark", "Nicole", "Ryan", "Megan", "Kevin", "Stephanie",
    "Andrew", "Lauren", "Matthew", "Ashley", "Joshua", "Brittany", "William", "Rebecca", "Joseph", "Hannah",
    "Charles", "Samantha", "Thomas", "Amber", "Christopher", "Michelle", "Daniel", "Danielle", "Matthew", "Jasmine",
    "Anthony", "Victoria", "Donald", "Alexis", "Steven", "Sophia", "Paul", "Isabella", "Andrew", "Mia",
    "Joshua", "Charlotte", "Kenneth", "Amelia", "Kevin", "Evelyn", "Brian", "Abigail", "Edward", "Emily"
]

LAST_NAMES = [
    "Smith", "Johnson", "Brown", "Davis", "Wilson", "Martinez", "Garcia", "Rodriguez", "Lee", "Anderson",
    "Taylor", "Thomas", "Jackson", "White", "Harris", "Clark", "Lewis", "Walker", "Hall", "Young",
    "Hernandez", "Moore", "Martin", "Pierce", "Scott", "Green", "Adams", "Nelson", "Carter", "Roberts",
    "Phillips", "Campbell", "Parker", "Edwards", "Collins", "Reeves", "Morris", "Murphy", "Rogers", "Morgan",
    "Peterson", "Cooper", "Reed", "Bell", "Graham", "Chamberlain", "Bridges", "Bristow", "Brooks", "Burke",
    "Burns", "Byrd", "Caldwell", "Carlisle", "Carlton", "Carpenter", "Carson", "Carver", "Cason", "Caspari"
]

def generate_sample_users(count=100):
    """Generate sample users dynamically"""
    import random
    random.seed(42)  # For reproducibility
    
    users = []
    used_usernames = set()
    used_emails = set()
    
    for i in range(count):
        while True:
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            username = f"{first_name.lower()}_{last_name.lower()}{random.randint(1, 999)}"
            email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
            
            if username not in used_usernames and email not in used_emails:
                used_usernames.add(username)
                used_emails.add(email)
                break
        
        balance = random.uniform(1000, 15000)
        users.append({
            "username": username,
            "email": email,
            "full_name": f"{first_name} {last_name}",
            "balance": round(balance, 2)
        })
    
    return users

SAMPLE_USERS = generate_sample_users(100)

def seed_database():
    """Add sample users to the database"""
    with app.app_context():
        print("🌱 Starting database seeding...")
        print(f"📝 Found {len(SAMPLE_USERS)} sample users to add\n")
        
        added_count = 0
        skipped_count = 0
        
        for user_data in SAMPLE_USERS:
            username = user_data['username']
            email = user_data['email']
            
            # Check if user already exists
            if User.query.filter_by(username=username).first():
                print(f"⏭️  Skipping '{username}' - already exists")
                skipped_count += 1
                continue
            
            if User.query.filter_by(email=email).first():
                print(f"⏭️  Skipping '{email}' - email already exists")
                skipped_count += 1
                continue
            
            # Create new user
            account_number = f"FC{User.query.count() + 1000}"
            user = User(
                username=username,
                email=email,
                password=generate_password_hash("password123"),  # Default password
                full_name=user_data['full_name'],
                account_number=account_number,
                balance=user_data.get('balance', 1000.0)
            )
            
            db.session.add(user)
            db.session.commit()
            
            print(f"✅ Added user: {user_data['full_name']} (@{username}) - Balance: ${user_data.get('balance', 1000.0):,.2f}")
            added_count += 1
        
        print(f"\n{'='*60}")
        print(f"🎉 Seeding complete!")
        print(f"✅ Users added: {added_count}")
        print(f"⏭️  Users skipped: {skipped_count}")
        print(f"📊 Total users in database: {User.query.count()}")
        print(f"{'='*60}")

if __name__ == '__main__':
    seed_database()
