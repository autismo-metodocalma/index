(() => {
  'use strict';

  const vimeoFrame = document.getElementById('calma-vimeo');
  const videoWrap = document.getElementById('calma-video-wrap');
  const vimeoPlayer = (vimeoFrame && window.Vimeo)
    ? new Vimeo.Player(vimeoFrame)
    : null;

  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutModalClose = document.getElementById('checkout-modal-close');


  /* =========================
     VIDEO
  ========================= */

  function revealLandingVideo() {
    if (videoWrap) {
      videoWrap.classList.add('video-is-playing');
    }
  }

  function playLandingVideo() {
    if (!vimeoPlayer) return;

    vimeoPlayer
      .play()
      .then(revealLandingVideo)
      .catch(() => {});
  }

  if (vimeoPlayer) {

    vimeoPlayer.on('play', revealLandingVideo);

    vimeoPlayer.on('pause', () => {
      if (videoWrap) {
        videoWrap.classList.add('video-is-playing');
      }
    });

  }


  /* =========================
     MODAL CHECKOUT
  ========================= */

  function openCheckoutModal() {

    if (!checkoutModal) return;

    checkoutModal.classList.add('is-open');
    checkoutModal.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

  }


  function closeCheckoutModal() {

    if (!checkoutModal) return;

    checkoutModal.classList.remove('is-open');
    checkoutModal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

  }


  /*
    TODOS LOS BOTONES DE COMPRA
    ABREN EL MODAL
  */

  document.querySelectorAll(
  'a.checkout-link:not(.checkout-option), a[href*="pay.hotmart.com"]:not(.checkout-option)'
).forEach((link) => {

    link.addEventListener('click', (event) => {

      event.preventDefault();

      if (window.fbq) {
        fbq('trackCustom', 'CheckoutClick');
      }

      openCheckoutModal();

    });

  });


  /*
    CERRAR CON LA X
  */

  if (checkoutModalClose) {

    checkoutModalClose.addEventListener('click', () => {
      closeCheckoutModal();
    });

  }


  /*
    CERRAR TOCANDO FUERA
  */

  if (checkoutModal) {

    checkoutModal.addEventListener('click', (event) => {

      if (event.target === checkoutModal) {
        closeCheckoutModal();
      }

    });

  }


  /*
    EVENTO META PIXEL
    CUANDO ELIGE PAÍS
  */

  document.querySelectorAll('.checkout-option').forEach((option) => {

    option.addEventListener('click', () => {

      if (window.fbq) {

        const country =
          option.classList.contains('checkout-option-ar')
            ? 'AR'
            : 'OTHER';

        fbq('trackCustom', 'CheckoutCountrySelected', {
          country
        });

      }

    });

  });


  /* =========================
     ANIMACIONES
  ========================= */

  document.body.classList.add('js-ready');

  const panels = [...document.querySelectorAll('[data-panel]')];

  panels.forEach((panel) => {

    const candidates = [
      ...panel.querySelectorAll(
        ':scope .section-shell > *, :scope .hero-shell > *, :scope .about-layout > *, :scope .faq-card > *'
      )
    ];

    candidates.forEach((element, index) => {

      if (element.matches('script,style')) return;

      element.dataset.reveal = 'up';

      element.style.setProperty(
        '--reveal-delay',
        `${Math.min(index * 80, 480)}ms`
      );

    });

  });


  const revealElements = [
    ...document.querySelectorAll('[data-reveal]')
  ];


  if ('IntersectionObserver' in window) {

    const observer = new IntersectionObserver(
      (entries, obs) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');

          obs.unobserve(entry.target);

        });

      },
      {
        root: null,
        threshold: 0.10,
        rootMargin: '0px 0px -8% 0px'
      }
    );


    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add('is-visible');
    });

  }


  /* =========================
     FAQ
  ========================= */

  document.querySelectorAll('details').forEach((detail) => {

    detail.addEventListener('toggle', () => {

      if (!detail.open) return;

      document.querySelectorAll('details[open]').forEach((other) => {

        if (other !== detail) {
          other.open = false;
        }

      });

    });

  });

})();