document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default action of the form (submitting the data)

  // Get the form element
  const contactForm = document.getElementById('contactForm');

  // Add a submit event listener to handle the form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default action of the form (submitting the data)
    // Get the form data as a JSON object
    const formData = new FormData(this);
    const jsonObject = {};
    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }

    try {
      // Validate the data as needed
      if (!jsonObject.name || !jsonObject.email || !jsonObject.message) {
        throw new Error('Invalid form data');
      }

      // Send the JSON data to Google Sheets using the fetch API
        const response = await fetch('https://script.google.com/macros/s/AKfycbzMZgddGeMtp0tKyll6KomwLy-dFJtbN8b0S32LPT9SHm9-Q6eCj_qLNNRee2-i40ub/exec', {
            method: 'POST',
            mode: 'cors', // wichtig für CORS
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonObject)
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
});
