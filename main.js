/* =========================================================
   03 · JAVASCRIPT — MAIN
   ========================================================= */

/* 03.01 · Custom Cursor */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;

  if(cursor){
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  }
});

function animateCursor(){

  rx += (mx - rx) * .09;
  ry += (my - ry) * .09;

  if(ring){
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

/* 03.02 · Cursor Hover States */
document.querySelectorAll('a,button,.chem-entry,.card').forEach(el => {

  el.addEventListener('mouseenter', () => {

    if(cursor){
      cursor.style.width = '12px';
      cursor.style.height = '12px';
    }

    if(ring){
      ring.style.width = '42px';
      ring.style.height = '42px';
      ring.style.borderColor = 'rgba(192,122,73,.38)';
    }
  });

  el.addEventListener('mouseleave', () => {

    if(cursor){
      cursor.style.width = '6px';
      cursor.style.height = '6px';
    }

    if(ring){
      ring.style.width = '26px';
      ring.style.height = '26px';
      ring.style.borderColor = 'rgba(202,184,159,.2)';
    }
  });
});

/* =========================================================
   03.03 · Progressive After-Image Loading
   ========================================================= */

window.addEventListener('load', () => {

  const upgradeImages = [

    {
      selector: 'img[src="images/best-05.jpg"]',
      full: 'images/After-01.jpg'
    },

    {
      selector: 'img[src="images/best-06.jpg"]',
      full: 'images/After-02.jpg'
    },

    {
      selector: 'img[src="images/best-07.jpg"]',
      full: 'images/After-03.jpg'
    },

    {
      selector: 'img[src="images/best-08.jpg"]',
      full: 'images/After-04.jpg'
    }
  ];

  upgradeImages.forEach(item => {

    const img = document.querySelector(item.selector);

    if(!img) return;

    const highRes = new Image();

    highRes.src = item.full;

    highRes.onload = () => {

      img.style.transition =
        'opacity .55s ease, filter .55s ease, transform .55s ease';

      img.style.opacity = '.82';

      requestAnimationFrame(() => {

        setTimeout(() => {

          img.src = item.full;

          img.onload = () => {

            img.style.opacity = '1';
            img.classList.add('after-loaded');
          };

        }, 140);

      });
    };
  });
});

/* =========================================================
   03.04 · Legal Gate / Datenschutz / Impressum
   ========================================================= */

const legalGate = document.getElementById('legalGate');
const legalContent = document.getElementById('legalContent');

if(legalGate && legalContent){

  legalGate.addEventListener('click', () => {

    const isVisible =
      legalContent.classList.toggle('visible');

    legalGate.setAttribute(
      'aria-expanded',
      isVisible ? 'true' : 'false'
    );

    const gateText = legalGate.querySelector('span');

    if(gateText){

      gateText.innerText = isVisible
        ? 'Datenschutz & Impressum ausblenden'
        : 'Datenschutz & Impressum einsehen';
    }
  });
}

/* 03.05 · Legal Panels */
document.querySelectorAll('.legal-toggle').forEach(button => {

  button.addEventListener('click', () => {

    const target =
      document.getElementById(button.dataset.legal);

    document.querySelectorAll('.legal-panel').forEach(panel => {

      if(panel !== target){
        panel.classList.remove('active');
      }
    });

    if(target){
      target.classList.toggle('active');
    }
  });
});

/* 03.06 · Impressum Freischaltung */
const imprintBtn =
  document.getElementById('showImprintBtn');

const imprintContent =
  document.getElementById('imprintContent');

const imprintAddress =
  document.getElementById('imprintAddress');

if(imprintBtn && imprintContent && imprintAddress){

  imprintBtn.addEventListener('click', () => {

    const addressLines = [

      'Fabian Harmuth',
      'Schneckweg 1',
      '89079 Ulm',
      'Deutschland'
    ];

    imprintAddress.innerHTML =
      addressLines.join('<br>');

    imprintContent.classList.add('visible');

    imprintBtn.innerText =
      'Adresse freigeschaltet';

    imprintBtn.disabled = true;
  });
}

/* =========================================================
   03.07 · Mobile Touch Optimization
   ========================================================= */

if(window.innerWidth <= 980){

  document.documentElement.style.scrollBehavior = 'smooth';

  document.querySelectorAll('.card').forEach(card => {

    card.addEventListener('touchstart', () => {
      card.classList.add('touch-active');
    });

    card.addEventListener('touchend', () => {

      setTimeout(() => {
        card.classList.remove('touch-active');
      }, 260);
    });
  });
}

/* =========================================================
   03.08 · Passive Scroll Optimization
   ========================================================= */

window.addEventListener(
  'scroll',
  () => {},
  { passive:true }
);
