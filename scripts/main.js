/**
 * Portfolio Showcase - Interactive JavaScript
 * Autor: George Pricop - Blockchain Developer & AI Automation Specialist
 * GitHub: https://github.com/Gzeu/portfolio-showcase
 */

class PortfolioShowcase {
    constructor() {
        this.isInitialized = false;
        this.observers = [];
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            this.setupSmoothScrolling();
            this.setupIntersectionObserver();
            this.setupNavigationHighlight();
            this.setupProjectCardAnimations();
            this.setupLazyLoading();
            this.initializeCounters();
            this.setupThemeDetection();
            this.setupPerformanceOptimizations();
            this.isInitialized = true;
            
            // Log successful initialization
            console.log('Portfolio Showcase initialized successfully');
        } catch (error) {
            console.error('Error initializing Portfolio Showcase:', error);
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerOffset = 120;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupIntersectionObserver() {
        // Observe elements for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe project cards and section titles
        const elementsToObserve = document.querySelectorAll('.project-card, .section-title, .tech-category');
        elementsToObserve.forEach(el => {
            fadeObserver.observe(el);
        });

        this.observers.push(fadeObserver);
    }

    setupNavigationHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const highlightNav = () => {
            let current = '';
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        // Throttled scroll handler
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    highlightNav();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Initial highlight
        highlightNav();
    }

    setupProjectCardAnimations() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach((card, index) => {
            // Add stagger delay for initial animation
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });

            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });

            // Add focus support for accessibility
            card.addEventListener('focus', () => {
                this.animateCard(card, 'enter');
            });

            card.addEventListener('blur', () => {
                this.animateCard(card, 'leave');
            });
        });
    }

    animateCard(card, state) {
        if (state === 'enter') {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = 'var(--shadow-xl)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        }
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('skeleton');
                        img.classList.add('fade-in');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                img.classList.add('skeleton');
                imageObserver.observe(img);
            });

            this.observers.push(imageObserver);
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('skeleton');
            });
        }
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(target * easeOutCubic);
                
                counter.textContent = currentValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                    counter.setAttribute('data-counted', 'true');
                }
            };

            requestAnimationFrame(updateCounter);
        };

        // Set up intersection observer for counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counter.textContent = '0';
            counterObserver.observe(counter);
        });

        this.observers.push(counterObserver);
    }

    setupThemeDetection() {
        // Detect system theme preference
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleThemeChange = (e) => {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        };

        // Listen for theme changes
        darkModeMediaQuery.addEventListener('change', handleThemeChange);
        
        // Set initial theme
        handleThemeChange(darkModeMediaQuery);
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Set up performance monitoring
        this.monitorPerformance();
        
        // Optimize scroll performance
        this.optimizeScrollPerformance();
    }

    preloadCriticalResources() {
        // Preload important images and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('fonts') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        // Monitor Core Web Vitals if available
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        switch (entry.entryType) {
                            case 'largest-contentful-paint':
                                console.log('LCP:', entry.startTime);
                                break;
                            case 'first-input':
                                console.log('FID:', entry.processingStart - entry.startTime);
                                break;
                            case 'layout-shift':
                                if (!entry.hadRecentInput) {
                                    console.log('CLS:', entry.value);
                                }
                                break;
                        }
                    }
                });

                observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
            } catch (error) {
                console.warn('Performance monitoring not fully supported:', error);
            }
        }
    }

    optimizeScrollPerformance() {
        // Use passive event listeners for better scroll performance
        const passiveSupported = this.supportsPassive();
        const options = passiveSupported ? { passive: true } : false;

        // Add scroll-based optimizations
        let ticking = false;
        
        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Perform scroll-based calculations here if needed
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', optimizedScrollHandler, options);
    }

    supportsPassive() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get() {
                    supportsPassive = true;
                    return true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {
            // Passive not supported
        }
        return supportsPassive;
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        this.observers = [];
        this.isInitialized = false;
    }
}

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Enhanced Button Interactions
class ButtonEnhancer {
    constructor() {
        this.setupButtonEffects();
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    createRippleEffect(event, button) {
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);

        // Clean up after animation
        setTimeout(() => {
            if (circle.parentNode) {
                circle.parentNode.removeChild(circle);
            }
        }, 600);
    }
}

// Analytics and Tracking (Privacy-Focused)
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.setupEventTracking();
    }

    setupEventTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .nav-link')) {
                this.trackEvent('click', e.target.textContent.trim(), e.target.href || e.target.getAttribute('onclick'));
            }
        });

        // Track section visibility
        const sections = document.querySelectorAll('section[id]');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackEvent('section_view', entry.target.id, entry.intersectionRatio);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    trackEvent(action, label, value) {
        const event = {
            timestamp: new Date().toISOString(),
            action,
            label,
            value,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.events.push(event);

        // Log for development (remove in production)
        console.log('Analytics Event:', event);

        // Here you could send to your analytics service
        // this.sendToAnalytics(event);
    }

    sendToAnalytics(event) {
        // Implementation for sending to analytics service
        // Example: Google Analytics, Plausible, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', event.action, {
                event_category: 'portfolio_interaction',
                event_label: event.label,
                value: event.value
            });
        }
    }

    getAnalytics() {
        return this.events;
    }
}

// Error Handling and Reporting
class ErrorHandler {
    constructor() {
        this.setupErrorHandling();
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason, {
                promise: event.promise
            });
        });
    }

    logError(type, error, context = {}) {
        const errorInfo = {
            type,
            message: error?.message || error,
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            context
        };

        console.error('Portfolio Error:', errorInfo);

        // In production, you might want to send this to an error reporting service
        // this.sendErrorReport(errorInfo);
    }

    sendErrorReport(errorInfo) {
        // Implementation for error reporting service
        // Example: Sentry, LogRocket, etc.
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize main portfolio functionality
        window.portfolioShowcase = new PortfolioShowcase();
        
        // Initialize enhancements
        new ButtonEnhancer();
        new AnalyticsManager();
        new ErrorHandler();
        
        // Add CSS for ripple effect
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 600ms linear;
                    background-color: rgba(255, 255, 255, 0.6);
                    pointer-events: none;
                }
                
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('Portfolio Showcase fully initialized');
        
    } catch (error) {
        console.error('Failed to initialize Portfolio Showcase:', error);
    }
});

// Expose utilities globally for potential external use
window.PortfolioUtils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    animateValue: (element, start, end, duration) => {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = start + (end - start) * progress;
            element.textContent = Math.floor(value);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioShowcase, ButtonEnhancer, AnalyticsManager, ErrorHandler };
}