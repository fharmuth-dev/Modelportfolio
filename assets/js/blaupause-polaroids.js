

const toggle = document.getElementById('measureToggle');

const panel = document.getElementById('measurePanel');



toggle.addEventListener('click', () => {



  const isOpen = panel.classList.toggle('open');



  toggle.querySelector('span').textContent = isOpen

    ? 'Konfektionsmaße ausblenden'

    : 'Konfektionsmaße einsehen';

});



/* =========================

CURSOR

========================= */



const cursor = document.getElementById('cursor');

const ring = document.getElementById('cursor-ring');



window.addEventListener('mousemove', e => {



  cursor.style.left = e.clientX + 'px';

  cursor.style.top = e.clientY + 'px';



  ring.style.left = e.clientX + 'px';

  ring.style.top = e.clientY + 'px';

});



document.querySelectorAll('a, button').forEach(el => {



  el.addEventListener('mouseenter', () => {

    ring.classList.add('active');

  });



  el.addEventListener('mouseleave', () => {

    ring.classList.remove('active');

  });



});



document.querySelectorAll('a, button').forEach(el => {



  el.addEventListener('mouseenter', () => {

    cursor.classList.add('hover');

  });



  el.addEventListener('mouseleave', () => {

    cursor.classList.remove('hover');

  });

});


