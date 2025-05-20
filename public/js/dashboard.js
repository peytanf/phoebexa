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

// Initialize employee performance chart
async function initEmployeePerformanceChart() {
    try {
        const response = await fetch('/api/dashboard/employee-performance');
        const data = await response.json();

        const ctx = document.getElementById('line-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.month),
                datasets: [{
                    label: 'Sales Performance',
                    data: data.map(item => item.sales_performance),
                    borderColor: '#4caf50',
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'Customer Satisfaction',
                    data: data.map(item => item.customer_satisfaction),
                    borderColor: '#f44336',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Performance Score'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing employee performance chart:', error);
        showError('Failed to load employee performance chart');
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

// Initialize product analysis chart
async function initProductAnalysisChart() {
    try {
        const response = await fetch('/api/dashboard/product-analysis');
        const data = await response.json();

        const ctx = document.getElementById('bubble-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: data.map((item, index) => ({
                    label: item.product_name,
                    data: [{
                        x: item.price,
                        y: item.quantity,
                        r: item.sales_volume / 10
                    }],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ][index % 6]
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Price ($)'
                        },
                        ticks: {
                            callback: value => '$' + value.toLocaleString()
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Quantity in Stock'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: Price: $${context.raw.x.toLocaleString()}, Quantity: ${context.raw.y}, Sales: ${context.raw.r * 10}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing product analysis chart:', error);
        showError('Failed to load product analysis chart');
    }
}

// Initialize department performance chart
async function initDepartmentPerformanceChart() {
    try {
        const response = await fetch('/api/dashboard/department-performance');
        const data = await response.json();

        const ctx = document.getElementById('radar-chart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: Object.keys(data[0]).filter(key => key !== 'department'),
                datasets: data.map((dept, index) => ({
                    label: dept.department,
                    data: Object.values(dept).filter((_, i) => i > 0),
                    fill: true,
                    backgroundColor: `rgba(${[
                        [54, 162, 235],
                        [255, 99, 132],
                        [255, 206, 86],
                        [75, 192, 192],
                        [153, 102, 255],
                        [255, 159, 64]
                    ][index % 6].join(', ')}, 0.2)`,
                    borderColor: `rgb(${[
                        [54, 162, 235],
                        [255, 99, 132],
                        [255, 206, 86],
                        [75, 192, 192],
                        [153, 102, 255],
                        [255, 159, 64]
                    ][index % 6].join(', ')})`
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing department performance chart:', error);
        showError('Failed to load department performance chart');
    }
}

// Show error message
function showError(message) {
    // You can implement this to show error messages to the user
    console.error(message);
}

// Initialize all charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardSummary();
    initSalesChart();
    initInventoryChart();
    initEmployeePerformanceChart();
    initSalesDistributionChart();
    initProductAnalysisChart();
    initDepartmentPerformanceChart();
});
