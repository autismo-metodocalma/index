(() => {
  'use strict';

  /* =========================================================
     CHECKOUT POR REGIÓN
     ========================================================= */

  const HOTMART_URL =
    'https://pay.hotmart.com/S105475830S?checkoutMode=10&bid=1779497014909';

  // TEMPORAL: Argentina también usa Hotmart.
  // Cuando tengas Shopify, cambiá SOLO esta línea.
  const SHOPIFY_URL = HOTMART_URL;

  const STORAGE_KEY = 'metodoCalmaCountry';

  /* =========================================================
     MÉTRICAS META PIXEL
     ========================================================= */

  function trackMetaEvent(eventName, params = {}) {
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, {
        ...params,
        page_path: window.location.pathname,
        page_title: document.title
      });
    }

    console.log('[Meta Pixel]', eventName, params);
  }

  /* =========================================================
     SELECTOR DE REGIÓN + LOCALSTORAGE
     ========================================================= */

  const regionModal = document.getElementById('region-modal');
  const countrySelect = document.getElementById('country-select');
  const continueButton = document.getElementById('region-continue');

  let selectedCountry = '';

  function checkoutFor(countryCode) {
    return countryCode === 'AR'
      ? SHOPIFY_URL
      : HOTMART_URL;
  }

  function applyCheckout(countryCode) {
    const destination = checkoutFor(countryCode);

    document
      .querySelectorAll('a[href*="pay.hotmart.com"], a.checkout-link')
      .forEach((link, index) => {
        link.href = destination;
        link.classList.add('checkout-link');

        if (!link.dataset.checkoutPosition) {
          link.dataset.checkoutPosition = String(index + 1);
        }
      });

    document.documentElement.dataset.country = countryCode;
  }

  function closeRegionModal() {
    if (!regionModal) return;

    regionModal.classList.add('is-hidden');
    document.body.classList.remove('region-locked');
  }

  const savedCountry = localStorage.getItem(STORAGE_KEY);

  if (savedCountry) {
    selectedCountry = savedCountry;
    applyCheckout(savedCountry);
    closeRegionModal();
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

      selectedCountry = country;

      localStorage.setItem(STORAGE_KEY, country);

      trackMetaEvent('country_selected', {
        country_code: country,
        checkout_provider:
          country === 'AR' && SHOPIFY_URL !== HOTMART_URL
            ? 'shopify'
            : 'hotmart'
      });

      applyCheckout(country);
      closeRegionModal();
    });
  }

  /* =========================================================
     CLICK EN COMPRA
     ========================================================= */

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.checkout-link');

    if (!link) return;

    trackMetaEvent('checkout_click', {
      country_code:
        selectedCountry ||
        document.documentElement.dataset.country ||
        'unknown',

      checkout_position:
        link.dataset.checkoutPosition || 'unknown',

      checkout_text:
        (link.textContent || '').trim().slice(0, 100),

      checkout_url:
        link.href
    });
  });

  /* =========================================================
     SCROLL 25 / 50 / 75 / 100
     ========================================================= */

  const reachedScrollDepths = new Set();

  function trackScrollDepth() {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      0;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (documentHeight <= 0) return;

    const percent = Math.min(
      100,
      Math.round((scrollTop / documentHeight) * 100)
    );

    [25, 50, 75, 100].forEach((depth) => {
      if (
        percent >= depth &&
        !reachedScrollDepths.has(depth)
      ) {
        reachedScrollDepths.add(depth);

        trackMetaEvent('scroll_depth', {
          percent_scrolled: depth,
          country_code:
            selectedCountry ||
            document.documentElement.dataset.country ||
            'unknown'
        });
      }
    });
  }

  let scrollScheduled = false;

  window.addEventListener(
    'scroll',
    () => {
      if (scrollScheduled) return;

      scrollScheduled = true;

      window.requestAnimationFrame(() => {
        trackScrollDepth();
        scrollScheduled = false;
      });
    },
    { passive: true }
  );

  /* =========================================================
     TIEMPO EN PÁGINA
     ========================================================= */

  [30, 60, 120, 300].forEach((seconds) => {
    window.setTimeout(() => {
      trackMetaEvent('time_on_page', {
        seconds,
        country_code:
          selectedCountry ||
          document.documentElement.dataset.country ||
          'unknown'
      });
    }, seconds * 1000);
  });

  /* =========================================================
     PANEL MÁS PROFUNDO VISTO
     ========================================================= */

  let deepestPanel = 0;

  if ('IntersectionObserver' in window) {
    const panelObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const panelNumber =
              Number(entry.target.dataset.panel) || 0;

            if (panelNumber > deepestPanel) {
              deepestPanel = panelNumber;

              trackMetaEvent('panel_view', {
                panel_number: panelNumber,
                panel_id: entry.target.id || '',
                country_code:
                  selectedCountry ||
                  document.documentElement.dataset.country ||
                  'unknown'
              });
            }
          });
        },
        {
          threshold: 0.35
        }
      );

    document
      .querySelectorAll('[data-panel]')
      .forEach((panel) =>
        panelObserver.observe(panel)
      );
  }

  /* =========================================================
     ANIMACIONES EXISTENTES
     ========================================================= */

  document.body.classList.add('js-ready');

  const panels =
    [...document.querySelectorAll('[data-panel]')];

  panels.forEach((panel) => {
    const shell =
      panel.querySelector(':scope > .shell');

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

      const grouped =
        element.querySelectorAll(
          ':scope > article, :scope > blockquote, :scope > p, :scope > details'
        );

      grouped.forEach(
        (child, childIndex) => {
          child.dataset.reveal =
            childIndex % 2 === 0
              ? 'up'
              : 'fade';

          child.style.setProperty(
            '--reveal-delay',
            `${Math.min(
              120 + childIndex * 105,
              600
            )}ms`
          );
        }
      );
    });
  });

  const revealElements =
    [...document.querySelectorAll('[data-reveal]')];

  if ('IntersectionObserver' in window) {
    const observer =
      new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              'is-visible'
            );

            obs.unobserve(entry.target);
          });
        },
        {
          root: null,
          threshold: 0.12,
          rootMargin: '0px 0px -8% 0px'
        }
      );

    revealElements.forEach((element) =>
      observer.observe(element)
    );
  } else {
    revealElements.forEach((element) =>
      element.classList.add('is-visible')
    );
  }

  /* =========================================================
     FAQ
     ========================================================= */

  document
    .querySelectorAll('details')
    .forEach((detail) => {
      detail.addEventListener(
        'toggle',
        () => {
          if (!detail.open) return;

          document
            .querySelectorAll('details[open]')
            .forEach((other) => {
              if (other !== detail) {
                other.open = false;
              }
            });
        }
      );
    });
})();
