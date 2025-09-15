from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Mock user database (in production, use a real database)
users = {
    'admin': generate_password_hash('password123'),
    'user': generate_password_hash('user123')
}

@app.route('/')
def index():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        # Initialize login attempts in session if not exists
        if 'login_attempts' not in session:
            session['login_attempts'] = 0
        
        # Check if user is locked out
        if session.get('login_attempts', 0) >= 5:
            flash('Too many failed login attempts. Please try again later.', 'error')
            return render_template('login.html', 
                                 login_attempts=session['login_attempts'],
                                 is_locked=True)
        
        # Validate input
        if not username:
            flash('Username is required', 'error')
            session['login_attempts'] = session.get('login_attempts', 0) + 1
            return render_template('login.html', 
                                 login_attempts=session['login_attempts'])
        
        if not password:
            flash('Password is required', 'error')
            session['login_attempts'] = session.get('login_attempts', 0) + 1
            return render_template('login.html', 
                                 login_attempts=session['login_attempts'])
        
        # Check if username exists
        if username not in users:
            session['login_attempts'] = session.get('login_attempts', 0) + 1
            flash(f'Username "{username}" not found. Please check your username and try again.', 'error')
            return render_template('login.html', 
                                 login_attempts=session['login_attempts'],
                                 attempted_username=username)
        
        # Check password
        if not check_password_hash(users[username], password):
            session['login_attempts'] = session.get('login_attempts', 0) + 1
            remaining_attempts = 5 - session['login_attempts']
            
            if remaining_attempts > 0:
                flash(f'Incorrect password. {remaining_attempts} attempt(s) remaining.', 'error')
            else:
                flash('Account locked due to too many failed attempts. Please try again later.', 'error')
            
            return render_template('login.html', 
                                 login_attempts=session['login_attempts'],
                                 attempted_username=username)
        
        # Successful login
        session['username'] = username
        session['login_attempts'] = 0  # Reset login attempts
        session['last_login'] = datetime.now().isoformat()
        flash(f'Welcome back, {username}!', 'success')
        return redirect(url_for('dashboard'))
    
    # GET request - show login form
    return render_template('login.html', 
                         login_attempts=session.get('login_attempts', 0))

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['username'])

@app.route('/logout')
def logout():
    username = session.get('username', 'User')
    session.clear()  # Clear all session data
    flash(f'Goodbye, {username}! You have been logged out successfully.', 'info')
    return redirect(url_for('login'))

@app.route('/reset-login-attempts')
def reset_login_attempts():
    """Reset login attempts (for testing purposes)"""
    session['login_attempts'] = 0
    flash('Login attempts have been reset', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
