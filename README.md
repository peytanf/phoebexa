# Phoebexa: Automated Sales and Inventory System with Analytics Dashboard

## Overview
This web-based Automated Sales and Inventory System with Forecasting and AI Product Recommendation for Phoebe Drugstore aims to modernize and streamline drugstore operations. The system addresses critical challenges in traditional manual processes, including:
- Inaccurate stock records
- Untracked sales patterns
- Medicine wastage issues
- Inefficient inventory management

The system provides an integrated solution featuring:
- Real-time inventory tracking
- Sales monitoring and analytics
- Interactive data visualizations
- Performance metrics dashboard
- Status monitoring and alerts

## Dataset
The system manages comprehensive pharmaceutical retail data including:

### Core Data Tables
1. **Inventory Management**
   - Products (medicines, supplies)
   - Categories
   - Stock levels
   - Reorder points
   - Price information

2. **Sales Records**
   - Transaction details
   - Payment methods
   - Customer information
   - Sales trends
   - Revenue analytics

3. **Employee Data**
   - Staff information
   - Department assignments
   - Performance metrics
   - Sales attribution

4. **Customer Information**
   - Customer profiles
   - Purchase history
   - Contact details
   - Preferences

5. **Reservations**
   - Booking details
   - Status tracking
   - Customer requests
   - Expiry management

## Installation Instructions

### Prerequisites
1. Node.js (v20.18.0 or higher)
2. MySQL (v5.2.1 or higher)
3. Web browser (Chrome/Firefox/Safari)

### Setup Steps
1. Clone the repository
   ```bash
   git clone [repository-url]
   cd phoebexa
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure database
   ```bash
   # Create .env file with your database credentials
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=phoebexa
   ```

4. Import database schema
   ```bash
   mysql -u root -p phoebexa < phoebexa.sql
   ```

5. Start the server
   ```bash
   npm start
   ```

6. Access the dashboard
   ```
   Open http://localhost:3000 in your web browser
   ```

## Authentication
The system implements a simple client-side authentication system:
- Default credentials: username: `admin`, password: `admin`
- Authentication state is stored in browser's localStorage
- Protected routes redirect unauthenticated users to the login page
- Sign-out functionality clears authentication data

## Dependencies

### Core Dependencies
```json
{
  "express": "^4.18.2",     // Web application framework
  "mysql2": "^3.6.5",       // MySQL database driver
  "dotenv": "^16.3.1",      // Environment configuration
  "cors": "^2.8.5",         // Cross-origin resource sharing
  "express-session": "^1.17.3", // Session management
  "bcryptjs": "^2.4.3"      // Password hashing
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.0.2"       // Auto-restart development server
}
```

### Frontend Libraries
- Chart.js - Data visualization
- Material Dashboard - UI framework
- Bootstrap 5 - Responsive design
- Font Awesome - Icons

## API Endpoints

### Dashboard Analytics
1. `GET /api/dashboard/summary`
   - Overall system statistics
   - Count of employees, inventory, reservations, sales
   - Response example:
   ```json
   {
     "employees": 5,
     "inventory": 30,
     "reservations": 15,
     "sales": 25
   }
   ```

2. `GET /api/dashboard/inventory-chart`
   - Inventory status by category
   - Stock levels and distribution
   - Response example:
   ```json
   [
     {
       "category": "Vitamins",
       "count": 10,
       "total_quantity": 150
     },
     {
       "category": "Antiseptics",
       "count": 8,
       "total_quantity": 120
     }
   ]
   ```

3. `GET /api/dashboard/sales-distribution`
   - Sales analysis by category
   - Revenue distribution
   - Response example:
   ```json
   [
     {
       "category": "Vitamins",
       "revenue": 15000.50
     },
     {
       "category": "Antibiotics",
       "revenue": 25000.75
     }
   ]
   ```

4. `GET /api/dashboard/department-performance`
   - Departmental efficiency metrics
   - Team performance indicators
   - Response example:
   ```json
   {
     "departments": ["Sales", "Pharmacy", "Management", "Inventory", "Marketing"],
     "sales_performance": [85, 75, 60, 70, 80],
     "employee_efficiency": [90, 85, 75, 65, 70]
   }
   ```

5. `GET /api/dashboard/sales-chart`
   - Weekly sales performance
   - Trend visualization
   - Response example:
   ```json
   [
     {
       "date": "2024-03-04",
       "total": 3865.75
     },
     {
       "date": "2024-03-05",
       "total": 4285.50
     }
   ]
   ```

6. `GET /api/reservations`
   - Reservation list with details
   - Response example:
   ```json
   [
     {
       "reservation_id": "R0001",
       "customer_name": "John Doe",
       "product_name": "Vitamin C 500mg",
       "quantity": 4,
       "status": "pending",
       "reservation_date": "2024-03-01",
       "expiry_date": "2024-03-08"
     }
   ]
   ```

7. `GET /api/employees`
   - Employee list with department info
   - Response example:
   ```json
   [
     {
       "employee_id": 1,
       "name": "Employee 1",
       "email": "emp1@phoebexa.com",
       "department_id": 1,
       "department_name": "Management",
       "hire_date": "2023-01-01",
       "phone": "111-222-3333"
     }
   ]
   ```

## Features
1. **Real-time Dashboard**
   - Interactive charts (4 types: line, doughnut, pie, radar)
   - Dynamic data updates
   - Performance metrics

2. **Inventory Management**
   - Stock level monitoring
   - Category management
   - Reorder alerts

3. **Sales Analytics**
   - Revenue tracking
   - Performance analysis
   - Trend visualization

4. **Simplified Reservation System**
   - Clear reservation listing
   - Status indicators (pending, confirmed, completed, cancelled)
   - Expiry date tracking

5. **Customer Management**
   - Purchase history
   - Reservation tracking
   - Contact management

## UI Features & Recent Changes
- Consistent Material Dashboard design across all pages
- Responsive mobile-first layout
- Simplified Reservations page with direct table view
- Focused dashboard with four essential charts
- User authentication with login/logout functionality
- Protected routes with authentication checks

## Security Features
- Session management
- Password hashing
- Protected routes
- Input validation

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details 