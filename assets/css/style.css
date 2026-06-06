/* =========================================================
   03 · JAVASCRIPT — Custom Cursor ohne Hero-Wackeln
   ========================================================= */

const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;

  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateCursor(){
  rx += (mx - rx) * .09;
  ry += (my - ry) * .09;

  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.querySelectorAll('a,button,.chem-entry,.card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';

    ring.style.width = '42px';
    ring.style.height = '42px';
    ring.style.borderColor = 'rgba(192,122,73,.38)';
  });

  el.addEventListener('mouseleave', () => {
    cursor.style.width = '6px';
    cursor.style.height = '6px';

    ring.style.width = '26px';
    ring.style.height = '26px';
    ring.style.borderColor = 'rgba(202,184,159,.2)';
  });
});


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
