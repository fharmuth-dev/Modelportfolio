const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

if(cursor && ring){
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

  document.querySelectorAll('a,button,input,textarea,.chem-entry,.card,.method-option span,.contact-card').forEach(el => {
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
}
