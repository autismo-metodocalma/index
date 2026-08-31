(() => {
  'use strict';

  // Animaciones suaves al entrar en pantalla.
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.10,
      rootMargin: '0px 0px -7% 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // Evita arrastrar accidentalmente las imágenes.
  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('dragstart', (event) => event.preventDefault());
  });
})();
