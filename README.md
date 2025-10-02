# QiEOS Embeddable Components

This directory contains self-contained, iframe-embeddable components for third-party portals and websites. Each component is a complete HTML page with its own JavaScript functionality, designed to be embedded via iframe.

## Available Components

### 1. Profile Card Project
**Path:** `/drops/profile-card-project/`
**Purpose:** Display user profiles with avatar, name, title, and contact info
**Use Case:** Team pages, about sections, user directories
**Features:** Multiple themes, responsive sizing, contact buttons, URL parameter customization

### 2. Dashboard Widget
**Path:** `/drops/dashboard-widget/`
**Purpose:** Display key metrics and KPIs in a compact format
**Use Case:** Executive dashboards, status pages, performance monitoring
**Features:** Auto-refresh, multiple themes, customizable metrics, real-time updates

### 3. Contact Form
**Path:** `/drops/contact-form/`
**Purpose:** Lead generation and contact collection
**Use Case:** Landing pages, support pages, sales funnels
**Features:** Form validation, multiple field types, success/error messages, customizable fields

### 4. Status Monitor
**Path:** `/drops/status-monitor/`
**Purpose:** Real-time system status and uptime display
**Use Case:** Status pages, monitoring dashboards, service health
**Features:** Live status updates, service icons, response times, incident simulation

### 5. Analytics Chart
**Path:** `/drops/analytics-chart/`
**Purpose:** Data visualization with interactive charts
**Use Case:** Reports, dashboards, data presentations
**Features:** Multiple chart types (line, bar, pie), interactive controls, statistics, custom data

### 6. Calendar Widget
**Path:** `/drops/calendar-widget/`
**Purpose:** Event display and scheduling interface
**Use Case:** Event pages, booking systems, availability display
**Features:** Month navigation, event indicators, event lists, date selection

## Usage

### Basic Iframe Embedding
```html
<iframe
    src="https://your-domain.com/drops/profile-card-project/"
    width="350"
    height="200"
    frameborder="0"
    title="Profile Card Widget">
</iframe>
```

### Responsive Embedding
```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
    <iframe
        src="https://your-domain.com/drops/dashboard-widget/"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        frameborder="0"
        title="Dashboard Widget">
    </iframe>
</div>
```

### With Custom Parameters
```html
<iframe
    src="https://your-domain.com/drops/contact-form/?theme=dark&size=compact"
    width="400"
    height="300"
    frameborder="0"
    title="Contact Form Widget">
</iframe>
```

## Component-Specific Examples

### Profile Card with Custom Data
```html
<iframe
    src="https://your-domain.com/drops/profile-card-project/?name=Jane%20Smith&title=Product%20Manager&theme=blue&size=large"
    width="400"
    height="250"
    frameborder="0">
</iframe>
```

### Dashboard with Custom Metrics
```html
<iframe
    src="https://your-domain.com/drops/dashboard-widget/?title=Sales%20Dashboard&theme=green&refresh=60"
    width="500"
    height="300"
    frameborder="0">
</iframe>
```

### Contact Form with Custom Fields
```html
<iframe
    src="https://your-domain.com/drops/contact-form/?title=Get%20In%20Touch&theme=dark&size=large"
    width="450"
    height="400"
    frameborder="0">
</iframe>
```

### Status Monitor for Specific Services
```html
<iframe
    src="https://your-domain.com/drops/status-monitor/?title=API%20Status&theme=blue&refresh=30"
    width="350"
    height="250"
    frameborder="0">
</iframe>
```

### Analytics Chart with Custom Data
```html
<iframe
    src="https://your-domain.com/drops/analytics-chart/?title=Revenue%20Chart&type=bar&theme=green"
    width="500"
    height="350"
    frameborder="0">
</iframe>
```

### Calendar Widget with Events
```html
<iframe
    src="https://your-domain.com/drops/calendar-widget/?title=Event%20Calendar&theme=blue&showEvents=true"
    width="400"
    height="450"
    frameborder="0">
</iframe>
```

## Customization

Each component supports URL parameters for customization:

### Global Parameters
- `theme`: `light`, `dark`, `blue`, `green`
- `size`: `small`, `medium`, `large`

### Component-Specific Parameters

#### Profile Card
- `name`: Display name
- `title`: Job title
- `avatar`: Avatar image URL
- `email`: Email address
- `linkedin`: LinkedIn profile URL
- `twitter`: Twitter profile URL
- `showContact`: `true` or `false`

#### Dashboard Widget
- `title`: Widget title
- `refresh`: Auto-refresh interval in seconds
- `metrics`: JSON string of custom metrics

#### Contact Form
- `title`: Form title
- `subtitle`: Form subtitle
- `submitUrl`: Form submission endpoint
- `successMessage`: Custom success message
- `fields`: JSON string of custom fields

#### Status Monitor
- `title`: Monitor title
- `refresh`: Auto-refresh interval in seconds
- `services`: JSON string of custom services

#### Analytics Chart
- `title`: Chart title
- `type`: Chart type (`line`, `bar`, `pie`)
- `data`: JSON string of chart data

#### Calendar Widget
- `title`: Calendar title
- `showEvents`: `true` or `false`
- `events`: JSON string of custom events

## Security

- All components are sandboxed within iframes
- No access to parent page data
- CORS headers configured for cross-origin embedding
- Content Security Policy implemented

## Development

### Local Testing
To test components locally, serve the `/drops/` directory with a local web server:

```bash
# Using Python
cd drops
python -m http.server 8000

# Using Node.js
npx serve drops

# Using PHP
cd drops
php -S localhost:8000
```

Then access components at:
- `http://localhost:8000/profile-card-project/`
- `http://localhost:8000/dashboard-widget/`
- etc.

### Customization
Each component is self-contained and can be customized by:

1. **URL Parameters**: Pass data via query string
2. **JavaScript API**: Use the exported classes for programmatic control
3. **CSS Variables**: Override styling with custom CSS
4. **Event Listeners**: Listen for component events

### JavaScript API Example
```javascript
// Access the component instance
const profileCard = new ProfileCard('container-id', {
    name: 'John Doe',
    title: 'Developer',
    theme: 'dark'
});

// Update the profile
profileCard.updateProfile({
    name: 'Jane Smith',
    title: 'Designer'
});
```

## Deployment

Components are served via Cloudflare R2 with public URLs:
- Production: `https://drops.qieos.com/`
- Development: `https://drops-dev.qieos.com/`

### Deployment Process
1. Build components (if needed)
2. Upload to Cloudflare R2 bucket
3. Configure CORS headers
4. Set up custom domain (optional)

## File Structure

```
drops/
├── README.md
├── profile-card-project/
│   ├── index.html
│   └── profile-card.js
├── dashboard-widget/
│   ├── index.html
│   └── dashboard-widget.js
├── contact-form/
│   ├── index.html
│   └── contact-form.js
├── status-monitor/
│   ├── index.html
│   └── status-monitor.js
├── analytics-chart/
│   ├── index.html
│   └── analytics-chart.js
└── calendar-widget/
    ├── index.html
    └── calendar-widget.js
```

## Support

For customization requests or new components, contact the QiEOS development team.

## License

These components are part of the QiEOS project and follow the same licensing terms.
