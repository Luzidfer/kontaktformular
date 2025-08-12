const ENDPOINT_URL = "https://kontaktformular.vercel.app/api/contact";

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();

  try {
    const response = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message })
    });

    const data = await response.json();
    console.log("API response:", data);

    if (response.ok) {
      alert("Message sent successfully!");
      form.reset();
    } else {
      alert(`Error: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
});
