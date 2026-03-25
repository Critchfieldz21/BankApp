from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import signal
import sys

app = Flask(__name__)
CORS(app)

# Graceful shutdown handler
def signal_handler(sig, frame):
    print('\n\n⏹️  Shutting down gracefully...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

# Database Configuration
# Support both SQLite (local) and PostgreSQL (Railway)
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Railway/Production: PostgreSQL
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Local Development: SQLite
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "fourcs_bank.db")}'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    account_number = db.Column(db.String(20), unique=True, nullable=False)
    balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    transactions = db.relationship('Transaction', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'account_number': self.account_number,
            'balance': self.balance,
            'created_at': self.created_at.isoformat()
        }

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)  # 'deposit', 'withdrawal', 'transfer'
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    balance_after = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'transaction_type': self.transaction_type,
            'amount': self.amount,
            'description': self.description,
            'balance_after': self.balance_after,
            'created_at': self.created_at.isoformat()
        }

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    account_number = f"FC{User.query.count() + 1000}"
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        full_name=data.get('full_name', 'User'),
        account_number=account_number,
        balance=1000.0  # Initial balance
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User created successfully',
        'user': user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@app.route('/api/transactions/<int:user_id>', methods=['GET'])
def get_transactions(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.created_at.desc()).all()
    
    return jsonify({
        'transactions': [t.to_dict() for t in transactions],
        'count': len(transactions)
    }), 200

@app.route('/api/transactions/<int:user_id>', methods=['POST'])
def create_transaction(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not data or not data.get('type') or not data.get('amount'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    transaction_type = data['type'].lower()
    amount = float(data['amount'])
    
    if transaction_type == 'withdrawal' and user.balance < amount:
        return jsonify({'error': 'Insufficient balance'}), 400
    
    if transaction_type == 'deposit':
        user.balance += amount
    elif transaction_type == 'withdrawal':
        user.balance -= amount
    else:
        return jsonify({'error': 'Invalid transaction type'}), 400
    
    transaction = Transaction(
        user_id=user_id,
        transaction_type=transaction_type,
        amount=amount,
        description=data.get('description', ''),
        balance_after=user.balance
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Transaction created successfully',
        'transaction': transaction.to_dict(),
        'new_balance': user.balance
    }), 201

@app.route('/api/user/search', methods=['GET'])
def search_user():
    username = request.args.get('username')
    
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'account_number': user.account_number
    }), 200

@app.route('/api/user/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('new_password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user.password = generate_password_hash(data['new_password'])
    db.session.commit()
    
    return jsonify({
        'message': 'Password reset successfully',
        'username': user.username
    }), 200

@app.route('/api/health', methods=['GET'])
def health():
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        db.session.commit()
        return jsonify({
            'status': 'Backend is running',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'Backend running but database error',
            'error': str(e)
        }), 503

if __name__ == '__main__':
    print('\n' + '='*60)
    print('🏦 Four Cs Bank Backend Server')
    print('='*60)
    print('✅ Running on http://127.0.0.1:5000')
    print('⏹️  Press CTRL+C to shutdown')
    print('='*60 + '\n')
    with app.app_context():
        db.create_all()
        print('✅ Database tables created/verified')
    app.run(debug=True, port=5000)
else:
    # For gunicorn/production
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f'⚠️  Database initialization: {e}')
