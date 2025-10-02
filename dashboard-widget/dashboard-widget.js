// Dashboard Widget
class DashboardWidget {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            title: options.title || 'Dashboard Metrics',
            theme: options.theme || 'light',
            size: options.size || 'medium',
            refreshInterval: options.refreshInterval || 30000, // 30 seconds
            metrics: options.metrics || this.getDefaultMetrics(),
            ...options
        };
        this.init();
    }

    init() {
        this.parseUrlParams();
        this.render();
        this.startAutoRefresh();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('title')) this.options.title = urlParams.get('title');
        if (urlParams.get('theme')) this.options.theme = urlParams.get('theme');
        if (urlParams.get('size')) this.options.size = urlParams.get('size');
        if (urlParams.get('refresh')) this.options.refreshInterval = parseInt(urlParams.get('refresh')) * 1000;
        
        // Parse metrics from URL
        const metricsParam = urlParams.get('metrics');
        if (metricsParam) {
            try {
                this.options.metrics = JSON.parse(decodeURIComponent(metricsParam));
            } catch (e) {
                console.warn('Invalid metrics parameter');
            }
        }
    }

    getDefaultMetrics() {
        return [
            {
                label: 'Users',
                value: 1247,
                change: 12.5,
                changeType: 'positive'
            },
            {
                label: 'Revenue',
                value: '$45.2K',
                change: -2.1,
                changeType: 'negative'
            },
            {
                label: 'Orders',
                value: 89,
                change: 5.2,
                changeType: 'positive'
            },
            {
                label: 'Conversion',
                value: '3.2%',
                change: 0,
                changeType: 'neutral'
            }
        ];
    }

    render() {
        const lastUpdated = new Date().toLocaleTimeString();
        
        this.container.innerHTML = `
            <div class="dashboard-widget ${this.options.theme} size-${this.options.size}">
                <div class="widget-header">
                    <h3 class="widget-title">${this.options.title}</h3>
                    <span class="last-updated">Updated ${lastUpdated}</span>
                </div>
                <div class="metrics-grid">
                    ${this.options.metrics.map(metric => this.renderMetric(metric)).join('')}
                </div>
            </div>
        `;
    }

    renderMetric(metric) {
        const changeIcon = this.getChangeIcon(metric.changeType);
        const changeText = metric.change !== 0 ? `${metric.change > 0 ? '+' : ''}${metric.change}%` : 'No change';
        
        return `
            <div class="metric-card">
                <div class="metric-value">${metric.value}</div>
                <div class="metric-label">${metric.label}</div>
                <div class="metric-change ${metric.changeType}">
                    ${changeIcon} ${changeText}
                </div>
            </div>
        `;
    }

    getChangeIcon(changeType) {
        switch (changeType) {
            case 'positive':
                return '↗';
            case 'negative':
                return '↘';
            default:
                return '→';
        }
    }

    updateMetrics(newMetrics) {
        this.options.metrics = newMetrics;
        this.render();
    }

    addMetric(metric) {
        this.options.metrics.push(metric);
        this.render();
    }

    removeMetric(label) {
        this.options.metrics = this.options.metrics.filter(m => m.label !== label);
        this.render();
    }

    startAutoRefresh() {
        if (this.options.refreshInterval > 0) {
            setInterval(() => {
                this.refreshData();
            }, this.options.refreshInterval);
        }
    }

    refreshData() {
        // Simulate data refresh - in real implementation, this would fetch from API
        this.options.metrics = this.options.metrics.map(metric => ({
            ...metric,
            value: this.generateRandomValue(metric),
            change: (Math.random() - 0.5) * 20, // Random change between -10% and +10%
            changeType: Math.random() > 0.5 ? 'positive' : 'negative'
        }));
        this.render();
    }

    generateRandomValue(metric) {
        const baseValue = typeof metric.value === 'string' ? 
            parseFloat(metric.value.replace(/[^0-9.]/g, '')) : metric.value;
        
        if (metric.label === 'Revenue') {
            return `$${(baseValue * (0.9 + Math.random() * 0.2)).toFixed(1)}K`;
        } else if (metric.label === 'Conversion') {
            return `${(baseValue * (0.9 + Math.random() * 0.2)).toFixed(1)}%`;
        } else {
            return Math.floor(baseValue * (0.9 + Math.random() * 0.2));
        }
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="dashboard-widget ${this.options.theme} size-${this.options.size}">
                <div class="loading">
                    <div class="spinner"></div>
                    <span style="margin-left: 8px;">Loading...</span>
                </div>
            </div>
        `;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DashboardWidget('dashboard-widget-container', {
        title: 'Business Metrics',
        theme: 'light',
        size: 'medium',
        refreshInterval: 30000
    });
});

// Export for external use
window.DashboardWidget = DashboardWidget;
