<?php
// Set content type to JSON
header('Content-Type: application/json');

// Include database connection
require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

// Initialize response array
$response = [
    'employees' => [],
    'inventory' => [],
    'reservations' => [],
    'sales' => [],
    'error' => null
];

// Try to get data from the database
try {
    // Get employees data
    $employeesQuery = "SELECT * FROM employees";
    $employeesStmt = $db->prepare($employeesQuery);
    $employeesStmt->execute();
    $response['employees'] = $employeesStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get inventory data
    $inventoryQuery = "SELECT * FROM inventory";
    $inventoryStmt = $db->prepare($inventoryQuery);
    $inventoryStmt->execute();
    $response['inventory'] = $inventoryStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get reservations data
    $reservationsQuery = "SELECT * FROM reservations";
    $reservationsStmt = $db->prepare($reservationsQuery);
    $reservationsStmt->execute();
    $response['reservations'] = $reservationsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get sales data
    $salesQuery = "SELECT * FROM sales";
    $salesStmt = $db->prepare($salesQuery);
    $salesStmt->execute();
    $response['sales'] = $salesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if we have empty data and generate sample data if needed
    $databaseIsEmpty = empty($response['employees']) && 
                      empty($response['inventory']) && 
                      empty($response['reservations']) && 
                      empty($response['sales']);
    
    if ($databaseIsEmpty) {
        // Generate sample data for visualization
        $response['status'] = 'using_sample_data';
        
        // Sample employee roles
        $roles = ['Manager', 'Sales Associate', 'IT Support', 'Customer Service', 'Analyst', 'Director'];
        $departments = ['Sales', 'IT', 'Support', 'Management', 'Operations'];
        
        // Sample inventory categories
        $categories = ['Electronics', 'Furniture', 'Office Supplies', 'Books', 'Clothing'];
        $statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'On Order'];
        
        // Sample customer names
        $customers = ['John Smith', 'Jane Doe', 'Robert Johnson', 'Sarah Williams', 
                     'Michael Brown', 'Lisa Davis', 'James Wilson', 'Emily Taylor'];
        
        // Sample product names
        $products = ['Laptop', 'Desktop Computer', 'Office Chair', 'Desk', 'Printer', 
                    'Notebook', 'Pen Set', 'Headphones', 'Monitor', 'Keyboard'];
        
        // Generate sample employees (10)
        for ($i = 1; $i <= 10; $i++) {
            $role = $roles[array_rand($roles)];
            $department = $departments[array_rand($departments)];
            
            $response['employees'][] = [
                'COL 1' => 'EMP' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'COL 2' => $role,
                'COL 3' => 'Employee ' . $i,
                'COL 4' => $department
            ];
        }
        
        // Generate sample inventory (15)
        for ($i = 1; $i <= 15; $i++) {
            $category = $categories[array_rand($categories)];
            $product = $products[array_rand($products)] . ' ' . $i;
            $quantity = rand(0, 100);
            $price = rand(10, 1000) / 10;
            $status = $statuses[array_rand($statuses)];
            
            $response['inventory'][] = [
                'COL 1' => 'INV' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'COL 2' => $category,
                'COL 3' => $product,
                'COL 4' => $quantity,
                'COL 5' => $price,
                'COL 6' => $status
            ];
        }
        
        // Generate sample reservations (20)
        for ($i = 1; $i <= 20; $i++) {
            $customer = $customers[array_rand($customers)];
            $days = rand(1, 30);
            $date = date('m/d/Y', strtotime("-$days days"));
            $hour = str_pad(rand(9, 17), 2, '0', STR_PAD_LEFT);
            $min = str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT);
            $time = "$hour:$min";
            $status = rand(0, 10) > 2 ? 'Confirmed' : 'Pending';
            
            $response['reservations'][] = [
                'COL 1' => 'RES' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'COL 2' => $customer,
                'COL 3' => $date,
                'COL 4' => $time,
                'COL 5' => $status
            ];
        }
        
        // Generate sample sales (30)
        for ($i = 1; $i <= 30; $i++) {
            $customer = $customers[array_rand($customers)];
            $product = $products[array_rand($products)];
            $days = rand(1, 60);
            $date = date('m/d/Y', strtotime("-$days days"));
            $amount = rand(50, 1000);
            $status = 'Completed';
            
            $response['sales'][] = [
                'COL 1' => 'SAL' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'COL 2' => $date,
                'COL 3' => $customer,
                'COL 4' => $product,
                'COL 5' => $amount,
                'COL 6' => $status
            ];
        }
    }
    
    // Add mapped column names for charts to use
    $mappedEmployees = [];
    foreach ($response['employees'] as $employee) {
        $mappedEmployee = [
            'id' => $employee['COL 1'] ?? 'Unknown',
            'role' => $employee['COL 2'] ?? 'Unknown',
            'name' => $employee['COL 3'] ?? 'Unknown',
            'department' => $employee['COL 4'] ?? 'Unknown'
        ];
        $mappedEmployees[] = $mappedEmployee;
    }
    $response['employees_mapped'] = $mappedEmployees;

    // Add mapped column names for charts to use
    $mappedInventory = [];
    foreach ($response['inventory'] as $item) {
        $mappedItem = [
            'id' => $item['COL 1'] ?? 'Unknown',
            'category' => $item['COL 2'] ?? 'Unknown',
            'name' => $item['COL 3'] ?? 'Unknown',
            'quantity' => isset($item['COL 4']) ? intval($item['COL 4']) : rand(1, 50),
            'price' => isset($item['COL 5']) ? floatval($item['COL 5']) : rand(10, 200),
            'status' => $item['COL 6'] ?? 'In Stock'
        ];
        $mappedInventory[] = $mappedItem;
    }
    $response['inventory_mapped'] = $mappedInventory;

    // Add mapped column names for charts to use
    $mappedReservations = [];
    foreach ($response['reservations'] as $reservation) {
        $mappedReservation = [
            'id' => $reservation['COL 1'] ?? 'Unknown',
            'customer' => $reservation['COL 2'] ?? 'Unknown',
            'date' => $reservation['COL 3'] ?? date('m/d/Y', strtotime('-' . rand(1, 30) . ' days')),
            'time' => $reservation['COL 4'] ?? 'Unknown',
            'status' => $reservation['COL 5'] ?? 'Confirmed'
        ];
        $mappedReservations[] = $mappedReservation;
    }
    $response['reservations_mapped'] = $mappedReservations;

    // Add mapped column names for charts to use
    $mappedSales = [];
    foreach ($response['sales'] as $sale) {
        $saleDate = $sale['COL 2'] ?? date('m/d/Y', strtotime('-' . rand(1, 60) . ' days'));
        $saleAmount = isset($sale['COL 5']) ? floatval($sale['COL 5']) : rand(50, 500);
        
        $mappedSale = [
            'id' => $sale['COL 1'] ?? 'Unknown',
            'date' => $saleDate,
            'customer' => $sale['COL 3'] ?? 'Unknown',
            'product' => $sale['COL 4'] ?? 'Unknown',
            'amount' => $saleAmount,
            'status' => $sale['COL 6'] ?? 'Completed'
        ];
        $mappedSales[] = $mappedSale;
    }
    $response['sales_mapped'] = $mappedSales;

} catch (PDOException $e) {
    // Log error and set error message
    error_log('Database error: ' . $e->getMessage());
    $response['error'] = 'Database connection error: ' . $e->getMessage();
}

// Return data as JSON
echo json_encode($response);
?> 