// Material UI Coming Soon Website - Interactive Features and Animations
class ComingSoonApp {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.countdownTarget = new Date('2025-07-27T23:59:59').getTime();
        
        this.init();
    }

    init() {
        // Initialize immediately, don't wait for DOMContentLoaded since we're loading after DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.setupCanvas();
        this.createParticles();
        this.startAnimationLoop();
        this.setupEventListeners();
        this.startCountdown();
        this.initializePageAnimations();
        
        // Force show all content elements
        this.ensureContentVisibility();
    }

    ensureContentVisibility() {
        // Ensure logo is visible
        const logo = document.getElementById('logo');
        if (logo) {
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1) rotate(0deg)';
        }

        // Ensure all main content is visible
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const cards = document.querySelectorAll('.card');
        const socialContainer = document.getElementById('social-links');

        [heroTitle, heroSubtitle, socialContainer, ...cards].forEach(element => {
            if (element) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Particle System
    setupCanvas() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            console.error('Particle canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => this.updateMousePosition(e));
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recreate particles when canvas resizes
        this.createParticles();
    }

    updateMousePosition(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    createParticles() {
        this.particles = []; // Clear existing particles
        const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas?.width || window.innerWidth),
                y: Math.random() * (this.canvas?.height || window.innerHeight),
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomParticleColor(),
                baseVx: (Math.random() - 0.5) * 0.5,
                baseVy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    getRandomParticleColor() {
        const colors = [
            'rgba(255, 215, 0, 0.6)',  // Gold
            'rgba(255, 68, 68, 0.6)',  // Red accent
            'rgba(255, 255, 255, 0.4)', // White
            'rgba(30, 30, 30, 0.6)'    // Dark
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles() {
        if (!this.canvas || !this.particles.length) return;

        this.particles.forEach(particle => {
            // Reset velocity to base values
            particle.vx = particle.baseVx;
            particle.vy = particle.baseVy;

            // Mouse interaction - stronger effect
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const force = (120 - distance) / 120;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * force * 2;
                particle.vy += Math.sin(angle) * force * 2;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    drawParticles() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw connections
        this.drawConnections();
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.3;
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    startAnimationLoop() {
        const animate = () => {
            this.updateParticles();
            this.drawParticles();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Countdown Timer
    startCountdown() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.countdownTarget - now;

        if (distance < 0) {
            this.displayCountdownExpired();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.animateCountdownUpdate('days', days);
        this.animateCountdownUpdate('hours', hours);
        this.animateCountdownUpdate('minutes', minutes);
        this.animateCountdownUpdate('seconds', seconds);
    }

    animateCountdownUpdate(id, value) {
        const element = document.getElementById(id);
        if (!element) return;
        
        const formattedValue = value.toString().padStart(2, '0');
        
        if (element.textContent !== formattedValue) {
            element.classList.add('animate');
            element.textContent = formattedValue;
            
            setTimeout(() => {
                element.classList.remove('animate');
            }, 300);
        }
    }

    displayCountdownExpired() {
        const countdownContainer = document.getElementById('countdown');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div style="text-align: center;">
                    <h2 style="color: var(--accent-color); font-family: var(--font-family-heading);">
                        The Phoenix Has Risen!
                    </h2>
                    <p style="color: var(--text-secondary); margin-top: 16px;">
                        Something amazing is here.
                    </p>
                </div>
            `;
        }
    }

    // Page Animations
    initializePageAnimations() {
        // Remove loading overlay after a delay
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('fade-out');
                
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        }, 1500);

        // Trigger staggered animations for cards
        this.staggerCardAnimations();
    }

    staggerCardAnimations() {
        const cards = document.querySelectorAll('.card');
        const socialContainer = document.getElementById('social-links');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 1500 + index * 200);
        });
        
        // Social links animation
        if (socialContainer) {
            setTimeout(() => {
                socialContainer.style.opacity = '1';
                socialContainer.style.transform = 'translateY(0)';
            }, 1900);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Form submission
        const emailForm = document.getElementById('email-form');
        if (emailForm) {
            emailForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Button ripple effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => this.createRippleEffect(e));
        });

        // Social media hover effects
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => this.animateSocialIcon(icon, 'enter'));
            icon.addEventListener('mouseleave', () => this.animateSocialIcon(icon, 'leave'));
        });

        // Input field interactions
        const emailInput = document.getElementById('email-input');
        if (emailInput) {
            emailInput.addEventListener('focus', () => this.handleInputFocus(emailInput));
            emailInput.addEventListener('blur', () => this.handleInputBlur(emailInput));
            emailInput.addEventListener('input', () => this.validateEmailInput(emailInput));
        }

        // Logo click interaction
        const logo = document.getElementById('logo');
        if (logo) {
            logo.addEventListener('click', () => {
                logo.style.transform = 'scale(1.1) rotate(10deg)';
                setTimeout(() => {
                    logo.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            });
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email-input');
        const formMessage = document.getElementById('form-message');
        const subscribeBtn = document.getElementById('subscribe-btn');
        
        if (!emailInput || !formMessage || !subscribeBtn) return;
        
        const email = emailInput.value.trim();
        
        if (!this.isValidEmail(email)) {
            this.showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        subscribeBtn.style.opacity = '0.7';
        subscribeBtn.style.pointerEvents = 'none';
        const btnText = subscribeBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Subscribing...';
        
        // Simulate form submission
        setTimeout(() => {
            this.showFormMessage('Thank you! You\'ll be the first to know when we launch.', 'success');
            emailInput.value = '';
            subscribeBtn.style.opacity = '1';
            subscribeBtn.style.pointerEvents = 'auto';
            if (btnText) btnText.textContent = 'Subscribe';
            
            // Add celebration particle burst
            this.createCelebrationBurst();
        }, 2000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFormMessage(message, type) {
        const formMessage = document.getElementById('form-message');
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = `form-message ${type} show`;
        
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = button.querySelector('.btn-ripple');
        
        if (ripple) {
            ripple.style.width = '0';
            ripple.style.height = '0';
            
            setTimeout(() => {
                ripple.style.width = '300px';
                ripple.style.height = '300px';
            }, 10);
            
            setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
            }, 600);
        }
    }

    animateSocialIcon(icon, action) {
        if (action === 'enter') {
            icon.style.transform = 'translateY(-3px) scale(1.1) rotate(5deg)';
        } else {
            icon.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        }
    }

    handleInputFocus(input) {
        const container = input.closest('.input-container');
        if (container) {
            container.style.transform = 'scale(1.02)';
            
            // Add focus glow effect
            const underline = container.querySelector('.input-underline');
            if (underline) {
                underline.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
            }
        }
    }

    handleInputBlur(input) {
        const container = input.closest('.input-container');
        if (container) {
            container.style.transform = 'scale(1)';
            
            const underline = container.querySelector('.input-underline');
            if (underline) {
                underline.style.boxShadow = 'none';
            }
        }
    }

    validateEmailInput(input) {
        const email = input.value.trim();
        const container = input.closest('.input-container');
        
        if (container) {
            if (email && !this.isValidEmail(email)) {
                container.style.borderColor = 'rgba(255, 68, 68, 0.5)';
                input.style.borderBottomColor = 'rgba(255, 68, 68, 0.5)';
            } else {
                container.style.borderColor = '';
                input.style.borderBottomColor = '';
            }
        }
    }

    createCelebrationBurst() {
        if (!this.ctx || !this.canvas) return;
        
        // Create temporary celebration particles
        const celebrationParticles = [];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 30; i++) {
            celebrationParticles.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 4 + 2,
                color: this.getRandomParticleColor()
            });
        }
        
        const animateCelebration = () => {
            // Don't clear the main canvas, draw on top
            this.ctx.save();
            
            celebrationParticles.forEach((particle, index) => {
                if (particle.life <= 0) {
                    celebrationParticles.splice(index, 1);
                    return;
                }
                
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // gravity
                particle.life -= particle.decay;
                
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            this.ctx.restore();
            
            if (celebrationParticles.length > 0) {
                requestAnimationFrame(animateCelebration);
            }
        };
        
        animateCelebration();
    }
}

// Initialize the application
const app = new ComingSoonApp();

// Additional smooth scroll behavior for any anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle visibility change to pause/resume animations when tab is not active
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Tab hidden - optimizing performance');
    } else {
        console.log('Tab visible - resuming full animations');
    }
});

// Ensure page loads properly
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Double-check that all critical elements are visible
    const logo = document.getElementById('logo');
    const countdown = document.getElementById('countdown');
    const subscriptionForm = document.getElementById('subscription-form');
    
    if (logo) logo.style.opacity = '1';
    if (countdown) countdown.style.opacity = '1';
    if (subscriptionForm) subscriptionForm.style.opacity = '1';
});