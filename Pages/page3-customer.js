document.getElementById('page3-customer-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        countryCode: document.getElementById('country-code').value,
        phone: document.getElementById('phone').value,
        addressLine1: document.getElementById('address-line1').value,
        addressLine2: document.getElementById('address-line2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        role: 'Customer'
    };

    const response = await fetch('/submit-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if(response.ok) {
        window.location.href = '/';
    } else {
        alert('An error occurred while submitting your profile.');
    }
    
});

