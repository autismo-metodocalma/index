(() => {
  'use strict';

  document.body.classList.add('js-ready');

  const panels = [...document.querySelectorAll('[data-panel]')];
  const revealSelector = [
    ':scope > .shell > h1',
    ':scope > .shell > h2',
    ':scope > .shell > .kicker',
    ':scope > .shell > .intro',
    ':scope > .shell > p',
    ':scope > .shell > figure',
    ':scope > .shell > img',
    ':scope > .shell > .video-wrap',
    ':scope > .shell > .hero-copy',
    ':scope > .shell > .badges',
    ':scope > .shell > .btn',
    ':scope > .shell > div:not(.shell)'
  ].join(',');

  panels.forEach((panel) => {
    const shell = panel.querySelector(':scope > .shell');
    if (!shell) return;

    // Elementos principales de cada panel, sin duplicar descendientes.
    const candidates = [...shell.children];
    let step = 0;

    candidates.forEach((element, index) => {
      if (element.matches('script,style')) return;

      let effect = 'up';
      if (element.matches('h1,h2,.kicker')) effect = 'fade';
      if (element.matches('img,figure,.video-wrap,.kit-image-box,.final-kit-frame')) effect = 'zoom';
      if (element.matches('.about-portrait')) effect = 'left';
      if (element.matches('.about-copy')) effect = 'right';

      element.dataset.reveal = effect;
      element.style.setProperty('--reveal-delay', `${Math.min(step * 95, 475)}ms`);
      step += 1;

      // Grillas y grupos: cada tarjeta aparece de manera escalonada.
      const grouped = element.querySelectorAll(':scope > article, :scope > blockquote, :scope > p, :scope > details');
      grouped.forEach((child, childIndex) => {
        child.dataset.reveal = childIndex % 2 === 0 ? 'up' : 'fade';
        child.style.setProperty('--reveal-delay', `${Math.min(120 + childIndex * 105, 600)}ms`);
      });
    });
  });

  const revealElements = [...document.querySelectorAll('[data-reveal]')];

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  revealElements.forEach((element) => observer.observe(element));

  // Acordeón: deja abierta solo una pregunta por vez.
  document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('details[open]').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });
})();
