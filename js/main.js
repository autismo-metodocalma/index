(() => {
  'use strict';

  const HOTMART_URL = 'https://pay.hotmart.com/S105475830S?checkoutMode=10&bid=1779497014909';
  const SHOPIFY_URL = 'https://metodo-calma-argentina.impultienda.ar/checkout/metodo-calma-embudo-principal';
  const STORAGE_KEY = 'metodoCalmaCountry';

  const regionModal = document.getElementById('region-modal');
  const argentinaButton = document.getElementById('country-argentina');
  const internationalButton = document.getElementById('country-international');
  const vimeoFrame = document.getElementById('calma-vimeo');
  const videoWrap = document.getElementById('calma-video-wrap');
  const vimeoPlayer = (vimeoFrame && window.Vimeo) ? new Vimeo.Player(vimeoFrame) : null;
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutModalClose = document.getElementById('checkout-modal-close');

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

   
  function checkoutFor(countryCode) {
    return countryCode === 'AR' ? SHOPIFY_URL : HOTMART_URL;
  }

  function applyCheckout(countryCode) {
  const destination = checkoutFor(countryCode);

  document.querySelectorAll(
    'a[href*="pay.hotmart.com"]:not(.checkout-option), a.checkout-link:not(.checkout-option)'
  ).forEach((link) => {
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

  if (argentinaButton) {

  argentinaButton.addEventListener('click', () => {

    const country = 'AR';

    localStorage.setItem(STORAGE_KEY, country);

    document.documentElement.classList.add('market-saved');

    applyCheckout(country);

    closeRegionModal();

    playLandingVideo();

    if (window.fbq) {
      fbq('trackCustom', 'CountrySelected', {
        country: 'AR'
      });
    }

  });

}


if (internationalButton) {

  internationalButton.addEventListener('click', () => {

    const country = 'INT';

    localStorage.setItem(STORAGE_KEY, country);

    document.documentElement.classList.add('market-saved');

    applyCheckout(country);

    closeRegionModal();

    playLandingVideo();

    if (window.fbq) {
      fbq('trackCustom', 'CountrySelected', {
        country: 'INT'
      });
    }

  });

}


  document.querySelectorAll(
  'a[href*="pay.hotmart.com"]:not(.checkout-option), a.checkout-link:not(.checkout-option)'
).forEach((link) => {

  link.addEventListener('click', (event) => {

    event.preventDefault();

    if (window.fbq) {
      fbq('trackCustom', 'CheckoutClick');
    }

    openCheckoutModal();

  });

});

if (checkoutModalClose) {

  checkoutModalClose.addEventListener('click', () => {
    closeCheckoutModal();
  });

}


if (checkoutModal) {

  checkoutModal.addEventListener('click', (event) => {

    if (event.target === checkoutModal) {
      closeCheckoutModal();
    }

  });

}


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