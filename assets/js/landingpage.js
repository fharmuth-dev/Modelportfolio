/* =========================================================
   03 · JAVASCRIPT — Custom Cursor ohne Hero-Wackeln
   ========================================================= */

/* 03.02 · Progressive Image Upgrade — Streetstyle Serie
   Wichtig: Lädt erst nach vollständigem Seitenaufbau.
   Sichtbar bleiben sofort best-05 bis best-08; danach werden After-01 bis After-04
   im Hintergrund geladen und erst nach vollständigem Laden ersetzt. */
window.addEventListener('load', () => {
  const upgradeImages = Array.from(document.querySelectorAll('.upgrade-img[data-after]'));

  if(!upgradeImages.length) return;

  const upgradeSingleImage = img => {
    const afterSrc = img.dataset.after;

    if(!afterSrc || img.dataset.upgraded === 'true') return;

    const afterImage = new Image();

    afterImage.onload = () => {
      img.classList.add('is-swapping');

      window.setTimeout(() => {
        img.src = afterSrc;
        img.dataset.upgraded = 'true';
        img.classList.remove('is-swapping');
        img.classList.add('is-upgraded');
      }, 180);
    };

    afterImage.onerror = () => {
      img.dataset.upgraded = 'failed';
    };

    afterImage.src = afterSrc;
  };

  const runQueue = async () => {
    for(const img of upgradeImages){
      upgradeSingleImage(img);
      await new Promise(resolve => setTimeout(resolve, 260));
    }
  };

  if('requestIdleCallback' in window){
    requestIdleCallback(runQueue, {timeout:2500});
  }else{
    window.setTimeout(runQueue, 900);
  }
});
/* 03.03 · Off The Beaten Track Carousel */
const offtrackCarousel = document.getElementById('offtrackCarousel');
const offtrackCounter = document.getElementById('offtrackCounter');

if(offtrackCarousel){
  const slides = Array.from(offtrackCarousel.querySelectorAll('.offtrack-slide'));
  const prevBtn = offtrackCarousel.querySelector('.offtrack-prev');
  const nextBtn = offtrackCarousel.querySelector('.offtrack-next');

  let currentIndex = 0;
  let wheelLocked = false;
  let carouselHover = false;
  let isExpanded = false;

  const formatNumber = number => String(number).padStart(2, '0');

  const renderCarousel = () => {
    const total = slides.length;

    slides.forEach((slide, index) => {
      slide.classList.remove('is-active', 'is-prev', 'is-next');

      const prevIndex = (currentIndex - 1 + total) % total;
      const nextIndex = (currentIndex + 1) % total;

      if(index === currentIndex){
        slide.classList.add('is-active');
      }

      if(index === prevIndex){
        slide.classList.add('is-prev');
      }

      if(index === nextIndex){
        slide.classList.add('is-next');
      }
    });

    if(offtrackCounter){
      offtrackCounter.textContent = `${formatNumber(currentIndex + 1)} / ${formatNumber(total)}`;
    }
  };

  const closeExpandedImage = () => {
    isExpanded = false;
    offtrackCarousel.classList.remove('is-expanded');
  };

  const goToSlide = direction => {
    const total = slides.length;
    currentIndex = (currentIndex + direction + total) % total;
    closeExpandedImage();
    renderCarousel();
  };

  if(prevBtn){
    prevBtn.addEventListener('click', () => goToSlide(-1));
  }

  if(nextBtn){
    nextBtn.addEventListener('click', () => goToSlide(1));
  }

  offtrackCarousel.addEventListener('mouseenter', () => {
    carouselHover = true;
  });

  offtrackCarousel.addEventListener('mouseleave', () => {
    carouselHover = false;
    wheelLocked = false;
  });

  offtrackCarousel.addEventListener('wheel', event => {
    if(!carouselHover) return;

    event.preventDefault();

    if(wheelLocked) return;

    wheelLocked = true;

    const direction = event.deltaY > 0 || event.deltaX > 0 ? 1 : -1;
    goToSlide(direction);

    window.setTimeout(() => {
      wheelLocked = false;
    }, 360);
  }, {passive:false});

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if(index !== currentIndex){
        currentIndex = index;
        closeExpandedImage();
        renderCarousel();
        return;
      }

      isExpanded = !isExpanded;
      offtrackCarousel.classList.toggle('is-expanded', isExpanded);
    });
  });

  renderCarousel();
}

/* 03.02 · Legal Gate / Datenschutz / Impressum */
const legalGate = document.getElementById('legalGate');
const legalContent = document.getElementById('legalContent');

if(legalGate && legalContent){
  legalGate.addEventListener('click', () => {
    const isVisible = legalContent.classList.toggle('visible');
    legalGate.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
    legalGate.querySelector('span').innerText = isVisible
      ? 'Datenschutz & Impressum ausblenden'
      : 'Datenschutz & Impressum einsehen';
  });
}

document.querySelectorAll('.legal-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.legal);

    document.querySelectorAll('.legal-panel').forEach(panel => {
      if(panel !== target){
        panel.classList.remove('active');
      }
    });

    target.classList.toggle('active');
  });
});

const imprintBtn = document.getElementById('showImprintBtn');
const imprintContent = document.getElementById('imprintContent');
const imprintAddress = document.getElementById('imprintAddress');

if(imprintBtn && imprintContent && imprintAddress){
  imprintBtn.addEventListener('click', () => {
    const addressLines = [
      'Fabian Harmuth',
      'Schneckweg 1',
      '89079 Ulm',
      'Deutschland'
    ];

    imprintAddress.innerHTML = addressLines.join('<br>');
    imprintContent.classList.add('visible');
    imprintBtn.innerText = 'Adresse freigeschaltet';
    imprintBtn.disabled = true;
  });
}
/* 03.04 · Globaler Portfolio Bild-Viewer */
const portfolioViewer = document.getElementById('portfolioViewer');
const portfolioViewerStage = document.getElementById('portfolioViewerStage');
const portfolioViewerImg = document.getElementById('portfolioViewerImg');
const portfolioViewerClose = document.getElementById('portfolioViewerClose');
const portfolioViewerLoupe = document.getElementById('portfolioViewerLoupe');

if(portfolioViewer && portfolioViewerStage && portfolioViewerImg){
  let viewerZoom = 1;
  let loupeActive = false;
  let currentViewerImage = null;
  let currentHighSrc = null;

  const setViewerZoom = value => {
    viewerZoom = Math.min(Math.max(value, 1), 3.5);
    portfolioViewerImg.style.setProperty('--viewer-zoom', viewerZoom);
  };

  const getBestImageSrc = img => {
    if(img.dataset.upgraded === 'true' && img.dataset.after){
      return img.dataset.after;
    }

    return img.currentSrc || img.src;
  };

  const openViewer = img => {
    currentViewerImage = img;
    currentHighSrc = img.dataset.after || null;

    setViewerZoom(1);

    portfolioViewerImg.src = getBestImageSrc(img);
    portfolioViewer.classList.add('is-open');
    portfolioViewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');

    if(currentHighSrc && portfolioViewerImg.src !== currentHighSrc){
      const highImage = new Image();

      highImage.onload = () => {
        if(!portfolioViewer.classList.contains('is-open')) return;

        portfolioViewerImg.classList.add('is-swapping');

        window.setTimeout(() => {
          portfolioViewerImg.src = currentHighSrc;
          portfolioViewerImg.classList.remove('is-swapping');
        }, 160);
      };

      highImage.src = currentHighSrc;
    }
  };

  const closeViewer = () => {
    portfolioViewer.classList.remove('is-open');
    portfolioViewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');

    portfolioViewerStage.classList.remove('is-loupe');
    portfolioViewerImg.src = '';
    currentViewerImage = null;
    currentHighSrc = null;
    loupeActive = false;
    setViewerZoom(1);
  };

  document.querySelectorAll('.gallery img, .hero-image').forEach(img => {
    img.addEventListener('dblclick', event => {
      event.preventDefault();
      event.stopPropagation();
      openViewer(img);
    });
  });

  portfolioViewerStage.addEventListener('wheel', event => {
    event.preventDefault();

    const direction = event.deltaY < 0 ? .18 : -.18;
    setViewerZoom(viewerZoom + direction);
  }, {passive:false});

  portfolioViewerStage.addEventListener('mousedown', event => {
    event.preventDefault();

    loupeActive = true;
    portfolioViewerStage.classList.add('is-loupe');
  });

  document.addEventListener('mouseup', () => {
    if(!loupeActive) return;

    loupeActive = false;
    portfolioViewerStage.classList.remove('is-loupe');
  });

  portfolioViewerStage.addEventListener('mousemove', event => {
    if(!portfolioViewerLoupe || !portfolioViewerStage.classList.contains('is-loupe')) return;

    const rect = portfolioViewerStage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const src = currentHighSrc || portfolioViewerImg.src;
    const loupeSize = 180;
    const loupeZoom = Math.max(viewerZoom, 2.2);

    portfolioViewerLoupe.style.left = `${x - loupeSize / 2}px`;
    portfolioViewerLoupe.style.top = `${y - loupeSize / 2}px`;
    portfolioViewerLoupe.style.backgroundImage = `url("${src}")`;
    portfolioViewerLoupe.style.backgroundSize = `${rect.width * loupeZoom}px ${rect.height * loupeZoom}px`;
    portfolioViewerLoupe.style.backgroundPosition = `${-(x * loupeZoom - loupeSize / 2)}px ${-(y * loupeZoom - loupeSize / 2)}px`;
  });

  portfolioViewer.addEventListener('click', event => {
    if(event.target === portfolioViewer){
      closeViewer();
    }
  });

  if(portfolioViewerClose){
    portfolioViewerClose.addEventListener('click', closeViewer);
  }

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && portfolioViewer.classList.contains('is-open')){
      closeViewer();
    }
  });
}
