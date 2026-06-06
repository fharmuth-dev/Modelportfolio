const textarea = document.getElementById('nachricht');
const counter = document.getElementById('cc');

const form = document.getElementById('cf');
const btn = document.getElementById('btn');
const btxt = document.getElementById('btxt');
const ok = document.getElementById('ok');
const err = document.getElementById('err');

const methodRadios = document.querySelectorAll('input[name="contact_method_choice"]');
const methodLabel = document.getElementById('contact_method_label');
const contactInputs = document.querySelectorAll('.contact-input');
const contactMethods = document.getElementById('contactMethods');

const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const instagramInput = document.getElementById('instagram');

const methodError = document.getElementById('methodError');
const phoneError = document.getElementById('phoneError');
const emailError = document.getElementById('emailError');
const instagramError = document.getElementById('instagramError');

let selectedMethod = null;

textarea.addEventListener('input', () => {
  const length = textarea.value.length;
  counter.textContent = length + ' / 2000';
  counter.classList.toggle('live', length > 0);
});

methodRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    selectedMethod = radio.dataset.method;
    methodLabel.value = radio.value;

    contactMethods.classList.add('is-selected');

    methodError.classList.remove('visible');
    phoneError.classList.remove('visible');
    emailError.classList.remove('visible');
    instagramError.classList.remove('visible');

    phoneInput.required = false;
    emailInput.required = false;
    instagramInput.required = false;

    contactInputs.forEach(box => {
      box.classList.toggle('active', box.dataset.contactInput === selectedMethod);
    });

    if(selectedMethod === 'phone') phoneInput.required = true;
    if(selectedMethod === 'email') emailInput.required = true;
    if(selectedMethod === 'instagram') instagramInput.required = true;
  });
});

function validEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function validPhone(value){
  const digits = value.replace(/\D/g, '');
  return /^(\+?\d[\d\s\-()/]{6,22})$/.test(value.trim()) && digits.length >= 7 && digits.length <= 16;
}

function validInstagram(value){
  const clean = value.trim().replace(/^@/, '');
  return /^[a-zA-Z0-9._]{2,30}$/.test(clean);
}

function validateContactMethod(){
  let valid = true;

  methodError.classList.remove('visible');
  phoneError.classList.remove('visible');
  emailError.classList.remove('visible');
  instagramError.classList.remove('visible');

  if(!selectedMethod){
    methodError.classList.add('visible');
    return false;
  }

  if(selectedMethod === 'phone' && !validPhone(phoneInput.value)){
    phoneError.classList.add('visible');
    valid = false;
  }

  if(selectedMethod === 'email' && !validEmail(emailInput.value)){
    emailError.classList.add('visible');
    valid = false;
  }

  if(selectedMethod === 'instagram' && !validInstagram(instagramInput.value)){
    instagramError.classList.add('visible');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  ok.style.display = 'none';
  err.style.display = 'none';

  if(textarea.value.trim().length < 10){
    err.textContent = '✕ Bitte schreibe mindestens 10 Zeichen.';
    err.style.display = 'block';
    return;
  }

  if(!validateContactMethod()){
    err.textContent = '✕ Bitte gültigen Kontaktweg eintragen.';
    err.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btxt.textContent = 'Sende …';

  try{
    const response = await fetch('https://api.web3forms.com/submit', {
      method:'POST',
      body:new FormData(form)
    });

    const result = await response.json();

    if(result.success){
      ok.style.display = 'block';
      form.reset();

      selectedMethod = null;
      methodLabel.value = 'Bitte auswählen';
      contactMethods.classList.remove('is-selected');

      phoneInput.required = false;
      emailInput.required = false;
      instagramInput.required = false;

      contactInputs.forEach(box => box.classList.remove('active'));

      counter.textContent = '0 / 2000';
      counter.classList.remove('live');

      btxt.textContent = 'Gesendet ✓';
    }else{
      throw new Error('Send failed');
    }
  }catch{
    err.textContent = '✕ Fehler beim Senden. Bitte erneut versuchen.';
    err.style.display = 'block';
    btxt.textContent = 'Senden';
    btn.disabled = false;
  }
});

/* Custom Cursor wie Landingpage */
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

document.querySelectorAll('a,button,input,textarea,.method-option span,.contact-card').forEach(el => {
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

