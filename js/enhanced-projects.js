/**
 * Enhanced Projects Section - Premium React Component Converted to Vanilla JS
 * Features: Responsive grid, project cards with hover effects, smooth animations
 * Dependencies: None (pure vanilla JS + Tailwind CSS)
 */

class ProjectCard {
  constructor(projectData) {
    this.data = {
      imgSrc: projectData.imgSrc || 'https://via.placeholder.com/600x400?text=Project',
      title: projectData.title || 'Project Title',
      description: projectData.description || 'Project description',
      demoLink: projectData.demoLink || '#',
      githubLink: projectData.githubLink || '#',
      technologies: projectData.technologies || [],
      ...projectData
    };
  }

  createTechBadges() {
    if (!this.data.technologies || this.data.technologies.length === 0) {
      return '';
    }

    return this.data.technologies
      .map(
        (tech) => `
      <span class="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs font-medium text-slate-300 hover:border-cyan-400 transition-colors duration-300">
        ${tech}
      </span>
    `
      )
      .join('');
  }

  render() {
    const card = document.createElement('div');
    card.className = `group relative flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm transition-all duration-500 ease-in-out hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 h-full`;

    card.innerHTML = `
      <!-- Card Image Section -->
      <div class="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src="${this.data.imgSrc}"
          alt="${this.data.title}"
          class="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(this.data.title)}'"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>

      <!-- Card Content Section -->
      <div class="flex flex-1 flex-col p-6">
        <!-- Title -->
        <h3 class="text-xl font-bold transition-colors duration-300 group-hover:text-cyan-400">
          ${this.data.title}
        </h3>

        <!-- Description -->
        <p class="mt-3 flex-1 text-slate-400 text-sm leading-relaxed">
          ${this.data.description}
        </p>

        <!-- Tech Stack -->
        ${
          this.data.technologies && this.data.technologies.length > 0
            ? `
          <div class="mt-4 flex flex-wrap gap-2">
            ${this.createTechBadges()}
          </div>
        `
            : ''
        }

        <!-- Action Buttons -->
        <div class="mt-5 flex gap-3 flex-wrap">
          <a
            href="${this.data.demoLink}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Live Demo
          </a>

          <a
            href="${this.data.githubLink}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-600 hover:border-purple-500 text-slate-300 hover:text-purple-400 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-purple-500/10 transform hover:scale-105"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    `;

    return card;
  }
}

class EnhancedProjects {
  constructor(containerSelector, projectsData = []) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error(`Container ${containerSelector} not found`);
      return;
    }

    this.projectsData = projectsData.length > 0 ? projectsData : this.getDefaultProjects();
    this.init();
  }

  getDefaultProjects() {
    return [
      {
        imgSrc: '../assets/projects/project1.png',
        title: 'E-Commerce Platform',
        description:
          'A full-stack e-commerce solution with product listings, shopping cart, and secure payment integration. Features real-time inventory management and user authentication.',
        demoLink: 'https://vitahealth-six.vercel.app/',
        githubLink: 'https://github.com',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
      },
      {
        imgSrc: '../assets/projects/project2.png',
        title: 'Task Management App',
        description:
          'A collaborative task management system with real-time updates and team collaboration features. Includes drag-and-drop boards, notifications, and advanced filtering.',
        demoLink: 'https://html-quest-game.vercel.app/',
        githubLink: 'https://github.com',
        technologies: ['Vue.js', 'Firebase', 'Tailwind CSS']
      },
      {
        imgSrc: '../assets/projects/project3.png',
        title: 'AI Chat Application',
        description:
          'An intelligent chatbot powered by AI with natural language processing and context awareness. Supports multiple conversations and conversation history.',
        demoLink: 'https://m-d-lime.vercel.app/',
        githubLink: 'https://github.com',
        technologies: ['React', 'OpenAI API', 'Express', 'PostgreSQL']
      },
      {
        imgSrc: '../assets/projects/project4.png',
        title: 'Restaurant albaraka',
        description:
          'Restaurant Al Baraka is a professional and fully-featured website for a traditional Moroccan restaurant that offers an authentic dining experience. The website is carefully designed to reflect authentic Moroccan identity with a modern contemporary touch.',
        demoLink: 'https://restorent-baraka.vercel.app/',
        githubLink: 'https://github.com',
        technologies: ['React', 'D3.js', 'GraphQL', 'Node.js']
      },
      {
        imgSrc: '../assets/projects/project2.png',
        title: 'Social Network Platform',
        description:
          'A social networking platform with user profiles, messaging, and content sharing. Includes real-time notifications and feed algorithms.',
        demoLink: 'https://html-quest-game.vercel.app/',
        githubLink: 'https://github.com',
        technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'WebSockets']
      },
      {
        imgSrc: '../assets/projects/project3.png',
        title: 'Fitness Tracker App',
        description:
          'A comprehensive fitness tracking application with workout logging and progress analytics. Features mobile-first design and offline support.',
        demoLink: 'https://m-d-lime.vercel.app/',
        githubLink: 'https://github.com',
        technologies: ['React Native', 'Firebase', 'Redux']
      }
    ];
  }

  init() {
    // Inject CSS styles
    this.injectStyles();

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className =
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max';

    // Render project cards
    this.projectsData.forEach((projectData, index) => {
      const card = new ProjectCard(projectData);
      const cardElement = card.render();

      // Add animation delay
      cardElement.style.animationDelay = `${index * 0.1}s`;
      cardElement.classList.add('animate-fade-in-up');

      gridContainer.appendChild(cardElement);
    });

    // Clear container and add grid
    this.container.innerHTML = '';
    this.container.appendChild(gridContainer);

    // Setup intersection observer for animations
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const cards = this.container.querySelectorAll('[class*="group"]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    cards.forEach((card) => observer.observe(card));
  }

  injectStyles() {
    if (document.getElementById('enhanced-projects-styles')) return;

    const style = document.createElement('style');
    style.id = 'enhanced-projects-styles';
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
      }

      /* Project Cards */
      .group {
        position: relative;
      }

      /* Smooth transitions */
      * {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .group:hover {
          transform: translateY(-4px) !important;
        }
      }

      /* Gradient overlays for better text contrast */
      .group img {
        will-change: transform;
      }

      /* Focus states for accessibility */
      a:focus-visible {
        outline: 2px solid #06b6d4;
        outline-offset: 2px;
      }
    `;

    document.head.appendChild(style);
  }

  // Public methods for dynamic updates
  addProject(projectData) {
    this.projectsData.push(projectData);
    this.init();
  }

  removeProject(index) {
    this.projectsData.splice(index, 1);
    this.init();
  }

  updateProject(index, projectData) {
    this.projectsData[index] = { ...this.projectsData[index], ...projectData };
    this.init();
  }

  setProjects(projectsData) {
    this.projectsData = projectsData;
    this.init();
  }
}

// --- Auto-initialization ---
document.addEventListener('DOMContentLoaded', () => {
  const projectsContainer = document.getElementById('projects-grid');
  if (projectsContainer) {
    new EnhancedProjects('#projects-grid');
  }
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProjectCard, EnhancedProjects };
}
