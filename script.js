(() => {
  const body = document.body;
  const topbar = document.querySelector('.topbar');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const backTop = document.querySelector('[data-back-to-top]');
  const interactiveControls = document.querySelectorAll('.btn, .sync-button, .console-action, .filter-tab, .theme-switch, .menu-switch');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const cursorOrb = document.querySelector('#cursor-orb');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GITHUB_USER = 'AbdelrahmanMostafa-Eng';
  const REPO_CACHE_KEY = 'abdelrahman-public-repos-v1';
  const FEATURED = new Set(['bioenv', 'fsae-telemetry-simulator', 'vehicle-dynamics-calculator']);
  const state = { repos: [], filter: 'all', sort: 'updated' };

  const applyTheme = (theme) => {
    const light = theme === 'light';
    body.classList.toggle('theme-light', light);
    themeToggle?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#F8FAFC' : '#070B12');
  };
  const storedTheme = localStorage.getItem('console-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(storedTheme || (prefersLight ? 'light' : 'dark'));
  themeToggle?.addEventListener('click', () => {
    const next = body.classList.contains('theme-light') ? 'dark' : 'light';
    localStorage.setItem('console-theme', next);
    applyTheme(next);
  });
  interactiveControls.forEach((control) => control.addEventListener('pointerdown', (event) => {
    if (reduceMotion) return;
    const rect = control.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'interaction-ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    control.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 620);
  }));

  const syncPageState = () => {
    const scrolled = window.scrollY > 36;
    topbar?.classList.toggle('is-scrolled', scrolled);
    backTop?.classList.toggle('is-visible', window.scrollY > 560);
  };
  syncPageState();
  window.addEventListener('scroll', syncPageState, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const scrollProgress = document.querySelector('[data-scroll-progress]');
  const scrollTargets = new Set(document.querySelectorAll('.hero-console, .metrics .metric, .principles .principle, .tool-row, .roadmap-step, .contact'));
  const registerScrollTarget = (target) => { if (target) { target.classList.add('scroll-depth'); scrollTargets.add(target); } };
  const sectionTargets = [...document.querySelectorAll('.hero, .intro, .work, .toolkit, .path, .contact')];
  scrollTargets.forEach((target) => target.classList.add('scroll-depth'));
  let scrollMotionFrame = 0;
  const updateScrollMotion = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
    scrollProgress?.style.setProperty('--scroll-progress', `${progress}%`);
    const viewportCenter = window.innerHeight * .52;
    let depthIndex = 0;
    scrollTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const distance = Math.max(-1.25, Math.min(1.25, ((rect.top + rect.height * .5) - viewportCenter) / window.innerHeight));
      const shift = Math.round(distance * -12);
      const depth = Math.round((1 - Math.min(1, Math.abs(distance))) * 10) + (depthIndex++ % 2);
      target.style.setProperty('--scroll-shift', `${shift}px`);
      target.style.setProperty('--scroll-z', `${depth}px`);
      if (target.matches('.hero-console, .contact')) target.style.setProperty('--scroll-tilt-y', `${(distance * -1.6).toFixed(2)}deg`);
    });
    sectionTargets.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(-1.5, Math.min(1.5, ((rect.top + rect.height * .35) - viewportCenter) / window.innerHeight));
      section.style.setProperty('--section-depth', distance.toFixed(3));
    });
    scrollMotionFrame = 0;
  };
  const requestScrollMotion = () => { if (!reduceMotion && !scrollMotionFrame) scrollMotionFrame = window.requestAnimationFrame(updateScrollMotion); };
  requestScrollMotion();
  window.addEventListener('scroll', requestScrollMotion, { passive: true });
  window.addEventListener('resize', requestScrollMotion, { passive: true });

  const closeMenu = () => {
    mobileMenu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };
  menuToggle?.addEventListener('click', () => {
    const open = mobileMenu?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -32px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  const pointerCapable = !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let attachTiltSurface = () => {};
  if (pointerCapable) {
    const ambientLights = [...document.querySelectorAll('.ambient-light')];
    const resetTilt = (surface) => {
      surface.style.setProperty('--tilt-x', '0deg');
      surface.style.setProperty('--tilt-y', '0deg');
      surface.style.setProperty('--lift', '0px');
      surface.style.setProperty('--mx', '50%');
      surface.style.setProperty('--my', '50%');
    };
    attachTiltSurface = (surface) => {
      if (!surface || surface.dataset.tiltBound === 'true') return;
      surface.dataset.tiltBound = 'true';
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        const localX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const localY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        const tiltX = (localX - .5) * 5;
        const tiltY = (localY - .5) * -5;
        surface.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        surface.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
        surface.style.setProperty('--lift', surface.matches('.hero-console') ? '-8px' : '-4px');
        surface.style.setProperty('--mx', `${(localX * 100).toFixed(1)}%`);
        surface.style.setProperty('--my', `${(localY * 100).toFixed(1)}%`);
      }, { passive: true });
      surface.addEventListener('pointerleave', () => resetTilt(surface));
    };
    document.querySelectorAll('.hero-console, .repo-card').forEach(attachTiltSurface);
    let pointerX = window.innerWidth * .5;
    let pointerY = window.innerHeight * .35;
    let targetX = pointerX;
    let targetY = pointerY;
    let frame = 0;
    const updateAmbientLights = () => {
      pointerX += (targetX - pointerX) * .055;
      pointerY += (targetY - pointerY) * .055;
      const x = (pointerX / window.innerWidth - .5) * 2;
      const y = (pointerY / window.innerHeight - .5) * 2;
      ambientLights.forEach((light, index) => {
        const strength = [22, -13, 16][index] || 14;
        const vertical = [15, 19, -14][index] || 12;
        light.style.setProperty('--light-x', `${x * strength}px`);
        light.style.setProperty('--light-y', `${y * vertical}px`);
      });
      frame = window.requestAnimationFrame(updateAmbientLights);
    };
    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorOrb?.classList.add('is-visible');
      cursorOrb?.animate({ transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0)` }, { duration: 420, fill: 'forwards', easing: 'cubic-bezier(.22,1,.36,1)' });
    }, { passive: true });
    document.addEventListener('mouseleave', () => cursorOrb?.classList.remove('is-visible'));
    window.addEventListener('pagehide', () => window.cancelAnimationFrame(frame), { once: true });
    updateAmbientLights();
  }

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const navSections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -58% 0px' });
    navSections.forEach((section) => navObserver.observe(section));
  }

  const clock = document.querySelector('[data-clock]');
  const updateClock = () => { if (clock) clock.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false }); };
  updateClock();
  window.setInterval(updateClock, 1000);

  const consoleLine = document.querySelector('[data-console-line]');
  const consolePrompt = document.querySelector('[data-console-prompt]');
  const consoleReadout = document.querySelector('[data-console-readout]');
  const consoleReadoutLabel = document.querySelector('[data-console-readout-label]');
  const consoleThroughput = document.querySelector('[data-console-throughput]');
  const consoleTime = document.querySelector('[data-console-time]');
  const graphSample = document.querySelector('[data-graph-sample]');
  let updateTelemetryFocus = () => {};
  const signalItems = [...document.querySelectorAll('.signal')];
  const diagnostics = [
    ['indexing public repositories...', '18ms', 'nominal latency', '86% throughput', 'sample 12 / 12'],
    ['warming simulation cache...', '24ms', 'cache warm-up', '78% throughput', 'sample 09 / 12'],
    ['checking local trust boundary...', '12ms', 'trust boundary', '92% throughput', 'sample 11 / 12'],
    ['rendering the next experiment...', '31ms', 'render queue', '69% throughput', 'sample 07 / 12'],
  ];
  const signalDiagnostics = {
    'repo index': ['scanning public repository graph...', '18ms', 'nominal latency', '86% throughput', 'sample 12 / 12'],
    telemetry: ['replaying telemetry sample window...', '22ms', 'telemetry pass', '81% throughput', 'sample 10 / 12'],
    'memory safe': ['checking local trust boundary...', '12ms', 'trust boundary', '92% throughput', 'sample 11 / 12'],
    'build queue': ['rendering the next experiment...', '31ms', 'render queue', '69% throughput', 'sample 07 / 12'],
  };
  let diagnosticIndex = 0;
  let typingTimer;
  const typeConsoleLine = (message) => {
    if (!consoleLine || reduceMotion) { if (consoleLine) consoleLine.textContent = message; return; }
    window.clearInterval(typingTimer);
    consoleLine.textContent = '';
    let index = 0;
    typingTimer = window.setInterval(() => {
      consoleLine.textContent = message.slice(0, index += 1);
      if (index >= message.length) window.clearInterval(typingTimer);
    }, 22);
  };
  const runDiagnostic = (selectedMessage, selectedLatency, selectedLabel, selectedThroughput, selectedSample) => {
    const [message, latency, label, throughput, sample] = selectedMessage ? [selectedMessage, selectedLatency, selectedLabel || 'nominal latency', selectedThroughput || '86% throughput', selectedSample || 'sample 12 / 12'] : diagnostics[diagnosticIndex++ % diagnostics.length];
    typeConsoleLine(message);
    if (consoleReadout) consoleReadout.textContent = latency;
    if (consoleReadoutLabel) consoleReadoutLabel.textContent = label;
    if (consoleThroughput) consoleThroughput.textContent = throughput;
    if (graphSample) graphSample.textContent = sample;
    const sampleMatch = String(sample).match(/(\d+)\s*\/\s*12/);
    if (sampleMatch) updateTelemetryFocus(Number(sampleMatch[1]) - 1);
    if (consoleTime) consoleTime.textContent = 'just now';
    if (consolePrompt) consolePrompt.textContent = '>';
  };
  document.querySelector('[data-console-action]')?.addEventListener('click', () => runDiagnostic());
  signalItems.forEach((signal) => {
    signal.setAttribute('tabindex', '0');
    signal.setAttribute('role', 'button');
    const activateSignal = () => {
      signalItems.forEach((item) => item.classList.toggle('active', item === signal));
      const [message, latency, label, throughput, sample] = signalDiagnostics[signal.textContent.trim()] || diagnostics[0];
      runDiagnostic(message, latency, label, throughput, sample);
    };
    signal.addEventListener('click', activateSignal);
    signal.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateSignal(); } });
  });
  if (!reduceMotion) window.setInterval(runDiagnostic, 4200);

  const telemetryGraph = document.querySelector('[data-telemetry-graph]');
  const graphSvg = telemetryGraph?.querySelector('[data-telemetry-canvas]');
  const sampleValues = [42, 48, 55, 51, 63, 70, 66, 78, 75, 88, 84, 94];
  const sampleVolumes = [34, 44, 38, 58, 51, 68, 57, 74, 64, 82, 71, 90];
  const graphPoints = sampleValues.map((value, index) => ({
    x: 48 + index * 47.5,
    y: 278 - value * 2.05,
    z: 10 + (index % 3) * 5,
    value,
    volume: sampleVolumes[index],
  }));
  const graphProject = ({ x, y, z = 0 }) => ({ x: x + z * .72, y: y - z * .46 });
  const graphPointString = (points) => points.map((point) => {
    const projected = graphProject(point);
    return `${projected.x.toFixed(1)},${projected.y.toFixed(1)}`;
  }).join(' ');
  const makeSvgElement = (tag, attributes = {}) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };
  const drawTelemetryGraph = () => {
    if (!graphSvg) return;
    graphSvg.innerHTML = '';
    const defs = makeSvgElement('defs');
    const areaGradient = makeSvgElement('linearGradient', { id: 'graph-3d-area', x1: '0', x2: '0', y1: '0', y2: '1' });
    [['0', '.28'], ['.65', '.08'], ['1', '0']].forEach(([offset, opacity]) => areaGradient.appendChild(makeSvgElement('stop', { offset, 'stop-color': 'var(--cyan)', 'stop-opacity': opacity })));
    const graphGlow = makeSvgElement('filter', { id: 'graph-3d-glow', x: '-30%', y: '-30%', width: '160%', height: '160%' });
    graphGlow.appendChild(makeSvgElement('feGaussianBlur', { stdDeviation: '3', result: 'blur' }));
    const merge = makeSvgElement('feMerge');
    merge.appendChild(makeSvgElement('feMergeNode', { in: 'blur' }));
    merge.appendChild(makeSvgElement('feMergeNode', { in: 'SourceGraphic' }));
    graphGlow.appendChild(merge);
    defs.append(areaGradient, graphGlow);
    graphSvg.appendChild(defs);
    const backPlane = makeSvgElement('polygon', { class: 'graph-3d-plane graph-3d-plane-back', points: graphPointString([{ x: 48, y: 36, z: 46 }, { x: 570, y: 36, z: 46 }, { x: 570, y: 278, z: 46 }, { x: 48, y: 278, z: 46 }]) });
    graphSvg.appendChild(backPlane);
    [0, 25, 50, 75, 100].forEach((value) => {
      const y = 278 - value * 2.05;
      const start = graphProject({ x: 48, y, z: 0 });
      const end = graphProject({ x: 570, y, z: 0 });
      const depthEnd = graphProject({ x: 570, y, z: 46 });
      graphSvg.appendChild(makeSvgElement('line', { class: 'graph-3d-grid', x1: start.x, y1: start.y, x2: end.x, y2: end.y }));
      graphSvg.appendChild(makeSvgElement('line', { class: 'graph-3d-grid graph-3d-grid-depth', x1: end.x, y1: end.y, x2: depthEnd.x, y2: depthEnd.y }));
    });
    [0, 2, 4, 6, 8, 10, 12].forEach((seconds, index) => {
      const x = 48 + index * (522 / 6);
      const front = graphProject({ x, y: 278, z: 0 });
      const back = graphProject({ x, y: 278, z: 46 });
      graphSvg.appendChild(makeSvgElement('line', { class: 'graph-3d-grid graph-3d-grid-vertical', x1: front.x, y1: 36, x2: front.x, y2: front.y }));
      graphSvg.appendChild(makeSvgElement('line', { class: 'graph-3d-grid graph-3d-grid-depth', x1: front.x, y1: front.y, x2: back.x, y2: back.y }));
    });
    const threshold = graphProject({ x: 48, y: 278 - 72 * 2.05, z: 0 });
    const thresholdEnd = graphProject({ x: 570, y: 278 - 72 * 2.05, z: 0 });
    graphSvg.appendChild(makeSvgElement('line', { class: 'graph-3d-threshold', x1: threshold.x, y1: threshold.y, x2: thresholdEnd.x, y2: thresholdEnd.y }));
    graphPoints.forEach((point, index) => {
      const front = graphProject(point);
      const back = graphProject({ ...point, z: point.z + 24 });
      const base = graphProject({ x: point.x, y: 278, z: point.z });
      const volume = Math.max(7, point.volume * .55);
      const volumeBase = graphProject({ x: point.x, y: 278, z: point.z + 24 });
      const barTop = graphProject({ x: point.x, y: 278 - volume, z: point.z });
      const barTopBack = graphProject({ x: point.x, y: 278 - volume, z: point.z + 24 });
      graphSvg.appendChild(makeSvgElement('polygon', { class: 'graph-3d-bar-side', points: `${barTop.x},${barTop.y} ${barTopBack.x},${barTopBack.y} ${volumeBase.x},${volumeBase.y} ${base.x},${base.y}` }));
      graphSvg.appendChild(makeSvgElement('line', { class: 'graph-3d-bar', x1: base.x, y1: base.y, x2: front.x, y2: front.y, 'data-sample-index': index }));
      graphSvg.appendChild(makeSvgElement('line', { class: 'graph-3d-bar-depth', x1: front.x, y1: front.y, x2: back.x, y2: back.y }));
    });
    const projectedPoints = graphPoints.map(graphProject);
    const areaPoints = `${graphPointString(graphPoints)} ${graphProject({ x: 570, y: 278, z: 0 }).x},${graphProject({ x: 570, y: 278, z: 0 }).y} ${graphProject({ x: 48, y: 278, z: 0 }).x},${graphProject({ x: 48, y: 278, z: 0 }).y}`;
    graphSvg.appendChild(makeSvgElement('polygon', { class: 'graph-3d-area', points: areaPoints }));
    graphSvg.appendChild(makeSvgElement('polyline', { class: 'graph-3d-trace-shadow', points: graphPointString(graphPoints.map((point) => ({ ...point, y: point.y + 7, z: 0 }))) }));
    graphSvg.appendChild(makeSvgElement('polyline', { class: 'graph-3d-trace', points: graphPointString(graphPoints) }));
    const focusGroup = makeSvgElement('g', { class: 'graph-3d-focus' });
    focusGroup.append(makeSvgElement('line', { class: 'graph-3d-focus-line', x1: projectedPoints.at(-1).x, y1: 36, x2: projectedPoints.at(-1).x, y2: 278 }), makeSvgElement('circle', { class: 'graph-3d-focus-halo', cx: projectedPoints.at(-1).x, cy: projectedPoints.at(-1).y, r: '12' }), makeSvgElement('circle', { class: 'graph-3d-focus-point', cx: projectedPoints.at(-1).x, cy: projectedPoints.at(-1).y, r: '5' }));
    graphSvg.appendChild(focusGroup);
    graphSvg.appendChild(makeSvgElement('polyline', { class: 'graph-3d-axis', points: graphPointString([{ x: 48, y: 278, z: 0 }, { x: 570, y: 278, z: 0 }, { x: 570, y: 278, z: 46 }]) }));
    updateTelemetryFocus = (sampleIndex) => {
      const index = Math.max(0, Math.min(graphPoints.length - 1, Number(sampleIndex) || 0));
      const point = graphProject(graphPoints[index]);
      const focusLine = graphSvg.querySelector('.graph-3d-focus-line');
      const focusPoint = graphSvg.querySelector('.graph-3d-focus-point');
      const focusHalo = graphSvg.querySelector('.graph-3d-focus-halo');
      focusLine?.setAttribute('x1', point.x.toFixed(1)); focusLine?.setAttribute('x2', point.x.toFixed(1));
      focusPoint?.setAttribute('cx', point.x.toFixed(1)); focusPoint?.setAttribute('cy', point.y.toFixed(1));
      focusHalo?.setAttribute('cx', point.x.toFixed(1)); focusHalo?.setAttribute('cy', point.y.toFixed(1));
      graphSvg.querySelectorAll('[data-sample-index]').forEach((bar) => bar.classList.toggle('is-focused', Number(bar.dataset.sampleIndex) === index));
      if (graphSample) graphSample.textContent = `sample ${String(index + 1).padStart(2, '0')} / 12`;
    };
    updateTelemetryFocus(graphPoints.length - 1);
  };
  drawTelemetryGraph();
  if (pointerCapable) {
    telemetryGraph?.addEventListener('pointermove', (event) => {
      const rect = telemetryGraph.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      updateTelemetryFocus(Math.round(progress * (graphPoints.length - 1)));
    }, { passive: true });
    telemetryGraph?.addEventListener('pointerleave', () => updateTelemetryFocus(graphPoints.length - 1));
  }

  const repoGrid = document.querySelector('[data-repo-grid]');
  const repoStatus = document.querySelector('[data-repo-status]');
  const repoTemplate = document.querySelector('#repo-card-template');
  const repoRefresh = document.querySelector('[data-repo-refresh]');
  const repoSort = document.querySelector('[data-repo-sort]');
  const filterTabs = [...document.querySelectorAll('[data-filter]')];
  const repoCount = document.querySelector('[data-count]');

  const formatDate = (value) => {
    if (!value) return 'date unknown';
    const date = new Date(value);
    const diff = Math.max(0, Date.now() - date.getTime());
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'updated today';
    if (days === 1) return 'updated yesterday';
    if (days < 30) return `updated ${days}d ago`;
    if (days < 365) return `updated ${Math.floor(days / 30)}mo ago`;
    return `updated ${Math.floor(days / 365)}y ago`;
  };
  const languageName = (language) => language || 'systems';
  const prepareRepo = (repo) => ({ ...repo, featured: FEATURED.has(repo.name) });
  const getVisibleRepos = () => {
    let repos = [...state.repos];
    if (state.filter === 'featured') repos = repos.filter((repo) => repo.featured);
    if (state.filter === 'recent') repos = repos.slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 6);
    if (state.sort === 'stars') repos.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
    if (state.sort === 'name') repos.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === 'updated') repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return repos;
  };
  const renderRepos = () => {
    if (!repoGrid || !repoTemplate) return;
    repoGrid.innerHTML = '';
    const repos = getVisibleRepos();
    if (!repos.length) {
      repoGrid.innerHTML = '<p class="repo-empty">No repositories match this view yet.</p>';
      return;
    }
    repos.forEach((repo, index) => {
      const card = repoTemplate.content.cloneNode(true).querySelector('.repo-card');
      card.dataset.repoUrl = repo.html_url;
      card.dataset.repoName = repo.name;
      card.classList.add('is-visible', 'is-entering', 'scroll-depth');
      registerScrollTarget(card);
      card.style.setProperty('--card-index', index);
      card.querySelector('.repo-number').textContent = String(index + 1).padStart(2, '0');
      card.querySelector('.repo-language').textContent = languageName(repo.language);
      card.querySelector('.repo-name').textContent = repo.name.replaceAll('-', ' ');
      card.querySelector('.repo-description').textContent = repo.description || 'An open experiment in software and systems. Open the repository to inspect the work.';
      card.querySelector('.repo-updated').textContent = formatDate(repo.updated_at);
      card.querySelector('.repo-stars').textContent = `${repo.stargazers_count} ★`;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `Open ${repo.name} on GitHub`);
      const openRepo = () => window.open(repo.html_url, '_blank', 'noopener,noreferrer');
      card.addEventListener('click', (event) => { if (!event.target.closest('a')) openRepo(); });
      card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openRepo(); } });
      card.addEventListener('pointermove', (event) => { const rect = card.getBoundingClientRect(); card.style.setProperty('--mx', `${event.clientX - rect.left}px`); card.style.setProperty('--my', `${event.clientY - rect.top}px`); });
      repoGrid.appendChild(card);
      attachTiltSurface(card);
    });
  };
  const readRepoCache = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(REPO_CACHE_KEY) || '[]');
      return Array.isArray(cached) ? cached.filter((repo) => repo && repo.html_url && repo.name).map(prepareRepo) : [];
    } catch (error) {
      return [];
    }
  };
  const writeRepoCache = (repos) => {
    try { localStorage.setItem(REPO_CACHE_KEY, JSON.stringify(repos)); } catch (error) { /* Storage can be unavailable in privacy mode. */ }
  };
  const renderCachedRepos = () => {
    const cached = readRepoCache();
    if (!cached.length) return false;
    state.repos = cached;
    if (repoCount) repoCount.textContent = String(cached.length).padStart(2, '0');
    if (repoStatus) repoStatus.textContent = `${cached.length} cached public repositories`;
    renderRepos();
    requestScrollMotion();
    return true;
  };
  const loadRepos = async () => {
    repoRefresh?.classList.add('is-syncing');
    repoRefresh?.setAttribute('aria-busy', 'true');
    if (repoStatus) repoStatus.textContent = 'Syncing public repositories...';
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal });
      if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
      const data = await response.json();
      state.repos = data.filter((repo) => !repo.fork).map(prepareRepo);
      writeRepoCache(state.repos);
      if (repoCount) repoCount.textContent = String(state.repos.length).padStart(2, '0');
      if (repoStatus) repoStatus.textContent = `${state.repos.length} public repositories indexed`;
      renderRepos();
      requestScrollMotion();
    } catch (error) {
      const cached = renderCachedRepos();
      if (cached && error instanceof Error && error.message.includes('403')) {
        if (repoStatus) repoStatus.textContent = `${state.repos.length} cached repositories · GitHub sync rate-limited`;
        console.info('GitHub public API rate limit reached; showing the last successful repository snapshot.');
      } else if (cached) {
        if (repoStatus) repoStatus.textContent = `${state.repos.length} cached repositories · live sync retry available`;
      } else {
        if (repoStatus) repoStatus.textContent = 'GitHub sync unavailable — showing the next retry state';
        if (repoGrid) repoGrid.innerHTML = '<p class="repo-empty">The repository feed could not be reached right now. Try “Sync now” again.</p>';
        console.info('GitHub repository feed unavailable; use Sync now to retry.', error);
      }
    } finally {
      window.clearTimeout(timeout);
      repoRefresh?.classList.remove('is-syncing');
      repoRefresh?.setAttribute('aria-busy', 'false');
    }
  };
  repoRefresh?.addEventListener('click', loadRepos);
  repoSort?.addEventListener('change', (event) => { state.sort = event.target.value; renderRepos(); });
  filterTabs.forEach((tab) => tab.addEventListener('click', () => {
    state.filter = tab.dataset.filter;
    filterTabs.forEach((button) => { const active = button === tab; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); });
    renderRepos();
  }));
  renderCachedRepos();
  loadRepos();
})();
