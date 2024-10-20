document.getElementById('page1-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const response = await fetch('/create-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        localStorage.setItem('userEmail', formData.email);
        window.location.href = '/page2';
    } else {
        alert('An error occurred while creating your account.');
    }

    
});