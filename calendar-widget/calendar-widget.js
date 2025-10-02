// Calendar Widget
class CalendarWidget {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            title: options.title || 'Calendar',
            theme: options.theme || 'light',
            size: options.size || 'medium',
            currentDate: options.currentDate || new Date(),
            events: options.events || this.getDefaultEvents(),
            showEvents: options.showEvents !== false,
            ...options
        };
        this.selectedDate = null;
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
        if (urlParams.get('showEvents')) this.options.showEvents = urlParams.get('showEvents') === 'true';

        // Parse events from URL
        const eventsParam = urlParams.get('events');
        if (eventsParam) {
            try {
                this.options.events = JSON.parse(decodeURIComponent(eventsParam));
            } catch (e) {
                console.warn('Invalid events parameter');
            }
        }
    }

    getDefaultEvents() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        return [
            {
                date: today.toISOString().split('T')[0],
                time: '10:00',
                title: 'Team Meeting',
                color: '#3b82f6'
            },
            {
                date: today.toISOString().split('T')[0],
                time: '14:30',
                title: 'Client Call',
                color: '#10b981'
            },
            {
                date: tomorrow.toISOString().split('T')[0],
                time: '09:00',
                title: 'Project Review',
                color: '#f59e0b'
            },
            {
                date: nextWeek.toISOString().split('T')[0],
                time: '16:00',
                title: 'Sprint Planning',
                color: '#ef4444'
            }
        ];
    }

    render() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentMonth = monthNames[this.options.currentDate.getMonth()];
        const currentYear = this.options.currentDate.getFullYear();

        this.container.innerHTML = `
            <div class="calendar-widget ${this.options.theme} size-${this.options.size}">
                <div class="calendar-header">
                    <h3 class="calendar-title">${this.options.title}</h3>
                    <div class="calendar-nav">
                        <button class="nav-btn" id="prev-month">‹</button>
                        <span class="calendar-month">${currentMonth} ${currentYear}</span>
                        <button class="nav-btn" id="next-month">›</button>
                    </div>
                </div>
                <div class="calendar-grid">
                    ${this.renderCalendarGrid()}
                </div>
                ${this.options.showEvents ? this.renderEventsList() : ''}
            </div>
        `;
    }

    renderCalendarGrid() {
        const year = this.options.currentDate.getFullYear();
        const month = this.options.currentDate.getMonth();

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            .map(day => `<div class="calendar-day-header">${day}</div>`)
            .join('');

        // Previous month days
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        const prevMonthCells = [];

        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            prevMonthCells.push(`<div class="calendar-day other-month">${day}</div>`);
        }

        // Current month days
        const currentMonthCells = [];
        const today = new Date();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const isToday = this.isSameDate(date, today);
            const isSelected = this.selectedDate && this.isSameDate(date, this.selectedDate);
            const hasEvent = this.hasEventOnDate(dateString);

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (hasEvent) classes += ' has-event';

            currentMonthCells.push(`<div class="${classes}" data-date="${dateString}">${day}</div>`);
        }

        // Next month days
        const totalCells = prevMonthCells.length + currentMonthCells.length;
        const remainingCells = 42 - totalCells; // 6 weeks * 7 days
        const nextMonthCells = [];

        for (let day = 1; day <= remainingCells; day++) {
            nextMonthCells.push(`<div class="calendar-day other-month">${day}</div>`);
        }

        return dayHeaders + prevMonthCells.join('') + currentMonthCells.join('') + nextMonthCells.join('');
    }

    renderEventsList() {
        if (!this.selectedDate) {
            return '<div class="events-list"><div class="events-title">Select a date to view events</div></div>';
        }

        const selectedDateString = this.selectedDate.toISOString().split('T')[0];
        const dayEvents = this.options.events.filter(event => event.date === selectedDateString);

        if (dayEvents.length === 0) {
            return '<div class="events-list"><div class="events-title">No events for this date</div></div>';
        }

        const eventsHtml = dayEvents
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(event => `
                <div class="event-item">
                    <span class="event-time">${event.time}</span>
                    <span class="event-title">${event.title}</span>
                </div>
            `).join('');

        return `
            <div class="events-list">
                <div class="events-title">Events for ${this.formatDate(this.selectedDate)}</div>
                ${eventsHtml}
            </div>
        `;
    }

    attachEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateMonth(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateMonth(1));
        }

        // Day clicks
        const dayElements = this.container.querySelectorAll('.calendar-day[data-date]');
        dayElements.forEach(day => {
            day.addEventListener('click', (e) => {
                const dateString = e.target.dataset.date;
                this.selectDate(new Date(dateString));
            });
        });
    }

    navigateMonth(direction) {
        const newDate = new Date(this.options.currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        this.options.currentDate = newDate;
        this.render();
        this.attachEventListeners();
    }

    selectDate(date) {
        this.selectedDate = date;
        this.render();
        this.attachEventListeners();

        // Dispatch custom event
        const event = new CustomEvent('dateSelected', {
            detail: { date: date.toISOString().split('T')[0] }
        });
        this.container.dispatchEvent(event);
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    hasEventOnDate(dateString) {
        return this.options.events.some(event => event.date === dateString);
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    addEvent(event) {
        this.options.events.push(event);
        this.render();
        this.attachEventListeners();
    }

    removeEvent(date, time, title) {
        this.options.events = this.options.events.filter(event =>
            !(event.date === date && event.time === time && event.title === title)
        );
        this.render();
        this.attachEventListeners();
    }

    getEventsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return this.options.events.filter(event => event.date === dateString);
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="calendar-widget ${this.options.theme} size-${this.options.size}">
                <div class="loading">
                    <div class="spinner"></div>
                    <span style="margin-left: 8px;">Loading calendar...</span>
                </div>
            </div>
        `;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CalendarWidget('calendar-widget-container', {
        title: 'Calendar',
        theme: 'light',
        size: 'medium',
        showEvents: true
    });
});

// Export for external use
window.CalendarWidget = CalendarWidget;
