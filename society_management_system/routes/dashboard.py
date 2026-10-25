from flask import Blueprint, render_template, session, redirect, url_for, flash
from society_management_system.models.database import query_db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
def index():
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))

    user_role = session.get('user_role')
    member_id = session.get('member_id')

    if user_role == 'admin':
        # Admin statistics calculated from MySQL
        total_members = query_db("SELECT COUNT(*) as cnt FROM members", one=True)['cnt']
        total_flats = query_db("SELECT COUNT(*) as cnt FROM flats", one=True)['cnt']
        
        maint_stats = query_db("""
            SELECT 
                COALESCE(SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END), 0) as collected,
                COALESCE(SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END), 0) as pending,
                COUNT(*) as total_charges
            FROM maintenance
        """, one=True)

        pending_complaints = query_db("SELECT COUNT(*) as cnt FROM complaints WHERE status != 'Resolved'", one=True)['cnt']
        active_visitors = query_db("SELECT COUNT(*) as cnt FROM visitors WHERE exit_time IS NULL", one=True)['cnt']

        # Recent feeds
        recent_members = query_db("SELECT * FROM members ORDER BY member_id DESC LIMIT 4")
        recent_complaints = query_db("""
            SELECT c.*, m.name as member_name 
            FROM complaints c 
            JOIN members m ON c.member_id = m.member_id 
            ORDER BY c.complaint_id DESC LIMIT 4
        """)
        recent_payments = query_db("SELECT * FROM payments ORDER BY payment_id DESC LIMIT 4")
        latest_notices = query_db("SELECT * FROM notices ORDER BY notice_id DESC LIMIT 3")
        recent_visitors = query_db("""
            SELECT v.*, f.block, f.flat_no 
            FROM visitors v 
            JOIN flats f ON v.flat_id = f.flat_id 
            ORDER BY v.visitor_id DESC LIMIT 4
        """)

        return render_template('dashboard.html',
            is_admin=True,
            total_members=total_members,
            total_flats=total_flats,
            total_collected=maint_stats['collected'],
            total_pending=maint_stats['pending'],
            total_charges=maint_stats['total_charges'],
            pending_complaints=pending_complaints,
            active_visitors=active_visitors,
            recent_members=recent_members,
            recent_complaints=recent_complaints,
            recent_payments=recent_payments,
            latest_notices=latest_notices,
            recent_visitors=recent_visitors
        )
    else:
        # Resident Dashboard
        member = query_db("SELECT * FROM members WHERE member_id = %s", (member_id,), one=True)
        flat = query_db("SELECT * FROM flats WHERE flat_id = %s", (member['flat_id'],), one=True) if member and member.get('flat_id') else None

        my_maintenance = query_db("SELECT * FROM maintenance WHERE member_id = %s ORDER BY maintenance_id DESC", (member_id,))
        my_bills = query_db("SELECT * FROM bills WHERE flat_id = %s ORDER BY bill_id DESC", (flat['flat_id'],)) if flat else []
        my_complaints = query_db("SELECT * FROM complaints WHERE member_id = %s ORDER BY complaint_id DESC", (member_id,))
        notices = query_db("SELECT * FROM notices WHERE publication_status = 'Published' ORDER BY notice_id DESC LIMIT 5")
        my_visitors = query_db("SELECT * FROM visitors WHERE flat_id = %s ORDER BY visitor_id DESC LIMIT 5", (flat['flat_id'],)) if flat else []

        return render_template('residents/dashboard.html',
            is_admin=False,
            member=member,
            flat=flat,
            maintenance=my_maintenance,
            bills=my_bills,
            complaints=my_complaints,
            notices=notices,
            visitors=my_visitors
        )
