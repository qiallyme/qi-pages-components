// Contact Form Widget
class ContactForm {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            title: options.title || 'Get In Touch',
            subtitle: options.subtitle || 'We\'d love to hear from you',
            theme: options.theme || 'light',
            size: options.size || 'medium',
            fields: options.fields || this.getDefaultFields(),
            submitUrl: options.submitUrl || '/api/contact',
            showSuccessMessage: options.showSuccessMessage !== false,
            successMessage: options.successMessage || 'Thank you! Your message has been sent.',
            ...options
        };
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
        if (urlParams.get('subtitle')) this.options.subtitle = urlParams.get('subtitle');
        if (urlParams.get('theme')) this.options.theme = urlParams.get('theme');
        if (urlParams.get('size')) this.options.size = urlParams.get('size');
        if (urlParams.get('submitUrl')) this.options.submitUrl = urlParams.get('submitUrl');
        if (urlParams.get('successMessage')) this.options.successMessage = urlParams.get('successMessage');
        
        // Parse fields from URL
        const fieldsParam = urlParams.get('fields');
        if (fieldsParam) {
            try {
                this.options.fields = JSON.parse(decodeURIComponent(fieldsParam));
            } catch (e) {
                console.warn('Invalid fields parameter');
            }
        }
    }

    getDefaultFields() {
        return [
            {
                name: 'name',
                label: 'Full Name',
                type: 'text',
                required: true,
                placeholder: 'Enter your full name'
            },
            {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true,
                placeholder: 'Enter your email'
            },
            {
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                required: false,
                placeholder: 'Enter your phone number'
            },
            {
                name: 'subject',
                label: 'Subject',
                type: 'select',
                required: true,
                options: [
                    { value: '', label: 'Select a subject' },
                    { value: 'general', label: 'General Inquiry' },
                    { value: 'support', label: 'Support' },
                    { value: 'sales', label: 'Sales' },
                    { value: 'partnership', label: 'Partnership' }
                ]
            },
            {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                required: true,
                placeholder: 'Tell us how we can help you...'
            }
        ];
    }

    render() {
        this.container.innerHTML = `
            <div class="contact-form ${this.options.theme} size-${this.options.size}">
                <div class="form-header">
                    <h3 class="form-title">${this.options.title}</h3>
                    <p class="form-subtitle">${this.options.subtitle}</p>
                </div>
                <form id="contact-form" novalidate>
                    ${this.options.fields.map(field => this.renderField(field)).join('')}
                    <button type="submit" class="form-button">Send Message</button>
                </form>
            </div>
        `;
    }

    renderField(field) {
        const required = field.required ? 'required' : '';
        const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';
        
        switch (field.type) {
            case 'textarea':
                return `
                    <div class="form-group">
                        <label class="form-label" for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <textarea 
                            id="${field.name}" 
                            name="${field.name}" 
                            class="form-textarea" 
                            ${required} 
                            ${placeholder}
                        ></textarea>
                    </div>
                `;
            
            case 'select':
                const options = field.options.map(opt => 
                    `<option value="${opt.value}">${opt.label}</option>`
                ).join('');
                return `
                    <div class="form-group">
                        <label class="form-label" for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <select 
                            id="${field.name}" 
                            name="${field.name}" 
                            class="form-select" 
                            ${required}
                        >
                            ${options}
                        </select>
                    </div>
                `;
            
            default:
                return `
                    <div class="form-group">
                        <label class="form-label" for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                        <input 
                            type="${field.type}" 
                            id="${field.name}" 
                            name="${field.name}" 
                            class="form-input" 
                            ${required} 
                            ${placeholder}
                        />
                    </div>
                `;
        }
    }

    attachEventListeners() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('.form-button');
        const formData = new FormData(form);
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Clear previous messages
        this.clearMessages();
        
        try {
            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Please fill in all required fields');
            }
            
            // Prepare data
            const data = Object.fromEntries(formData.entries());
            
            // Submit form
            const response = await this.submitForm(data);
            
            if (response.ok) {
                this.showSuccess();
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        return isValid;
    }

    async submitForm(data) {
        // In a real implementation, this would make an actual API call
        // For demo purposes, we'll simulate a successful submission
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve({ ok: true });
            }, 1000);
        });
        
        // Real implementation would be:
        // return fetch(this.options.submitUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // });
    }

    showSuccess() {
        if (!this.options.showSuccessMessage) return;
        
        const form = document.getElementById('contact-form');
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = this.options.successMessage;
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    showError(message) {
        const form = document.getElementById('contact-form');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    clearMessages() {
        const form = document.getElementById('contact-form');
        const messages = form.querySelectorAll('.form-success, .form-error');
        messages.forEach(msg => msg.remove());
    }

    addField(field) {
        this.options.fields.push(field);
        this.render();
        this.attachEventListeners();
    }

    removeField(fieldName) {
        this.options.fields = this.options.fields.filter(f => f.name !== fieldName);
        this.render();
        this.attachEventListeners();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('contact-form-container', {
        title: 'Contact Us',
        subtitle: 'Send us a message and we\'ll get back to you',
        theme: 'light',
        size: 'medium'
    });
});

// Export for external use
window.ContactForm = ContactForm;
