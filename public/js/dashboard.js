// Dashboard JavaScript

// Fetch dashboard summary data
async function fetchDashboardSummary() {
    try {
        const response = await fetch('/api/dashboard/summary');
        const data = await response.json();
        
        // Update summary cards
        document.getElementById('employees-count').textContent = data.employees;
        document.getElementById('inventory-count').textContent = data.inventory;
        document.getElementById('reservations-count').textContent = data.reservations;
        document.getElementById('sales-count').textContent = data.sales;
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        showError('Failed to fetch dashboard summary');
    }
}

// Initialize sales chart
async function initSalesChart() {
    try {
        const response = await fetch('/api/dashboard/sales-chart');
        const data = await response.json();

        const ctx = document.getElementById('sales-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => new Date(item.date).toLocaleDateString()),
                datasets: [{
                    label: 'Sales Amount',
                    data: data.map(item => item.total),
                    borderColor: '#2196f3',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing sales chart:', error);
        showError('Failed to load sales chart');
    }
}

// Initialize inventory chart
async function initInventoryChart() {
    try {
        const response = await fetch('/api/dashboard/inventory-chart');
        const data = await response.json();

        const ctx = document.getElementById('inventory-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(item => item.category),
                datasets: [{
                    data: data.map(item => item.total_quantity),
                    backgroundColor: [
                        '#2196f3',
                        '#4caf50',
                        '#ff9800',
                        '#f44336',
                        '#9c27b0',
                        '#00bcd4'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing inventory chart:', error);
        showError('Failed to load inventory chart');
    }
}

// Initialize sales distribution chart
async function initSalesDistributionChart() {
    try {
        const response = await fetch('/api/dashboard/sales-distribution');
        const data = await response.json();

        const ctx = document.getElementById('pie-chart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.category),
                datasets: [{
                    data: data.map(item => item.revenue),
                    backgroundColor: [
                        '#3f51b5',
                        '#e91e63',
                        '#00bcd4',
                        '#ff9800',
                        '#9c27b0',
                        '#8bc34a'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${percentage}% ($${value.toLocaleString()})`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing sales distribution chart:', error);
        showError('Failed to load sales distribution chart');
    }
}

// Initialize department performance chart
async function initDepartmentPerformanceChart() {
    try {
        console.log('Fetching department performance data...');
        const response = await fetch('/api/dashboard/department-performance');
        const data = await response.json();
        
        console.log('Department performance data received:', data);
        
        // Data is coming as an array of department objects, transform it to the format we need
        const transformedData = {
            departments: data.map(dept => dept.department),
            sales_performance: data.map(dept => dept['Sales Performance'] || 0),
            employee_efficiency: data.map(dept => dept['Efficiency'] || 0)
        };
        
        console.log('Transformed data:', transformedData);
        console.log('Departments:', transformedData.departments);
        console.log('Sales Performance:', transformedData.sales_performance);
        console.log('Employee Efficiency:', transformedData.employee_efficiency);

        const ctx = document.getElementById('radar-chart');
        if (!ctx) {
            console.error('Radar chart canvas element not found!');
            return;
        }
        
        console.log('Creating radar chart...');
        new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: transformedData.departments,
                datasets: [{
                    label: 'Sales Performance',
                    data: transformedData.sales_performance,
                    borderColor: '#9c27b0',
                    backgroundColor: 'rgba(156, 39, 176, 0.2)',
                    pointBackgroundColor: '#9c27b0',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#9c27b0'
                }, {
                    label: 'Employee Efficiency',
                    data: transformedData.employee_efficiency,
                    borderColor: '#00bcd4',
                    backgroundColor: 'rgba(0, 188, 212, 0.2)',
                    pointBackgroundColor: '#00bcd4',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#00bcd4'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
        console.log('Radar chart created successfully!');
    } catch (error) {
        console.error('Error initializing department performance chart:', error);
        showError('Failed to load department performance chart');
    }
}

function showError(message) {
    // Show error toast or notification
    console.error(message);
    
    // Display database notice if needed
    if (message.includes('fetch')) {
        document.getElementById('database-notice').style.display = 'block';
    }
}

// Check database connection
async function checkDatabaseConnection() {
    try {
        const response = await fetch('/api/dashboard/check-database');
        const data = await response.json();
        
        if (!data.connected) {
            document.getElementById('database-notice').style.display = 'block';
        }
    } catch (error) {
        console.error('Error checking database connection:', error);
        document.getElementById('database-notice').style.display = 'block';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Fetch dashboard data
    fetchDashboardSummary();
    // Commenting out due to 404 error - endpoint doesn't exist
    // checkDatabaseConnection();
    
    // Initialize charts
    initSalesChart();
    initInventoryChart();
    initSalesDistributionChart();
    initDepartmentPerformanceChart();
});
