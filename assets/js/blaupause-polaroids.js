

const toggle = document.getElementById('measureToggle');

const panel = document.getElementById('measurePanel');



toggle.addEventListener('click', () => {



  const isOpen = panel.classList.toggle('open');



  toggle.querySelector('span').textContent = isOpen

    ? 'Konfektionsmaße ausblenden'

    : 'Konfektionsmaße einsehen';

});





