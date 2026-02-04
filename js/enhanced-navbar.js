/**
 * Enhanced Navbar - Vanilla JS Implementation
 * Converts React/Framer Motion to pure JavaScript
 * Features: Scroll detection, mobile menu, staggered animations, magnetic CTA button
 */

class EnhancedNavbar {
  constructor() {
    this.scrolled = false;
    this.mobileMenuOpen = false;
    this.navItems = [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Skills", href: "#skills" },
      { name: "Contact", href: "#contact" },
    ];
    this.init();
  }

  init() {
    this.createNavbarStructure();
    this.setupScrollListener();
    this.setupMobileMenuListener();
    this.setupNavLinks();
    this.setupCTAButton();
    this.animateNavbarEntrance();
  }

  createNavbarStructure() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    nav.innerHTML = `
      <div class="section-container">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a href="#" class="navbar-logo text-2xl font-bold text-foreground relative group">
            <span class="relative z-10">
              Badr<span class="text-indigo-600">.</span>
            </span>
            <span class="navbar-logo-bg absolute -inset-2 bg-indigo-600/10 rounded-lg -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </a>

          <!-- Nav Links - Desktop -->
          <div class="hidden md:flex items-center gap-8">
            ${this.navItems.map((item, index) => `
              <a href="${item.href}" 
                 class="nav-link text-sm font-medium uppercase tracking-wider relative group opacity-0"
                 style="animation-delay: ${0.1 * index + 0.5}s"
                 data-nav-index="${index}">
                ${item.name}
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            `).join('')}
          </div>

          <!-- CTA Button - Desktop -->
          <a href="#contact" class="hidden md:flex navbar-cta-btn items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-medium relative overflow-hidden group opacity-0"
             style="animation-delay: 0.8s">
            <span class="navbar-cta-gradient absolute inset-0 bg-gradient-to-r from-red-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span class="relative z-10">Let's Talk</span>
          </a>

          <!-- Mobile Menu Button -->
          <button class="md:hidden navbar-menu-btn relative w-10 h-10 flex items-center justify-center">
            <div class="relative w-6 h-5">
              <span class="navbar-hamburger-line absolute left-0 w-full h-0.5 bg-foreground rounded-full top-0 transition-all duration-300"></span>
              <span class="navbar-hamburger-line absolute left-0 w-full h-0.5 bg-foreground rounded-full top-2.5 transition-all duration-300"></span>
              <span class="navbar-hamburger-line absolute left-0 w-full h-0.5 bg-foreground rounded-full bottom-0 transition-all duration-300"></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div class="navbar-backdrop fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden opacity-0 pointer-events-none transition-opacity duration-300"></div>

      <!-- Mobile Menu -->
      <div class="navbar-mobile-menu fixed top-0 right-0 bottom-0 w-72 bg-slate-900 border-l border-slate-700 z-30 md:hidden translate-x-full transition-transform duration-300">
        <div class="flex flex-col justify-center h-full px-8">
          <nav class="space-y-6">
            ${this.navItems.map((item, index) => `
              <a href="${item.href}" 
                 class="navbar-mobile-link block text-2xl font-bold text-foreground hover:text-indigo-400 transition-colors opacity-0"
                 style="animation-delay: ${index * 0.1}s"
                 data-mobile-index="${index}">
                <span class="text-indigo-600 mr-2">0${index + 1}.</span>
                ${item.name}
              </a>
            `).join('')}
          </nav>

          <a href="#contact" class="navbar-mobile-cta mt-12 inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold opacity-0"
             style="animation-delay: 0.4s">
            Let's Talk
          </a>
        </div>
      </div>
    `;
  }

  setupScrollListener() {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      const isScrolled = window.scrollY > 50;
      
      if (isScrolled && !this.scrolled) {
        this.scrolled = true;
        nav.classList.add('scrolled-navbar');
      } else if (!isScrolled && this.scrolled) {
        this.scrolled = false;
        nav.classList.remove('scrolled-navbar');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  setupMobileMenuListener() {
    const menuBtn = document.querySelector('.navbar-menu-btn');
    const backdrop = document.querySelector('.navbar-backdrop');
    const mobileMenu = document.querySelector('.navbar-mobile-menu');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    backdrop.addEventListener('click', () => {
      this.closeMobileMenu();
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.navbar-mobile-link, .navbar-mobile-cta').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }

  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenuOpen = true;
    const backdrop = document.querySelector('.navbar-backdrop');
    const mobileMenu = document.querySelector('.navbar-mobile-menu');
    const lines = document.querySelectorAll('.navbar-hamburger-line');

    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.classList.remove('translate-x-full');

    // Hamburger animation
    lines[0].style.transform = 'rotate(45deg) translateY(10px)';
    lines[1].style.opacity = '0';
    lines[2].style.transform = 'rotate(-45deg) translateY(-10px)';

    // Animate menu items
    document.querySelectorAll('.navbar-mobile-link, .navbar-mobile-cta').forEach(item => {
      item.classList.remove('opacity-0');
    });
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    const backdrop = document.querySelector('.navbar-backdrop');
    const mobileMenu = document.querySelector('.navbar-mobile-menu');
    const lines = document.querySelectorAll('.navbar-hamburger-line');

    backdrop.classList.add('opacity-0', 'pointer-events-none');
    mobileMenu.classList.add('translate-x-full');

    // Reset hamburger
    lines[0].style.transform = 'none';
    lines[1].style.opacity = '1';
    lines[2].style.transform = 'none';

    // Hide menu items
    document.querySelectorAll('.navbar-mobile-link, .navbar-mobile-cta').forEach(item => {
      item.classList.add('opacity-0');
    });
  }

  setupNavLinks() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  setupCTAButton() {
    const ctaButtons = document.querySelectorAll('.navbar-cta-btn, .navbar-mobile-cta');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          if (this.mobileMenuOpen) this.closeMobileMenu();
        }
      });
    });
  }

  animateNavbarEntrance() {
    // Animate nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.style.animation = `fadeInDown 0.6s ease-out forwards`;
    });

    // Animate CTA button
    document.querySelectorAll('.navbar-cta-btn').forEach(btn => {
      btn.style.animation = `fadeIn 0.6s ease-out forwards`;
    });
  }
}

// CSS Animations
const navbarAnimationsStyle = document.createElement('style');
navbarAnimationsStyle.textContent = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    transition: all 0.5s cubic-bezier(0.6, 0.05, 0.01, 0.99);
    padding: 1.5rem 0;
  }

  nav.scrolled-navbar {
    padding: 1rem 0;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  .navbar-logo {
    transition: all 0.3s ease;
  }

  .navbar-logo:hover {
    transform: scale(1.05);
  }

  .nav-link {
    position: relative;
    transition: color 0.3s ease;
  }

  .nav-link:hover {
    color: hsl(217 91% 60%);
  }

  .navbar-cta-btn {
    transition: all 0.3s ease;
  }

  .navbar-cta-btn:hover {
    transform: scale(1.05);
  }

  .navbar-cta-btn:active {
    transform: scale(0.95);
  }

  .navbar-hamburger-line {
    will-change: transform;
  }

  .navbar-backdrop {
    will-change: opacity;
  }

  .navbar-mobile-menu {
    will-change: transform;
  }

  .navbar-mobile-link,
  .navbar-mobile-cta {
    transition: all 0.3s ease;
  }

  .navbar-mobile-link:active,
  .navbar-mobile-cta:active {
    transform: scale(0.95);
  }
`;

document.head.appendChild(navbarAnimationsStyle);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedNavbar();
  });
} else {
  new EnhancedNavbar();
}