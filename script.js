// Contact form client script - secure, modern, best practices
// Expects Cloudflare Worker endpoint (no API keys in frontend!)

const ENDPOINT_URL = "kontaktformular.vercel.app";

// --- DOM Elements ---
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const messageError = document.getElementById('messageError');

// --- Helper: Clear error messages ---
function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    messageError.textContent = '';
}

// --- Helper: Validation ---
function validateInputs(name, email, phone, message) {
    let isValid = true;
    clearErrors();

    if (!name) {
        nameError.textContent = 'Bitte geben Sie Ihren Namen ein.';
        isValid = false;
    }
    if (!email) {
        emailError.textContent = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        isValid = false;
    }
    if (!phone) {
        phoneError.textContent = 'Bitte geben Sie Ihre Telefonnummer ein.';
        isValid = false;
    } else if (!/^[\d+\s\-/()]{6,20}$/.test(phone)) {
        phoneError.textContent = 'Bitte geben Sie eine gültige Telefonnummer ein.';
        isValid = false;
    }
    if (!message) {
        messageError.textContent = 'Bitte geben Sie eine Nachricht ein.';
        isValid = false;
    }

    return isValid;
}

// --- Form Submit Handler ---
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    // Optionally clear old errors (validation now does this)
    // clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    if (!validateInputs(name, email, phone, message)) return;

    const payload = { name, email, phone, message };

    try {
        const response = await fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Defensive: Check network errors and valid JSON
        if (!response.ok) throw new Error('Serverfehler: ' + response.status);
        let result;
        try {
            result = await response.json();
        } catch {
            throw new Error('Ungültige Serverantwort.');
        }

        // Accepts either id or success in result for compatibility
        if ((result && result.id) || result.success) {
            alert('Nachricht erfolgreich gesendet!');
            form.reset();
        } else {
            alert('Fehler beim Senden: ' + (result.message || 'Unbekannter Fehler.'));
        }
    } catch (error) {
        console.error('Fehler:', error);
        alert('Ein Netzwerkfehler oder Serverfehler ist aufgetreten. Bitte später erneut versuchen.');
    }
});