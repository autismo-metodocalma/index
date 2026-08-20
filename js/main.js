(() => {
  'use strict';

  const HOTMART_URL = 'https://pay.hotmart.com/S105475830S?checkoutMode=10&bid=1779497014909';
  const SHOPIFY_URL = 'https://12qrkf-eg.myshopify.com/products/cuando-el-diagnostico-cambia-todo';
  const STORAGE_KEY = 'metodoCalmaCountry';

  const regionModal = document.getElementById('region-modal');
  const countrySelect = document.getElementById('country-select');
  const continueButton = document.getElementById('region-continue');
  const changeMarketButton = document.getElementById('change-market');

  /* =========================================================
     VIMEO
     ========================================================= */

  const vimeoIframe = document.getElementById('vimeo-player');

  const vimeoPlayer = vimeoIframe && window.Vimeo
    ? new Vimeo.Player(vimeoIframe)
    : null;

  function playVimeo(withSound = false) {
    if (!vimeoPlayer) return;

    const playPromise = withSound
      ? vimeoPlayer.setMuted(false).then(() => vimeoPlayer.play())
      : vimeoPlayer.play();

    playPromise.catch((error) => {
      console.warn('Vimeo no pudo iniciar:', error);
    });
  }

  /* =========================================================
     CHECKOUT
     ========================================================= */

  function checkoutFor(countryCode) {
    return countryCode === 'AR'
      ? SHOPIFY_URL
      : HOTMART_URL;
  }

  function applyCheckout(countryCode) {
    const destination = checkoutFor(countryCode);

    document
      .querySelectorAll('a[href*="pay.hotmart.com"], a.checkout-link')
      .forEach((link) => {
        link.href = destination;
        link.classList.add('checkout-link');
      });

    document.documentElement.dataset.country = countryCode;
  }

  /* =========================================================
     MODAL DE REGIÓN
     ========================================================= */

  function closeRegionModal() {
    if (!regionModal) return;

    regionModal.classList.add('is-hidden');
    document.body.classList.remove('region-locked');
  }

  let savedCountry = null;

  try {
    savedCountry = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn('No se pudo acceder a localStorage.');
  }

  /* =========================================================
     PAÍS YA ELEGIDO
     ========================================================= */

  if (savedCountry) {

    applyCheckout(savedCountry);
    closeRegionModal();

    /*
     * SEGUNDA VISITA:
     *
     * No aparece el selector.
     * Intentamos reproducir automáticamente con sonido.
     */
    if (vimeoPlayer) {
      vimeoPlayer.ready().then(() => {
        playVimeo(true);
      });
    }

  } else if (regionModal) {

    /*
     * PRIMERA VISITA:
     *
     * El selector queda abierto.
     * El video NO se reproduce.
     */
    document.body.classList.add('region-locked');
  }

  /* =========================================================
     SELECCIÓN DE PAÍS
     ========================================================= */

  if (countrySelect && continueButton) {

    countrySelect.addEventListener('change', () => {
      continueButton.disabled = !countrySelect.value;
    });

    continueButton.addEventListener('click', () => {

      const country = countrySelect.value;

      if (!country) return;

      try {
        localStorage.setItem(STORAGE_KEY, country);
      } catch (e) {
        console.warn('No se pudo guardar el país.');
      }

      document.documentElement.classList.add('market-saved');

      applyCheckout(country);
      closeRegionModal();

      /*
       * PRIMERA VISITA DESPUÉS DE ELEGIR PAÍS:
       *
       * Este click del usuario habilita el intento de
       * reproducción con sonido.
       */
      if (vimeoPlayer) {
        vimeoPlayer.ready().then(() => {
          playVimeo(true);
        });
      }
    });
  }

  /* =========================================================
     CAMBIAR PAÍS / MERCADO
     ========================================================= */

  if (changeMarketButton && regionModal) {

    changeMarketButton.addEventListener('click', () => {

      document.documentElement.classList.remove('market-saved');

      let currentCountry = null;

      try {
        currentCountry = localStorage.getItem(STORAGE_KEY);
      } catch (e) {}

      if (currentCountry && countrySelect) {

        countrySelect.value = currentCountry;

        if (continueButton) {
          continueButton.disabled = false;
        }
      }

      regionModal.classList.remove('is-hidden');
      document.body.classList.add('region-locked');
    });
  }

  /* =========================================================
     ANIMACIONES
     ========================================================= */

  document.body.classList.add('js-ready');

  const panels = [...document.querySelectorAll('[data-panel]')];

  panels.forEach((panel) => {

    const shell = panel.querySelector(':scope > .shell');

    if (!shell) return;

    const candidates = [...shell.children];
    let step = 0;

    candidates.forEach((element) => {

      if (element.matches('script,style')) return;

      let effect = 'up';

      if (element.matches('h1,h2,.kicker')) {
        effect = 'fade';
      }

      if (
        element.matches(
          'img,figure,.video-wrap,.kit-image-box,.final-kit-frame'
        )
      ) {
        effect = 'zoom';
      }

      if (element.matches('.about-portrait')) {
        effect = 'left';
      }

      if (element.matches('.about-copy')) {
        effect = 'right';
      }

      element.dataset.reveal = effect;

      element.style.setProperty(
        '--reveal-delay',
        `${Math.min(step * 95, 475)}ms`
      );

      step += 1;

      const grouped = element.querySelectorAll(
        ':scope > article, :scope > blockquote, :scope > p, :scope > details'
      );

      grouped.forEach((child, childIndex) => {

        child.dataset.reveal =
          childIndex % 2 === 0 ? 'up' : 'fade';

        child.style.setProperty(
          '--reveal-delay',
          `${Math.min(120 + childIndex * 105, 600)}ms`
        );
      });
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
        threshold: 0.12,
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

  /* =========================================================
     FAQ
     ========================================================= */

  document.querySelectorAll('details').forEach((detail) => {

    detail.addEventListener('toggle', () => {

      if (!detail.open) return;

      document
        .querySelectorAll('details[open]')
        .forEach((other) => {

          if (other !== detail) {
            other.open = false;
          }

        });
    });
  });

})();
