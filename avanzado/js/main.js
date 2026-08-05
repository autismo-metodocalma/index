(() => {
  'use strict';

  document.querySelectorAll('.page-section img').forEach((image) => {
    image.addEventListener('dragstart', (event) => event.preventDefault());
  });

  const mobileButton = document.querySelector('.mobile-buy');
  const lastSection = document.querySelector('.page-section:last-child');

  if (mobileButton && lastSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      mobileButton.classList.toggle(
        'is-hidden',
        entry.isIntersecting && entry.intersectionRatio > 0.62
      );
    }, {
      threshold:[0.62]
    });

    observer.observe(lastSection);
  }
})();
