// Analytics Chart Widget
class AnalyticsChart {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            title: options.title || 'Analytics Overview',
            theme: options.theme || 'light',
            size: options.size || 'medium',
            chartType: options.chartType || 'line',
            data: options.data || this.getDefaultData(),
            colors: options.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            ...options
        };
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.parseUrlParams();
        this.render();
        this.attachEventListeners();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('title')) this.options.title = urlParams.get('title');
        if (urlParams.get('theme')) this.options.theme = urlParams.get('theme');
        if (urlParams.get('size')) this.options.size = urlParams.get('size');
        if (urlParams.get('type')) this.options.chartType = urlParams.get('type');
        
        // Parse data from URL
        const dataParam = urlParams.get('data');
        if (dataParam) {
            try {
                this.options.data = JSON.parse(decodeURIComponent(dataParam));
            } catch (e) {
                console.warn('Invalid data parameter');
            }
        }
    }

    getDefaultData() {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Users',
                    data: [120, 190, 300, 500, 200, 300],
                    color: '#3b82f6'
                },
                {
                    label: 'Revenue',
                    data: [1000, 1500, 2000, 1800, 2200, 2500],
                    color: '#10b981'
                }
            ]
        };
    }

    render() {
        this.container.innerHTML = `
            <div class="analytics-chart ${this.options.theme} size-${this.options.size}">
                <div class="chart-header">
                    <h3 class="chart-title">${this.options.title}</h3>
                    <div class="chart-type-selector">
                        <button class="chart-type-btn ${this.options.chartType === 'line' ? 'active' : ''}" data-type="line">Line</button>
                        <button class="chart-type-btn ${this.options.chartType === 'bar' ? 'active' : ''}" data-type="bar">Bar</button>
                        <button class="chart-type-btn ${this.options.chartType === 'pie' ? 'active' : ''}" data-type="pie">Pie</button>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas class="chart-canvas" id="chart-canvas"></canvas>
                </div>
                <div class="chart-legend">
                    ${this.renderLegend()}
                </div>
                <div class="chart-stats">
                    ${this.renderStats()}
                </div>
            </div>
        `;
        
        this.initCanvas();
        this.drawChart();
    }

    renderLegend() {
        return this.options.data.datasets.map((dataset, index) => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${dataset.color}"></div>
                <span>${dataset.label}</span>
            </div>
        `).join('');
    }

    renderStats() {
        const stats = this.calculateStats();
        return Object.entries(stats).map(([key, value]) => `
            <div class="stat-item">
                <div class="stat-value">${value}</div>
                <div class="stat-label">${key}</div>
            </div>
        `).join('');
    }

    calculateStats() {
        const allData = this.options.data.datasets.flatMap(d => d.data);
        const total = allData.reduce((sum, val) => sum + val, 0);
        const average = total / allData.length;
        const max = Math.max(...allData);
        const min = Math.min(...allData);
        
        return {
            Total: this.formatNumber(total),
            Avg: this.formatNumber(average),
            Max: this.formatNumber(max),
            Min: this.formatNumber(min)
        };
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toFixed(0);
    }

    initCanvas() {
        this.canvas = document.getElementById('chart-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }

    drawChart() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        switch (this.options.chartType) {
            case 'line':
                this.drawLineChart();
                break;
            case 'bar':
                this.drawBarChart();
                break;
            case 'pie':
                this.drawPieChart();
                break;
        }
    }

    drawLineChart() {
        const { labels, datasets } = this.options.data;
        const padding = 40;
        const chartWidth = this.canvas.width - (padding * 2);
        const chartHeight = this.canvas.height - (padding * 2);
        
        // Find min/max values
        const allData = datasets.flatMap(d => d.data);
        const minValue = Math.min(...allData);
        const maxValue = Math.max(...allData);
        const valueRange = maxValue - minValue;
        
        // Draw axes
        this.ctx.strokeStyle = this.options.theme === 'dark' ? '#4b5563' : '#d1d5db';
        this.ctx.lineWidth = 1;
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, this.canvas.height - padding);
        this.ctx.stroke();
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(padding, this.canvas.height - padding);
        this.ctx.lineTo(this.canvas.width - padding, this.canvas.height - padding);
        this.ctx.stroke();
        
        // Draw data lines
        datasets.forEach(dataset => {
            this.ctx.strokeStyle = dataset.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            
            dataset.data.forEach((value, index) => {
                const x = padding + (index * chartWidth / (labels.length - 1));
                const y = this.canvas.height - padding - ((value - minValue) / valueRange * chartHeight);
                
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            
            this.ctx.stroke();
        });
        
        // Draw labels
        this.ctx.fillStyle = this.options.theme === 'dark' ? '#9ca3af' : '#6b7280';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        
        labels.forEach((label, index) => {
            const x = padding + (index * chartWidth / (labels.length - 1));
            this.ctx.fillText(label, x, this.canvas.height - padding + 20);
        });
    }

    drawBarChart() {
        const { labels, datasets } = this.options.data;
        const padding = 40;
        const chartWidth = this.canvas.width - (padding * 2);
        const chartHeight = this.canvas.height - (padding * 2);
        
        // Find min/max values
        const allData = datasets.flatMap(d => d.data);
        const minValue = Math.min(...allData);
        const maxValue = Math.max(...allData);
        const valueRange = maxValue - minValue;
        
        const barWidth = chartWidth / (labels.length * datasets.length) * 0.8;
        const barSpacing = chartWidth / (labels.length * datasets.length) * 0.2;
        
        // Draw bars
        datasets.forEach((dataset, datasetIndex) => {
            this.ctx.fillStyle = dataset.color;
            
            dataset.data.forEach((value, index) => {
                const x = padding + (index * (barWidth + barSpacing) * datasets.length) + (datasetIndex * (barWidth + barSpacing));
                const barHeight = (value - minValue) / valueRange * chartHeight;
                const y = this.canvas.height - padding - barHeight;
                
                this.ctx.fillRect(x, y, barWidth, barHeight);
            });
        });
        
        // Draw labels
        this.ctx.fillStyle = this.options.theme === 'dark' ? '#9ca3af' : '#6b7280';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        
        labels.forEach((label, index) => {
            const x = padding + (index * (barWidth + barSpacing) * datasets.length) + (datasets.length * (barWidth + barSpacing) / 2);
            this.ctx.fillText(label, x, this.canvas.height - padding + 20);
        });
    }

    drawPieChart() {
        const { datasets } = this.options.data;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        const total = datasets.reduce((sum, dataset) => sum + dataset.data.reduce((a, b) => a + b, 0), 0);
        let currentAngle = 0;
        
        datasets.forEach(dataset => {
            const datasetTotal = dataset.data.reduce((a, b) => a + b, 0);
            const sliceAngle = (datasetTotal / total) * 2 * Math.PI;
            
            this.ctx.fillStyle = dataset.color;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }

    attachEventListeners() {
        const typeButtons = this.container.querySelectorAll('.chart-type-btn');
        typeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.changeChartType(type);
            });
        });
    }

    changeChartType(type) {
        this.options.chartType = type;
        
        // Update active button
        const typeButtons = this.container.querySelectorAll('.chart-type-btn');
        typeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        this.drawChart();
    }

    updateData(newData) {
        this.options.data = newData;
        this.render();
        this.attachEventListeners();
    }

    addDataset(dataset) {
        this.options.data.datasets.push(dataset);
        this.render();
        this.attachEventListeners();
    }

    removeDataset(label) {
        this.options.data.datasets = this.options.data.datasets.filter(d => d.label !== label);
        this.render();
        this.attachEventListeners();
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="analytics-chart ${this.options.theme} size-${this.options.size}">
                <div class="loading">
                    <div class="spinner"></div>
                    <span style="margin-left: 8px;">Loading chart...</span>
                </div>
            </div>
        `;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsChart('analytics-chart-container', {
        title: 'Analytics Overview',
        theme: 'light',
        size: 'medium',
        chartType: 'line'
    });
});

// Export for external use
window.AnalyticsChart = AnalyticsChart;
