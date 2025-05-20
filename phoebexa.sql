-- phpMyAdmin SQL Dump
-- version 5.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `phoebexa`;
USE `phoebexa`;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) UNIQUE NOT NULL,
  `phone` varchar(20),
  `hire_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) UNIQUE,
  `phone` varchar(20) NOT NULL,
  `address` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `description` text,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `reorder_level` int(11) NOT NULL DEFAULT 10,
  `restock_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` varchar(20) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `reservation_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`reservation_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`),
  FOREIGN KEY (`product_id`) REFERENCES `inventory`(`product_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sale_id` varchar(20) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `quantity_sold` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` ENUM('cash', 'credit_card', 'debit_card', 'online') NOT NULL,
  `sale_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sale_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`),
  FOREIGN KEY (`product_id`) REFERENCES `inventory`(`product_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Sample data for departments
--

INSERT INTO `departments` (`name`, `description`) VALUES
('Management', 'Store management and administration'),
('Sales', 'Sales and customer service'),
('Pharmacy', 'Pharmaceutical services and consultation'),
('Inventory', 'Stock management and control'),
('Marketing', 'Promotions and customer engagement');

--
-- Sample data for categories
--

INSERT INTO `categories` (`name`, `description`) VALUES
('Vitamins', 'Dietary supplements and vitamins'),
('Antiseptics', 'Wound care and sterilization products'),
('Antibiotics', 'Prescription antibiotics'),
('Analgesics', 'Pain relief medications'),
('First Aid', 'First aid supplies and equipment'),
('Skincare', 'Skin treatment and care products'),
('Dental Care', 'Oral hygiene products'),
('Baby Care', 'Baby health and wellness products'),
('Eye Care', 'Eye drops and treatments'),
('Supplements', 'Health supplements and minerals');

--
-- Sample data for employees
--

INSERT INTO `employees` (`department_id`, `name`, `email`, `phone`, `hire_date`) VALUES
(1, 'Employee 1', 'emp1@phoebexa.com', '111-222-3333', '2023-01-01'),
(2, 'Employee 2', 'emp2@phoebexa.com', '222-333-4444', '2023-02-01'),
(3, 'Employee 3', 'emp3@phoebexa.com', '333-444-5555', '2023-03-01'),
(3, 'Employee 4', 'emp4@phoebexa.com', '444-555-6666', '2023-04-01'),
(2, 'Employee 5', 'emp5@phoebexa.com', '555-666-7777', '2023-05-01');

--
-- Sample data for customers
--

INSERT INTO `customers` (`name`, `email`, `phone`, `address`) VALUES
('John Doe', 'john@example.com', '123-456-7890', '123 Main St'),
('Jane Smith', 'jane@example.com', '234-567-8901', '456 Oak Ave'),
('Bob Wilson', 'bob@example.com', '345-678-9012', '789 Pine Rd'),
('Alice Johnson', 'alice@example.com', '456-789-0123', '321 Elm St'),
('Charlie Brown', 'charlie@example.com', '567-890-1234', '654 Maple Dr'),
('Diana Prince', 'diana@example.com', '678-901-2345', '987 Cedar Ln'),
('Edward Clark', 'edward@example.com', '789-012-3456', '147 Birch Rd'),
('Fiona White', 'fiona@example.com', '890-123-4567', '258 Spruce Ave'),
('George Miller', 'george@example.com', '901-234-5678', '369 Pine St'),
('Helen Davis', 'helen@example.com', '012-345-6789', '741 Oak Rd'),
('Ian Taylor', 'ian@example.com', '123-234-3456', '852 Maple St'),
('Julia Green', 'julia@example.com', '234-345-4567', '963 Cedar Ave'),
('Kevin Black', 'kevin@example.com', '345-456-5678', '159 Elm Rd'),
('Laura Adams', 'laura@example.com', '456-567-6789', '753 Pine Ln'),
('Michael Scott', 'michael@example.com', '567-678-7890', '951 Oak Dr'),
('Nancy Lee', 'nancy@example.com', '678-789-8901', '357 Maple Ave'),
('Oliver King', 'oliver@example.com', '789-890-9012', '246 Cedar St'),
('Patricia Quinn', 'patricia@example.com', '890-901-0123', '135 Birch Ln'),
('Robert James', 'robert@example.com', '901-012-1234', '468 Spruce Rd'),
('Sarah Wilson', 'sarah@example.com', '012-123-2345', '579 Pine Ave');

--
-- Sample data for inventory
--

INSERT INTO `inventory` (`category_id`, `product_name`, `description`, `quantity`, `price`, `reorder_level`) VALUES
(1, 'Vitamin C 500mg', 'Daily vitamin C supplement', 150, 213.35, 30),
(2, 'Antiseptic Spray', 'Wound cleaning spray', 85, 278.62, 20),
(3, 'Amoxicillin 500mg', 'Broad-spectrum antibiotic', 200, 219.00, 40),
(4, 'Ibuprofen 200mg', 'Pain relief tablet', 300, 207.12, 50),
(2, 'Hydrogen Peroxide', 'Antiseptic solution', 120, 38.09, 25),
(5, 'Bandage Roll', 'Elastic bandage', 180, 156.50, 30),
(6, 'Acne Cream', 'Topical acne treatment', 90, 325.75, 20),
(7, 'Fluoride Toothpaste', 'Cavity protection', 250, 189.99, 40),
(8, 'Baby Shampoo', 'Gentle baby shampoo', 160, 245.50, 30),
(9, 'Eye Drops', 'Lubricating eye drops', 140, 198.25, 25),
(1, 'Multivitamin', 'Daily multivitamin tablets', 200, 456.80, 35),
(3, 'Ciprofloxacin', 'Antibiotic tablets', 180, 325.00, 30),
(4, 'Paracetamol', 'Fever reducer', 400, 156.25, 60),
(5, 'First Aid Kit', 'Basic first aid supplies', 75, 789.99, 15),
(6, 'Sunscreen SPF50', 'Sun protection lotion', 110, 445.50, 25),
(7, 'Mouthwash', 'Antibacterial mouthwash', 160, 267.75, 30),
(8, 'Baby Wipes', 'Gentle cleansing wipes', 220, 189.50, 40),
(9, 'Contact Solution', 'Contact lens solution', 95, 345.25, 20),
(10, 'Calcium Tablets', 'Calcium supplement', 170, 289.99, 30),
(10, 'Fish Oil Capsules', 'Omega-3 supplement', 140, 567.50, 25);

--
-- Sample data for reservations
--

INSERT INTO `reservations` (`reservation_id`, `customer_id`, `product_id`, `employee_id`, `quantity`, `status`, `reservation_date`, `expiry_date`, `notes`) VALUES
('R0001', 1, 1, 2, 4, 'completed', '2024-02-21', '2024-02-28', 'Regular customer'),
('R0002', 2, 2, 3, 4, 'cancelled', '2023-10-12', '2023-10-19', 'Customer cancelled'),
('R0003', 3, 3, 4, 3, 'pending', '2024-03-01', '2024-03-08', 'Prescription required'),
('R0004', 4, 4, 5, 2, 'confirmed', '2024-03-02', '2024-03-09', 'Called to confirm'),
('R0005', 5, 5, 2, 1, 'completed', '2024-03-03', '2024-03-10', 'Picked up early'),
('R0006', 6, 6, 3, 3, 'pending', '2024-03-04', '2024-03-11', 'Waiting for stock'),
('R0007', 7, 7, 4, 2, 'confirmed', '2024-03-05', '2024-03-12', 'Will pickup tomorrow'),
('R0008', 8, 8, 5, 5, 'completed', '2024-03-06', '2024-03-13', 'Bulk order'),
('R0009', 9, 9, 2, 1, 'cancelled', '2024-03-07', '2024-03-14', 'Found alternative'),
('R0010', 10, 10, 3, 2, 'pending', '2024-03-08', '2024-03-15', 'Special order'),
('R0011', 11, 11, 4, 3, 'confirmed', '2024-03-09', '2024-03-16', 'Regular customer'),
('R0012', 12, 12, 5, 4, 'completed', '2024-03-10', '2024-03-17', 'Priority order'),
('R0013', 13, 13, 2, 2, 'pending', '2024-03-11', '2024-03-18', 'Needs verification'),
('R0014', 14, 14, 3, 1, 'confirmed', '2024-03-12', '2024-03-19', 'Confirmed via phone'),
('R0015', 15, 15, 4, 3, 'cancelled', '2024-03-13', '2024-03-20', 'Out of stock'),
('R0016', 16, 16, 5, 2, 'completed', '2024-03-14', '2024-03-21', 'Express delivery'),
('R0017', 17, 17, 2, 4, 'pending', '2024-03-15', '2024-03-22', 'Bulk reservation'),
('R0018', 18, 18, 3, 1, 'confirmed', '2024-03-16', '2024-03-23', 'Will pickup today'),
('R0019', 19, 19, 4, 2, 'completed', '2024-03-17', '2024-03-24', 'Regular order'),
('R0020', 20, 20, 5, 3, 'pending', '2024-03-18', '2024-03-25', 'Awaiting confirmation');

--
-- Sample data for sales
--

INSERT INTO `sales` (`sale_id`, `customer_id`, `product_id`, `employee_id`, `quantity_sold`, `unit_price`, `total_amount`, `payment_method`, `sale_date`) VALUES
('S0001', 1, 1, 2, 2, 213.35, 426.70, 'credit_card', '2024-03-01'),
('S0002', 2, 3, 4, 1, 219.00, 219.00, 'cash', '2024-03-01'),
('S0003', 3, 5, 3, 3, 38.09, 114.27, 'debit_card', '2024-03-02'),
('S0004', 4, 2, 5, 1, 278.62, 278.62, 'online', '2024-03-02'),
('S0005', 5, 4, 2, 2, 207.12, 414.24, 'cash', '2024-03-03'),
('S0006', 6, 6, 3, 3, 156.50, 469.50, 'credit_card', '2024-03-03'),
('S0007', 7, 7, 4, 1, 325.75, 325.75, 'debit_card', '2024-03-04'),
('S0008', 8, 8, 5, 4, 189.99, 759.96, 'cash', '2024-03-04'),
('S0009', 9, 9, 2, 2, 198.25, 396.50, 'online', '2024-03-05'),
('S0010', 10, 10, 3, 1, 456.80, 456.80, 'credit_card', '2024-03-05'),
('S0011', 11, 11, 4, 3, 456.80, 1370.40, 'cash', '2024-03-06'),
('S0012', 12, 12, 5, 2, 325.00, 650.00, 'debit_card', '2024-03-06'),
('S0013', 13, 13, 2, 5, 156.25, 781.25, 'online', '2024-03-07'),
('S0014', 14, 14, 3, 1, 789.99, 789.99, 'cash', '2024-03-07'),
('S0015', 15, 15, 4, 2, 445.50, 891.00, 'credit_card', '2024-03-08'),
('S0016', 16, 16, 5, 3, 267.75, 803.25, 'debit_card', '2024-03-08'),
('S0017', 17, 17, 2, 4, 189.50, 758.00, 'cash', '2024-03-09'),
('S0018', 18, 18, 3, 1, 345.25, 345.25, 'online', '2024-03-09'),
('S0019', 19, 19, 4, 2, 289.99, 579.98, 'credit_card', '2024-03-10'),
('S0020', 20, 20, 5, 3, 567.50, 1702.50, 'cash', '2024-03-10');

--
-- Additional sample sales data for the last 7 days
--

INSERT INTO `sales` (`sale_id`, `customer_id`, `product_id`, `employee_id`, `quantity_sold`, `unit_price`, `total_amount`, `payment_method`, `sale_date`, `created_at`) VALUES
-- March 10, 2024 (Today)
('S1001', 1, 1, 1, 3, 213.35, 640.05, 'credit_card', '2024-03-10', '2024-03-10 09:15:00'),
('S1002', 2, 3, 2, 2, 219.00, 438.00, 'cash', '2024-03-10', '2024-03-10 10:30:00'),
('S1003', 3, 2, 1, 4, 278.62, 1114.48, 'debit_card', '2024-03-10', '2024-03-10 14:20:00'),
('S1004', 4, 5, 3, 1, 38.09, 38.09, 'online', '2024-03-10', '2024-03-10 16:45:00'),

-- March 9, 2024
('S1005', 5, 4, 2, 3, 207.12, 621.36, 'credit_card', '2024-03-09', '2024-03-09 11:20:00'),
('S1006', 6, 7, 4, 2, 325.75, 651.50, 'cash', '2024-03-09', '2024-03-09 13:15:00'),
('S1007', 7, 8, 5, 5, 189.99, 949.95, 'online', '2024-03-09', '2024-03-09 15:30:00'),

-- March 8, 2024
('S1008', 8, 10, 1, 2, 456.80, 913.60, 'debit_card', '2024-03-08', '2024-03-08 10:45:00'),
('S1009', 9, 12, 3, 3, 325.00, 975.00, 'credit_card', '2024-03-08', '2024-03-08 14:20:00'),
('S1010', 10, 15, 4, 1, 445.50, 445.50, 'cash', '2024-03-08', '2024-03-08 16:30:00'),

-- March 7, 2024
('S1011', 11, 16, 5, 4, 267.75, 1071.00, 'online', '2024-03-07', '2024-03-07 09:30:00'),
('S1012', 12, 18, 2, 2, 345.25, 690.50, 'credit_card', '2024-03-07', '2024-03-07 11:45:00'),
('S1013', 13, 19, 3, 3, 289.99, 869.97, 'debit_card', '2024-03-07', '2024-03-07 15:20:00'),

-- March 6, 2024
('S1014', 14, 20, 4, 2, 567.50, 1135.00, 'cash', '2024-03-06', '2024-03-06 10:15:00'),
('S1015', 15, 1, 1, 3, 213.35, 640.05, 'online', '2024-03-06', '2024-03-06 13:30:00'),
('S1016', 16, 3, 2, 1, 219.00, 219.00, 'credit_card', '2024-03-06', '2024-03-06 16:45:00'),

-- March 5, 2024
('S1017', 17, 5, 3, 4, 38.09, 152.36, 'debit_card', '2024-03-05', '2024-03-05 11:20:00'),
('S1018', 18, 7, 4, 2, 325.75, 651.50, 'cash', '2024-03-05', '2024-03-05 14:15:00'),
('S1019', 19, 9, 5, 3, 198.25, 594.75, 'online', '2024-03-05', '2024-03-05 16:30:00'),

-- March 4, 2024
('S1020', 20, 11, 1, 2, 456.80, 913.60, 'credit_card', '2024-03-04', '2024-03-04 09:45:00'),
('S1021', 1, 13, 2, 3, 156.25, 468.75, 'cash', '2024-03-04', '2024-03-04 12:30:00'),
('S1022', 2, 15, 3, 1, 445.50, 445.50, 'debit_card', '2024-03-04', '2024-03-04 15:15:00');

-- Update the created_at timestamps for these sales to match their sale dates
UPDATE `sales` 
SET `created_at` = `sale_date` 
WHERE `sale_id` LIKE 'S10%'; 

-- Additional sales data for the last 7 days (for Sales Overview chart)
INSERT INTO `sales` (`sale_id`, `customer_id`, `product_id`, `employee_id`, `quantity_sold`, `unit_price`, `total_amount`, `payment_method`, `sale_date`, `created_at`) VALUES
-- Today (highest sales)
('S2001', 1, 1, 2, 5, 213.35, 1066.75, 'credit_card', CURRENT_DATE, CURRENT_TIMESTAMP),
('S2002', 2, 3, 3, 6, 219.00, 1314.00, 'cash', CURRENT_DATE, CURRENT_TIMESTAMP),
('S2003', 3, 5, 4, 8, 38.09, 304.72, 'online', CURRENT_DATE, CURRENT_TIMESTAMP),
('S2004', 4, 7, 5, 4, 325.75, 1303.00, 'debit_card', CURRENT_DATE, CURRENT_TIMESTAMP),

-- Yesterday
('S2005', 5, 2, 2, 3, 278.62, 835.86, 'credit_card', DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
('S2006', 6, 4, 3, 5, 207.12, 1035.60, 'cash', DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
('S2007', 7, 6, 4, 4, 156.50, 626.00, 'online', DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),

-- 2 days ago
('S2008', 8, 8, 5, 7, 189.99, 1329.93, 'debit_card', DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
('S2009', 9, 10, 2, 3, 456.80, 1370.40, 'credit_card', DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
('S2010', 10, 12, 3, 2, 325.00, 650.00, 'cash', DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),

-- 3 days ago (peak sales)
('S2011', 11, 14, 4, 6, 789.99, 4739.94, 'online', DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
('S2012', 12, 16, 5, 8, 267.75, 2142.00, 'debit_card', DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
('S2013', 13, 18, 2, 5, 345.25, 1726.25, 'credit_card', DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),

-- 4 days ago
('S2014', 14, 20, 3, 4, 567.50, 2270.00, 'cash', DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
('S2015', 15, 1, 4, 3, 213.35, 640.05, 'online', DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
('S2016', 16, 3, 5, 5, 219.00, 1095.00, 'debit_card', DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),

-- 5 days ago
('S2017', 17, 5, 2, 6, 38.09, 228.54, 'credit_card', DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
('S2018', 18, 7, 3, 4, 325.75, 1303.00, 'cash', DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
('S2019', 19, 9, 4, 3, 198.25, 594.75, 'online', DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),

-- 6 days ago
('S2020', 20, 11, 5, 5, 456.80, 2284.00, 'debit_card', DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
('S2021', 1, 13, 2, 4, 156.25, 625.00, 'credit_card', DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
('S2022', 2, 15, 3, 3, 445.50, 1336.50, 'cash', DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY));

-- Additional employee performance data (varied performance across months)
INSERT INTO `sales` (`sale_id`, `customer_id`, `product_id`, `employee_id`, `quantity_sold`, `unit_price`, `total_amount`, `payment_method`, `sale_date`, `created_at`) VALUES
-- January Performance
('S3001', 3, 1, 2, 8, 213.35, 1706.80, 'credit_card', '2024-01-15', '2024-01-15 10:00:00'),
('S3002', 4, 3, 2, 6, 219.00, 1314.00, 'cash', '2024-01-16', '2024-01-16 11:30:00'),
('S3003', 5, 5, 3, 10, 38.09, 380.90, 'online', '2024-01-17', '2024-01-17 14:15:00'),
('S3004', 6, 7, 3, 7, 325.75, 2280.25, 'debit_card', '2024-01-18', '2024-01-18 16:45:00'),

-- February Performance (higher)
('S3005', 7, 2, 2, 12, 278.62, 3343.44, 'credit_card', '2024-02-10', '2024-02-10 09:30:00'),
('S3006', 8, 4, 2, 9, 207.12, 1864.08, 'cash', '2024-02-11', '2024-02-11 13:20:00'),
('S3007', 9, 6, 3, 15, 156.50, 2347.50, 'online', '2024-02-12', '2024-02-12 15:45:00'),
('S3008', 10, 8, 3, 11, 189.99, 2089.89, 'debit_card', '2024-02-13', '2024-02-13 17:00:00'),

-- March Performance (peak)
('S3009', 11, 10, 2, 18, 456.80, 8222.40, 'credit_card', '2024-03-05', '2024-03-05 10:15:00'),
('S3010', 12, 12, 2, 14, 325.00, 4550.00, 'cash', '2024-03-06', '2024-03-06 12:30:00'),
('S3011', 13, 14, 3, 20, 789.99, 15799.80, 'online', '2024-03-07', '2024-03-07 14:45:00'),
('S3012', 14, 16, 3, 16, 267.75, 4284.00, 'debit_card', '2024-03-08', '2024-03-08 16:20:00');

-- Update inventory quantities to reflect sales
UPDATE `inventory` SET 
    `quantity` = CASE 
        WHEN `product_id` = 1 THEN 150
        WHEN `product_id` = 2 THEN 85
        WHEN `product_id` = 3 THEN 200
        WHEN `product_id` = 4 THEN 300
        WHEN `product_id` = 5 THEN 120
        WHEN `product_id` = 6 THEN 180
        WHEN `product_id` = 7 THEN 90
        WHEN `product_id` = 8 THEN 250
        WHEN `product_id` = 9 THEN 160
        WHEN `product_id` = 10 THEN 140
        ELSE `quantity`
    END; 

-- Additional employee performance data for better monthly trends
INSERT INTO `sales` (`sale_id`, `customer_id`, `product_id`, `employee_id`, `quantity_sold`, `unit_price`, `total_amount`, `payment_method`, `sale_date`, `created_at`) VALUES
-- April Data (showing growth trend)
('S4001', 1, 1, 2, 15, 213.35, 3200.25, 'credit_card', '2024-04-01', '2024-04-01 10:00:00'),
('S4002', 2, 3, 2, 12, 219.00, 2628.00, 'cash', '2024-04-02', '2024-04-02 11:30:00'),
('S4003', 3, 5, 3, 18, 38.09, 685.62, 'online', '2024-04-03', '2024-04-03 14:15:00'),
('S4004', 4, 7, 3, 14, 325.75, 4560.50, 'debit_card', '2024-04-04', '2024-04-04 16:45:00'),

-- May Data (peak performance)
('S4005', 5, 2, 2, 20, 278.62, 5572.40, 'credit_card', '2024-05-01', '2024-05-01 09:30:00'),
('S4006', 6, 4, 2, 16, 207.12, 3313.92, 'cash', '2024-05-02', '2024-05-02 13:20:00'),
('S4007', 7, 6, 3, 22, 156.50, 3443.00, 'online', '2024-05-03', '2024-05-03 15:45:00'),
('S4008', 8, 8, 3, 19, 189.99, 3609.81, 'debit_card', '2024-05-04', '2024-05-04 17:00:00');

-- Additional product data with varied price points and quantities
INSERT INTO `inventory` (`category_id`, `product_name`, `description`, `quantity`, `price`, `reorder_level`) VALUES
(1, 'Premium Multivitamin', 'High-end daily supplement', 75, 789.99, 15),
(2, 'Advanced First Aid Kit', 'Comprehensive medical kit', 45, 1299.99, 10),
(3, 'Basic Pain Relief', 'Generic pain medication', 450, 49.99, 100),
(4, 'Luxury Skincare Set', 'Premium beauty products', 30, 2499.99, 5),
(5, 'Economy Pack Bandages', 'Bulk pack bandages', 800, 29.99, 200),
(6, 'Professional Grade Antiseptic', 'Hospital grade', 120, 899.99, 25),
(7, 'Budget Multivitamin', 'Affordable daily supplement', 600, 89.99, 150),
(8, 'Specialty Wound Care', 'Advanced healing products', 50, 1599.99, 10);

-- Add sales data for new products
INSERT INTO `sales` (`sale_id`, `customer_id`, `product_id`, `employee_id`, `quantity_sold`, `unit_price`, `total_amount`, `payment_method`, `sale_date`, `created_at`) VALUES
('S5001', 9, 21, 2, 5, 789.99, 3949.95, 'credit_card', '2024-05-05', '2024-05-05 10:15:00'),
('S5002', 10, 22, 3, 3, 1299.99, 3899.97, 'debit_card', '2024-05-05', '2024-05-05 11:30:00'),
('S5003', 11, 23, 4, 20, 49.99, 999.80, 'cash', '2024-05-05', '2024-05-05 14:45:00'),
('S5004', 12, 24, 5, 2, 2499.99, 4999.98, 'credit_card', '2024-05-05', '2024-05-05 16:00:00'),
('S5005', 13, 25, 2, 50, 29.99, 1499.50, 'online', '2024-05-05', '2024-05-05 17:15:00'),
('S5006', 14, 26, 3, 4, 899.99, 3599.96, 'debit_card', '2024-05-06', '2024-05-06 09:30:00'),
('S5007', 15, 27, 4, 30, 89.99, 2699.70, 'cash', '2024-05-06', '2024-05-06 10:45:00'),
('S5008', 16, 28, 5, 3, 1599.99, 4799.97, 'credit_card', '2024-05-06', '2024-05-06 13:00:00'); 