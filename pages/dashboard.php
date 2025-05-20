<?php
require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

// Fetch data from all tables
$employeesData = [];
$inventoryData = [];
$reservationsData = [];
$salesData = [];

// Get employees data
$employeesQuery = "SELECT * FROM employees LIMIT 10";
$employeesStmt = $db->prepare($employeesQuery);
$employeesStmt->execute();
$employeesData = $employeesStmt->fetchAll(PDO::FETCH_ASSOC);

// Get inventory data
$inventoryQuery = "SELECT * FROM inventory LIMIT 10";
$inventoryStmt = $db->prepare($inventoryQuery);
$inventoryStmt->execute();
$inventoryData = $inventoryStmt->fetchAll(PDO::FETCH_ASSOC);

// Get reservations data
$reservationsQuery = "SELECT * FROM reservations LIMIT 10";
$reservationsStmt = $db->prepare($reservationsQuery);
$reservationsStmt->execute();
$reservationsData = $reservationsStmt->fetchAll(PDO::FETCH_ASSOC);

// Get sales data
$salesQuery = "SELECT * FROM sales LIMIT 10";
$salesStmt = $db->prepare($salesQuery);
$salesStmt->execute();
$salesData = $salesStmt->fetchAll(PDO::FETCH_ASSOC);

// Count total records for dashboard metrics
$employeesCountQuery = "SELECT COUNT(*) as count FROM employees";
$inventoryCountQuery = "SELECT COUNT(*) as count FROM inventory";
$reservationsCountQuery = "SELECT COUNT(*) as count FROM reservations";
$salesCountQuery = "SELECT COUNT(*) as count FROM sales";

$employeesCountStmt = $db->prepare($employeesCountQuery);
$inventoryCountStmt = $db->prepare($inventoryCountQuery);
$reservationsCountStmt = $db->prepare($reservationsCountQuery);
$salesCountStmt = $db->prepare($salesCountQuery);

$employeesCountStmt->execute();
$inventoryCountStmt->execute();
$reservationsCountStmt->execute();
$salesCountStmt->execute();

$employeesCount = $employeesCountStmt->fetch(PDO::FETCH_ASSOC)['count'];
$inventoryCount = $inventoryCountStmt->fetch(PDO::FETCH_ASSOC)['count'];
$reservationsCount = $reservationsCountStmt->fetch(PDO::FETCH_ASSOC)['count'];
$salesCount = $salesCountStmt->fetch(PDO::FETCH_ASSOC)['count'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
  <link rel="icon" type="image/png" href="../assets/img/phoebexa.png">
  <title>
    Dashboard
  </title>
  <!--     Fonts and icons     -->
  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700,900" />
  <!-- Nucleo Icons -->
  <link href="../assets/css/nucleo-icons.css" rel="stylesheet" />
  <link href="../assets/css/nucleo-svg.css" rel="stylesheet" />
  <!-- Font Awesome Icons -->
  <script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>
  <!-- Material Icons -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
  <!-- CSS Files -->
  <link id="pagestyle" href="../assets/css/material-dashboard.css?v=3.2.0" rel="stylesheet" />
  <!-- Custom Dashboard CSS -->
  <link href="../assets/css/dashboard-custom.css" rel="stylesheet" />
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body class="g-sidenav-show  bg-gray-100">
  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2  bg-white my-2" id="sidenav-main">
    <div class="sidenav-header">
      <i class="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand px-4 py-3 m-0" href="dashboard.php" target="_blank">
        <img src="../assets/img/logo-ct-dark.png" class="navbar-brand-img" width="26" height="26" alt="main_logo">
        <span class="ms-1 text-sm text-dark">PHOEBEXA</span>
      </a>
    </div>
    <hr class="horizontal dark mt-0 mb-2">
    <div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active bg-gradient-dark text-white" href="../pages/dashboard.php">
            <i class="material-symbols-rounded opacity-5">dashboard</i>
            <span class="nav-link-text ms-1">Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="../pages/employees.php">
            <i class="material-symbols-rounded opacity-5">person</i>
            <span class="nav-link-text ms-1">Employees</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="../pages/inventory.php">
            <i class="material-symbols-rounded opacity-5">inventory_2</i>
            <span class="nav-link-text ms-1">Inventory</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="../pages/reservations.php">
            <i class="material-symbols-rounded opacity-5">calendar_month</i>
            <span class="nav-link-text ms-1">Reservations</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" href="../pages/sales.php">
            <i class="material-symbols-rounded opacity-5">point_of_sale</i>
            <span class="nav-link-text ms-1">Sales</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="sidenav-footer position-absolute w-100 bottom-0 ">
      <div class="mx-3">
        <a class="btn bg-gradient-dark w-100" href="sign-in.html" type="button">Sign Out</a>
      </div>
    </div>
  </aside>
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
    <!-- Navbar -->
    <nav class="navbar navbar-main navbar-expand-lg px-0 mx-3 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
      <div class="container-fluid py-1 px-3">
        <nav aria-label="breadcrumb">
          <button class="navbar-toggler me-3" type="button" onclick="toggleSidenav()">
            <span class="navbar-toggler-icon">
              <i class="fas fa-bars"></i>
            </span>
          </button>
          <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
            <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="javascript:;">Pages</a></li>
            <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard</li>
          </ol>
        </nav>
      </div>
    </nav>
    <!-- End Navbar -->
    <div class="container-fluid py-2">
      <div class="row">
        <div class="ms-3">
          <h3 class="mb-0 h4 font-weight-bolder">Phoebexa Analytics Dashboard</h3>
          <p class="mb-4">
            Interactive data visualization for your database
          </p>
        </div>
        
        <?php if ($employeesCount == 0 && $inventoryCount == 0 && $reservationsCount == 0 && $salesCount == 0): ?>
        <!-- Show database connection message if no data is available -->
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <div class="icon icon-lg icon-shape bg-gradient-warning shadow text-center border-radius-lg mb-3">
                  <i class="material-symbols-rounded opacity-10">warning</i>
                </div>
                <div class="ms-3">
                  <h5 class="mb-2">Database Notice</h5>
                  <p class="mb-1">The database connection is working, but no data was found in the tables.</p>
                  <p class="mb-0">This could be because:</p>
                  <ul class="mb-0">
                    <li>The database tables are empty</li>
                    <li>The database structure exists but no records have been added</li>
                    <li>The column names in the tables may not match what the dashboard expects</li>
                  </ul>
                  <p class="mt-3">Your table structure shows these column names: <code>COL 1</code>, <code>COL 2</code>, etc. When you add data, the dashboard will automatically display it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <?php endif; ?>
        
        <!-- KPI Summary Cards -->
        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div class="card">
            <div class="card-header p-2 ps-3">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-sm mb-0 text-capitalize">Employees</p>
                  <h4 class="mb-0"><?php echo $employeesCount; ?></h4>
                </div>
                <div class="icon icon-md icon-shape bg-gradient-primary shadow text-center border-radius-lg">
                  <i class="material-symbols-rounded opacity-10">person</i>
                </div>
              </div>
            </div>
            <hr class="dark horizontal my-0">
            <div class="card-footer p-2 ps-3">
              <p class="mb-0 text-sm">Total employees in database</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div class="card">
            <div class="card-header p-2 ps-3">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-sm mb-0 text-capitalize">Inventory</p>
                  <h4 class="mb-0"><?php echo $inventoryCount; ?></h4>
                </div>
                <div class="icon icon-md icon-shape bg-gradient-success shadow text-center border-radius-lg">
                  <i class="material-symbols-rounded opacity-10">inventory_2</i>
                </div>
              </div>
            </div>
            <hr class="dark horizontal my-0">
            <div class="card-footer p-2 ps-3">
              <p class="mb-0 text-sm">Total inventory items</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
          <div class="card">
            <div class="card-header p-2 ps-3">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-sm mb-0 text-capitalize">Reservations</p>
                  <h4 class="mb-0"><?php echo $reservationsCount; ?></h4>
                </div>
                <div class="icon icon-md icon-shape bg-gradient-info shadow text-center border-radius-lg">
                  <i class="material-symbols-rounded opacity-10">calendar_month</i>
                </div>
              </div>
            </div>
            <hr class="dark horizontal my-0">
            <div class="card-footer p-2 ps-3">
              <p class="mb-0 text-sm">Total reservations</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card">
            <div class="card-header p-2 ps-3">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="text-sm mb-0 text-capitalize">Sales</p>
                  <h4 class="mb-0"><?php echo $salesCount; ?></h4>
                </div>
                <div class="icon icon-md icon-shape bg-gradient-warning shadow text-center border-radius-lg">
                  <i class="material-symbols-rounded opacity-10">point_of_sale</i>
                </div>
              </div>
            </div>
            <hr class="dark horizontal my-0">
            <div class="card-footer p-2 ps-3">
              <p class="mb-0 text-sm">Total sales records</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Analytics Controls Section -->
      <div class="row mt-4">
        <div class="col-12 mb-4">
          <div class="card analytics-card">
            <div class="card-header pb-0 p-3">
              <div class="row">
                <div class="col-6 d-flex align-items-center">
                  <h6 class="mb-0 chart-title">Data Visualization</h6>
                </div>
                <div class="col-6 text-end">
                  <div class="d-flex justify-content-end">
                    <a href="generate_report.php" class="btn btn-sm btn-dark me-3" id="generate-pdf">
                      <i class="fas fa-file-pdf me-1"></i> Generate PDF Report
                    </a>
                    <div class="input-group" style="max-width: 250px;">
                      <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
                      <input type="text" class="form-control" id="chart-search" placeholder="Search charts...">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Analytics Section -->
      <div class="row">
        <div class="col-12 mb-3">
          <h5 class="analytics-section-title">Sales Analytics</h5>
        </div>
        <div class="col-lg-8 col-md-12 mb-4">
          <div class="card h-100 chart-card">
            <div class="card-header pb-0 p-3">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0 chart-title">Sales Performance Trend</h6>
                <div>
                  <span class="filter-label">Time Period:</span>
                  <select class="form-select form-select-sm w-auto chart-filter" data-chart="sales-line">
                    <option value="all">Full Year</option>
                    <option value="last-half">Last 6 Months</option>
                    <option value="last-quarter">Last Quarter</option>
                    <option value="current-month">Current Month</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <div class="chart chart-canvas-container">
                <div class="chart-loading">
                  <div class="chart-loading-spinner"></div>
                </div>
                <canvas id="sales-line-chart" class="chart-canvas" height="300"></canvas>
                <div class="no-data-message d-none">No sales data available</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-12 mb-4">
          <div class="card h-100 chart-card">
            <div class="card-header pb-0 p-3">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0 chart-title">Reservations Data</h6>
                <div>
                  <span class="filter-label">View:</span>
                  <select class="form-select form-select-sm w-auto chart-filter" data-chart="bubble">
                    <option value="reservations-only">Reservations Only</option>
                    <option value="sales-only">Sales Only</option>
                    <option value="both-separate">Show Both</option>
                    <option value="first-half">First Half Month</option>
                    <option value="second-half">Second Half Month</option>
                    <option value="high-value">High Value</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <div class="chart chart-canvas-container">
                <div class="chart-loading">
                  <div class="chart-loading-spinner"></div>
                </div>
                <canvas id="bubble-chart" class="chart-canvas" height="300"></canvas>
                <div class="no-data-message d-none">No comparison data available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Inventory and Staff Analytics Section -->
      <div class="row">
        <div class="col-12 mb-3">
          <h5 class="analytics-section-title">Inventory & Staff Analytics</h5>
        </div>
        <div class="col-lg-6 col-md-12 mb-4">
          <div class="card h-100 chart-card">
            <div class="card-header pb-0 p-3">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0 chart-title">Inventory Distribution</h6>
                <div>
                  <span class="filter-label">Stock Level:</span>
                  <select class="form-select form-select-sm w-auto chart-filter" data-chart="inventory-bar">
                    <option value="all">All Inventory</option>
                    <option value="high-stock">High Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <div class="chart chart-canvas-container">
                <div class="chart-loading">
                  <div class="chart-loading-spinner"></div>
                </div>
                <canvas id="inventory-bar-chart" class="chart-canvas" height="300"></canvas>
                <div class="no-data-message d-none">No inventory data available</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-md-12 mb-4">
          <div class="card h-100 chart-card">
            <div class="card-header pb-0 p-3">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0 chart-title">Staff Composition</h6>
                <div>
                  <span class="filter-label">Department:</span>
                  <select class="form-select form-select-sm w-auto chart-filter" data-chart="employees-pie">
                    <option value="all">All Departments</option>
                    <option value="management">Management</option>
                    <option value="sales">Sales Team</option>
                    <option value="support">Support Staff</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <div class="chart chart-canvas-container">
                <div class="chart-loading">
                  <div class="chart-loading-spinner"></div>
                </div>
                <canvas id="employees-pie-chart" class="chart-canvas" height="300"></canvas>
                <div class="no-data-message d-none">No employee data available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer class="footer py-4">
        <div class="container-fluid">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-lg-6 mb-lg-0 mb-4">
              <div class="copyright text-center text-sm text-muted text-lg-start">
                © <script>
                  document.write(new Date().getFullYear())
                </script>,
                Phoebexa Analytics Dashboard
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </main>

  <!-- Core JS Files -->
  <script src="../assets/js/core/popper.min.js"></script>
  <script src="../assets/js/core/bootstrap.min.js"></script>

  <!-- Dashboard Charts JS -->
  <script src="../assets/js/dashboard-charts.js"></script>

  <!-- Toggle Sidenav Script -->
  <script>
    function toggleSidenav() {
      const sidenav = document.getElementById('sidenav-main');
      sidenav.classList.toggle('d-none');
    }
  </script>
</body>

</html>