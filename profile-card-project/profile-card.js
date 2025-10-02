// Profile Card Widget
class ProfileCard {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            name: options.name || 'John Doe',
            title: options.title || 'Software Developer',
            avatar: options.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            email: options.email || 'john@example.com',
            phone: options.phone || '+1 (555) 123-4567',
            linkedin: options.linkedin || 'https://linkedin.com/in/johndoe',
            twitter: options.twitter || 'https://twitter.com/johndoe',
            theme: options.theme || 'light',
            size: options.size || 'medium',
            showContact: options.showContact !== false,
            ...options
        };
        this.init();
    }

    init() {
        this.parseUrlParams();
        this.render();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('name')) this.options.name = urlParams.get('name');
        if (urlParams.get('title')) this.options.title = urlParams.get('title');
        if (urlParams.get('avatar')) this.options.avatar = urlParams.get('avatar');
        if (urlParams.get('email')) this.options.email = urlParams.get('email');
        if (urlParams.get('phone')) this.options.phone = urlParams.get('phone');
        if (urlParams.get('linkedin')) this.options.linkedin = urlParams.get('linkedin');
        if (urlParams.get('twitter')) this.options.twitter = urlParams.get('twitter');
        if (urlParams.get('theme')) this.options.theme = urlParams.get('theme');
        if (urlParams.get('size')) this.options.size = urlParams.get('size');
        if (urlParams.get('showContact')) this.options.showContact = urlParams.get('showContact') === 'true';
    }

    render() {
        const contactButtons = this.options.showContact ? this.renderContactButtons() : '';
        
        this.container.innerHTML = `
            <div class="profile-card ${this.options.theme} size-${this.options.size}">
                <img src="${this.options.avatar}" alt="${this.options.name}" class="avatar">
                <h3 class="name">${this.options.name}</h3>
                <p class="title">${this.options.title}</p>
                ${contactButtons}
            </div>
        `;
    }

    renderContactButtons() {
        const buttons = [];
        
        if (this.options.email) {
            buttons.push(`
                <a href="mailto:${this.options.email}" class="contact-btn" title="Send Email">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email
                </a>
            `);
        }
        
        if (this.options.linkedin) {
            buttons.push(`
                <a href="${this.options.linkedin}" target="_blank" class="contact-btn" title="LinkedIn Profile">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                </a>
            `);
        }
        
        if (this.options.twitter) {
            buttons.push(`
                <a href="${this.options.twitter}" target="_blank" class="contact-btn" title="Twitter Profile">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                </a>
            `);
        }
        
        return buttons.length > 0 ? `<div class="contact-info">${buttons.join('')}</div>` : '';
    }

    updateProfile(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.render();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProfileCard('profile-card-container', {
        name: 'Jane Smith',
        title: 'Product Manager',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        email: 'jane@example.com',
        linkedin: 'https://linkedin.com/in/janesmith',
        twitter: 'https://twitter.com/janesmith'
    });
});

// Export for external use
window.ProfileCard = ProfileCard;
