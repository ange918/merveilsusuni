# Merveille Susuni Portfolio

## Overview

This is a personal portfolio website for Merveille Susuni, a French-speaking artistic director, model coach, and digital entrepreneur from Benin. The website is built as a single-page application using vanilla HTML, CSS, and JavaScript with Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: The website uses a single HTML file with multiple sections for different content areas
- **Client-Side Navigation**: Smooth scrolling navigation between sections using vanilla JavaScript
- **Responsive Design**: Mobile-first approach with responsive navigation menu
- **Modern CSS Framework**: Tailwind CSS for utility-first styling with custom configuration

### Technology Stack
- **HTML5**: Semantic markup structure
- **Vanilla JavaScript**: Client-side interactivity and navigation
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Google Fonts**: Montserrat font family for typography
- **CSS3**: Custom animations and styling enhancements

## Key Components

### Navigation System
- Fixed navigation bar with backdrop blur effect
- Desktop horizontal menu and mobile hamburger menu
- Active section highlighting based on scroll position
- Smooth scrolling to anchor sections

### Styling Framework
- **Tailwind CSS**: Primary styling framework with custom configuration
- **Custom CSS**: Additional animations and transitions in styles.css
- **Design System**: Dark theme with night-blue background and blue accent colors
- **Typography**: Montserrat font family with multiple weights

### Interactive Features
- Mobile menu toggle functionality
- Smooth scrolling navigation
- Active navigation state management
- Responsive design breakpoints

## Data Flow

### Client-Side Navigation
1. User clicks navigation link
2. JavaScript prevents default behavior
3. Target section is identified by anchor ID
4. Smooth scroll animation moves to target section
5. Active navigation state is updated based on scroll position

### Mobile Menu Interaction
1. User clicks mobile menu button
2. Menu visibility is toggled
3. Navigation links close menu when clicked
4. Smooth transition to target section

## External Dependencies

### CDN Resources
- **Tailwind CSS**: `https://cdn.tailwindcss.com` - CSS framework
- **Google Fonts**: Montserrat font family loaded from Google Fonts API
- **Google Fonts Preconnect**: Performance optimization for font loading

### Font Loading Strategy
- Preconnect to Google Fonts domains for performance
- Montserrat font family with weights: 300, 400, 500, 600, 700
- Display swap for better loading performance

## Deployment Strategy

### Static Website Hosting
- **File Structure**: Simple static files (HTML, CSS, JS)
- **No Build Process**: Direct deployment of source files
- **CDN Dependencies**: External resources loaded from CDNs
- **Browser Compatibility**: Modern browsers with ES6+ support

### Performance Considerations
- Minimized external dependencies
- Efficient font loading with preconnect
- Optimized animations with CSS transforms
- Lightweight vanilla JavaScript implementation

### Hosting Requirements
- Static file hosting (GitHub Pages, Netlify, Vercel, etc.)
- HTTPS support for external CDN resources
- No server-side processing required
- No database or backend services needed