/* =========================================================
   BLAUPAUSE / POLAS · JavaScript
   ========================================================= */


/* 01 · Progressive Image Upgrade */
window.addEventListener('load', () => {
  const upgradeImages = Array.from(document.querySelectorAll('.pola-upgrade[data-after]'));

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
      await new Promise(resolve => setTimeout(resolve, 240));
    }
  };

  if('requestIdleCallback' in window){
    requestIdleCallback(runQueue, {timeout:2200});
  }else{
    window.setTimeout(runQueue, 900);
  }
});


/* 02 · Pola Stack / Carousel */
const polaShowcase = document.getElementById('polaShowcase');

if(polaShowcase){
  const cards = Array.from(polaShowcase.querySelectorAll('.pola-card'));
  const prevBtn = document.getElementById('polaPrev');
  const nextBtn = document.getElementById('polaNext');
  const activeFrameNumber = document.getElementById('activeFrameNumber');
  const activeFrameText = document.getElementById('activeFrameText');

  let activeIndex = 0;
  let wheelLocked = false;
  let hoverActive = false;

  const renderCards = () => {
    const total = cards.length;

    cards.forEach((card, index) => {
      card.classList.remove('is-active', 'is-prev', 'is-next');

      const prevIndex = (activeIndex - 1 + total) % total;
      const nextIndex = (activeIndex + 1) % total;

      if(index === activeIndex){
        card.classList.add('is-active');

        if(activeFrameNumber){
          activeFrameNumber.textContent = card.dataset.frame || String(index + 1).padStart(2, '0');
        }

        if(activeFrameText){
          activeFrameText.textContent = card.dataset.note || '';
        }
      }

      if(index === prevIndex){
        card.classList.add('is-prev');
      }

      if(index === nextIndex){
        card.classList.add('is-next');
      }
    });
  };

  const goToCard = direction => {
    const total = cards.length;
    activeIndex = (activeIndex + direction + total) % total;
    renderCards();
  };

  if(prevBtn){
    prevBtn.addEventListener('click', () => goToCard(-1));
  }

  if(nextBtn){
    nextBtn.addEventListener('click', () => goToCard(1));
  }

  polaShowcase.addEventListener('mouseenter', () => {
    hoverActive = true;
  });

  polaShowcase.addEventListener('mouseleave', () => {
    hoverActive = false;
    wheelLocked = false;
  });

  polaShowcase.addEventListener('wheel', event => {
    if(!hoverActive) return;

    event.preventDefault();

    if(wheelLocked) return;

    wheelLocked = true;

    const direction = event.deltaY > 0 || event.deltaX > 0 ? 1 : -1;
    goToCard(direction);

    window.setTimeout(() => {
      wheelLocked = false;
    }, 340);
  }, {passive:false});

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      activeIndex = index;
      renderCards();
    });
  });

  renderCards();
}


/* 03 · Großbild-Viewer mit Zoom / Pan */
const polaViewer = document.getElementById('polaViewer');
const polaViewerStage = document.getElementById('polaViewerStage');
const polaViewerImg = document.getElementById('polaViewerImg');
const polaViewerClose = document.getElementById('polaViewerClose');

if(polaViewer && polaViewerStage && polaViewerImg){
  let viewerZoom = 1;
  let panX = 0;
  let panY = 0;
  let currentHighSrc = null;

  const setViewerZoom = value => {
    viewerZoom = Math.min(Math.max(value, 1), 3.8);
    polaViewerImg.style.setProperty('--viewer-zoom', viewerZoom);
  };

  const setViewerPan = (x, y) => {
    panX = x;
    panY = y;

    polaViewerImg.style.setProperty('--viewer-pan-x', `${panX}px`);
    polaViewerImg.style.setProperty('--viewer-pan-y', `${panY}px`);
  };

  const resetViewer = () => {
    setViewerZoom(1);
    setViewerPan(0, 0);
  };

  const getBestSrc = img => {
    if(img.dataset.upgraded === 'true' && img.dataset.after){
      return img.dataset.after;
    }

    return img.currentSrc || img.src;
  };

  const updatePanFromMouse = event => {
    if(viewerZoom <= 1) return;

    const rect = polaViewerStage.getBoundingClientRect();

    const relativeX = (event.clientX - rect.left) / rect.width - .5;
    const relativeY = (event.clientY - rect.top) / rect.height - .5;

    const maxPanX = rect.width * (viewerZoom - 1) * .42;
    const maxPanY = rect.height * (viewerZoom - 1) * .42;

    setViewerPan(
      -relativeX * maxPanX,
      -relativeY * maxPanY
    );
  };

  const openViewer = img => {
    currentHighSrc = img.dataset.after || null;

    resetViewer();

    polaViewerImg.src = getBestSrc(img);
    polaViewer.classList.add('is-open');
    polaViewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');

    if(currentHighSrc && polaViewerImg.src !== currentHighSrc){
      const highImage = new Image();

      highImage.onload = () => {
        if(!polaViewer.classList.contains('is-open')) return;

        polaViewerImg.classList.add('is-swapping');

        window.setTimeout(() => {
          polaViewerImg.src = currentHighSrc;
          polaViewerImg.classList.remove('is-swapping');
        }, 160);
      };

      highImage.src = currentHighSrc;
    }
  };

  const closeViewer = () => {
    polaViewer.classList.remove('is-open');
    polaViewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');

    polaViewerImg.src = '';
    currentHighSrc = null;

    resetViewer();
  };

  document.querySelectorAll('.pola-card img, .hero-pola-img').forEach(img => {
    img.addEventListener('dblclick', event => {
      event.preventDefault();
      event.stopPropagation();

      openViewer(img);
    });
  });

  polaViewerStage.addEventListener('wheel', event => {
    event.preventDefault();

    const direction = event.deltaY < 0 ? .18 : -.18;

    setViewerZoom(viewerZoom + direction);

    if(viewerZoom <= 1){
      setViewerPan(0, 0);
    }else{
      updatePanFromMouse(event);
    }
  }, {passive:false});

  polaViewerStage.addEventListener('mousemove', event => {
    updatePanFromMouse(event);
  });

  polaViewer.addEventListener('click', event => {
    if(event.target === polaViewer){
      closeViewer();
    }
  });

  if(polaViewerClose){
    polaViewerClose.addEventListener('click', closeViewer);
  }

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && polaViewer.classList.contains('is-open')){
      closeViewer();
    }
  });
}





