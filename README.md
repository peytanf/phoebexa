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

4. `GET /api/dashboard/product-analysis`
   - Product performance metrics
   - Sales volume vs. price analysis
   - Response example:
   ```json
   [
     {
       "product_name": "Vitamin C 500mg",
       "price": 213.35,
       "quantity": 30,
       "sales_volume": 45,
       "total_sales": 9600.75
     }
   ]
   ```

5. `GET /api/dashboard/department-performance`
   - Departmental efficiency metrics
   - Team performance indicators
   - Response example:
   ```json
   [
     {
       "department": "Sales",
       "Sales Performance": 85,
       "Revenue Generation": 90,
       "Team Size": 60,
       "Average Transaction": 75,
       "Efficiency": 82
     }
   ]
   ```

6. `GET /api/dashboard/top-employees`
   - Top performing staff
   - Sales achievement metrics
   - Response example:
   ```json
   [
     {
       "employee_name": "John Doe",
       "email": "john@example.com",
       "department": "Sales",
       "total_sales": 150,
       "total_revenue": 45000.00,
       "avg_sale_amount": 300.00
     }
   ]
   ```

7. `GET /api/dashboard/customer-insights`
   - Customer behavior analysis
   - Purchase patterns
   - Response example:
   ```json
   [
     {
       "customer_name": "Jane Smith",
       "purchase_count": 12,
       "total_spent": 3500.00,
       "avg_purchase_amount": 291.67,
       "last_purchase_date": "2024-03-01"
     }
   ]
   ```

## Features
1. **Real-time Dashboard**
   - Interactive charts
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

4. **Employee Performance**
   - Sales attribution
   - Department metrics
   - Efficiency tracking

5. **Customer Management**
   - Purchase history
   - Reservation tracking
   - Contact management

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