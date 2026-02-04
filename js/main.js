// ====================================
// TYPING EFFECT
// ====================================

class TypingEffect {
    constructor(elementId, texts, speed = 100, deleteSpeed = 50, delayBetween = 2000) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetween = delayBetween;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element) return;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;

            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
                return;
            }

            setTimeout(() => this.type(), this.deleteSpeed);
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;

            if (this.charIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delayBetween);
                return;
            }

            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Initialize typing effect on hero section
document.addEventListener('DOMContentLoaded', () => {
    new TypingEffect('typing', [
        'Full Stack Developer',
        'Web Developer',
        'UI/UX Developer',
        'Problem Solver'
    ], 80, 50, 1500);
});

// ====================================
// MOBILE MENU TOGGLE
// ====================================

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('menu-open');
        });
    });
}

// ====================================
// SMOOTH SCROLL & NAVBAR HIGHLIGHTING
// ====================================

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    this.updateActiveLink(targetId);
                }
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        let currentSectionId = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });

        this.updateActiveLink(currentSectionId);
    }

    updateActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

new SmoothScroll();

// ====================================
// SCROLL ANIMATIONS
// ====================================

class ScrollAnimation {
    constructor() {
        this.elements = document.querySelectorAll('.fade-up');
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, this.options);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

new ScrollAnimation();

// ====================================
// FORM VALIDATION & SUBMISSION
// ====================================

class ContactForm {
    constructor(formId = 'contact-form') {
        this.form = document.getElementById(formId);
        this.formMessage = document.getElementById('form-message');
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            message: document.getElementById('message')
        };
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        Object.values(this.fields).forEach(field => {
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (!value) {
            errorMessage = `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`;
            isValid = false;
        } else if (field.type === 'email' && !this.isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        } else if (field.name === 'message' && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
            isValid = false;
        } else if (field.name === 'name' && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long';
            isValid = false;
        }

        this.setFieldError(field, errorMessage, isValid);
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setFieldError(field, message, isValid) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        if (!errorSpan) return;

        if (isValid) {
            field.classList.remove('form-error');
            errorSpan.classList.add('hidden');
            errorSpan.textContent = '';
        } else {
            field.classList.add('form-error');
            errorSpan.classList.remove('hidden');
            errorSpan.textContent = message;
        }
    }

    clearFieldError(field) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        if (errorSpan && errorSpan.textContent) {
            errorSpan.classList.add('hidden');
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        Object.values(this.fields).forEach(field => {
            if (field && !this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) return;

        // Show success message
        this.showSuccessMessage();

        // Reset form
        this.form.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            this.formMessage.classList.add('hidden');
        }, 5000);
    }

    showSuccessMessage() {
        this.formMessage.innerHTML = '✓ Message sent successfully! I\'ll get back to you soon.';
        this.formMessage.className = 'success-message';
        this.formMessage.classList.remove('hidden');
    }
}

new ContactForm();

// ====================================
// SKILL BARS ANIMATION
// ====================================

class SkillBarsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-bar');
        this.options = {
            threshold: 0.5
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.animation = `fillBar 1.5s ease-out forwards`;
                    observer.unobserve(bar);
                }
            });
        }, this.options);

        this.skillBars.forEach(bar => observer.observe(bar));
    }
}

new SkillBarsAnimation();

// ====================================
// PARALLAX EFFECT
// ====================================

class ParallaxEffect {
    constructor() {
        this.heroSection = document.querySelector('#home');
        this.blobs = document.querySelectorAll('.animate-blob');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onScroll() {
        if (!this.heroSection) return;

        const scrollY = window.scrollY;
        const heroBottom = this.heroSection.offsetTop + this.heroSection.offsetHeight;

        if (scrollY < heroBottom) {
            this.blobs.forEach((blob, index) => {
                const speed = 0.5 + (index * 0.1);
                blob.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }

    onMouseMove(e) {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) * 0.01;
        const moveY = (clientY - centerY) * 0.01;

        this.blobs.forEach((blob, index) => {
            blob.style.transform += ` translate(${moveX * (index + 1)}px, ${moveY * (index + 1)}px)`;
        });
    }
}

new ParallexEffect();

// ====================================
// LAZY LOADING IMAGES
// ====================================

class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });

            this.images.forEach(img => observer.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';

        img.onload = () => {
            img.style.opacity = '1';
        };

        // Trigger loading
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    }
}

new LazyLoadImages();

// ====================================
// COPY TO CLIPBOARD
// ====================================

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Copied to clipboard!');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ====================================
// SCROLL TO TOP BUTTON (Optional)
// ====================================

class ScrollToTop {
    constructor() {
        this.btn = document.createElement('button');
        this.btn.innerHTML = '↑';
        this.btn.id = 'scroll-to-top';
        this.btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 999;
            pointer-events: none;
        `;

        document.body.appendChild(this.btn);
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll());
        this.btn.addEventListener('click', () => this.scrollToTop());
    }

    onScroll() {
        if (window.pageYOffset > 300) {
            this.btn.style.opacity = '1';
            this.btn.style.pointerEvents = 'auto';
        } else {
            this.btn.style.opacity = '0';
            this.btn.style.pointerEvents = 'none';
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

new ScrollToTop();

// ====================================
// PERFORMANCE OPTIMIZATION
// ====================================

// Debounce function for scroll events
function debounce(func, delay) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ====================================
// DARK MODE TOGGLE (Optional Enhancement)
// ====================================

class DarkModeToggle {
    constructor() {
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    init() {
        // Check system preference
        if (this.prefersDark.matches) {
            document.documentElement.classList.add('dark');
        }

        // Listen for changes
        this.prefersDark.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
    }
}

new DarkModeToggle();

// ====================================
// ANALYTICS TRACKER (Optional)
// ====================================

class AnalyticsTracker {
    constructor() {
        this.trackSectionViews();
        this.trackButtonClicks();
    }

    trackSectionViews() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(`Viewed section: ${entry.target.id}`);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    trackButtonClicks() {
        const buttons = document.querySelectorAll('a, button');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log(`Clicked: ${btn.textContent}`);
            });
        });
    }
}

new AnalyticsTracker();

// ====================================
// BUTTON HANDLERS
// ====================================

function handleViewWork() {
    const myWorkSection = document.getElementById('my-work');
    if (myWorkSection) {
        myWorkSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn('My Work section not found');
    }
}

function handleDownloadCV() {
    window.open('cv.pdf', '_blank');
}

// ====================================
// INITIALIZATION ON DOM READY
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Portfolio initialized successfully');
});

// ====================================
// ERROR HANDLING
// ====================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
