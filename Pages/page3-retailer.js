document.getElementById('page3-retailer-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        phone: document.getElementById('shop-phone').value,
        addressLine1: document.getElementById('shop-address').value,
        role: 'Retailer'
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