// =============================
// Configuration
// =============================
const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbyicPWmRUWE7N7OfRbMC0kfRXRsipfff5brySa69SxXghN2KkQZFsGmS3m1MxsDcimh/exec';
const STATUS_SUCCESS = 'success';

// =============================
// Cached DOM Elements
// =============================
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const messageError = document.getElementById('messageError');

// =============================
// Helper: Clear all error messages
// =============================
function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    messageError.textContent = '';
}

// =============================
// Helper: Basic client-side validation
// =============================
function validateInputs(name, email, phone, message) {
    let isValid = true;

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
    } else if (!/^[\d+\s\-\/()]{6,20}$/.test(phone)) {
        phoneError.textContent = 'Bitte geben Sie eine gültige Telefonnummer ein.';
        isValid = false;
    }
    if (!message) {
        messageError.textContent = 'Bitte geben Sie eine Nachricht ein.';
        isValid = false;
    }

    return isValid;
}

// =============================
// Submit Event Handler
// =============================
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Validate before sending
    if (!validateInputs(name, email, phone, message)) {
        return;
    }

    const payload = { name, email, phone, message };

    try {
        const response = await fetch(ENDPOINT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Serverfehler: ' + response.status);
        }

        const result = await response.json();

        if (result.status === STATUS_SUCCESS) {
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

