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
