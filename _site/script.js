document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const payload = {
        name,
        email,
        message
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzMZgddGeMtp0tKyll6KomwLy-dFJtbN8b0S32LPT9SHm9-Q6eCj_qLNNRee2-i40ub/exec', {
            method: 'POST',
            mode: 'cors', // wichtig für CORS
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Nachricht erfolgreich gesendet!');
            document.getElementById('contactForm').reset();
        } else {
            alert('Fehler beim Senden: ' + result.message);
        }

    } catch (error) {
        console.error('Fehler:', error);
        alert('Ein Netzwerkfehler ist aufgetreten. Bitte später erneut versuchen.');
    }
});
