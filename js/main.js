// Professional portfolio interactions: theme, scroll effects, active nav, reveal animations, mobile menu
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const header = document.querySelector('.site-header');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  // ===== Theme Toggle =====
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  if (btn) {
    btn.textContent = initial === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', now);
      localStorage.setItem('theme', now);
      btn.textContent = now === 'dark' ? '☀️' : '🌙';
    });
  }

  // ===== Set Year =====
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Mobile Menu Toggle =====
  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('mobile-active');
      mobileMenuToggle.classList.toggle('active');
      mobileMenuToggle.textContent = nav.classList.contains('mobile-active') ? '✕' : '☰';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 768 && 
          nav.classList.contains('mobile-active') &&
          !nav.contains(e.target) && 
          !mobileMenuToggle.contains(e.target)) {
        nav.classList.remove('mobile-active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
      }
    });
  }

  // ===== Smooth Scroll Navigation (Centered) =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#" or empty
      if (!href || href === '#') return;
      
      // Find target element
      const target = document.querySelector(href);
      
      if (target) {
        // Prevent default jump
        e.preventDefault();
        
        // Close mobile menu if open
        if (nav && mobileMenuToggle) {
          if (nav.classList.contains('mobile-active')) {
            nav.classList.remove('mobile-active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
          }
        }
        
        // Smooth scroll to CENTER of viewport
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',      // Center the section vertically
          inline: 'nearest'
        });
      }
    });
  });

  // ===== Scroll Effects: Header Shadow & Active Nav =====
  let lastScroll = 0;
  const sections = document.querySelectorAll('main section[id]');
  
  function onScroll() {
    const scrollPos = window.scrollY;
    
    // Add shadow to header when scrolled
    if (header) {
      if (scrollPos > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Highlight active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    lastScroll = scrollPos;
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load

  // ===== Intersection Observer for Scroll Reveal Animations =====
  const revealElements = document.querySelectorAll('section, .project, .skills-list li');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: unobserve after reveal for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ===== Add stagger delay to skill items =====
  const skillItems = document.querySelectorAll('.skills-list li');
  skillItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.05}s`;
  });

})();
