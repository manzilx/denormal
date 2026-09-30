// denormal.in: theme, palette, menu, tabs, motion, and the drawing's live references.
(() => {
  window.__dn = 1;
  const root = document.documentElement;
  const body = document.body;
  // Bookmarks from the previous homepage still reach a current section.
  const homeAnchors = { '#trace': '#systems', '#engage': '#start' };
  const currentAnchor = location.pathname === '/' && homeAnchors[location.hash];
  if (currentAnchor) {
    history.replaceState(null, '', currentAnchor);
    document.querySelector(currentAnchor)?.scrollIntoView({ behavior: 'instant' });
  }
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motionPreference.matches;
  let pausedByUser = false;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // Theme: the boot script in <head> already applied a saved choice.
  const dark = () => root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const syncToggle = () => document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(dark()));
    b.setAttribute('aria-label', dark() ? 'Light theme' : 'Dark theme');
  });
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
    const next = dark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode: the choice lasts this page */ }
    syncToggle();
  }));
  syncToggle();

  // Palette under exploration.
  const docks = document.querySelectorAll('[data-palette-set]');
  const syncPalette = () => docks.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.paletteSet === (root.dataset.palette || 'olive'))));
  docks.forEach((b) => b.addEventListener('click', () => {
    root.dataset.palette = b.dataset.paletteSet;
    try { localStorage.setItem('palette', b.dataset.paletteSet); } catch (e) { /* this page only */ }
    syncPalette();
  }));
  syncPalette();

  // Menu dialog.
  const menu = document.getElementById('menu');
  document.querySelectorAll('[data-menu-open]').forEach((b) => b.addEventListener('click', () => menu?.showModal()));
  menu?.querySelectorAll('[data-menu-close], a').forEach((el) => el.addEventListener('click', () => menu.close()));
  menu?.addEventListener('click', (e) => { if (e.target === menu) menu.close(); });

  // Tabs: roving tabindex, arrow keys, Home and End.
  document.querySelectorAll('[role="tablist"]:not(.ref-selector):not(.atlas-choices)').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault();
        select(tabs[(k + tabs.length) % tabs.length], true);
      });
    });
  });

  // Mono labels decode into place, the way a readout settles.
  const GLYPHS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  const decode = (el) => {
    if (reduced || el.__decoded) return;
    el.__decoded = true;
    const final = el.textContent;
    const t0 = performance.now();
    const dur = 650 + final.length * 12;
    const step = (now) => {
      const p = reduced ? 1 : clamp((now - t0) / dur);
      const settled = Math.floor(p * final.length);
      el.textContent = final.split('').map((c, i) => (i < settled || c === ' ' || c === '·' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
      if (p < 1) requestAnimationFrame(step); else el.textContent = final;
    };
    requestAnimationFrame(step);
  };

  // Figures count up to their value once.
  const count = (el) => {
    const m = /^(\D*)(\d+)(.*)$/.exec(el.textContent.trim());
    if (reduced || !m || Number(m[2]) < 2) return;
    const [, pre, num, post] = m;
    const to = Number(num);
    const t0 = performance.now();
    const step = (now) => {
      const p = reduced ? 1 : clamp((now - t0) / 1400);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = `${pre}${Math.round(to * e)}${post}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Reveals. Blocks below the first screen lift in, in sequence within their
  // parent; headings rise word by word; linework plots. Each runs once.
  const REVEAL = [
    '.zone-lede', '.legend', '.sysrow', '.tabs', '.tracetable', '.trace-foot', '.prog-row', '.bound', '.commit > div',
    '.notbuilt-row', '.clouds > li', '.stops > li', '.principles > div', '.refusals tr', '.ops > li', '.refs > li', '.dim',
    '.register tbody tr', '.lines-item', '.spec tr', '.dline-wrap', '.refuse-grid > *', '.contd a', '.credits li', '.prose p',
    '.start-k', '.start-body', '.start .btn', '.start-mail', '.sendlist', '.weeks', '.more', '.arch-note', '.boundary-note',
    '.tb', '.tb-foot', '.h-small', '.brief-lede', '.brief-side', '.band-d', '.fig', '.acc-i', '.figs-k',
    '.values-grid > article', '.industrial-method li', '.policy-section', '.system-deliverables > article', '.system-process > li', '.workflow-principles > article', '.system-review > div', '.system-context p', '.purpose-k', '.vision-copy', '.purpose-visual', '.mission-statement', '.lean-intro', '.lean-method > li', '.purpose-next',
  ].join(',');
  const inFirstScreen = (el) => el.getBoundingClientRect().top < innerHeight * 0.92;
  const targets = [];
  if (!reduced && 'IntersectionObserver' in window) {
    document.querySelectorAll(REVEAL).forEach((el) => {
      if (el.closest('.cover, .page-hero') || inFirstScreen(el)) return;
      const sibs = [...el.parentElement.children].filter((c) => c.matches(REVEAL));
      el.style.setProperty('--i', Math.min(sibs.indexOf(el), 6));
      el.classList.add('rv');
      targets.push(el);
    });
    document.querySelectorAll('.viewport').forEach((el) => { if (!el.closest('.cover') && !inFirstScreen(el)) { el.classList.add('rv-media'); targets.push(el); } });
    document.querySelectorAll('.zone-head, .start h2, .band-t').forEach((el) => targets.push(el));
    document.querySelectorAll('.zone-ref, .page-code .mono, .band-k span').forEach((el) => targets.push(el));
    document.querySelectorAll('.dim-v, .fig-v').forEach((el) => targets.push(el));
  }
  const fire = (el) => {
    el.classList.add('is-in');
    if (el.matches('.zone-ref, .page-code .mono, .band-k span')) decode(el);
    if (el.matches('.dim-v, .fig-v')) count(el);
    el.querySelectorAll?.('.zone-ref').forEach(decode);
  };
  if (targets.length) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      fire(e.target);
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -10% 0px' });
    targets.forEach((t) => io.observe(t));
  } else {
    document.querySelectorAll('.zone-head, .start h2, .band-t').forEach((el) => el.classList.add('is-in'));
  }
  document.querySelectorAll('.cover-kicker .mono').forEach((el) => setTimeout(() => decode(el), 650));

  // Linework plots in once. The parent is observed, because a fully clipped
  // element never reports an intersection.
  const plots = document.querySelectorAll('.plot');
  if (reduced || !('IntersectionObserver' in window)) plots.forEach((p) => p.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.__plots.forEach((p) => p.classList.add('is-in'));
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -12% 0px' });
    plots.forEach((p) => {
      const host = p.parentElement;
      (host.__plots ||= []).push(p);
      io.observe(host);
    });
  }

  // Image reveals and scroll depth share the existing scroll scheduler.
  // Observe only visible media; do not run another animation loop.
  const depthMedia = [...document.querySelectorAll('.purpose-visual, .people-photo, .workflow-image, .industrial-photo')];
  const visibleDepthMedia = new Set();
  const entranceTargets = [...depthMedia, ...document.querySelectorAll('.footer-display')];
  entranceTargets.forEach(el => {
    el.classList.add(el.matches('.footer-display') ? 'impact-footer' : 'impact-media');
    if (reduced || inFirstScreen(el)) el.classList.add('impact-revealed');
  });
  if ('IntersectionObserver' in window) {
    // Observe the unclipped host so a closed image aperture can still enter.
    const entranceHosts = new Map();
    entranceTargets.forEach(el => {
      const host = el.matches('.footer-display') ? el : el.parentElement;
      const list = entranceHosts.get(host) || [];
      list.push(el);
      entranceHosts.set(host, list);
    });
    const depthObserver = new IntersectionObserver(entries => entries.forEach(e => {
      entranceHosts.get(e.target).forEach(el => {
        if (e.isIntersecting) {
          el.classList.add('impact-revealed');
          if (el.classList.contains('impact-media')) visibleDepthMedia.add(el);
        } else visibleDepthMedia.delete(el);
      });
    }), { rootMargin:'0px 0px -4% 0px', threshold:0.04 });
    entranceHosts.forEach((_, host) => depthObserver.observe(host));
  } else entranceTargets.forEach(el => el.classList.add('impact-revealed'));

  // Card depth is pointer-driven and only enabled for a precise pointer.
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.values-grid article, .people-card, .system-deliverables article, .workflow-image').forEach(card => {
      card.classList.add('impact-card');
      let pending = false, px = 0.5, py = 0.5;
      card.addEventListener('pointermove', e => {
        if (reduced) return;
        const r = card.getBoundingClientRect();
        px = clamp((e.clientX - r.left) / r.width);
        py = clamp((e.clientY - r.top) / r.height);
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          if (reduced) return;
          card.style.setProperty('--light-x', `${(px * 100).toFixed(1)}%`);
          card.style.setProperty('--light-y', `${(py * 100).toFixed(1)}%`);
          card.style.setProperty('--card-tilt', `${((px - py) * 2).toFixed(2)}deg`);
        });
      }, {passive:true});
      card.addEventListener('pointerleave', () => card.style.setProperty('--card-tilt', '0deg'));
    });
  }

  // Spatial studies for the original Lean method and deployment boundaries.
  const immersiveScenes = [...document.querySelectorAll('.immersive')];
  const visibleImmersive = new Set();
  const bindSpatialTabs = (host, buttonSelector, panelSelector, update, onManual = () => {}) => {
    const buttons = [...host.querySelectorAll(buttonSelector)];
    const panels = [...host.querySelectorAll(panelSelector)];
    const select = (index, focus = false) => {
      buttons.forEach((b, i) => {
        b.setAttribute('aria-selected', String(i === index));
        b.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach((p, i) => { p.hidden = i !== index; });
      update(index, buttons[index]);
      if (focus) buttons[index].focus();
    };
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => { onManual(); select(i); });
      b.addEventListener('keydown', e => {
        let next;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % buttons.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + buttons.length) % buttons.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = buttons.length - 1;
        if (next === undefined) return;
        e.preventDefault();
        onManual();
        select(next, true);
      });
    });
    return select;
  };
  const refinery = document.querySelector('[data-refinery]');
  let refineryTimer, refineryAuto = true, selectRefinery;
  const refAutoButton = refinery?.querySelector('[data-ref-autoplay]');
  const refreshRefinery = () => {
    clearTimeout(refineryTimer);
    if (!refinery || !refineryAuto || reduced || !visibleImmersive.has(refinery)) return;
    refineryTimer = setTimeout(() => {
      selectRefinery((Number(refinery.dataset.phase) + 1) % 6);
      refreshRefinery();
    }, 4800);
  };
  const setRefineryAuto = value => {
    refineryAuto = value;
    refAutoButton.setAttribute('aria-pressed', String(value));
    refAutoButton.setAttribute('aria-label', value ? 'Pause process sequence' : 'Play process sequence');
    refAutoButton.querySelector('span').textContent = value ? 'Auto sequence' : 'Play sequence';
    refreshRefinery();
  };
  if (refinery) selectRefinery = bindSpatialTabs(refinery, '[data-ref-step]', '[data-ref-panel]', (index, button) => {
    refinery.dataset.phase = index;
    refinery.style.setProperty('--order', (index / 5).toFixed(3));
    refinery.querySelector('[data-ref-caption]').textContent = button.dataset.caption;
  }, () => setRefineryAuto(false));
  refAutoButton?.addEventListener('click', () => setRefineryAuto(!refineryAuto));
  const atlas = document.querySelector('[data-atlas]');
  if (atlas) bindSpatialTabs(atlas, '[data-boundary-choice]', '[data-boundary-panel]', (index, button) => {
    atlas.dataset.boundary = index;
    atlas.querySelector('[data-boundary-caption]').textContent = button.dataset.caption;
    atlas.querySelector('[data-boundary-label]').textContent = button.dataset.label;
  });
  if ('IntersectionObserver' in window) {
    const spatialObserver = new IntersectionObserver(entries => entries.forEach(e => {
      e.target.classList.toggle('is-visible', e.isIntersecting);
      if (e.isIntersecting) visibleImmersive.add(e.target);
      else visibleImmersive.delete(e.target);
      if (e.target === refinery) refreshRefinery();
    }), {threshold:0});
    immersiveScenes.forEach(scene => spatialObserver.observe(scene));
  } else immersiveScenes.forEach(scene => { scene.classList.add('is-visible'); visibleImmersive.add(scene); });
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) immersiveScenes.forEach(scene => {
    let pending = false, sx = 0, sy = 0;
    scene.addEventListener('pointermove', e => {
      if (reduced) return;
      const r = scene.getBoundingClientRect();
      sx = clamp((e.clientX - r.left) / r.width - .5, -.5, .5) * 8;
      sy = clamp((e.clientY - r.top) / r.height - .5, -.5, .5) * -6;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        if (reduced) return;
        scene.style.setProperty('--scene-x', `${sx.toFixed(2)}deg`);
        scene.style.setProperty('--scene-y', `${sy.toFixed(2)}deg`);
      });
    }, {passive:true});
    scene.addEventListener('pointerleave', () => {
      scene.style.setProperty('--scene-x', '0deg');
      scene.style.setProperty('--scene-y', '0deg');
    });
  });

  // Scroll: the cover drifts and dims, bands open to full bleed, the masthead
  // settles onto the sheet past the cover, the zone rail lights its letter.
  const cover = document.querySelector('.cover');
  const mast = document.querySelector('.masthead');
  const bands = [...document.querySelectorAll('.band')];
  const links = new Map([...document.querySelectorAll('[data-zone-link]')].map((a) => [a.dataset.zoneLink, a]));
  const zones = [...document.querySelectorAll('[data-zone]')].filter((z) => links.has(z.id));
  const progress = document.querySelector('.brand-progress');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const vh = innerHeight;
    for (const scene of visibleImmersive) {
      const r = scene.getBoundingClientRect();
      scene.style.setProperty('--scene-scroll', reduced ? '0' : clamp((vh / 2 - r.top - r.height / 2) / vh, -1, 1).toFixed(3));
      if (reduced) {
        scene.style.setProperty('--scene-x', '0deg');
        scene.style.setProperty('--scene-y', '0deg');
      }
    }
    if (cover) {
      const h = cover.offsetHeight;
      if (!reduced) cover.style.setProperty('--hs', clamp(scrollY / h).toFixed(4));
      mast?.classList.toggle('is-over', scrollY < h - (mast?.offsetHeight || 64));
      body.classList.toggle('at-cover', scrollY < h * 0.6);
    }
    if (!reduced) for (const b of bands) {
      const r = b.getBoundingClientRect();
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) continue;
      b.style.setProperty('--bp', clamp((vh - r.top) / (vh * 0.8)).toFixed(4));
      b.style.setProperty('--bq', clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1).toFixed(4));
    }
    for (const media of visibleDepthMedia) {
      const r = media.getBoundingClientRect();
      const travel = innerWidth <= 720 ? 16 : 32;
      const shift = reduced ? 0 : clamp((vh / 2 - r.top - r.height / 2) / vh, -1, 1) * travel;
      media.style.setProperty('--media-shift', `${shift.toFixed(1)}px`);
    }
    const line = vh * 0.35;
    let current = zones[0];
    for (const z of zones) if (z.getBoundingClientRect().top <= line) current = z;
    links.forEach((a, id) => a.classList.toggle('is-on', current && id === current.id));
    const max = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // ── Landing aerial: pointer depth and a live grid reference ───────────
  const home = document.querySelector('.cover-home');
  const gridref = document.querySelector('[data-gridref]');
  if (home && !reduced && matchMedia('(pointer: fine)').matches) {
    home.addEventListener('pointermove', (e) => {
      const r = home.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      home.style.setProperty('--mx', ((x - 0.5) * 2).toFixed(3));
      home.style.setProperty('--my', ((y - 0.5) * 2).toFixed(3));
      if (gridref) gridref.textContent = `${'ABCDEFGH'[Math.min(7, Math.floor(y * 8))]} · ${String(Math.min(12, Math.floor(x * 12) + 1)).padStart(2, '0')}`;
    }, { passive: true });
    home.addEventListener('pointerleave', () => { home.style.setProperty('--mx', 0); home.style.setProperty('--my', 0); });
  }

  // ── Ticker: runs faster with the scroll, and turns with its direction ──
  const tickAnim = document.querySelector('.ticker-track')?.getAnimations?.()[0];
  let lastY = scrollY, vel = 0, dir = 1;
  if (tickAnim) {
    const spin = () => {
      const dy = scrollY - lastY; lastY = scrollY;
      if (Math.abs(dy) > 0.5) dir = dy > 0 ? 1 : -1;
      vel += (Math.min(Math.abs(dy), 80) / 8 - vel) * 0.08;
      tickAnim.playbackRate = reduced || document.hidden ? 0 : dir * (1 + vel);
      requestAnimationFrame(spin);
    };
    requestAnimationFrame(spin);
  }

  // ── Systems list: the row's photograph follows the pointer ─────────────
  const follow = document.querySelector('.follow');
  const followList = document.querySelector('[data-follow-list]');
  if (follow && followList && !reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const shots = new Map([...follow.querySelectorAll('[data-follow]')].map((el) => [el.dataset.follow, el]));
    let tx = 0, ty = 0, fx = 0, fy = 0, on = false, raf = 0;
    const loop = () => {
      const px = fx; fx += (tx - fx) * 0.14; fy += (ty - fy) * 0.14;
      follow.style.setProperty('--fx', `${fx.toFixed(1)}px`);
      follow.style.setProperty('--fy', `${fy.toFixed(1)}px`);
      follow.style.setProperty('--fr', `${clamp((fx - px) * 0.25, -8, 8).toFixed(2)}deg`);
      raf = on || Math.abs(tx - fx) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    followList.querySelectorAll('.sysrow').forEach((row) => {
      row.addEventListener('pointerenter', () => { shots.forEach((el, k) => el.classList.toggle('is-on', k === row.dataset.slug)); });
    });
    followList.addEventListener('pointermove', (e) => {
      tx = e.clientX + 28; ty = e.clientY - 110;
      if (!on) { on = true; if (!fx) { fx = tx; fy = ty; } follow.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    followList.addEventListener('pointerleave', () => { on = false; follow.classList.remove('is-on'); });
  }

  // ── Accordion: hover or press opens a system ───────────────────────────
  document.querySelectorAll('[data-acc]').forEach((acc) => {
    const items = [...acc.querySelectorAll('[data-acc-item]')];
    const open = (it) => items.forEach((x) => {
      x.classList.toggle('is-open', x === it);
      x.querySelector('.acc-tab').setAttribute('aria-expanded', String(x === it));
      x.querySelector('.acc-panel').inert = x !== it;
    });
    open(items.find(it => it.classList.contains('is-open')) || items[0]);
    items.forEach((it) => {
      it.querySelector('.acc-tab').addEventListener('click', () => open(it));
      if (matchMedia('(hover: hover) and (min-width: 961px)').matches) it.addEventListener('pointerenter', () => open(it));
    });
  });

  // ── Scrubbed scenes ────────────────────────────────────────────────────
  const ease = (t) => t * t * (3 - 2 * t);
  const scrubs = [...document.querySelectorAll('[data-scrub]')];
  const pipe = document.querySelector('[data-scrub="pipe"]');
  let pipeData = [], pipeSys = 0;
  try { pipeData = JSON.parse(document.getElementById('pipe-data')?.textContent || '[]'); } catch (e) { /* the first system stays drawn */ }
  const setPipe = (i) => {
    const d = pipeData[i];
    if (!d || !pipe) return;
    pipeSys = i;
    pipe.querySelectorAll('[data-pipe]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.pipe) === i)));
    pipe.querySelectorAll('[data-lab]').forEach((el) => { el.textContent = d.labels[Number(el.dataset.lab)]; });
    pipe.querySelectorAll('.st-gate').forEach((el) => el.classList.toggle('is-rule', Number(el.dataset.st) === d.rule));
    pipe.querySelector('[data-pipe-cap]').textContent = d.caption;
    const link = pipe.querySelector('[data-pipe-link]');
    link.href = `/systems/${d.slug}/`; link.textContent = `${d.name}, sheet DL-10${i + 1} →`;
    pipe.querySelector('.pipe-steps').innerHTML = d.steps.map((st, k) => `<li data-step="${k}" class="st-${st.state}"><span class="mono"></span><p></p></li>`).join('');
    pipe.querySelectorAll('.pipe-steps li').forEach((li, k) => { li.firstChild.textContent = d.steps[k].k; li.lastChild.textContent = d.steps[k].d; });
    scrubTick();
  };
  pipe?.querySelectorAll('[data-pipe]').forEach((b) => b.addEventListener('click', () => setPipe(Number(b.dataset.pipe))));
  const handlers = {
    stack(el, p) {
      el.querySelector('.iso').style.setProperty('--ex', ease(clamp(p * 1.5)).toFixed(3));
      const lit = Math.min(3, Math.floor(clamp(p * 1.25) * 4));
      el.querySelectorAll('.slab').forEach((s) => s.classList.toggle('is-lit', Number(s.dataset.layer) <= lit));
      el.querySelectorAll('.stack-list li').forEach((li) => li.classList.toggle('is-lit', Number(li.dataset.layer) <= lit));
    },
    pipe(el, p) {
      const n = 5, seg = clamp(p) * n * 0.999, idx = Math.floor(seg), f = seg - idx;
      const tp = idx + (idx < n - 1 ? ease(clamp((f - 0.45) / 0.55)) : 0);
      const active = Math.min(n - 1, Math.round(tp));
      const iso = el.querySelector('.iso');
      iso.style.setProperty('--tp', tp.toFixed(3));
      iso.style.setProperty('--held', clamp((tp - 3.55) / 0.45).toFixed(3));
      el.querySelectorAll('.st').forEach((s) => s.classList.toggle('is-on', Number(s.dataset.st) <= active));
      el.querySelectorAll('.pipe-steps li').forEach((li, k) => { li.classList.toggle('is-on', k === active); li.classList.toggle('is-past', k < active); });
    },
  };
  function scrubTick() {
    const vh = innerHeight;
    for (const el of scrubs) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const mobile = matchMedia('(max-width: 960px)').matches;
      const p = reduced ? 1 : mobile ? clamp((vh * .7 - r.top) / Math.max(1, r.height * .65)) : clamp(-r.top / Math.max(1, r.height - vh));
      el.style.setProperty('--sp', p.toFixed(4));
      handlers[el.dataset.scrub]?.(el, p);
    }
  }
  if (scrubs.length) {
    let st = false;
    addEventListener('scroll', () => { if (!st) { st = true; requestAnimationFrame(() => { st = false; scrubTick(); }); } }, { passive: true });
    addEventListener('resize', scrubTick);
    scrubTick();
    // The scenes lean a little toward the pointer.
    if (!reduced && matchMedia('(pointer: fine)').matches) document.querySelectorAll('.iso-scene').forEach((sc) => {
      const iso = sc.querySelector('.iso');
      sc.addEventListener('pointermove', (e) => {
        const r = sc.getBoundingClientRect();
        iso.style.setProperty('--tx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        iso.style.setProperty('--ty', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      }, { passive: true });
      sc.addEventListener('pointerleave', () => { iso.style.setProperty('--tx', 0); iso.style.setProperty('--ty', 0); });
    });
  }


  // Industrial illustrations animate only while visible. All animation uses
  // CSS so the existing motion control and reduced-motion preference apply.
  const industrialScenes = document.querySelectorAll('[data-industrial-motion]');
  if ('IntersectionObserver' in window) {
    const industrialObserver = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('is-active', e.isIntersecting));
    }, {threshold:0.08});
    industrialScenes.forEach(el => industrialObserver.observe(el));
  } else industrialScenes.forEach(el => el.classList.add('is-active'));

  // Cinematic scenes. Automatic changes stop for reduced motion, user focus,
  // a hidden page, or while the cover is outside the viewport.
  const frames = [...document.querySelectorAll('[data-frame]')];
  const sceneButtons = [...document.querySelectorAll('[data-scene]')];
  let sceneIndex = 0, sceneFocused = false, lastScene = performance.now();
  const selectScene = (i) => {
    sceneIndex = i;
    frames.forEach((f, k) => f.classList.toggle('is-active', k === i));
    sceneButtons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    const caption = document.querySelector('[data-scene-caption]');
    if (caption && sceneButtons[i]) caption.textContent = sceneButtons[i].dataset.caption;
    lastScene = performance.now();
  };
  sceneButtons.forEach((b, i) => b.addEventListener('click', () => selectScene(i)));
  const selector = document.querySelector('.scene-select');
  selector?.addEventListener('focusin', () => { sceneFocused = true; });
  selector?.addEventListener('focusout', (e) => { if (!selector.contains(e.relatedTarget)) { sceneFocused = false; lastScene = performance.now(); } });
  selector?.addEventListener('pointerenter', () => { sceneFocused = true; });
  selector?.addEventListener('pointerleave', () => { sceneFocused = selector.contains(document.activeElement); lastScene = performance.now(); });
  if (frames.length) setInterval(() => {
    if (reduced || sceneFocused || document.hidden || !cover || cover.getBoundingClientRect().bottom < 0) { lastScene = performance.now(); return; }
    if (performance.now() - lastScene >= 8000) selectScene((sceneIndex + 1) % frames.length);
  }, 500);

  const syncMotion = () => {
    reduced = pausedByUser || motionPreference.matches;
    root.dataset.motion = reduced ? 'paused' : 'running';
    root.classList.toggle('no-motion', reduced);
    refreshRefinery();
    document.querySelectorAll('[data-motion-toggle]').forEach(b => {
      b.setAttribute('aria-pressed', String(reduced));
      b.setAttribute('aria-label', reduced ? 'Resume motion' : 'Pause motion');
      b.firstElementChild.textContent = reduced ? '▷' : 'Ⅱ';
    });
    lastScene = performance.now();
    scrubTick();
    onScroll();
  };
  document.querySelectorAll('[data-motion-toggle]').forEach(b => b.addEventListener('click', () => {
    pausedByUser = !reduced;
    syncMotion();
  }));
  motionPreference.addEventListener('change', syncMotion);
  syncMotion();

  // Column references: the pointer's column lights in the strip under the
  // masthead, the way you read a coordinate off a drawing.
  const strip = document.querySelector('.colrefs-grid');
  if (strip && matchMedia('(pointer: fine)').matches) {
    const cells = [...strip.children];
    let last = -1;
    addEventListener('pointermove', (e) => {
      const r = strip.getBoundingClientRect();
      const i = e.clientX < r.left || e.clientX > r.right ? -1 : Math.min(11, Math.floor(((e.clientX - r.left) / r.width) * 12));
      if (i === last) return;
      if (last >= 0) cells[last].classList.remove('is-on');
      if (i >= 0) cells[i].classList.add('is-on');
      last = i;
    }, { passive: true });
  }
})();
