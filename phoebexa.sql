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
('Pharmacy', 'Pharmaceutical services and consultation');

--
-- Sample data for categories
--

INSERT INTO `categories` (`name`, `description`) VALUES
('Vitamins', 'Dietary supplements and vitamins'),
('Antiseptics', 'Wound care and sterilization products'),
('Antibiotics', 'Prescription antibiotics'),
('Analgesics', 'Pain relief medications'),
('First Aid', 'First aid supplies and equipment');

--
-- Sample data for customers
--

INSERT INTO `customers` (`name`, `email`, `phone`, `address`) VALUES
('John Doe', 'john@example.com', '123-456-7890', '123 Main St'),
('Jane Smith', 'jane@example.com', '234-567-8901', '456 Oak Ave'),
('Bob Wilson', 'bob@example.com', '345-678-9012', '789 Pine Rd');

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
-- Sample data for inventory
--

INSERT INTO `inventory` (`category_id`, `product_name`, `description`, `quantity`, `price`, `reorder_level`) VALUES
(1, 'Vitamin C 500mg', 'Daily vitamin C supplement', 30, 213.35, 15),
(2, 'Antiseptic Spray', 'Wound cleaning spray', 16, 278.62, 10),
(3, 'Amoxicillin 500mg', 'Broad-spectrum antibiotic', 91, 219.00, 20),
(4, 'Ibuprofen 200mg', 'Pain relief tablet', 40, 207.12, 15),
(2, 'Hydrogen Peroxide', 'Antiseptic solution', 65, 38.09, 25);

--
-- Sample data for reservations
--

INSERT INTO `reservations` (`reservation_id`, `customer_id`, `product_id`, `employee_id`, `quantity`, `status`, `reservation_date`, `expiry_date`) VALUES
('R0001', 1, 1, 2, 4, 'completed', '2024-02-21', '2024-02-28'),
('R0002', 2, 2, 3, 4, 'cancelled', '2023-10-12', '2023-10-19'),
('R0003', 3, 3, 4, 3, 'pending', '2024-03-01', '2024-03-08'),
('R0004', 1, 4, 5, 2, 'confirmed', '2024-03-02', '2024-03-09'),
('R0005', 2, 5, 2, 1, 'completed', '2024-03-03', '2024-03-10');

--
-- Sample data for sales
--

INSERT INTO `sales` (`sale_id`, `customer_id`, `product_id`, `employee_id`, `quantity_sold`, `unit_price`, `total_amount`, `payment_method`, `sale_date`) VALUES
('S0001', 1, 1, 2, 2, 213.35, 426.70, 'credit_card', '2024-03-01'),
('S0002', 2, 3, 4, 1, 219.00, 219.00, 'cash', '2024-03-01'),
('S0003', 3, 5, 3, 3, 38.09, 114.27, 'debit_card', '2024-03-02'),
('S0004', 1, 2, 5, 1, 278.62, 278.62, 'online', '2024-03-02'),
('S0005', 2, 4, 2, 2, 207.12, 414.24, 'cash', '2024-03-03'); 