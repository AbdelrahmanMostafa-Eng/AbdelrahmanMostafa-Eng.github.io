(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const backToTop = document.querySelector('[data-back-to-top]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const cursorShadow = document.querySelector('#cursor-shadow');
  const cursorDot = document.querySelector('#cursor-dot');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    body.classList.toggle('theme-dark', isDark);
    themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#0f1c1d' : '#f4f0e7');
  };

  const storedTheme = localStorage.getItem('portfolio-theme');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme || (preferredDark ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    const nextTheme = body.classList.contains('theme-dark') ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', nextTheme);
    applyTheme(nextTheme);
  });

  const syncScrollState = () => {
    const hasScrolled = window.scrollY > 20;
    header?.classList.toggle('is-scrolled', hasScrolled);
    backToTop?.classList.toggle('is-visible', window.scrollY > 520);
  };
  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const closeMenu = () => {
    mobileMenu?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hoverTargets = document.querySelectorAll('a, button, .tilt-card, .skill-pill, .project-row');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => cursorDot?.classList.add('is-hovering'));
      target.addEventListener('mouseleave', () => cursorDot?.classList.remove('is-hovering'));
    });

    window.addEventListener('pointermove', (event) => {
      cursorShadow?.classList.add('is-visible');
      cursorDot?.classList.add('is-visible');
      cursorShadow?.animate({ transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0)` }, { duration: 420, fill: 'forwards', easing: 'cubic-bezier(.23,1,.32,1)' });
      cursorDot?.animate({ transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0)` }, { duration: 90, fill: 'forwards', easing: 'cubic-bezier(.23,1,.32,1)' });
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorShadow?.classList.remove('is-visible');
      cursorDot?.classList.remove('is-visible');
    });

    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-5px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });

    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        button.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  const typewriter = document.querySelector('[data-typewriter]');
  const commands = ['git status --short', 'python simulate.py --laps 12', 'cargo test --workspace', 'git commit -m "keep building"'];
  if (typewriter) {
    if (reduceMotion) {
      typewriter.textContent = commands[0];
    } else {
      let commandIndex = 0;
      let characterIndex = commands[0].length;
      let deleting = true;
      const typeNextCommand = () => {
        const command = commands[commandIndex];
        if (!deleting) {
          characterIndex += 1;
          typewriter.textContent = command.slice(0, characterIndex);
          if (characterIndex >= command.length) {
            deleting = true;
            window.setTimeout(typeNextCommand, 1900);
            return;
          }
        } else {
          characterIndex -= 1;
          typewriter.textContent = command.slice(0, characterIndex);
          if (characterIndex <= 0) {
            deleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
          }
        }
        window.setTimeout(typeNextCommand, deleting ? 38 : 62);
      };
      window.setTimeout(typeNextCommand, 1900);
    }
  }

  const systemReadout = document.querySelector('[data-system-readout]');
  const systemLog = document.querySelector('[data-system-log]');
  const systemMeter = document.querySelector('.readout-meter i');
  const systemNodes = document.querySelectorAll('[data-system-node]');
  const modules = {
    simulation: { label: 'SIMULATION', log: 'telemetry pipeline stable', meter: '68%' },
    security: { label: 'SECURITY', log: 'secrets isolated in memory', meter: '84%' },
    data: { label: 'DATA', log: 'lap traces ready for analysis', meter: '76%' },
  };
  const activateModule = (name) => {
    const module = modules[name] || modules.simulation;
    systemReadout && (systemReadout.textContent = module.label);
    systemLog && (systemLog.textContent = module.log);
    systemMeter && (systemMeter.style.width = module.meter);
    systemNodes.forEach((node) => {
      const active = node.dataset.systemNode === name;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
  };
  systemNodes.forEach((node) => {
    const activateFromNode = () => activateModule(node.dataset.systemNode);
    node.addEventListener('click', activateFromNode);
    node.addEventListener('mouseenter', activateFromNode);
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateFromNode();
      }
    });
  });
  if (systemNodes.length) activateModule('simulation');

  const spotlightTargets = document.querySelectorAll('.project-card, .contact-card');
  spotlightTargets.forEach((target) => {
    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    });
  });

  const desktopNavLinks = [...document.querySelectorAll('.desktop-nav a')];
  const navSections = desktopNavLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && desktopNavLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        desktopNavLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    navSections.forEach((section) => navObserver.observe(section));
  }
})();
