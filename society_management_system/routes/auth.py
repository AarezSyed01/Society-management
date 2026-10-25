from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from society_management_system.models.database import query_db, get_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        if not email or not password:
            flash('Please provide both email and password.', 'danger')
            return render_template('login.html')

        user = query_db("SELECT * FROM users WHERE LOWER(email) = %s", (email,), one=True)
        if not user:
            flash('Invalid email or password.', 'danger')
            return render_template('login.html')

        # Check password hash (or fallback plain text for dev seed compatibility)
        is_valid = False
        try:
            is_valid = check_password_hash(user['password_hash'], password)
        except Exception:
            is_valid = (user['password_hash'] == password)

        if not is_valid:
            flash('Invalid email or password.', 'danger')
            return render_template('login.html')

        if user.get('status') == 'Pending Approval':
            flash('Your resident account registration is pending committee approval.', 'warning')
            return render_template('login.html')

        # Store session
        session['user_id'] = user['user_id']
        session['user_name'] = user['name']
        session['user_role'] = user['role']
        session['member_id'] = user.get('member_id')
        session['society_id'] = user.get('society_id')

        flash(f'Welcome back, {user["name"]}!', 'success')
        return redirect(url_for('dashboard.index'))

    return render_template('login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        phone = request.form.get('phone', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        flat_id = request.form.get('flat_id')
        society_id = request.form.get('society_id', 1)

        if not name or not email or not phone or not password or not flat_id:
            flash('All required fields must be filled.', 'danger')
            flats = query_db("SELECT * FROM flats ORDER BY block, flat_no")
            societies = query_db("SELECT * FROM societies")
            return render_template('register.html', flats=flats, societies=societies)

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            flats = query_db("SELECT * FROM flats ORDER BY block, flat_no")
            societies = query_db("SELECT * FROM societies")
            return render_template('register.html', flats=flats, societies=societies)

        # Check existing user
        existing_user = query_db("SELECT user_id FROM users WHERE LOWER(email) = %s", (email,), one=True)
        if existing_user:
            flash('An account with this email address already exists.', 'danger')
            flats = query_db("SELECT * FROM flats ORDER BY block, flat_no")
            societies = query_db("SELECT * FROM societies")
            return render_template('register.html', flats=flats, societies=societies)

        # Database Transaction for Member & User creation
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        try:
            # 1. Insert member record
            cursor.execute("""
                INSERT INTO members (name, phone, email, flat_id, society_id, status)
                VALUES (%s, %s, %s, %s, %s, 'Active')
            """, (name, phone, email, flat_id, society_id))
            member_id = cursor.lastrowid

            # 2. Insert user record with hashed password
            hashed_pw = generate_password_hash(password)
            cursor.execute("""
                INSERT INTO users (name, role, email, password_hash, society_id, member_id, status)
                VALUES (%s, 'resident', %s, %s, %s, %s, 'Active')
            """, (name, email, hashed_pw, society_id, member_id))
            user_id = cursor.lastrowid

            conn.commit()

            # Set session
            session['user_id'] = user_id
            session['user_name'] = name
            session['user_role'] = 'resident'
            session['member_id'] = member_id
            session['society_id'] = society_id

            flash('Registration successful! Welcome to the society portal.', 'success')
            return redirect(url_for('dashboard.index'))
        except Exception as e:
            conn.rollback()
            flash(f'Registration error: {str(e)}', 'danger')
        finally:
            cursor.close()
            conn.close()

    flats = query_db("SELECT * FROM flats ORDER BY block, flat_no")
    societies = query_db("SELECT * FROM societies")
    return render_template('register.html', flats=flats, societies=societies)

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('auth.login'))
