import React, { useState } from 'react';

export const ProjectDocsModule: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'er-diagram' | 'sql-script' | 'flask-structure' | 'setup-guide'>('er-diagram');

  const sqlSample = `-- ============================================================================
-- DATABASE SCRIPT: Society Management System
-- BCA Final Year Capstone Project (Academic Year 2026-2027)
-- Normalized MySQL Relational Database Schema
-- ============================================================================

CREATE DATABASE IF NOT EXISTS \`society_management_system\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`society_management_system\`;

-- 1. societies
CREATE TABLE \`societies\` (
  \`society_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`address\` VARCHAR(255) NOT NULL,
  \`contact_no\` VARCHAR(20) NOT NULL,
  \`registration_no\` VARCHAR(50) DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. flats
CREATE TABLE \`flats\` (
  \`flat_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`flat_no\` VARCHAR(20) NOT NULL,
  \`floor\` INT NOT NULL,
  \`block\` VARCHAR(10) NOT NULL,
  \`type\` VARCHAR(50) NOT NULL,
  \`society_id\` INT NOT NULL,
  CONSTRAINT \`fk_flats_society\` FOREIGN KEY (\`society_id\`)
    REFERENCES \`societies\` (\`society_id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. members
CREATE TABLE \`members\` (
  \`member_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`address\` VARCHAR(255) DEFAULT NULL,
  \`flat_id\` INT DEFAULT NULL,
  \`society_id\` INT NOT NULL,
  \`status\` VARCHAR(20) DEFAULT 'Active',
  CONSTRAINT \`fk_members_society\` FOREIGN KEY (\`society_id\`)
    REFERENCES \`societies\` (\`society_id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_members_flat\` FOREIGN KEY (\`flat_id\`)
    REFERENCES \`flats\` (\`flat_id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. users
CREATE TABLE \`users\` (
  \`user_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`role\` VARCHAR(20) NOT NULL, -- 'admin' or 'resident'
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`society_id\` INT DEFAULT NULL,
  \`member_id\` INT DEFAULT NULL,
  CONSTRAINT \`fk_users_society\` FOREIGN KEY (\`society_id\`)
    REFERENCES \`societies\` (\`society_id\`),
  CONSTRAINT \`fk_users_member\` FOREIGN KEY (\`member_id\`)
    REFERENCES \`members\` (\`member_id\`)
) ENGINE=InnoDB;

-- 5. maintenance
CREATE TABLE \`maintenance\` (
  \`maintenance_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`member_id\` INT NOT NULL,
  \`flat_id\` INT DEFAULT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`due_date\` DATE NOT NULL,
  \`status\` VARCHAR(20) DEFAULT 'Pending',
  \`payment_date\` DATE DEFAULT NULL,
  \`description\` VARCHAR(255) DEFAULT NULL,
  \`billing_month\` VARCHAR(30) NOT NULL,
  CONSTRAINT \`fk_maint_member\` FOREIGN KEY (\`member_id\`)
    REFERENCES \`members\` (\`member_id\`)
) ENGINE=InnoDB;

-- 6. complaints
CREATE TABLE \`complaints\` (
  \`complaint_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`member_id\` INT NOT NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`status\` VARCHAR(30) DEFAULT 'Pending',
  \`resolution_notes\` TEXT DEFAULT NULL,
  \`created_date\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_complaints_member\` FOREIGN KEY (\`member_id\`)
    REFERENCES \`members\` (\`member_id\`)
) ENGINE=InnoDB;

-- 7. bills
CREATE TABLE \`bills\` (
  \`bill_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`flat_id\` INT NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`due_date\` DATE NOT NULL,
  \`status\` VARCHAR(20) DEFAULT 'Pending',
  \`month_year\` VARCHAR(30) NOT NULL,
  \`bill_type\` VARCHAR(50) DEFAULT 'Society Utility',
  CONSTRAINT \`fk_bills_flat\` FOREIGN KEY (\`flat_id\`)
    REFERENCES \`flats\` (\`flat_id\`)
) ENGINE=InnoDB;

-- 8. notices
CREATE TABLE \`notices\` (
  \`notice_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`created_by\` INT DEFAULT NULL,
  \`society_id\` INT NOT NULL,
  \`publication_status\` VARCHAR(20) DEFAULT 'Published',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. visitors
CREATE TABLE \`visitors\` (
  \`visitor_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`visitor_name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) DEFAULT NULL,
  \`purpose\` VARCHAR(200) NOT NULL,
  \`flat_id\` INT NOT NULL,
  \`society_id\` INT NOT NULL,
  \`entry_time\` DATETIME NOT NULL,
  \`exit_time\` DATETIME DEFAULT NULL
) ENGINE=InnoDB;

-- 10. payments
CREATE TABLE \`payments\` (
  \`payment_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`maintenance_id\` INT DEFAULT NULL,
  \`bill_id\` INT DEFAULT NULL,
  \`amount_paid\` DECIMAL(10,2) NOT NULL,
  \`payment_date\` DATE NOT NULL,
  \`payment_method\` VARCHAR(50) NOT NULL,
  \`transaction_ref\` VARCHAR(100) DEFAULT NULL,
  \`recorded_by\` INT DEFAULT NULL
) ENGINE=InnoDB;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-3 text-xs">
      {/* Title */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">
            Project Documentation & SQL Architecture
          </h2>
          <p className="text-slate-500 m-0 text-[11px]">
            BCA Capstone Project Specification, Entity-Relationship Design & Python Flask MVC Blueprint
          </p>
        </div>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          {copied ? 'Copied SQL!' : 'Copy database.sql'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-300 bg-white rounded-t px-2 pt-2 gap-1">
        <button
          onClick={() => setActiveSubTab('er-diagram')}
          className={`px-3 py-1.5 font-bold rounded-t text-xs ${
            activeSubTab === 'er-diagram' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. ER Diagram & Tables
        </button>
        <button
          onClick={() => setActiveSubTab('sql-script')}
          className={`px-3 py-1.5 font-bold rounded-t text-xs ${
            activeSubTab === 'sql-script' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. MySQL database.sql
        </button>
        <button
          onClick={() => setActiveSubTab('flask-structure')}
          className={`px-3 py-1.5 font-bold rounded-t text-xs ${
            activeSubTab === 'flask-structure' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Flask MVC Code Structure
        </button>
        <button
          onClick={() => setActiveSubTab('setup-guide')}
          className={`px-3 py-1.5 font-bold rounded-t text-xs ${
            activeSubTab === 'setup-guide' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          4. How to Run Locally
        </button>
      </div>

      {/* ER Diagram */}
      {activeSubTab === 'er-diagram' && (
        <div className="bg-white p-4 rounded border border-slate-300 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Normalized Database Entities (Page 9 Synopsis)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">1. users:</strong> Stores login credentials, role (admin / resident), password hash, and member linkage.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">2. societies:</strong> Society registration number, complex name, address, and office contact.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">3. flats:</strong> Flat number, wing/block (A/B), floor level, type (1/2/3 BHK), linked to society.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">4. members:</strong> Resident directory holding name, phone, email, status, and assigned flat ID.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">5. maintenance:</strong> Monthly society dues, billing period, due date, amount, status (Pending/Paid).
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">6. complaints:</strong> Resident tickets with title, description, status (Pending/In Progress/Resolved), and notes.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">7. bills:</strong> Utility expenses and sinking fund bills associated directly with flats.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">8. notices:</strong> Circulars and official notices published by committee members.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">9. visitors:</strong> Visitor gate log with name, phone, purpose, flat visited, entry & exit time.
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <strong className="text-blue-800">10. payments:</strong> Payment transaction ledger with method (UPI, Cash, Cheque, NEFT) and reference number.
            </div>
          </div>
        </div>
      )}

      {/* SQL Script */}
      {activeSubTab === 'sql-script' && (
        <div className="bg-white p-3 rounded border border-slate-300">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-800">MySQL Schema & Demo Data: database.sql</span>
            <button onClick={copyToClipboard} className="text-blue-700 underline font-semibold">
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          <pre className="p-3 bg-slate-900 text-slate-100 rounded text-[11px] font-mono overflow-x-auto max-h-96">
            {sqlSample}
          </pre>
        </div>
      )}

      {/* Flask MVC */}
      {activeSubTab === 'flask-structure' && (
        <div className="bg-white p-4 rounded border border-slate-300 space-y-2">
          <h3 className="font-bold text-slate-800 text-sm">Project Folder Structure (MVC Architecture)</h3>
          <pre className="p-3 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800">
{`society_management_system/
├── app.py                 # Flask entry point and blueprint registrations
├── config.py              # Configuration and MySQL environment variables
├── requirements.txt       # Flask, mysql-connector-python, Werkzeug
├── database.sql           # MySQL tables and demonstration data
├── README.md              # Installation guide for faculty/students
├── routes/                # Flask Controller Blueprints
│   ├── auth.py            # Login, register, logout, session management
│   ├── dashboard.py       # Metrics calculation and role dashboards
│   ├── members.py         # Member CRUD operations
│   ├── flats.py           # Flat/apartment management
│   ├── maintenance.py     # Maintenance billing and payment recording
│   ├── complaints.py      # Ticket submission and status updates
│   ├── notices.py         # Notice board circulars
│   ├── visitors.py        # Gate security log
│   └── bills.py           # Flat utility bills
├── models/                # MySQL Model Layer
│   ├── database.py        # Connection pooling and query helpers
│   ├── user.py            # User authentication queries
│   └── member.py          # Member records
├── templates/             # Bootstrap 5 HTML Templates
│   ├── base.html          # Main navigation and footer
│   ├── login.html         # Login form
│   ├── register.html      # Registration form
│   └── dashboard.html     # Summary cards and recent records
└── static/
    ├── css/style.css      # Custom styling
    └── js/script.js       # Basic form interactions`}
          </pre>
        </div>
      )}

      {/* Setup Guide */}
      {activeSubTab === 'setup-guide' && (
        <div className="bg-white p-4 rounded border border-slate-300 space-y-3 leading-relaxed">
          <h3 className="font-bold text-slate-800 text-sm">How to Run on Local Computer</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>
              <strong>Create Virtual Environment:</strong>
              <div className="font-mono bg-slate-100 p-1.5 rounded mt-0.5">
                python -m venv venv && venv\Scripts\activate  (Windows)<br />
                python3 -m venv venv && source venv/bin/activate  (Mac/Linux)
              </div>
            </li>
            <li>
              <strong>Install Dependencies:</strong>
              <div className="font-mono bg-slate-100 p-1.5 rounded mt-0.5">
                pip install -r requirements.txt
              </div>
            </li>
            <li>
              <strong>Setup MySQL Database:</strong>
              <div className="font-mono bg-slate-100 p-1.5 rounded mt-0.5">
                mysql -u root -p society_management_system &lt; database.sql
              </div>
            </li>
            <li>
              <strong>Run Flask App:</strong>
              <div className="font-mono bg-slate-100 p-1.5 rounded mt-0.5">
                python app.py
              </div>
              <span className="text-slate-500 text-[11px]">Open browser at http://localhost:5000</span>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};
