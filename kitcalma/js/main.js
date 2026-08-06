(() => {
  'use strict';
  document.querySelectorAll('.page-section img').forEach((image) => {
    image.addEventListener('dragstart', (event) => event.preventDefault());
  });
})();
