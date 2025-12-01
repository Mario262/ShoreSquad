# ShoreSquad 🌊

**Rally your crew, track weather, and hit the next beach cleanup with our dope map app!**

## Project Overview

ShoreSquad is a social web application designed to mobilize young people to participate in beach cleanups. It combines interactive mapping, real-time weather tracking, and social features to make environmental action fun and connected.

### Target Audience
- Environmentally conscious young people (Gen Z)
- Beach cleanup organizers and volunteers
- Community groups focused on ocean conservation

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Ocean Blue (Dark) | `#0077BE` | Primary actions, headers |
| Ocean Blue (Light) | `#00A8E8` | Hover states, accents |
| Coral Red | `#FF6B6B` | Secondary actions, alerts |
| Coral Orange | `#FF8C42` | Event cards, CTAs |
| Eco Green | `#1ECC7A` | Success states, eco-themes |
| Accent Yellow | `#FFD93D` | Highlights, crew highlights |
| White | `#FFFFFF` | Backgrounds |
| Dark Grey | `#2C3E50` | Text, borders |

### Typography
- **Headings**: Poppins (Bold, 600-800 weight)
- **Body**: Inter (Regular, 400-600 weight)
- **Responsive**: Mobile-first scaling

---

## ✨ Key Features

### 1. **Interactive Beach Map**
- Real-time visualization of cleanup events
- User location tracking
- Event markers with popup details
- Built with Leaflet.js

### 2. **Weather Integration**
- Real-time weather data from Open-Meteo API
- Temperature, wind speed, conditions
- Weather-appropriate cleanup recommendations

### 3. **Event Management**
- Create cleanup events with details (date, location, crew size)
- Join events and track participation
- Event sharing capabilities
- Crew collaboration

### 4. **Crew System**
- Create or join crews
- Track crew members
- Location-based crew discovery

### 5. **Performance & Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- Lazy loading for images
- Service Worker for offline support
- Responsive design (mobile-first)

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- Live Server extension or local web server

### Installation

1. **Clone/Download the project**
   ```bash
   cd ShoreSquad
   ```

2. **Install dependencies** (Optional, for development)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # Using Live Server (recommended)
   npm run dev
   
   # Or use VS Code Live Server extension
   # Right-click index.html → Open with Live Server
   ```

4. **Open in browser**
   ```
   http://localhost:5500
   ```

---

## 📁 Project Structure

```
ShoreSquad/
├── index.html              # Main HTML5 boilerplate
├── css/
│   └── styles.css         # Complete styling system
├── js/
│   └── app.js             # Main application logic
├── .vscode/
│   └── settings.json      # VS Code Live Server config
├── package.json           # Project dependencies & scripts
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup, accessibility
- **CSS3**: Custom properties, grid/flexbox, animations
- **JavaScript (ES6+)**: Modern async/await, Fetch API

### Libraries & APIs
- **Leaflet.js** (v1.9.4): Interactive mapping
- **OpenStreetMap**: Map tiles
- **Open-Meteo API**: Weather data (free, no API key required)
- **Google Fonts**: Typography (Poppins, Inter)

### Development Tools
- **Live Server**: Local development server
- **ESLint**: Code quality
- **Prettier**: Code formatting

---

## 💡 UX Design Principles

### 1. **Mobile-First Responsive Design**
- Touch-friendly buttons (min 44x44px)
- Adaptive layouts for all screen sizes
- Responsive typography scaling

### 2. **Accessibility (WCAG 2.1 AA)**
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (4.5:1)
- Skip-to-content links

### 3. **Performance**
- Lazy loading
- Code splitting ready
- Service Worker foundation
- Optimized CSS animations
- Efficient JavaScript execution

### 4. **User Experience**
- Clear call-to-action buttons
- Skeleton screens for loading
- Smooth animations
- Dark mode support
- Toast notifications
- Progressive disclosure

### 5. **Usability**
- Consistent navigation
- Clear form feedback
- Intuitive crew/event discovery
- Social sharing capabilities
- Real-time weather awareness

---

## 🎯 JavaScript Features & Recommendations

### Interactive Features
- ✅ Geolocation API for user location
- ✅ Fetch API for weather data
- ✅ Local Storage for offline data persistence
- ✅ Modal dialogs for event/crew management
- ✅ Form handling with validation
- ✅ Event delegation for performance

### Performance Optimizations
- ✅ Lazy loading for images
- ✅ Service Worker registration (foundation)
- ✅ Performance monitoring
- ✅ Efficient DOM updates
- ✅ CSS animations over JS animations

### Recommended Enhancements
```javascript
// Future additions:
- WebSocket for real-time crew updates
- IndexedDB for offline-first data
- Notification API for event alerts
- Canvas for advanced visualizations
- Web Workers for heavy computations
```

---

## 📱 Responsive Breakpoints

| Device | Width | Adjustments |
|--------|-------|------------|
| Mobile | < 480px | Single column, touch-optimized |
| Tablet | 480px - 768px | Two columns, larger touch targets |
| Desktop | > 768px | Full grid layouts, hover effects |

---

## 🌍 API Integration

### Open-Meteo Weather API
```javascript
GET /v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,weather_code,wind_speed_10m
```
- **Features**: Free, no authentication required
- **Rate Limit**: 10,000 requests/day
- **Response**: Current weather conditions

---

## 🚢 Deployment Ready

### Recommended Hosting
- **Netlify**: `npm run build` + drag & drop
- **Vercel**: Git integration
- **GitHub Pages**: Static site hosting
- **AWS S3 + CloudFront**: Scalable CDN

### Pre-Deployment Checklist
- [ ] Test on multiple browsers
- [ ] Validate HTML/CSS/JS
- [ ] Check accessibility (WAVE tool)
- [ ] Optimize images
- [ ] Set up proper CORS headers
- [ ] Configure caching headers

---

## 📝 Git Workflow

```bash
# Initialize git
git init

# Create branches
git checkout -b feature/event-creation

# Commit with clear messages
git commit -m "feat: add event creation modal"

# Push to repository
git push origin feature/event-creation
```

---

## 🐛 Troubleshooting

### Map not loading
- Check browser console for errors
- Verify internet connection
- Ensure Leaflet CDN is accessible

### Weather data not updating
- Check Open-Meteo API status
- Verify geolocation permissions
- Clear browser cache

### Live Server not working
- Ensure extension is installed: `ritwickdey.LiveServer`
- Try port 5500 (default) or change in settings.json

---

## 📞 Support & Contributing

### Bug Reports
Create detailed issues with:
- Browser version
- Device type
- Steps to reproduce
- Screenshots/screen recordings

### Feature Requests
Suggest enhancements that align with:
- Mobile-first design
- Accessibility compliance
- Performance standards
- User experience principles

---

## 📄 License

MIT License - Feel free to use, modify, and distribute

---

## 🙏 Acknowledgments

- **OpenStreetMap**: Map data and tiles
- **Open-Meteo**: Free weather API
- **Leaflet.js**: Interactive mapping library
- **Web Accessibility Initiative (WAI)**: WCAG guidelines
- **Eco-warriors everywhere**: Inspiring action for our oceans! 🌊

---

**Built with 💚 for the environment by ShoreSquad**

Rally your crew. Clean the shore. Make a difference.
