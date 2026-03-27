#!/usr/bin/env python3
"""
Script to display all users in the database
"""

from app import app, db, User

def list_all_users():
    """List all users in the database"""
    with app.app_context():
        users = User.query.all()
        
        print(f"\n{'='*80}")
        print(f"📊 Total Users in Database: {len(users)}")
        print(f"{'='*80}\n")
        
        print(f"{'ID':<4} {'Username':<20} {'Full Name':<25} {'Balance':<12} {'Account #':<12}")
        print("-" * 80)
        
        for user in users:
            print(f"{user.id:<4} {user.username:<20} {user.full_name:<25} ${user.balance:<11,.2f} {user.account_number:<12}")
        
        print(f"\n{'='*80}")
        total_balance = sum(user.balance for user in users)
        print(f"💰 Total Balance in All Accounts: ${total_balance:,.2f}")
        print(f"{'='*80}\n")

if __name__ == '__main__':
    list_all_users()
