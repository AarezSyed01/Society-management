-- ============================================================================
-- DATABASE SCRIPT: Society Management System
-- BCA Final Year Capstone Project (Academic Year 2026-2027)
-- Normalized MySQL Relational Database Schema with Sample Demonstration Data
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `society_management_system`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `society_management_system`;

-- Disable foreign key checks for clean re-creation
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `visitors`;
DROP TABLE IF EXISTS `notices`;
DROP TABLE IF EXISTS `bills`;
DROP TABLE IF EXISTS `complaints`;
DROP TABLE IF EXISTS `maintenance`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `members`;
DROP TABLE IF EXISTS `flats`;
DROP TABLE IF EXISTS `societies`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Table 1: societies
-- ----------------------------------------------------------------------------
CREATE TABLE `societies` (
  `society_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `contact_no` VARCHAR(20) NOT NULL,
  `registration_no` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 2: flats
-- ----------------------------------------------------------------------------
CREATE TABLE `flats` (
  `flat_id` INT AUTO_INCREMENT PRIMARY KEY,
  `flat_no` VARCHAR(20) NOT NULL,
  `floor` INT NOT NULL,
  `block` VARCHAR(10) NOT NULL,
  `type` VARCHAR(50) NOT NULL, -- e.g., '1 BHK', '2 BHK', '3 BHK', 'Penthouse'
  `society_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_flats_society` FOREIGN KEY (`society_id`)
    REFERENCES `societies` (`society_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `uk_society_flat_block` (`society_id`, `block`, `flat_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 3: members
-- ----------------------------------------------------------------------------
CREATE TABLE `members` (
  `member_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `address` VARCHAR(255) DEFAULT NULL,
  `flat_id` INT DEFAULT NULL,
  `society_id` INT NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Inactive', 'Pending'
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_members_society` FOREIGN KEY (`society_id`)
    REFERENCES `societies` (`society_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_members_flat` FOREIGN KEY (`flat_id`)
    REFERENCES `flats` (`flat_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 4: users
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(20) NOT NULL, -- 'admin' or 'resident'
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `society_id` INT DEFAULT NULL,
  `member_id` INT DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Pending Approval', 'Suspended'
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_society` FOREIGN KEY (`society_id`)
    REFERENCES `societies` (`society_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_users_member` FOREIGN KEY (`member_id`)
    REFERENCES `members` (`member_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 5: maintenance
-- ----------------------------------------------------------------------------
CREATE TABLE `maintenance` (
  `maintenance_id` INT AUTO_INCREMENT PRIMARY KEY,
  `member_id` INT NOT NULL,
  `flat_id` INT DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `due_date` DATE NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Paid', 'Partially Paid'
  `payment_date` DATE DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `billing_month` VARCHAR(30) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_maint_member` FOREIGN KEY (`member_id`)
    REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_maint_flat` FOREIGN KEY (`flat_id`)
    REFERENCES `flats` (`flat_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 6: complaints
-- ----------------------------------------------------------------------------
CREATE TABLE `complaints` (
  `complaint_id` INT AUTO_INCREMENT PRIMARY KEY,
  `member_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `status` VARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Resolved'
  `resolution_notes` TEXT DEFAULT NULL,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_complaints_member` FOREIGN KEY (`member_id`)
    REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 7: bills
-- ----------------------------------------------------------------------------
CREATE TABLE `bills` (
  `bill_id` INT AUTO_INCREMENT PRIMARY KEY,
  `flat_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `due_date` DATE NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Paid'
  `month_year` VARCHAR(30) NOT NULL,
  `bill_type` VARCHAR(50) DEFAULT 'Utility & Sinking Fund',
  `payment_date` DATE DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bills_flat` FOREIGN KEY (`flat_id`)
    REFERENCES `flats` (`flat_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 8: notices
-- ----------------------------------------------------------------------------
CREATE TABLE `notices` (
  `notice_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `created_by` INT DEFAULT NULL,
  `society_id` INT NOT NULL,
  `publication_status` VARCHAR(20) DEFAULT 'Published', -- 'Draft', 'Published'
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notices_user` FOREIGN KEY (`created_by`)
    REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_notices_society` FOREIGN KEY (`society_id`)
    REFERENCES `societies` (`society_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 9: visitors
-- ----------------------------------------------------------------------------
CREATE TABLE `visitors` (
  `visitor_id` INT AUTO_INCREMENT PRIMARY KEY,
  `visitor_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `purpose` VARCHAR(200) NOT NULL,
  `flat_id` INT NOT NULL,
  `society_id` INT NOT NULL,
  `entry_time` DATETIME NOT NULL,
  `exit_time` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_visitors_flat` FOREIGN KEY (`flat_id`)
    REFERENCES `flats` (`flat_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_visitors_society` FOREIGN KEY (`society_id`)
    REFERENCES `societies` (`society_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table 10: payments
-- ----------------------------------------------------------------------------
CREATE TABLE `payments` (
  `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `maintenance_id` INT DEFAULT NULL,
  `bill_id` INT DEFAULT NULL,
  `amount_paid` DECIMAL(10,2) NOT NULL,
  `payment_date` DATE NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL, -- 'UPI', 'Cash', 'Cheque', 'Net Banking'
  `transaction_ref` VARCHAR(100) DEFAULT NULL,
  `recorded_by` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payments_maint` FOREIGN KEY (`maintenance_id`)
    REFERENCES `maintenance` (`maintenance_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_bill` FOREIGN KEY (`bill_id`)
    REFERENCES `bills` (`bill_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_user` FOREIGN KEY (`recorded_by`)
    REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DEMONSTRATION / SEED DATA (Academic Year 2026-2027)
-- ============================================================================

-- Society
INSERT INTO `societies` (`society_id`, `name`, `address`, `contact_no`, `registration_no`) VALUES
(1, 'Gokuldham Co-operative Housing Society', 'Plot 42, Sector 19, Powder Gali, Goregaon East, Mumbai - 400063', '+91 98201 12345', 'MH/MUM/HSG/2018/4891');

-- Flats
INSERT INTO `flats` (`flat_id`, `flat_no`, `floor`, `block`, `type`, `society_id`) VALUES
(1, '101', 1, 'A', '2 BHK', 1),
(2, '102', 1, 'A', '2 BHK', 1),
(3, '201', 2, 'A', '3 BHK', 1),
(4, '202', 2, 'A', '3 BHK', 1),
(5, '301', 3, 'A', '2 BHK', 1),
(6, '302', 3, 'A', '2 BHK', 1),
(7, '101', 1, 'B', '1 BHK', 1),
(8, '102', 1, 'B', '2 BHK', 1),
(9, '201', 2, 'B', '2 BHK', 1),
(10, '202', 2, 'B', '3 BHK', 1);

-- Members
INSERT INTO `members` (`member_id`, `name`, `phone`, `email`, `address`, `flat_id`, `society_id`, `status`) VALUES
(1, 'Rajesh Sharma', '+91 98200 11111', 'admin@society.org', 'Flat A-201, Gokuldham CHS', 3, 1, 'Active'),
(2, 'Amit Verma', '+91 98200 22222', 'amit@verma.com', 'Flat A-302, Gokuldham CHS', 6, 1, 'Active'),
(3, 'Sunita Deshmukh', '+91 98200 33333', 'sunita.d@gmail.com', 'Flat A-101, Gokuldham CHS', 1, 1, 'Active'),
(4, 'Vikram Mehta', '+91 98200 44444', 'vikram.m@gmail.com', 'Flat B-102, Gokuldham CHS', 8, 1, 'Active'),
(5, 'Pooja Kulkarni', '+91 98200 55555', 'pooja.k@gmail.com', 'Flat B-201, Gokuldham CHS', 9, 1, 'Active');

-- Users (passwords hashed using werkzeug.security generate_password_hash or bcrypt)
-- admin@society.org -> 'admin123'
-- amit@verma.com -> 'resident123'
INSERT INTO `users` (`user_id`, `name`, `role`, `email`, `password_hash`, `society_id`, `member_id`, `status`) VALUES
(1, 'Rajesh Sharma', 'admin', 'admin@society.org', 'scrypt:32768:8:1$kR89vX4$e09a34bc9886f4a86b3e8e1f0e470877a28e75e11a3df9f9393a61f5f3e440b8', 1, 1, 'Active'),
(2, 'Amit Verma', 'resident', 'amit@verma.com', 'scrypt:32768:8:1$mP12xZ9$98c17da77341ea22b31a89c7d42ea045f928e0762cf31742a7810fb59ce3fa21', 1, 2, 'Active'),
(3, 'Sunita Deshmukh', 'resident', 'sunita.d@gmail.com', 'scrypt:32768:8:1$mP12xZ9$98c17da77341ea22b31a89c7d42ea045f928e0762cf31742a7810fb59ce3fa21', 1, 3, 'Active');

-- Maintenance Charges
INSERT INTO `maintenance` (`maintenance_id`, `member_id`, `flat_id`, `amount`, `due_date`, `status`, `payment_date`, `description`, `billing_month`) VALUES
(1, 1, 3, 3500.00, '2026-10-10', 'Paid', '2026-10-05', 'Monthly Maintenance Charge (3 BHK)', 'October 2026'),
(2, 2, 6, 2800.00, '2026-10-10', 'Pending', NULL, 'Monthly Maintenance Charge (2 BHK)', 'October 2026'),
(3, 3, 1, 2800.00, '2026-10-10', 'Paid', '2026-10-08', 'Monthly Maintenance Charge (2 BHK)', 'October 2026'),
(4, 4, 8, 2800.00, '2026-10-10', 'Pending', NULL, 'Monthly Maintenance Charge (2 BHK)', 'October 2026'),
(5, 5, 9, 2800.00, '2026-10-10', 'Paid', '2026-10-09', 'Monthly Maintenance Charge (2 BHK)', 'October 2026'),
(6, 2, 6, 2800.00, '2026-09-10', 'Paid', '2026-09-06', 'Monthly Maintenance Charge (2 BHK)', 'September 2026');

-- Bills
INSERT INTO `bills` (`bill_id`, `flat_id`, `amount`, `due_date`, `status`, `month_year`, `bill_type`, `payment_date`) VALUES
(1, 3, 750.00, '2026-10-15', 'Paid', 'October 2026', 'Water & Common Electricity', '2026-10-06'),
(2, 6, 650.00, '2026-10-15', 'Pending', 'October 2026', 'Water & Common Electricity', NULL),
(3, 1, 650.00, '2026-10-15', 'Paid', '2026-10-09', 'Water & Common Electricity', '2026-10-09'),
(4, 8, 650.00, '2026-10-15', 'Pending', 'October 2026', 'Water & Common Electricity', NULL);

-- Complaints
INSERT INTO `complaints` (`complaint_id`, `member_id`, `title`, `description`, `status`, `resolution_notes`, `created_date`) VALUES
(1, 2, 'Lift A-Wing Stuck Between 2nd and 3rd Floor', 'The elevator in A-Wing made a grinding noise and stalled on Sunday morning. Emergency technician required.', 'In Progress', 'Technician from Otis contacted; scheduled maintenance visit for today 4:00 PM.', '2026-10-24 09:30:00'),
(2, 3, 'Water Leakage in Corridor Ceiling', 'Seepage observed near Flat A-101 common corridor after yesterday heavy rain.', 'Pending', NULL, '2026-10-25 08:15:00'),
(3, 2, 'Streetlight Flickering Near Gate 2', 'The pole light near secondary gate is blinking continuously at night.', 'Resolved', 'Electrician replaced the faulty LED choke on 22nd October.', '2026-10-21 18:40:00');

-- Notices
INSERT INTO `notices` (`notice_id`, `title`, `description`, `created_by`, `society_id`, `publication_status`, `created_at`) VALUES
(1, 'Annual General Meeting (AGM) Notice 2026', 'Notice is hereby given that the Annual General Meeting of Shree Ganesh CHS will be held in the Society Clubhouse on Sunday, 8th November 2026 at 10:30 AM. All members are requested to attend.', 1, 1, 'Published', '2026-10-20 10:00:00'),
(2, 'Overhead Water Tank Cleaning Schedule', 'Please note that the main overhead water tanks of Wing A & Wing B will be cleaned on Thursday, 29th October between 10:00 AM and 4:00 PM. Water supply will remain suspended during these hours.', 1, 1, 'Published', '2026-10-23 11:30:00'),
(3, 'Diwali Festival Cultural Committee Meeting', 'All interested residents and youth volunteers are invited to join the cultural planning session for Diwali celebration on Saturday, 31st October at 7:00 PM.', 1, 1, 'Published', '2026-10-24 16:00:00');

-- Visitors
INSERT INTO `visitors` (`visitor_id`, `visitor_name`, `phone`, `purpose`, `flat_id`, `society_id`, `entry_time`, `exit_time`) VALUES
(1, 'Ramesh Gupta', '+91 97690 12345', 'Grocery Delivery (BigBasket)', 6, 1, '2026-10-25 08:15:00', '2026-10-25 08:35:00'),
(2, 'Deepak Shinde', '+91 98190 23456', 'AC Repair Technician', 3, 1, '2026-10-25 09:00:00', NULL),
(3, 'Priya Nair', '+91 99200 34567', 'Guest / Relative Visit', 1, 1, '2026-10-25 10:10:00', NULL),
(4, 'Suresh Jadhav', '+91 98210 45678', 'Courier Delivery (BlueDart)', 8, 1, '2026-10-24 14:20:00', '2026-10-24 14:38:00');

-- Payments
INSERT INTO `payments` (`payment_id`, `maintenance_id`, `bill_id`, `amount_paid`, `payment_date`, `payment_method`, `transaction_ref`, `recorded_by`) VALUES
(1, 1, NULL, 3500.00, '2026-10-05', 'UPI', 'UPI/20261005/789123', 1),
(2, 3, NULL, 2800.00, '2026-10-08', 'Net Banking', 'NEFT/HDFC/2026100801', 1),
(3, 5, NULL, 2800.00, '2026-10-09', 'Cash', 'RCP-2026-109', 1),
(4, NULL, 1, 750.00, '2026-10-06', 'UPI', 'UPI/20261006/445891', 1),
(5, NULL, 3, 650.00, '2026-10-09', 'UPI', 'UPI/20261009/881230', 1);
