# Society Management System
## BCA Capstone Final Year Project (Academic Year 2026–2027)

A centralized web-based residential society management system designed and developed using Python (Flask), MySQL, Bootstrap 5, HTML5, and CSS3.

---

### Project Features & Modules

1. **Member & Apartment Management**: Track society members, flats (wings, block, floor, type), and association between resident accounts and flat records.
2. **Maintenance Management**: Generate maintenance dues, record payments via multiple channels (UPI, Cheque, Cash, Bank Transfer), and display dues/history.
3. **Complaint Management**: Enable residents to raise service tickets with categorized issues and allow committee members to track and update progress (Pending, In Progress, Resolved).
4. **Notice & Communication Management**: Publish official circulars, AGM notices, water tank cleaning schedules, and maintenance alerts.
5. **Visitor Management**: Gate record tracking visitor name, contact, purpose, flat visited, entry timestamp, and checkout/exit logging.
6. **Utility Bills Management**: Flat-wise common utility bills, sinking funds, and payment verification.
7. **Role-Based Authentication**: Admin / Committee Member vs Resident with secure password hashing (`werkzeug.security`) and session validation.

---

### Prerequisites

- **Python 3.10+**
- **MySQL Server 8.0+** (or MariaDB 10.5+)
- **Git** & **VS Code** (recommended IDE)

---

### Step-by-Step Local Setup Guide

#### 1. Clone or Extract Project
```bash
cd society_management_system
```

#### 2. Create and Activate a Python Virtual Environment

**On Windows (Command Prompt / PowerShell):**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure MySQL Database

Open MySQL command line client or MySQL Workbench:
```sql
CREATE DATABASE society_management_system;
```

Import the database schema and demonstration data:
```bash
# On Windows / Mac / Linux:
mysql -u root -p society_management_system < database.sql
```

#### 5. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```ini
FLASK_SECRET_KEY=my_secure_secret_key_2026
FLASK_DEBUG=1
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=society_management_system
```

#### 6. Create or Verify Administrator Account

The provided `database.sql` script pre-seeds standard credentials:
- **Admin Login:** `admin@society.org` / `admin123` (Role: Admin / Committee Secretary)
- **Resident Login:** `amit@verma.com` / `resident123` (Flat A-302, Member: Amit Verma)

To create a new administrator account programmatically via CLI:
```bash
python -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('your_new_password'))"
```
Insert the user into the `users` table with role `'admin'`.

#### 7. Run the Application
```bash
python app.py
```
Or with Flask CLI:
```bash
flask --app app run --port 5000 --debug
```

#### 8. Open in Browser
Visit: `http://localhost:5000`

---

### Troubleshooting Common Errors

| Error | Root Cause | Solution |
|---|---|---|
| `mysql.connector.errors.ProgrammingError: 1045 Access denied` | Incorrect MySQL username or password in `.env` | Verify DB credentials in `.env` and grant privileges to user. |
| `mysql.connector.errors.DatabaseError: 1049 Unknown database` | Database has not been created yet | Run `CREATE DATABASE society_management_system;` in MySQL. |
| `ModuleNotFoundError: No module named 'flask'` | Virtual environment not activated | Activate virtual environment (`source venv/bin/activate` or `venv\Scripts\activate`) before running. |
| `Address already in use: Port 5000` | Port 5000 is occupied (e.g. AirPlay on macOS) | Run on alternative port: `python -m flask run --port 5001`. |

---

### Academic Integrity & Evaluation Notes
- Built for BCA Capstone Final Year Evaluation (2026–2027).
- Relational schema adheres strictly to 3NF normalization guidelines.
- Compliant with ER diagram relationships (1-to-N Society-Flat, 1-to-N Member-Maintenance, 1-to-N Member-Complaints).
