const ENDPOINT_URL = "https://kontaktformular.vercel.app/api/contact";

const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

  const errorElem = document.getElementById('formError');
  const successElem = document.getElementById('formSuccess');
  if (errorElem) errorElem.textContent = '';
  if (successElem) successElem.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    if (errorElem) errorElem.textContent = 'Bitte alle Pflichtfelder ausfüllen.';
    return;
  }

    try {
        const response = await fetch(ENDPOINT_URL, {
            method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone, message })
    });

    const data = await response.json();

    if (response.ok && (data.success || data.id)) {
      if (successElem) successElem.textContent = 'Nachricht erfolgreich gesendet!';
            form.reset();
        } else {
      if (errorElem) errorElem.textContent = data.error || data.message || 'Fehler beim Senden.';
        }
  } catch (err) {
    if (errorElem) errorElem.textContent = 'Netzwerkfehler – bitte versuchen Sie es später erneut.';
    }
});