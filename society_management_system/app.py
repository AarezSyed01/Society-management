import os
from flask import Flask, render_template, session, redirect, url_for, g
from society_management_system.config import Config
from society_management_system.routes.auth import auth_bp
from society_management_system.routes.dashboard import dashboard_bp
from society_management_system.routes.members import members_bp
from society_management_system.routes.flats import flats_bp
from society_management_system.routes.maintenance import maintenance_bp
from society_management_system.routes.complaints import complaints_bp
from society_management_system.routes.notices import notices_bp
from society_management_system.routes.visitors import visitors_bp
from society_management_system.routes.bills import bills_bp

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(Config)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(members_bp, url_prefix='/members')
    app.register_blueprint(flats_bp, url_prefix='/flats')
    app.register_blueprint(maintenance_bp, url_prefix='/maintenance')
    app.register_blueprint(complaints_bp, url_prefix='/complaints')
    app.register_blueprint(notices_bp, url_prefix='/notices')
    app.register_blueprint(visitors_bp, url_prefix='/visitors')
    app.register_blueprint(bills_bp, url_prefix='/bills')

    @app.before_request
    def load_logged_in_user():
        g.user_id = session.get('user_id')
        g.user_name = session.get('user_name')
        g.user_role = session.get('user_role')
        g.member_id = session.get('member_id')
        g.society_id = session.get('society_id')

    @app.route('/')
    def index():
        if 'user_id' in session:
            return redirect(url_for('dashboard.index'))
        return redirect(url_for('auth.login'))

    @app.errorhandler(403)
    def access_denied(e):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def server_error(e):
        return render_template('errors/500.html'), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
