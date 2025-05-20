// Dashboard Charts

// Initialize chart data
let employeesData = [];
let inventoryData = [];
let reservationsData = [];
let salesData = [];

// Chart instances
let salesLineChart;
let inventoryBarChart;
let employeesPieChart;
let salesReservationsBubbleChart;

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Show loading indicators
  showAllLoadingIndicators();
  
  // Fetch data and initialize charts
  fetchChartData();
});

// Function to show all loading indicators
function showAllLoadingIndicators() {
  document.querySelectorAll('.chart-loading').forEach(loader => {
    loader.classList.add('active');
  });
  
  // Also show loading in chart containers
  document.querySelectorAll('.chart-canvas-container').forEach(container => {
    container.style.opacity = '0.7';
  });
}

// Function to hide all loading indicators
function hideAllLoadingIndicators() {
  document.querySelectorAll('.chart-loading').forEach(loader => {
    loader.classList.remove('active');
  });
  
  // Restore chart containers
  document.querySelectorAll('.chart-canvas-container').forEach(container => {
    container.style.opacity = '1';
  });
}

// Function to show loading indicator for a specific chart
function showLoadingIndicator(chartId) {
  const canvas = document.getElementById(chartId);
  if (canvas) {
    const container = canvas.closest('.chart');
    const loader = container.querySelector('.chart-loading');
    if (loader) {
      loader.classList.add('active');
    }
  }
}

// Function to hide loading indicator for a specific chart
function hideLoadingIndicator(chartId) {
  const canvas = document.getElementById(chartId);
  if (canvas) {
    const container = canvas.closest('.chart');
    const loader = container.querySelector('.chart-loading');
    if (loader) {
      loader.classList.remove('active');
    }
  }
}

// Function to fetch data from PHP via AJAX
function fetchChartData() {
  fetch('get_chart_data.php')
    .then(response => response.json())
    .then(data => {
      // Check if there's an error
      if (data.error) {
        console.error('Server reported an error:', data.error);
        hideAllLoadingIndicators();
        
        // Show error messages in place of charts
        document.querySelectorAll('.no-data-message').forEach(msg => {
          msg.textContent = 'Database error: ' + data.error;
          msg.classList.remove('d-none');
        });
        return;
      }
      
      // Use mapped data if available, otherwise fall back to raw data
      employeesData = data.employees_mapped || data.employees || [];
      inventoryData = data.inventory_mapped || data.inventory || [];
      reservationsData = data.reservations_mapped || data.reservations || [];
      salesData = data.sales_mapped || data.sales || [];
      
      // Initialize charts with data
      initializeCharts();
      
      // Add event listeners for charts and filters
      setupEventListeners();
      
      // Hide loading indicators after charts are initialized
      setTimeout(hideAllLoadingIndicators, 500);
    })
    .catch(error => {
      console.error('Error fetching chart data:', error);
      hideAllLoadingIndicators();
      
      // Show error messages in place of charts
      document.querySelectorAll('.no-data-message').forEach(msg => {
        msg.textContent = 'Failed to load data. Please try again later.';
        msg.classList.remove('d-none');
      });
    });
}

// Function to initialize all charts
function initializeCharts() {
  // Destroy existing charts if they exist to prevent the "Canvas is already in use" error
  if (salesLineChart) {
    salesLineChart.destroy();
    salesLineChart = null;
  }
  if (inventoryBarChart) {
    inventoryBarChart.destroy();
    inventoryBarChart = null;
  }
  if (employeesPieChart) {
    employeesPieChart.destroy();
    employeesPieChart = null;
  }
  if (salesReservationsBubbleChart) {
    salesReservationsBubbleChart.destroy();
    salesReservationsBubbleChart = null;
  }
  
  // Clear canvas elements to ensure clean state
  document.querySelectorAll('.chart-canvas').forEach(canvas => {
    const parent = canvas.parentNode;
    const newCanvas = document.createElement('canvas');
    newCanvas.id = canvas.id;
    newCanvas.className = canvas.className;
    parent.removeChild(canvas);
    parent.appendChild(newCanvas);
  });
  
  // Initialize charts
  setTimeout(() => {
    createSalesLineChart();
    createInventoryBarChart();
    createEmployeesPositionPieChart();
    createSalesReservationsBubbleChart();
  }, 50);
}

// Function to create chart options with consistent sizing
function getChartOptions(title, xLabel, yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yLabel
        }
      },
      x: {
        title: {
          display: true,
          text: xLabel
        }
      }
    }
  };
}

// Function to setup event listeners
function setupEventListeners() {
  // Setup chart filter change events
  document.querySelectorAll('.chart-filter').forEach(filter => {
    filter.addEventListener('change', function() {
      const chartType = this.getAttribute('data-chart');
      const filterValue = this.value;
      filterData(chartType, filterValue);
    });
  });
  
  // Setup search functionality
  const searchInput = document.getElementById('chart-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchValue = this.value.trim().toLowerCase();
      searchChartData(searchValue);
    });
  }
  
  // Setup PDF export button
  const generatePdfBtn = document.getElementById('generate-pdf');
  if (generatePdfBtn) {
    generatePdfBtn.addEventListener('click', function(e) {
      // We'll just let PHP handle the PDF generation
      // But we can prepare chart data for the server if needed
      prepareChartsForExport();
    });
  }
  
  // Add chart info tooltips toggle
  const chartCards = document.querySelectorAll('.chart-card');
  chartCards.forEach(card => {
    const chartTitle = card.querySelector('.chart-title');
    if (chartTitle) {
      // Add info icon
      const infoIcon = document.createElement('i');
      infoIcon.className = 'fas fa-info-circle ms-2 chart-info-icon';
      infoIcon.style.cursor = 'pointer';
      chartTitle.appendChild(infoIcon);
      
      // Add tooltip functionality
      infoIcon.addEventListener('click', function() {
        const chartId = card.querySelector('.chart-canvas').id;
        showChartInfo(chartId, this);
      });
    }
  });
}

// Function to prepare charts for export
function prepareChartsForExport() {
  // Convert charts to base64 images and store in localStorage
  // (will be picked up by PHP if needed)
  if (salesLineChart) {
    const salesChartImg = salesLineChart.toBase64Image();
    localStorage.setItem('sales_chart_img', salesChartImg);
  }
  
  if (inventoryBarChart) {
    const inventoryChartImg = inventoryBarChart.toBase64Image();
    localStorage.setItem('inventory_chart_img', inventoryChartImg);
  }
  
  if (employeesPieChart) {
    const employeesChartImg = employeesPieChart.toBase64Image();
    localStorage.setItem('employees_chart_img', employeesChartImg);
  }
  
  if (salesReservationsBubbleChart) {
    const bubbleChartImg = salesReservationsBubbleChart.toBase64Image();
    localStorage.setItem('bubble_chart_img', bubbleChartImg);
  }
}

// Function to show chart information
function showChartInfo(chartId, element) {
  let infoText = '';
  
  switch(chartId) {
    case 'sales-line-chart':
      infoText = 'This chart shows sales performance trends over time. Use the filter to adjust the time period.';
      break;
    case 'inventory-bar-chart':
      infoText = 'This chart displays inventory distribution by category. Filter to see different stock levels.';
      break;
    case 'employees-pie-chart':
      infoText = 'This chart shows staff composition by role. You can filter by department.';
      break;
    case 'bubble-chart':
      infoText = 'This chart compares sales and reservations. The size of each bubble represents the value.';
      break;
    default:
      infoText = 'Hover over chart elements to see detailed information.';
  }
  
  // Create or get tooltip
  let tooltip = document.getElementById('chart-info-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'chart-info-tooltip';
    tooltip.className = 'chart-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '1000';
    tooltip.style.padding = '10px';
    tooltip.style.backgroundColor = 'rgba(52, 71, 103, 0.9)';
    tooltip.style.color = 'white';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '12px';
    tooltip.style.maxWidth = '250px';
    document.body.appendChild(tooltip);
  }
  
  // Position and show tooltip
  const rect = element.getBoundingClientRect();
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = (rect.bottom + 10) + 'px';
  tooltip.innerHTML = infoText;
  tooltip.style.display = 'block';
  
  // Hide tooltip after 3 seconds
  setTimeout(() => {
    tooltip.style.display = 'none';
  }, 3000);
}

// Sales Line Chart - Monthly trends
function createSalesLineChart() {
  const ctx = document.getElementById('sales-line-chart').getContext('2d');
  
  // Process sales data for chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlySales = new Array(12).fill(0);
  const monthlyRevenue = new Array(12).fill(0);
  
  // Count sales by month (using sample data if no real data)
  if (salesData.length > 0) {
    salesData.forEach(sale => {
      // Try to extract month from date field if available
      let monthIndex;
      
      if (sale.date) {
        // Attempt to extract month from date string (assuming format MM/DD/YYYY or similar)
        const dateParts = sale.date.split(/[\/\-]/);
        if (dateParts.length > 1) {
          // Subtract 1 because months are 0-indexed in JS but 1-indexed in data
          monthIndex = parseInt(dateParts[0]) - 1;
        }
      }
      
      // Fall back to random if unable to parse date
      if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        monthIndex = Math.floor(Math.random() * 12);
      }
      
      monthlySales[monthIndex] += 1;
      
      // Add revenue if 'amount' field exists
      if (sale.amount) {
        monthlyRevenue[monthIndex] += parseFloat(sale.amount);
      } else {
        // Random amount between 50 and 500
        monthlyRevenue[monthIndex] += Math.floor(Math.random() * 450) + 50;
      }
    });
  } else {
    // Sample data if no sales data is available
    for (let i = 0; i < 12; i++) {
      monthlySales[i] = Math.floor(Math.random() * 50) + 10;
      monthlyRevenue[i] = monthlySales[i] * (Math.floor(Math.random() * 50) + 100);
    }
  }

  // Get base options from helper function
  const options = getChartOptions('Monthly Sales Trend', 'Month', 'Number of Sales');
  
  // Add chart-specific options
  options.interaction = {
    mode: 'index',
    intersect: false,
  };
  
  options.plugins.legend = {
    display: true,
    position: 'top',
    onClick: function(e, legendItem, legend) {
      // Toggle dataset visibility when clicking legend item
      const index = legendItem.datasetIndex;
      const ci = legend.chart;
      const meta = ci.getDatasetMeta(index);
      
      // Toggle visibility
      meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
      
      // Update chart
      ci.update();
    }
  };
  
  options.plugins.tooltip = {
    mode: 'index',
    intersect: false
  };
  
  // Add dual Y axis setup
  options.scales.y1 = {
    beginAtZero: true,
    position: 'right',
    grid: {
      drawOnChartArea: false,
    },
    title: {
      display: true,
      text: 'Revenue ($)'
    }
  };

  // Create chart
  salesLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Number of Sales',
          data: monthlySales,
          borderColor: '#43A047',
          backgroundColor: 'rgba(67, 160, 71, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#43A047',
          yAxisID: 'y'
        },
        {
          label: 'Revenue ($)',
          data: monthlyRevenue,
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#FF9800',
          borderDash: [5, 5],
          yAxisID: 'y1',
          hidden: true // Initially hidden, can be toggled
        }
      ]
    },
    options: options
  });
}

// Inventory Bar Chart - Items by category
function createInventoryBarChart() {
  const ctx = document.getElementById('inventory-bar-chart').getContext('2d');
  
  // Process inventory data
  let categories = {};
  
  // Count items by category (using sample data if no real data)
  if (inventoryData.length > 0) {
    inventoryData.forEach(item => {
      // Use the category field from mapped data
      const category = item.category || 'Unknown';
      categories[category] = (categories[category] || 0) + 1;
    });
  } else {
    // Sample categories if no inventory data is available
    const sampleCategories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Food'];
    sampleCategories.forEach(cat => {
      categories[cat] = Math.floor(Math.random() * 20) + 5;
    });
  }
  
  // Prepare data for chart
  const categoryLabels = Object.keys(categories);
  const categoryCounts = Object.values(categories);
  
  // Generate random colors for each category
  const backgroundColors = categoryLabels.map(() => {
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  });

  // Get base options from helper function
  const options = getChartOptions('Inventory by Category', 'Category', 'Quantity');
  
  // Customize options for this chart
  options.plugins.legend = {
    display: false
  };

  // Create chart
  inventoryBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categoryLabels,
      datasets: [{
        label: 'Inventory by Category',
        data: categoryCounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: options
  });
}

// Employees Pie Chart - By Position/Role
function createEmployeesPositionPieChart() {
  const ctx = document.getElementById('employees-pie-chart').getContext('2d');
  
  // Process employees data
  let positions = {};
  
  // Count employees by position (using sample data if no real data)
  if (employeesData.length > 0) {
    employeesData.forEach(employee => {
      // Use the role field from mapped data
      const position = employee.role || 'Unknown';
      positions[position] = (positions[position] || 0) + 1;
    });
  } else {
    // Sample positions if no employee data is available
    const samplePositions = ['Manager', 'Staff', 'Sales', 'IT', 'HR'];
    samplePositions.forEach(pos => {
      positions[pos] = Math.floor(Math.random() * 10) + 1;
    });
  }
  
  // Prepare data for chart
  const positionLabels = Object.keys(positions);
  const positionCounts = Object.values(positions);
  
  // Generate colors for each position
  const colors = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#9C27B0', // Purple
    '#F44336', // Red
    '#FF9800', // Orange
    '#607D8B'  // Blue Grey
  ];
  
  // Get base options - for pie charts, x and y labels aren't relevant
  const options = getChartOptions('Employees by Position', '', '');
  
  // Delete scales for pie chart as they're not needed
  delete options.scales;
  
  // Customize options for this chart
  options.plugins.legend = {
    position: 'right'
  };
  
  options.plugins.tooltip = {
    callbacks: {
      label: function(context) {
        const label = context.label || '';
        const value = context.formattedValue;
        const total = context.dataset.data.reduce((a, b) => a + b, 0);
        const percentage = Math.round((context.raw / total) * 100);
        return `${label}: ${value} (${percentage}%)`;
      }
    }
  };
  
  // Create chart
  employeesPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: positionLabels,
      datasets: [{
        data: positionCounts,
        backgroundColor: colors.slice(0, positionLabels.length),
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: options
  });
}

// Sales vs Reservations Bubble Chart
function createSalesReservationsBubbleChart() {
  const ctx = document.getElementById('bubble-chart').getContext('2d');
  
  // Process data for bubble chart
  const salesBubbleData = [];
  const reservationsBubbleData = [];
  
  // Generate bubble data based on sales and reservations
  // Each bubble: x = day of month, y = amount or value, r = relative importance/size
  
  // Process sales data
  if (salesData.length > 0) {
    salesData.forEach(sale => {
      // Try to extract date information for x-axis
      let day = 0;
      if (sale.date) {
        // Try to extract day from date string (assuming format MM/DD/YYYY or similar)
        const dateParts = sale.date.split(/[\/\-]/);
        if (dateParts.length > 1) {
          day = parseInt(dateParts[1]);  // Day should be the second part
        }
      }
      
      // Use a random day if we couldn't parse the date
      if (isNaN(day) || day < 1 || day > 31) {
        day = Math.floor(Math.random() * 28) + 1;  // Random day between 1-28
      }
      
      // Use amount for y-axis if available
      const amount = sale.amount ? parseFloat(sale.amount) : Math.random() * 100;
      
      // Calculate bubble size (radius) based on amount
      const radius = Math.max(5, Math.min(20, amount / 10));
      
      salesBubbleData.push({
        x: day,
        y: amount,
        r: radius
      });
    });
  }
  
  // Process reservations data
  if (reservationsData.length > 0) {
    reservationsData.forEach(reservation => {
      // Try to extract date information for x-axis
      let day = 0;
      if (reservation.date) {
        // Try to extract day from date string (assuming format MM/DD/YYYY or similar)
        const dateParts = reservation.date.split(/[\/\-]/);
        if (dateParts.length > 1) {
          day = parseInt(dateParts[1]);  // Day should be the second part
        }
      }
      
      // Use a random day if we couldn't parse the date
      if (isNaN(day) || day < 1 || day > 31) {
        day = Math.floor(Math.random() * 28) + 1;  // Random day between 1-28
      }
      
      // For reservations, use a random value for y-axis since we don't have amounts
      const value = Math.random() * 80 + 20;  // Random value between 20-100
      
      // Calculate bubble size (radius)
      const radius = Math.max(5, Math.min(15, value / 10));
      
      reservationsBubbleData.push({
        x: day,
        y: value,
        r: radius
      });
    });
  }
  
  // If we have no data, create some sample data
  if (salesBubbleData.length === 0 && reservationsBubbleData.length === 0) {
    // Generate sample sales data
    for (let i = 0; i < 8; i++) {
      salesBubbleData.push({
        x: Math.floor(Math.random() * 28) + 1,  // Random day (1-28)
        y: Math.random() * 100,                 // Random amount
        r: Math.random() * 10 + 5               // Random size
      });
    }
    
    // Generate sample reservations data
    for (let i = 0; i < 7; i++) {
      reservationsBubbleData.push({
        x: Math.floor(Math.random() * 28) + 1,  // Random day (1-28)
        y: Math.random() * 100,                 // Random value
        r: Math.random() * 10 + 5               // Random size
      });
    }
  }
  
  // Get base options from helper function
  const options = getChartOptions('Reservations by Day of Month', 'Day of Month', 'Value ($)');
  
  // Update x-axis min and max
  options.scales.x.min = 1;
  options.scales.x.max = 31;
  
  // Add custom tooltip
  options.plugins.tooltip = {
    callbacks: {
      label: function(context) {
        return `${context.dataset.label}: (Day ${context.raw.x}, Value: $${Math.round(context.raw.y)})`;
      }
    }
  };
  
  // Store both datasets for filtering
  const allDatasets = [
    {
      label: 'Sales',
      data: salesBubbleData,
      backgroundColor: 'rgba(66, 133, 244, 0.6)',
      borderColor: 'rgb(66, 133, 244)',
      borderWidth: 1
    },
    {
      label: 'Reservations',
      data: reservationsBubbleData,
      backgroundColor: 'rgba(219, 68, 55, 0.6)',
      borderColor: 'rgb(219, 68, 55)',
      borderWidth: 1
    }
  ];
  
  // Create chart - default to showing only reservations
  salesReservationsBubbleChart = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [allDatasets[1]] // Show only reservations by default
    },
    options: options
  });
  
  // Store all datasets for filtering
  salesReservationsBubbleChart._allDatasets = allDatasets;
}

// Function to filter chart data based on user selection
function filterData(chartType, filterValue) {
  // Show loading for appropriate chart
  switch(chartType) {
    case 'sales-line':
      showLoadingIndicator('sales-line-chart');
      setTimeout(() => {
        filterSalesLineChart(filterValue);
        hideLoadingIndicator('sales-line-chart');
      }, 300);
      break;
    case 'inventory-bar':
      showLoadingIndicator('inventory-bar-chart');
      setTimeout(() => {
        filterInventoryBarChart(filterValue);
        hideLoadingIndicator('inventory-bar-chart');
      }, 300);
      break;
    case 'employees-pie':
      showLoadingIndicator('employees-pie-chart');
      setTimeout(() => {
        filterEmployeesPieChart(filterValue);
        hideLoadingIndicator('employees-pie-chart');
      }, 300);
      break;
    case 'bubble':
      showLoadingIndicator('bubble-chart');
      setTimeout(() => {
        filterBubbleChart(filterValue);
        hideLoadingIndicator('bubble-chart');
      }, 300);
      break;
  }
}

function filterSalesLineChart(filterValue) {
  if (!salesLineChart) return;
  
  // Filter logic for sales line chart
  // For example, filter by date range or category
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (filterValue === 'last-quarter') {
    salesLineChart.data.labels = months.slice(months.length - 3);
    salesLineChart.data.datasets[0].data = salesLineChart.data.datasets[0].data.slice(months.length - 3);
  } else if (filterValue === 'last-half') {
    salesLineChart.data.labels = months.slice(months.length - 6);
    salesLineChart.data.datasets[0].data = salesLineChart.data.datasets[0].data.slice(months.length - 6);
  } else if (filterValue === 'current-month') {
    // Get current month index (0-11)
    const currentMonth = new Date().getMonth();
    salesLineChart.data.labels = [months[currentMonth]];
    salesLineChart.data.datasets[0].data = [salesLineChart.data.datasets[0].data[currentMonth]];
  } else {
    // Reset to full year
    salesLineChart.data.labels = months;
    // Regenerate random data for example
    const monthlySales = new Array(12).fill(0).map(() => Math.floor(Math.random() * 50) + 10);
    salesLineChart.data.datasets[0].data = monthlySales;
  }
  
  salesLineChart.update();
}

function filterInventoryBarChart(filterValue) {
  if (!inventoryBarChart) return;
  
  // Filter logic for inventory bar chart
  // For example, only show categories with quantities above a threshold
  if (filterValue === 'high-stock') {
    // Filter to only high stock items (example: above 15)
    const dataLength = inventoryBarChart.data.labels.length;
    const filteredIndices = [];
    
    for (let i = 0; i < dataLength; i++) {
      if (inventoryBarChart.data.datasets[0].data[i] > 15) {
        filteredIndices.push(i);
      }
    }
    
    const newLabels = filteredIndices.map(i => inventoryBarChart.data.labels[i]);
    const newData = filteredIndices.map(i => inventoryBarChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => inventoryBarChart.data.datasets[0].backgroundColor[i]);
    
    inventoryBarChart.data.labels = newLabels;
    inventoryBarChart.data.datasets[0].data = newData;
    inventoryBarChart.data.datasets[0].backgroundColor = newColors;
  } else if (filterValue === 'low-stock') {
    // Filter to only low stock items (example: between 1 and 10)
    const dataLength = inventoryBarChart.data.labels.length;
    const filteredIndices = [];
    
    for (let i = 0; i < dataLength; i++) {
      if (inventoryBarChart.data.datasets[0].data[i] > 0 && inventoryBarChart.data.datasets[0].data[i] <= 10) {
        filteredIndices.push(i);
      }
    }
    
    const newLabels = filteredIndices.map(i => inventoryBarChart.data.labels[i]);
    const newData = filteredIndices.map(i => inventoryBarChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => inventoryBarChart.data.datasets[0].backgroundColor[i]);
    
    inventoryBarChart.data.labels = newLabels;
    inventoryBarChart.data.datasets[0].data = newData;
    inventoryBarChart.data.datasets[0].backgroundColor = newColors;
  } else if (filterValue === 'out-of-stock') {
    // Filter to only out of stock items (example: 0 quantity)
    const dataLength = inventoryBarChart.data.labels.length;
    const filteredIndices = [];
    
    for (let i = 0; i < dataLength; i++) {
      if (inventoryBarChart.data.datasets[0].data[i] === 0) {
        filteredIndices.push(i);
      }
    }
    
    const newLabels = filteredIndices.map(i => inventoryBarChart.data.labels[i]);
    const newData = filteredIndices.map(i => inventoryBarChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => inventoryBarChart.data.datasets[0].backgroundColor[i]);
    
    inventoryBarChart.data.labels = newLabels;
    inventoryBarChart.data.datasets[0].data = newData;
    inventoryBarChart.data.datasets[0].backgroundColor = newColors;
  } else {
    // Reset to all items
    createInventoryBarChart();
  }
  
  inventoryBarChart.update();
}

function filterEmployeesPieChart(filterValue) {
  if (!employeesPieChart) return;
  
  // Filter logic for employees pie chart
  // For example, show only specific departments
  if (filterValue === 'management') {
    // Show only management positions (example)
    const managementPositions = ['Manager', 'Director', 'Supervisor', 'CEO', 'CTO'];
    const dataLength = employeesPieChart.data.labels.length;
    const filteredIndices = [];
    
    for (let i = 0; i < dataLength; i++) {
      if (managementPositions.includes(employeesPieChart.data.labels[i])) {
        filteredIndices.push(i);
      }
    }
    
    const newLabels = filteredIndices.map(i => employeesPieChart.data.labels[i]);
    const newData = filteredIndices.map(i => employeesPieChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => employeesPieChart.data.datasets[0].backgroundColor[i]);
    
    employeesPieChart.data.labels = newLabels;
    employeesPieChart.data.datasets[0].data = newData;
    employeesPieChart.data.datasets[0].backgroundColor = newColors;
  } else if (filterValue === 'sales') {
    // Show only sales positions
    const salesPositions = ['Sales Representative', 'Sales Manager', 'Account Manager', 'Sales'];
    const dataLength = employeesPieChart.data.labels.length;
    const filteredIndices = [];
    
    for (let i = 0; i < dataLength; i++) {
      if (salesPositions.some(pos => employeesPieChart.data.labels[i].includes(pos))) {
        filteredIndices.push(i);
      }
    }
    
    const newLabels = filteredIndices.map(i => employeesPieChart.data.labels[i]);
    const newData = filteredIndices.map(i => employeesPieChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => employeesPieChart.data.datasets[0].backgroundColor[i]);
    
    employeesPieChart.data.labels = newLabels;
    employeesPieChart.data.datasets[0].data = newData;
    employeesPieChart.data.datasets[0].backgroundColor = newColors;
  } else if (filterValue === 'support') {
    // Show only support positions
    const supportPositions = ['Support', 'IT', 'Customer Service', 'Admin', 'Assistant'];
    const dataLength = employeesPieChart.data.labels.length;
    const filteredIndices = [];
    
    for (let i = 0; i < dataLength; i++) {
      if (supportPositions.some(pos => employeesPieChart.data.labels[i].includes(pos))) {
        filteredIndices.push(i);
      }
    }
    
    const newLabels = filteredIndices.map(i => employeesPieChart.data.labels[i]);
    const newData = filteredIndices.map(i => employeesPieChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => employeesPieChart.data.datasets[0].backgroundColor[i]);
    
    employeesPieChart.data.labels = newLabels;
    employeesPieChart.data.datasets[0].data = newData;
    employeesPieChart.data.datasets[0].backgroundColor = newColors;
  } else {
    // Reset to all employees by position
    createEmployeesPositionPieChart();
  }
  
  employeesPieChart.update();
}

function filterBubbleChart(filterValue) {
  if (!salesReservationsBubbleChart) return;
  
  // First, get the stored datasets
  const allDatasets = salesReservationsBubbleChart._allDatasets || [];
  
  // Set data based on filter value
  if (filterValue === 'sales-only') {
    // Show only sales data
    salesReservationsBubbleChart.data.datasets = [allDatasets[0]];
    salesReservationsBubbleChart.options.plugins.title.text = 'Sales by Day of Month';
  } else if (filterValue === 'reservations-only') {
    // Show only reservations data
    salesReservationsBubbleChart.data.datasets = [allDatasets[1]];
    salesReservationsBubbleChart.options.plugins.title.text = 'Reservations by Day of Month';
  } else if (filterValue === 'both-separate') {
    // Show both datasets
    salesReservationsBubbleChart.data.datasets = allDatasets;
    salesReservationsBubbleChart.options.plugins.title.text = 'Sales & Reservations by Day of Month';
  } else if (filterValue === 'first-half') {
    // Filter to first half of month
    salesReservationsBubbleChart.options.scales.x.max = 15;
    salesReservationsBubbleChart.options.scales.x.min = 1;
  } else if (filterValue === 'second-half') {
    // Filter to second half of month
    salesReservationsBubbleChart.options.scales.x.min = 16;
    salesReservationsBubbleChart.options.scales.x.max = 31;
  } else if (filterValue === 'high-value') {
    // Filter to high value transactions (bubbles with y value > 75)
    const datasets = salesReservationsBubbleChart.data.datasets;
    for (let i = 0; i < datasets.length; i++) {
      const originalData = datasets[i]._originalData || datasets[i].data;
      
      // Store the original data if it's the first time filtering
      if (!datasets[i]._originalData) {
        datasets[i]._originalData = [...originalData];
      }
      
      // Filter to only high value data points
      datasets[i].data = originalData.filter(point => point.y > 75);
    }
  } else {
    // Reset to default (reservations only)
    salesReservationsBubbleChart.data.datasets = [allDatasets[1]];
    salesReservationsBubbleChart.options.scales.x.min = 1;
    salesReservationsBubbleChart.options.scales.x.max = 31;
    salesReservationsBubbleChart.options.plugins.title.text = 'Reservations by Day of Month';
    
    // Restore original data if available
    const datasets = salesReservationsBubbleChart.data.datasets;
    for (let i = 0; i < datasets.length; i++) {
      if (datasets[i]._originalData) {
        datasets[i].data = [...datasets[i]._originalData];
      }
    }
  }
  
  salesReservationsBubbleChart.update();
}

// Function to search chart data based on user input
function searchChartData(searchValue) {
  // This function will search across all charts
  if (searchValue.length === 0) {
    // Reset all charts if search is cleared
    initializeCharts();
    return;
  }
  
  // Search in each chart
  searchSalesLineChart(searchValue);
  searchInventoryBarChart(searchValue);
  searchEmployeesPieChart(searchValue);
  // Bubble chart searching is more complex, skipping for simplicity
}

function searchSalesLineChart(searchValue) {
  if (!salesLineChart) return;
  
  // Search logic for sales line chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const filteredMonths = months.filter(month => month.toLowerCase().includes(searchValue));
  const filteredIndices = filteredMonths.map(month => months.indexOf(month));
  
  if (filteredIndices.length > 0) {
    const newLabels = filteredIndices.map(i => months[i]);
    const newData = filteredIndices.map(i => salesLineChart.data.datasets[0].data[i]);
    
    salesLineChart.data.labels = newLabels;
    salesLineChart.data.datasets[0].data = newData;
    salesLineChart.update();
  }
}

function searchInventoryBarChart(searchValue) {
  if (!inventoryBarChart) return;
  
  // Search logic for inventory bar chart
  const labels = inventoryBarChart.data.labels;
  const filteredIndices = [];
  
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].toLowerCase().includes(searchValue)) {
      filteredIndices.push(i);
    }
  }
  
  if (filteredIndices.length > 0) {
    const newLabels = filteredIndices.map(i => labels[i]);
    const newData = filteredIndices.map(i => inventoryBarChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => inventoryBarChart.data.datasets[0].backgroundColor[i]);
    
    inventoryBarChart.data.labels = newLabels;
    inventoryBarChart.data.datasets[0].data = newData;
    inventoryBarChart.data.datasets[0].backgroundColor = newColors;
    inventoryBarChart.update();
  }
}

function searchEmployeesPieChart(searchValue) {
  if (!employeesPieChart) return;
  
  // Search logic for employees pie chart
  const labels = employeesPieChart.data.labels;
  const filteredIndices = [];
  
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].toLowerCase().includes(searchValue)) {
      filteredIndices.push(i);
    }
  }
  
  if (filteredIndices.length > 0) {
    const newLabels = filteredIndices.map(i => labels[i]);
    const newData = filteredIndices.map(i => employeesPieChart.data.datasets[0].data[i]);
    const newColors = filteredIndices.map(i => employeesPieChart.data.datasets[0].backgroundColor[i]);
    
    employeesPieChart.data.labels = newLabels;
    employeesPieChart.data.datasets[0].data = newData;
    employeesPieChart.data.datasets[0].backgroundColor = newColors;
    employeesPieChart.update();
  }
} 