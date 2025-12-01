/**
 * ShoreSquad - Main Application Script
 * Rally your crew, track weather, and hit the next beach cleanup
 * Features: Interactive map, weather integration, event management, crew tracking
 */

// ==========================================
// Configuration
// ==========================================
const CONFIG = {
    apiWeather: 'https://api.open-meteo.com/v1/forecast',
    mapCenter: [1.3521, 103.8198], // Default to Singapore beaches
    mapZoom: 11,
    storageKey: 'shoresquad_data',
};

// ==========================================
// State Management
// ==========================================
const AppState = {
    events: [],
    crews: [],
    userLocation: null,
    currentUser: null,
    userCrew: null,
    
    initialize() {
        this.loadFromStorage();
        this.getCurrentLocation();
    },
    
    loadFromStorage() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored) {
            const data = JSON.parse(stored);
            this.events = data.events || [];
            this.crews = data.crews || [];
        }
    },
    
    saveToStorage() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify({
            events: this.events,
            crews: this.crews,
        }));
    },
    
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    updateMapCenter();
                },
                (error) => console.log('Location access denied:', error)
            );
        }
    },
};

// ==========================================
// Map Management
// ==========================================
let mapInstance = null;
let mapMarkers = [];

function initializeMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;
    
    mapInstance = L.map('map').setView(CONFIG.mapCenter, CONFIG.mapZoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(mapInstance);
    
    renderMapMarkers();
    
    // Show user location if available
    if (AppState.userLocation) {
        L.circleMarker([AppState.userLocation.lat, AppState.userLocation.lng], {
            radius: 8,
            fillColor: '#1ECC7A',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
        }).addTo(mapInstance).bindPopup('📍 Your Location');
    }
}

function updateMapCenter() {
    if (mapInstance && AppState.userLocation) {
        mapInstance.setView([AppState.userLocation.lat, AppState.userLocation.lng], CONFIG.mapZoom);
    }
}

function renderMapMarkers() {
    if (!mapInstance) return;
    
    // Clear existing markers
    mapMarkers.forEach(marker => mapInstance.removeLayer(marker));
    mapMarkers = [];
    
    // Add event markers
    AppState.events.forEach(event => {
        const marker = L.marker([event.lat, event.lng], {
            icon: L.icon({
                iconUrl: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF6B6B'><path d='M12 0C6.48 0 2 4.48 2 10c0 7 10 14 10 14s10-7 10-14c0-5.52-4.48-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'/></svg>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            }),
        }).bindPopup(`<strong>${event.name}</strong><br>${event.location}<br><em>${event.date}</em>`);
        
        mapMarkers.push(marker);
    });
}

// ==========================================
// Weather Management
// ==========================================
async function fetchWeather(lat = CONFIG.mapCenter[0], lng = CONFIG.mapCenter[1]) {
    try {
        const response = await fetch(
            `${CONFIG.apiWeather}?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
        );
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

function getWeatherIcon(code) {
    // WMO Weather interpretation codes
    const iconMap = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌧️', 53: '🌧️', 55: '🌧️',
        61: '🌧️', 63: '⛈️', 65: '⛈️',
        80: '🌧️', 81: '⛈️', 82: '⛈️',
        85: '🌨️', 86: '🌨️',
    };
    return iconMap[code] || '🌤️';
}

async function updateWeatherWidget() {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;
    
    const coords = AppState.userLocation || CONFIG.mapCenter;
    const weather = await fetchWeather(coords[0] || coords.lat, coords[1] || coords.lng);
    
    if (weather) {
        const icon = getWeatherIcon(weather.weather_code);
        weatherInfo.innerHTML = `
            <div class="weather-card">
                <div class="weather-icon">${icon}</div>
                <div class="weather-temp">${Math.round(weather.temperature_2m)}°C</div>
                <div class="weather-meta">Wind: ${weather.wind_speed_10m} km/h</div>
            </div>
        `;
    } else {
        weatherInfo.innerHTML = '<p>Unable to load weather data</p>';
    }
}

// ==========================================
// Event Management
// ==========================================
function createEvent(formData) {
    const event = {
        id: Date.now(),
        name: formData.get('event-name'),
        date: formData.get('event-date'),
        location: formData.get('event-location'),
        description: formData.get('event-description'),
        crewSize: parseInt(formData.get('event-crew-size')),
        createdBy: AppState.currentUser || 'Anonymous',
        joined: [],
        lat: AppState.userLocation?.lat || CONFIG.mapCenter[0],
        lng: AppState.userLocation?.lng || CONFIG.mapCenter[1],
    };
    
    AppState.events.push(event);
    AppState.saveToStorage();
    return event;
}

function renderEvents() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;
    
    if (AppState.events.length === 0) {
        eventsList.innerHTML = '<p class="empty-state">No cleanup events yet. Be the first to create one! 🌊</p>';
        return;
    }
    
    eventsList.innerHTML = AppState.events.map(event => `
        <div class="event-card" role="listitem">
            <h3>${event.name}</h3>
            <div class="event-meta">
                <span>📅 ${new Date(event.date).toLocaleDateString()} ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>📍 ${event.location}</span>
                <span>👥 Created by ${event.createdBy}</span>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-crew-size">Crew Size: ${event.crewSize} eco-warriors</div>
            <div class="event-actions">
                <button class="btn btn-secondary btn-small" onclick="joinEvent(${event.id})">Join Event</button>
                <button class="btn btn-secondary btn-small" onclick="shareEvent(${event.id})">Share 📤</button>
            </div>
        </div>
    `).join('');
}

function joinEvent(eventId) {
    const event = AppState.events.find(e => e.id === eventId);
    if (event && !event.joined.includes(AppState.currentUser || 'Anonymous')) {
        event.joined.push(AppState.currentUser || 'Anonymous');
        AppState.saveToStorage();
        renderEvents();
        showNotification(`You joined "${event.name}"! 🎉`);
    }
}

function shareEvent(eventId) {
    const event = AppState.events.find(e => e.id === eventId);
    if (event && navigator.share) {
        navigator.share({
            title: `ShoreSquad: ${event.name}`,
            text: `Join me for a beach cleanup at ${event.location}! ${event.date}`,
            url: window.location.href,
        }).catch(err => console.log('Share failed:', err));
    } else {
        showNotification('Share the event with your crew! 📱');
    }
}

// ==========================================
// Crew Management
// ==========================================
function createCrew(name, location) {
    const crew = {
        id: Date.now(),
        name,
        location,
        members: [AppState.currentUser || 'Anonymous'],
        createdAt: new Date().toISOString(),
    };
    
    AppState.crews.push(crew);
    AppState.userCrew = crew.id;
    AppState.saveToStorage();
    return crew;
}

function renderCrews() {
    const crewList = document.getElementById('crew-list');
    if (!crewList) return;
    
    if (AppState.crews.length === 0) {
        crewList.innerHTML = '<p class="empty-state">Join or create a crew to see your team here! 👥</p>';
        return;
    }
    
    crewList.innerHTML = AppState.crews.map(crew => `
        <div class="crew-card" role="listitem">
            <div class="crew-avatar">${crew.name.charAt(0).toUpperCase()}</div>
            <h3>${crew.name}</h3>
            <div class="crew-location">📍 ${crew.location}</div>
            <div class="crew-members">${crew.members.length} Members</div>
            <button class="btn btn-secondary btn-small" onclick="joinCrew(${crew.id})">
                ${crew.members.includes(AppState.currentUser) ? 'Joined ✓' : 'Join Crew'}
            </button>
        </div>
    `).join('');
}

function joinCrew(crewId) {
    const crew = AppState.crews.find(c => c.id === crewId);
    if (crew && !crew.members.includes(AppState.currentUser || 'Anonymous')) {
        crew.members.push(AppState.currentUser || 'Anonymous');
        AppState.userCrew = crewId;
        AppState.saveToStorage();
        renderCrews();
        showNotification(`You joined "${crew.name}"! 🌊`);
    }
}

// ==========================================
// Modal Management
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function setupModalListeners() {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
}

// ==========================================
// Form Handling
// ==========================================
function setupEventForm() {
    const form = document.getElementById('event-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const event = createEvent(formData);
        
        renderEvents();
        renderMapMarkers();
        closeModal('event-modal');
        form.reset();
        
        showNotification(`Event "${event.name}" created! 🎉`);
    });
}

// ==========================================
// UI Utilities
// ==========================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B6B, #FF8C42);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideUp 300ms ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ==========================================
// Performance: Lazy Loading
// ==========================================
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
}

// ==========================================
// Service Worker Registration (Offline Support)
// ==========================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service Worker registration not available');
        });
    }
}

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize app state
    AppState.initialize();
    
    // Setup UI
    setupNavigation();
    setupModalListeners();
    setupEventForm();
    setupLazyLoading();
    registerServiceWorker();
    
    // Initialize features
    initializeMap();
    updateWeatherWidget();
    renderEvents();
    renderCrews();
    
    // Event Listeners
    document.getElementById('create-event-btn')?.addEventListener('click', () => openModal('event-modal'));
    document.getElementById('find-crew-btn')?.addEventListener('click', () => openModal('crew-modal'));
    
    // Auto-update weather every 10 minutes
    setInterval(updateWeatherWidget, 600000);
    
    // Performance: Monitor performance metrics
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.duration > 3000) {
                    console.warn(`Slow operation: ${entry.name} took ${entry.duration}ms`);
                }
            });
        });
        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }
});

// ==========================================
// Error Handling
// ==========================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
