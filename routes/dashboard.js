const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get dashboard summary counts
router.get('/summary', async (req, res) => {
    try {
        console.log('Fetching dashboard summary...');
        const queries = [
            'SELECT COUNT(*) as count FROM employees',
            'SELECT COUNT(*) as count FROM inventory',
            'SELECT COUNT(*) as count FROM reservations',
            'SELECT COUNT(*) as count FROM sales'
        ];

        const results = await Promise.all(
            queries.map(async (query) => {
                try {
                    const [result] = await pool.query(query);
                    return result[0].count;
                } catch (err) {
                    console.error(`Error executing query: ${query}`, err);
                    return 0;
                }
            })
        );

        const [employees, inventory, reservations, sales] = results;

        res.json({
            employees,
            inventory,
            reservations,
            sales
        });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard summary', details: error.message });
    }
});

// Get recent data for all tables
router.get('/recent', async (req, res) => {
    try {
        const queries = [
            'SELECT * FROM employees ORDER BY employee_id DESC LIMIT 10',
            'SELECT * FROM inventory ORDER BY product_id DESC LIMIT 10',
            'SELECT * FROM reservations ORDER BY reservation_id DESC LIMIT 10',
            'SELECT * FROM sales ORDER BY sale_id DESC LIMIT 10'
        ];

        const [employees, inventory, reservations, sales] = await Promise.all(
            queries.map(query => pool.query(query))
        );

        res.json({
            employees: employees[0],
            inventory: inventory[0],
            reservations: reservations[0],
            sales: sales[0]
        });
    } catch (error) {
        console.error('Error fetching recent data:', error);
        res.status(500).json({ error: 'Failed to fetch recent data' });
    }
});

// Get sales data for chart
router.get('/sales-chart', async (req, res) => {
    try {
        console.log('Fetching sales chart data...');
        const query = `
            SELECT 
                DATE(created_at) as date,
                SUM(total_amount) as total
            FROM sales
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `;
        
        const [results] = await pool.query(query);
        console.log('Sales chart data:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sales chart data:', error);
        res.status(500).json({ error: 'Failed to fetch sales chart data', details: error.message });
    }
});

// Get inventory status for chart
router.get('/inventory-chart', async (req, res) => {
    try {
        console.log('Fetching inventory chart data...');
        const query = `
            SELECT 
                COALESCE(c.name, 'Uncategorized') as category,
                COUNT(i.product_id) as count,
                SUM(i.quantity) as total_quantity
            FROM inventory i
            LEFT JOIN categories c ON i.category_id = c.category_id
            GROUP BY c.category_id, c.name
        `;
        
        const [results] = await pool.query(query);
        console.log('Inventory chart data:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching inventory chart data:', error);
        res.status(500).json({ error: 'Failed to fetch inventory chart data', details: error.message });
    }
});

// Get employee performance data for line chart
router.get('/employee-performance', async (req, res) => {
    try {
        console.log('Fetching employee performance data...');
        const query = `
            SELECT 
                DATE_FORMAT(s.sale_date, '%b') as month,
                COUNT(s.sale_id) as sales_count,
                ROUND(AVG(s.total_amount), 2) as average_sale
            FROM 
                employees e
            LEFT JOIN 
                sales s ON e.employee_id = s.employee_id
            WHERE 
                YEAR(s.sale_date) = YEAR(CURRENT_DATE)
            GROUP BY 
                DATE_FORMAT(s.sale_date, '%b'), MONTH(s.sale_date)
            ORDER BY 
                MONTH(s.sale_date)
        `;
        
        const [results] = await pool.query(query);
        
        // Transform the data for the chart
        const chartData = results.map(row => ({
            month: row.month,
            sales_performance: row.sales_count ? (row.sales_count * 10) + (row.average_sale / 10) : 0,
            customer_satisfaction: row.sales_count ? Math.min(95, Math.max(80, 85 + (row.average_sale / 100))) : 80
        }));
        
        console.log('Employee performance data:', chartData);
        res.json(chartData);
    } catch (error) {
        console.error('Error fetching employee performance data:', error);
        res.status(500).json({ error: 'Failed to fetch employee performance data', details: error.message });
    }
});

// Get sales distribution data for pie chart
router.get('/sales-distribution', async (req, res) => {
    try {
        console.log('Fetching sales distribution data...');
        const query = `
            SELECT 
                COALESCE(c.name, 'Uncategorized') as category,
                SUM(s.total_amount) as revenue
            FROM 
                sales s
            LEFT JOIN 
                inventory i ON s.product_id = i.product_id
            LEFT JOIN 
                categories c ON i.category_id = c.category_id
            GROUP BY 
                c.category_id, c.name
            HAVING 
                revenue > 0
            ORDER BY 
                revenue DESC
        `;
        
        const [results] = await pool.query(query);
        console.log('Sales distribution data:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sales distribution data:', error);
        res.status(500).json({ error: 'Failed to fetch sales distribution data', details: error.message });
    }
});

// Get product analysis data for bubble chart
router.get('/product-analysis', async (req, res) => {
    try {
        console.log('Fetching product analysis data...');
        const query = `
            SELECT 
                i.product_name,
                i.price,
                i.quantity,
                COUNT(s.sale_id) as sales_volume,
                COALESCE(SUM(s.total_amount), 0) as total_sales
            FROM 
                inventory i
            LEFT JOIN 
                sales s ON i.product_id = s.product_id
            GROUP BY 
                i.product_id, i.product_name, i.price, i.quantity
            ORDER BY 
                total_sales DESC
            LIMIT 10
        `;
        
        const [results] = await pool.query(query);
        console.log('Product analysis data:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching product analysis data:', error);
        res.status(500).json({ error: 'Failed to fetch product analysis data', details: error.message });
    }
});

// Get department performance data for radar chart
router.get('/department-performance', async (req, res) => {
    try {
        console.log('Fetching department performance data...');
        const query = `
            SELECT 
                COALESCE(d.name, 'Unassigned') as department,
                COUNT(DISTINCT e.employee_id) as employee_count,
                COUNT(s.sale_id) as total_sales,
                ROUND(AVG(s.total_amount), 2) as avg_sale_amount,
                COALESCE(SUM(s.total_amount), 0) as total_revenue
            FROM 
                departments d
            LEFT JOIN 
                employees e ON d.department_id = e.department_id
            LEFT JOIN 
                sales s ON e.employee_id = s.employee_id
            GROUP BY 
                d.department_id, d.name
            ORDER BY
                d.name
        `;
        
        const [results] = await pool.query(query);
        
        // Transform the data for the radar chart in the format expected by the client
        const departments = results.map(row => row.department);
        
        // Calculate sales performance (based on total sales)
        const salesPerformance = results.map(row => {
            const maxSales = Math.max(...results.map(r => r.total_sales || 0));
            return maxSales ? Math.round((row.total_sales / maxSales) * 100) : 0;
        });
        
        // Calculate employee efficiency (based on revenue per employee)
        const employeeEfficiency = results.map(row => {
            if (!row.employee_count) return 0;
            const revenuePerEmployee = row.total_revenue / row.employee_count;
            const maxRevenuePerEmployee = Math.max(...results
                .filter(r => r.employee_count > 0)
                .map(r => r.total_revenue / r.employee_count));
            
            return maxRevenuePerEmployee ? Math.round((revenuePerEmployee / maxRevenuePerEmployee) * 100) : 0;
        });
        
        // Format data as expected by the client
        const formattedData = {
            departments,
            sales_performance: salesPerformance,
            employee_efficiency: employeeEfficiency
        };
        
        console.log('Department performance data:', formattedData);
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching department performance data:', error);
        res.status(500).json({ error: 'Failed to fetch department performance data', details: error.message });
    }
});

// Get top performing employees
router.get('/top-employees', async (req, res) => {
    try {
        console.log('Fetching top employees data...');
        const query = `
            SELECT 
                e.name as employee_name,
                e.email,
                d.name as department,
                COUNT(s.sale_id) as total_sales,
                SUM(s.total_amount) as total_revenue,
                ROUND(AVG(s.total_amount), 2) as avg_sale_amount
            FROM 
                employees e
            LEFT JOIN 
                departments d ON e.department_id = d.department_id
            LEFT JOIN 
                sales s ON e.employee_id = s.employee_id
            GROUP BY 
                e.employee_id, e.name, e.email, d.name
            HAVING
                total_sales > 0
            ORDER BY 
                total_revenue DESC
            LIMIT 5
        `;
        
        const [results] = await pool.query(query);
        console.log('Top employees data:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching top employees data:', error);
        res.status(500).json({ error: 'Failed to fetch top employees data', details: error.message });
    }
});

// Get low stock products
router.get('/low-stock', async (req, res) => {
    try {
        console.log('Fetching low stock products...');
        const query = `
            SELECT 
                i.product_id,
                i.product_name,
                i.quantity,
                i.reorder_level,
                c.name as category,
                i.price,
                DATEDIFF(CURRENT_DATE, i.restock_date) as days_since_restock
            FROM 
                inventory i
            LEFT JOIN 
                categories c ON i.category_id = c.category_id
            WHERE 
                i.quantity <= i.reorder_level
            ORDER BY 
                i.quantity ASC
        `;
        
        const [results] = await pool.query(query);
        console.log('Low stock products:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        res.status(500).json({ error: 'Failed to fetch low stock products', details: error.message });
    }
});

// Get sales trends
router.get('/sales-trends', async (req, res) => {
    try {
        console.log('Fetching sales trends...');
        const query = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y-%m') as month,
                COUNT(sale_id) as total_transactions,
                SUM(total_amount) as total_revenue,
                ROUND(AVG(total_amount), 2) as avg_transaction_value,
                COUNT(DISTINCT customer_id) as unique_customers,
                COUNT(DISTINCT product_id) as products_sold
            FROM 
                sales
            WHERE 
                sale_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
            GROUP BY 
                DATE_FORMAT(sale_date, '%Y-%m')
            ORDER BY 
                month DESC
        `;
        
        const [results] = await pool.query(query);
        console.log('Sales trends:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sales trends:', error);
        res.status(500).json({ error: 'Failed to fetch sales trends', details: error.message });
    }
});

// Get customer insights
router.get('/customer-insights', async (req, res) => {
    try {
        console.log('Fetching customer insights...');
        const query = `
            SELECT 
                c.name as customer_name,
                COUNT(s.sale_id) as purchase_count,
                SUM(s.total_amount) as total_spent,
                ROUND(AVG(s.total_amount), 2) as avg_purchase_amount,
                MAX(s.sale_date) as last_purchase_date
            FROM 
                customers c
            LEFT JOIN 
                sales s ON c.customer_id = s.customer_id
            GROUP BY 
                c.customer_id, c.name
            HAVING 
                purchase_count > 0
            ORDER BY 
                total_spent DESC
            LIMIT 10
        `;
        
        const [results] = await pool.query(query);
        console.log('Customer insights:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching customer insights:', error);
        res.status(500).json({ error: 'Failed to fetch customer insights', details: error.message });
    }
});

// Get reservation status summary
router.get('/reservation-status', async (req, res) => {
    try {
        console.log('Fetching reservation status summary...');
        const query = `
            SELECT 
                status,
                COUNT(*) as count,
                COUNT(DISTINCT customer_id) as unique_customers,
                COUNT(DISTINCT product_id) as unique_products,
                SUM(quantity) as total_items,
                MIN(reservation_date) as earliest_date,
                MAX(expiry_date) as latest_expiry
            FROM 
                reservations
            WHERE 
                reservation_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
            GROUP BY 
                status
        `;
        
        const [results] = await pool.query(query);
        console.log('Reservation status summary:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching reservation status:', error);
        res.status(500).json({ error: 'Failed to fetch reservation status', details: error.message });
    }
});

module.exports = router;  