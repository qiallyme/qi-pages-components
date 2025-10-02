// Status Monitor Widget
class StatusMonitor {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            title: options.title || 'System Status',
            theme: options.theme || 'light',
            size: options.size || 'medium',
            refreshInterval: options.refreshInterval || 30000, // 30 seconds
            services: options.services || this.getDefaultServices(),
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
        
        // Parse services from URL
        const servicesParam = urlParams.get('services');
        if (servicesParam) {
            try {
                this.options.services = JSON.parse(decodeURIComponent(servicesParam));
            } catch (e) {
                console.warn('Invalid services parameter');
            }
        }
    }

    getDefaultServices() {
        return [
            {
                name: 'API Server',
                status: 'operational',
                icon: '🔌',
                responseTime: '45ms'
            },
            {
                name: 'Database',
                status: 'operational',
                icon: '🗄️',
                responseTime: '12ms'
            },
            {
                name: 'CDN',
                status: 'operational',
                icon: '🌐',
                responseTime: '23ms'
            },
            {
                name: 'Email Service',
                status: 'degraded',
                icon: '📧',
                responseTime: '2.1s'
            },
            {
                name: 'File Storage',
                status: 'operational',
                icon: '💾',
                responseTime: '67ms'
            }
        ];
    }

    render() {
        const overallStatus = this.getOverallStatus();
        const lastUpdated = new Date().toLocaleTimeString();
        
        this.container.innerHTML = `
            <div class="status-monitor ${this.options.theme} size-${this.options.size}">
                <div class="monitor-header">
                    <h3 class="monitor-title">${this.options.title}</h3>
                    <div class="overall-status">
                        <div class="status-indicator ${overallStatus}"></div>
                        <span>${this.capitalizeFirst(overallStatus)}</span>
                    </div>
                </div>
                <div class="services-list">
                    ${this.options.services.map(service => this.renderService(service)).join('')}
                </div>
                <div class="last-updated">Last updated: ${lastUpdated}</div>
            </div>
        `;
    }

    renderService(service) {
        return `
            <div class="service-item">
                <div class="service-info">
                    <div class="service-icon">${service.icon}</div>
                    <span class="service-name">${service.name}</span>
                </div>
                <div class="service-status ${service.status}">
                    <span>${this.capitalizeFirst(service.status)}</span>
                    ${service.responseTime ? `<span>(${service.responseTime})</span>` : ''}
                </div>
            </div>
        `;
    }

    getOverallStatus() {
        const statuses = this.options.services.map(s => s.status);
        
        if (statuses.includes('outage')) return 'outage';
        if (statuses.includes('degraded')) return 'degraded';
        if (statuses.includes('maintenance')) return 'maintenance';
        return 'operational';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updateService(serviceName, newStatus, responseTime = null) {
        const service = this.options.services.find(s => s.name === serviceName);
        if (service) {
            service.status = newStatus;
            if (responseTime) service.responseTime = responseTime;
            this.render();
        }
    }

    addService(service) {
        this.options.services.push(service);
        this.render();
    }

    removeService(serviceName) {
        this.options.services = this.options.services.filter(s => s.name !== serviceName);
        this.render();
    }

    startAutoRefresh() {
        if (this.options.refreshInterval > 0) {
            setInterval(() => {
                this.refreshStatus();
            }, this.options.refreshInterval);
        }
    }

    refreshStatus() {
        // Simulate status refresh - in real implementation, this would fetch from API
        this.options.services = this.options.services.map(service => ({
            ...service,
            status: this.getRandomStatus(),
            responseTime: this.getRandomResponseTime()
        }));
        this.render();
    }

    getRandomStatus() {
        const statuses = ['operational', 'operational', 'operational', 'degraded', 'maintenance'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    getRandomResponseTime() {
        const times = ['12ms', '23ms', '45ms', '67ms', '89ms', '1.2s', '2.1s'];
        return times[Math.floor(Math.random() * times.length)];
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="status-monitor ${this.options.theme} size-${this.options.size}">
                <div class="loading">
                    <div class="spinner"></div>
                    <span style="margin-left: 8px;">Loading status...</span>
                </div>
            </div>
        `;
    }

    // Method to simulate incidents
    simulateIncident(serviceName, status = 'outage') {
        this.updateService(serviceName, status);
        
        // Auto-recover after 30 seconds
        setTimeout(() => {
            this.updateService(serviceName, 'operational');
        }, 30000);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new StatusMonitor('status-monitor-container', {
        title: 'Service Status',
        theme: 'light',
        size: 'medium',
        refreshInterval: 30000
    });
});

// Export for external use
window.StatusMonitor = StatusMonitor;
