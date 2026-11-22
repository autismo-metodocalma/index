(() => {
  'use strict';

  const vimeoFrame = document.getElementById('calma-vimeo');
  const videoWrap = document.getElementById('calma-video-wrap');
  const vimeoPlayer = (vimeoFrame && window.Vimeo)
    ? new Vimeo.Player(vimeoFrame)
    : null;

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
     PÍXEL DE META: "Pago iniciado"
     Cuando alguien toca un botón de compra, le avisamos a Meta
     (InitiateCheckout) y recién después la llevamos al checkout.
  ========================= */

  function linkConDatosDelAnuncio(href) {
    try {
      const aqui = new URLSearchParams(window.location.search);
      const url = new URL(href);
      aqui.forEach((valor, clave) => {
        if ((/^utm_/i.test(clave) || clave === 'fbclid') && !url.searchParams.has(clave)) {
          url.searchParams.set(clave, valor);
        }
      });
      return url.toString();
    } catch (e) {
      return href;
    }
  }

  document.querySelectorAll('a[data-checkout]').forEach((link) => {

    link.addEventListener('click', (event) => {

      // Si abre en otra pestaña (Ctrl/Cmd + clic), no la frenamos.
      const newTab = event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;

      let sent = false;
      try {
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'InitiateCheckout', {
            value: 19900,
            currency: 'ARS',
            content_name: 'Método CALMA',
            content_type: 'product'
          });
          sent = true;
        }
      } catch (e) {}

      // Pasamos al checkout los datos del anuncio (utm_..., fbclid)
      // para que Impultienda sepa de qué anuncio vino cada venta.
      const destino = linkConDatosDelAnuncio(link.href);
      link.href = destino;

      if (!sent || newTab) return;

      // Pequeña pausa para que el aviso llegue a Meta antes de salir.
      event.preventDefault();
      setTimeout(() => { window.location.href = destino; }, 300);

    });

  });


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