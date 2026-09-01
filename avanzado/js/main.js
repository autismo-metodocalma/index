(() => {
  'use strict';

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const mobileButton = document.querySelector('.mobile-buy');
  const checkout = document.querySelector('#comprar');
  if (mobileButton && checkout && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      mobileButton.classList.toggle('is-hidden', entry.isIntersecting);
    }, { threshold: 0.15 });
    observer.observe(checkout);
  }

  document.querySelectorAll('img').forEach(image => {
    image.addEventListener('dragstart', event => event.preventDefault());
  });

  document.querySelectorAll('.primary-button, .header-cta, .mobile-buy').forEach(button => {
    button.addEventListener('click', () => {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'CalmaCTA', { label: button.textContent.trim() });
      }
    });
  });
})();
