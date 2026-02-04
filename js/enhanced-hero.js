// ====================================
// ENHANCED HERO WITH SPLIT TEXT & PARALLAX
// ====================================

class EnhancedHeroAnimation {
    constructor() {
        this.hero = document.querySelector('#home');
        this.init();
    }

    init() {
        if (!this.hero) return;
        
        this.createSplitTextAnimation();
        this.createMorphingBlob();
        this.createParallaxEffect();
        this.createGlowRing();
    }

    // Split text animation (letter by letter)
    createSplitTextAnimation() {
        const titleElement = document.querySelector('h1');
        if (!titleElement) return;

        const originalText = titleElement.textContent;
        titleElement.innerHTML = '';

        const letters = originalText.split('');
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.display = 'inline-block';
            span.style.animation = `letterFade 0.6s ease-out forwards`;
            span.style.animationDelay = `${index * 0.03}s`;
            titleElement.appendChild(span);
        });
    }

    // Morphing blob animation
    createMorphingBlob() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes morphing {
                0% {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    transform: translate(0, 0) rotate(0deg);
                }
                33% {
                    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                    transform: translate(30px, -50px) rotate(120deg);
                }
                66% {
                    border-radius: 70% 30% 40% 60% / 40% 70% 60% 30%;
                    transform: translate(-20px, 20px) rotate(240deg);
                }
                100% {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    transform: translate(0, 0) rotate(360deg);
                }
            }

            @keyframes letterFade {
                from {
                    opacity: 0;
                    transform: translateY(100px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes glowPulse {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(79, 70, 229, 0.3), 
                                0 0 40px rgba(79, 70, 229, 0.1);
                }
                50% {
                    box-shadow: 0 0 40px rgba(79, 70, 229, 0.5), 
                                0 0 60px rgba(79, 70, 229, 0.2);
                }
            }

            @keyframes scanLine {
                0% {
                    transform: translateY(-100%);
                }
                100% {
                    transform: translateY(100%);
                }
            }

            @keyframes dotPulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.8;
                }
            }

            .morphing-blob {
                animation: morphing 20s infinite linear;
            }

            .glow-ring {
                animation: glowPulse 3s ease-in-out infinite;
            }

            .hero-image {
                transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .hero-image:hover {
                filter: grayscale(0%);
                transform: scale(1.02);
            }

            .scan-effect {
                animation: scanLine 0.8s ease-in-out;
            }

            .pulse-dot {
                animation: dotPulse 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);

        // Create morphing blob
        const blob = document.createElement('div');
        blob.className = 'absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/5 blur-3xl morphing-blob rounded-full';
        blob.style.pointerEvents = 'none';
        
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.appendChild(blob);
        }
    }

    // Parallax effect on scroll
    createParallaxEffect() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                
                if (scrollProgress > 0 && scrollProgress < 1) {
                    const yMove = scrollProgress * 30;
                    const opacity = Math.max(0, 1 - scrollProgress * 0.2);
                    
                    element.style.transform = `translateY(${yMove}%)`;
                    element.style.opacity = opacity;
                }
            });
        });

        // Add data-parallax to hero content
        const heroContent = document.querySelector('#home .max-w-6xl');
        if (heroContent) {
            heroContent.setAttribute('data-parallax', 'true');
        }
    }

    // Glow ring animation around image
    createGlowRing() {
        const images = document.querySelectorAll('img[alt*="Photo"], img[alt*="Profile"]');
        
        images.forEach(img => {
            const parent = img.parentElement;
            if (parent) {
                const glowRing = document.createElement('div');
                glowRing.className = 'glow-ring absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 opacity-20 blur-2xl';
                glowRing.style.pointerEvents = 'none';
                parent.style.position = 'relative';
                parent.insertBefore(glowRing, img);

                // Add hover scan effect
                img.addEventListener('mouseenter', () => {
                    const scanLine = document.createElement('div');
                    scanLine.className = 'scan-effect absolute inset-0 bg-gradient-to-b from-indigo-400/0 via-indigo-400/10 to-indigo-400/0';
                    parent.appendChild(scanLine);
                    
                    setTimeout(() => scanLine.remove(), 800);
                });

                // Add grayscale filter by default
                img.classList.add('hero-image');
            }
        });
    }
}

// ====================================
// MAGNETIC BUTTON EFFECT
// ====================================

class MagneticButton {
    constructor(button) {
        this.button = button;
        this.x = 0;
        this.y = 0;
        this.init();
    }

    init() {
        this.button.addEventListener('mousemove', (e) => this.magnetize(e));
        this.button.addEventListener('mouseenter', () => this.startMagnetize());
        this.button.addEventListener('mouseleave', () => this.resetButton());
    }

    magnetize(e) {
        const rect = this.button.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        
        const distance = 100;
        const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX);
        
        this.x = Math.cos(angle) * distance;
        this.y = Math.sin(angle) * distance;
        
        this.button.style.transform = `translate(${this.x * 0.1}px, ${this.y * 0.1}px)`;
    }

    startMagnetize() {
        this.button.style.transition = 'transform 0.3s cubic-bezier(0.6, 0.05, 0.01, 0.99)';
    }

    resetButton() {
        this.button.style.transform = 'translate(0, 0)';
    }
}

// ====================================
// FLOATING PARTICLES
// ====================================

class FloatingParticles {
    constructor(containerId = 'home', particleCount = 20) {
        this.container = document.getElementById(containerId);
        this.particleCount = particleCount;
        this.init();
    }

    init() {
        if (!this.container) return;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px) translateX(0px);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }

            .floating-particle {
                position: absolute;
                pointer-events: none;
                mix-blend-mode: screen;
            }
        `;
        document.head.appendChild(style);

        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const duration = Math.random() * 10 + 15;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.bottom = '-10px';
            particle.style.backgroundColor = '#4f46e5';
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = `0 0 ${size * 2}px #4f46e5`;
            particle.style.animation = `float ${duration}s ease-in infinite`;
            particle.style.animationDelay = `${delay}s`;
            
            this.container.appendChild(particle);
        }
    }
}

// ====================================
// GRID PATTERN BACKGROUND
// ====================================

class GridPattern {
    constructor(containerId = 'home') {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        if (!this.container) return;

        const grid = document.createElement('div');
        grid.className = 'absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]';
        grid.style.pointerEvents = 'none';
        
        // Insert at the beginning (before other content)
        this.container.insertBefore(grid, this.container.firstChild);
    }
}

// ====================================
// ENHANCED BUTTON GRADIENT ANIMATION
// ====================================

class GradientButton {
    constructor(button) {
        this.button = button;
        this.init();
    }

    init() {
        this.button.addEventListener('mouseenter', () => this.animateGradient());
        this.button.addEventListener('mouseleave', () => this.resetGradient());
    }

    animateGradient() {
        if (!this.button.style.background) {
            this.button.style.background = 'linear-gradient(90deg, #4f46e5, #ec4899, #4f46e5)';
            this.button.style.backgroundSize = '200% 100%';
        }
        
        this.button.style.animation = 'gradientShift 1s ease-in-out';
    }

    resetGradient() {
        this.button.style.animation = 'none';
        this.button.style.background = '';
    }
}

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Enhanced Hero Animations Initialized');
    
    // Initialize enhanced hero
    new EnhancedHeroAnimation();
    
    // Initialize floating particles
    new FloatingParticles('home', 30);
    
    // Initialize grid pattern
    new GridPattern('home');
    
    // Initialize magnetic buttons
    const ctaButtons = document.querySelectorAll('a[href="#projects"], a[href="#contact"], a[href="#skills"]');
    ctaButtons.forEach(button => {
        new MagneticButton(button);
        new GradientButton(button);
    });

    // Add scroll event for additional effects
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('#home');
        
        if (hero && scrollY < hero.offsetHeight) {
            hero.style.opacity = Math.max(0, 1 - scrollY / 1000);
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedHeroAnimation,
        MagneticButton,
        FloatingParticles,
        GridPattern,
        GradientButton
    };
}