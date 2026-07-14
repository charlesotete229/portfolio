// Portfolio Interactive Engine - app.js

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let projectsData = [];
  const body = document.body;

  // 1. Theme Toggle Management
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');

  // Load saved theme or check system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    body.classList.add('light-theme');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    body.classList.remove('light-theme');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    if (isLight) {
      localStorage.setItem('theme', 'light');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      localStorage.setItem('theme', 'dark');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    });
  });

  // Active navigation link tracking
  const sections = document.querySelectorAll('section');
  const navObserverOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: '-80px 0px 0px 0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // 3. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-el');
  const revealObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animates once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // SVG Icons library to render inside projects dynamically
  const svgIcons = {
    fullstack: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    frontend: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>`,
    backend: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H5v-4h14v4zm0-14H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 6H5V7h14v4z"/></svg>`
  };

  // 4. Load Projects dynamically
  const projectsGrid = document.getElementById('projects-grid');
  
  async function loadProjects() {
    try {
      const response = await fetch('projects.json');
      projectsData = await response.json();
      renderProjects(projectsData);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      projectsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Impossible de charger les projets pour le moment. Veuillez réessayer plus tard.</p>`;
    }
  }

  function renderProjects(projects) {
    projectsGrid.innerHTML = '';
    // If there are few projects, center them with a fixed column width
    if (projects.length <= 2) {
      projectsGrid.classList.add('centered');
    } else {
      projectsGrid.classList.remove('centered');
    }
    
    if (projects.length === 0) {
      projectsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Aucun projet trouvé dans cette catégorie.</p>`;
      return;
    }

    projects.forEach((proj, idx) => {
      const card = document.createElement('article');
      card.className = 'project-card reveal-el';
      card.style.transitionDelay = `${idx * 0.1}s`;
      
      // Determine project icon matching the category
      const categoryIcon = svgIcons[proj.category] || svgIcons.fullstack;

      card.innerHTML = `
        <div class="project-preview">
          <div class="project-preview-overlay"></div>
          <div class="project-preview-art bg-grad-${proj.category}">
            <div class="project-preview-icon">
              ${categoryIcon}
            </div>
          </div>
        </div>
        <div class="project-info">
          <span class="project-category">${proj.category}</span>
          <h3 class="project-card-title">${proj.title}</h3>
          <p class="project-card-desc">${proj.description}</p>
          <div class="project-tags">
            ${proj.tech.slice(0, 4).map(t => `<span class="project-tag">${t}</span>`).join('')}
            ${proj.tech.length > 4 ? `<span class="project-tag">+${proj.tech.length - 4}</span>` : ''}
          </div>
          <div class="project-links">
            <button class="project-btn-details" data-id="${proj.id}">
              Détails
              <svg viewBox="0 0 24 24"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
            </button>
            <div class="project-icon-links">
              <a href="${proj.links.github}" class="project-icon-link" target="_blank" rel="noopener noreferrer" aria-label="Lien GitHub">
                <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="${proj.links.demo}" class="project-icon-link" target="_blank" rel="noopener noreferrer" aria-label="Lien Démo Live">
                <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
              </a>
            </div>
          </div>
        </div>
      `;
      
      projectsGrid.appendChild(card);
      // Trigger reveal immediately for parsed DOM nodes
      setTimeout(() => card.classList.add('active'), 50);
    });

    // Rebind Modal opening buttons
    const detailButtons = document.querySelectorAll('.project-btn-details');
    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.currentTarget.getAttribute('data-id');
        openProjectModal(projectId);
      });
    });
  }

  // 5. Category Filtering
  const filterTabs = document.getElementById('filter-tabs');
  const filterButtons = filterTabs.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      e.currentTarget.classList.add('active');
      e.currentTarget.setAttribute('aria-selected', 'true');

      const filterVal = e.currentTarget.getAttribute('data-filter');
      
      if (filterVal === 'all') {
        renderProjects(projectsData);
      } else {
        const filtered = projectsData.filter(p => p.category === filterVal);
        renderProjects(filtered);
      }
    });
  });

  // 6. Modal details controller
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalGridContent = document.getElementById('modal-grid-content');

  function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const categoryIcon = svgIcons[project.category] || svgIcons.fullstack;

    modalGridContent.innerHTML = `
      <div class="modal-visual-panel">
        <div class="modal-visual-pattern">
          ${categoryIcon}
        </div>
        <div class="modal-meta-box">
          <div class="modal-meta-row">
            <span class="modal-meta-label">Catégorie</span>
            <span class="modal-meta-val" style="text-transform: capitalize;">${project.category}</span>
          </div>
          <div class="modal-meta-row">
            <span class="modal-meta-label">Stack size</span>
            <span class="modal-meta-val">${project.tech.length} Technologies</span>
          </div>
          <div class="modal-meta-row">
            <span class="modal-meta-label">Statut</span>
            <span class="modal-meta-val" style="color:var(--success-accent)">Production</span>
          </div>
        </div>
      </div>
      
      <div class="modal-content-panel">
        <div class="modal-project-title">
          <h2>${project.title}</h2>
          <p>${project.subtitle}</p>
        </div>
        
        <div class="modal-desc-box">
          <h3 class="modal-section-title">Présentation du Projet</h3>
          <p>${project.longDescription}</p>
        </div>
        
        <div class="modal-features-box">
          <h3 class="modal-section-title">Fonctionnalités clés</h3>
          <ul class="modal-features-list">
            ${project.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        
        <div class="modal-challenge-box">
          <h3 class="modal-section-title">Défi technique & Solution</h3>
          <p>${project.challenges}</p>
        </div>
        
        <div class="modal-results-box">
          <h3 class="modal-section-title">Résultats & Impact</h3>
          <p>${project.results}</p>
        </div>
        
        <div class="modal-actions">
          <a href="${project.links.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:currentColor;"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            Visiter le site
          </a>
          <a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:currentColor;"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            Code Source
          </a>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Release scroll
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 7. Dynamic Connected Particles Canvas
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let mouse = {
    x: null,
    y: null,
    radius: 100
  };

  // Adjust mouse coordinates
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Bounce off screen boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check mouse interaction (attraction effect)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Soft attraction pull
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;

      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    
    // Scale density based on window size to prevent performance lag
    let numberOfParticles = (canvas.width * canvas.height) / 11000;
    if (numberOfParticles > 120) numberOfParticles = 120; // Cap it
    if (window.innerWidth < 768) numberOfParticles = 25;  // Low density for mobile

    const color = body.classList.contains('light-theme') 
      ? 'rgba(124, 58, 237, 0.12)' 
      : 'rgba(139, 92, 246, 0.12)';

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 0.6) - 0.3;
      let directionY = (Math.random() * 0.6) - 0.3;

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  function connectParticles() {
    let opacityValue = 1;
    const isLightTheme = body.classList.contains('light-theme');
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          opacityValue = 1 - (distance / 120);
          ctx.strokeStyle = isLightTheme
            ? `rgba(124, 58, 237, ${opacityValue * 0.08})`
            : `rgba(139, 92, 246, ${opacityValue * 0.08})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Handle window resizing
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  // Track body theme switches to adjust particles color instantly
  const observer = new MutationObserver(() => {
    // Reconfigure particle visual colors on theme toggles
    const newColor = body.classList.contains('light-theme') 
      ? 'rgba(124, 58, 237, 0.12)' 
      : 'rgba(139, 92, 246, 0.12)';
    particlesArray.forEach(p => p.color = newColor);
  });

  observer.observe(body, { attributes: true, attributeFilter: ['class'] });

  // Initialize Canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
  animateParticles();

  // 8. Contact Form Validator
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameEl = document.getElementById('form-name');
    const emailEl = document.getElementById('form-email');
    const messageEl = document.getElementById('form-message');
    
    let isFormValid = true;

    // Reset feedback
    document.querySelectorAll('.form-feedback').forEach(f => f.classList.remove('visible'));
    formStatus.className = 'form-status';
    formStatus.style.display = 'none';

    // Name Validation
    if (!nameEl.value.trim()) {
      document.getElementById('feedback-name').classList.add('visible');
      isFormValid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailEl.value.trim() || !emailRegex.test(emailEl.value.trim())) {
      document.getElementById('feedback-email').classList.add('visible');
      isFormValid = false;
    }

    // Message Validation
    if (!messageEl.value.trim()) {
      document.getElementById('feedback-message').classList.add('visible');
      isFormValid = false;
    }

    if (isFormValid) {
      const submitBtn = document.getElementById('form-submit-btn');
      const originalBtnHtml = submitBtn.innerHTML;
      
      // Simulate Loader
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 50 50" style="width: 18px; height: 18px; animation: rotate 2s linear infinite; margin-right: 8px;">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="1, 150" stroke-dashoffset="0" style="stroke-linecap: round; animation: dash 1.5s ease-in-out infinite;"></circle>
        </svg>
        Envoi en cours...
      `;

      // CSS keyframes injections for loading spinner
      if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.innerHTML = `
          @keyframes rotate { 100% { transform: rotate(360deg); } }
          @keyframes dash {
            0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
            100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
          }
        `;
        document.head.appendChild(style);
      }

      const payload = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        message: messageEl.value.trim(),
      };

      fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(async (response) => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;

          const result = await response.json();
          if (response.ok) {
            formStatus.textContent = result?.message || 'Votre message a bien été envoyé !';
            formStatus.classList.add('success');
            contactForm.reset();
          } else {
            formStatus.textContent = result?.message || 'Erreur lors de l’envoi. Réessayez plus tard.';
            formStatus.classList.add('error');
          }
          formStatus.style.display = 'block';
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          formStatus.textContent = 'Impossible de joindre le serveur. Vérifiez que le backend Nest.js est démarré.';
          formStatus.classList.add('error');
          formStatus.style.display = 'block';
        });
    }
  });

  // Floating label init: ensure labels adjust to pre-filled auto-complete entries
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('change', () => {
      // Trigger reflow for label state transitions
    });
  });

  // Run startup operations
  loadProjects();
});
