(() => {
  'use strict';

  const HOTMART_URL = 'https://pay.hotmart.com/S105475830S?checkoutMode=10&bid=1779497014909';
  const SHOPIFY_URL = 'https://12qrkf-eg.myshopify.com/products/cuando-el-diagnostico-cambia-todo';
  const STORAGE_KEY = 'metodoCalmaCountry';

  const regionModal = document.getElementById('region-modal');
  const countrySelect = document.getElementById('country-select');
  const continueButton = document.getElementById('region-continue');
  const changeMarketButton = document.getElementById('change-market');
  const vimeoFrame = document.getElementById('calma-vimeo');
  const videoWrap = document.getElementById('calma-video-wrap');
  const vimeoPlayer = (vimeoFrame && window.Vimeo) ? new Vimeo.Player(vimeoFrame) : null;
  const soundButton = document.getElementById('calma-sound-button');

  function revealLandingVideo() {
    if (videoWrap) videoWrap.classList.add('video-is-playing');
  }

  function playLandingVideo() {
    if (!vimeoPlayer) return;
    vimeoPlayer.play().then(revealLandingVideo).catch(() => {});
  }

  function pauseLandingVideo() {
    if (!vimeoPlayer) return;
    vimeoPlayer.pause().catch(() => {});
  }

  if (vimeoPlayer) {
    vimeoPlayer.on('play', revealLandingVideo);
    vimeoPlayer.on('pause', () => {
      // Si el usuario ya inició el video, dejamos los controles visibles.
      if (videoWrap) videoWrap.classList.add('video-is-playing');
    });
  }

  function activateLandingSound() {
  if (!vimeoPlayer) return;

  Promise.all([
    vimeoPlayer.getCurrentTime(),
    vimeoPlayer.getPaused()
  ])
  .then(([currentTime, wasPaused]) => {

    return vimeoPlayer.setVolume(1).then(() => {

      if (!wasPaused) {
        return vimeoPlayer.setCurrentTime(currentTime)
          .then(() => vimeoPlayer.play());
      }

    });

  })
  .then(() => {

    if (soundButton) {
      soundButton.textContent = '🔇 SILENCIAR';
      soundButton.setAttribute('aria-label', 'Silenciar video');
      soundButton.classList.add('sound-on');
    }

  })
  .catch((error) => {
    console.log('No se pudo activar el sonido:', error);
  });
}


function muteLandingVideo() {
  if (!vimeoPlayer) return;

  vimeoPlayer.setVolume(0)
    .then(() => {

      if (soundButton) {
        soundButton.textContent = '🔊 ACTIVAR SONIDO';
        soundButton.setAttribute('aria-label', 'Activar sonido');
        soundButton.classList.remove('sound-on');
      }

    })
    .catch(() => {});
}

  function checkoutFor(countryCode) {
    return countryCode === 'AR' ? SHOPIFY_URL : HOTMART_URL;
  }

  function applyCheckout(countryCode) {
    const destination = checkoutFor(countryCode);

    document.querySelectorAll('a[href*="pay.hotmart.com"], a.checkout-link').forEach((link) => {
      link.href = destination;
      link.classList.add('checkout-link');
    });

    document.documentElement.dataset.country = countryCode;
  }

  function closeRegionModal() {
    if (!regionModal) return;
    regionModal.classList.add('is-hidden');
    regionModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('region-locked');
  }

  function openRegionModal() {
    if (!regionModal) return;
    regionModal.classList.remove('is-hidden');
    regionModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('region-locked');
  }

  const savedCountry = localStorage.getItem(STORAGE_KEY);

  if (savedCountry) {
    applyCheckout(savedCountry);
    closeRegionModal();
    playLandingVideo();
  } else if (regionModal) {
    document.body.classList.add('region-locked');
  }

  if (countrySelect && continueButton) {
    countrySelect.addEventListener('change', () => {
      continueButton.disabled = !countrySelect.value;
    });

    continueButton.addEventListener('click', () => {
      const country = countrySelect.value;
      if (!country) return;

      localStorage.setItem(STORAGE_KEY, country);
      document.documentElement.classList.add('market-saved');
      applyCheckout(country);
      closeRegionModal();
      playLandingVideo();

      if (window.fbq) {
        fbq('trackCustom', 'CountrySelected', { country });
      }
    });
  }

  if (changeMarketButton && regionModal) {
    changeMarketButton.addEventListener('click', () => {
      pauseLandingVideo();

      document.documentElement.classList.remove('market-saved');
      const currentCountry = localStorage.getItem(STORAGE_KEY);

      if (currentCountry && countrySelect) {
        countrySelect.value = currentCountry;
        if (continueButton) continueButton.disabled = false;
      }

      openRegionModal();
    });
  }

  document.querySelectorAll('a[href*="pay.hotmart.com"], a.checkout-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.fbq) fbq('trackCustom', 'CheckoutClick');
    });
  });

  document.body.classList.add('js-ready');

  const panels = [...document.querySelectorAll('[data-panel]')];

  panels.forEach((panel) => {
    const candidates = [...panel.querySelectorAll(':scope .section-shell > *, :scope .hero-shell > *, :scope .about-layout > *, :scope .faq-card > *')];
    candidates.forEach((element, index) => {
      if (element.matches('script,style')) return;
      element.dataset.reveal = 'up';
      element.style.setProperty('--reveal-delay', `${Math.min(index * 80, 480)}ms`);
    });
  });

  const revealElements = [...document.querySelectorAll('[data-reveal]')];

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, {
      root: null,
      threshold: 0.10,
      rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;

      document.querySelectorAll('details[open]').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });
})();
