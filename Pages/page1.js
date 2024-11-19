document.getElementById('page1-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    fetch('/create-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        if (response.ok) {
            localStorage.setItem('userEmail', formData.email);
            window.location.href = '/page2';
        } else {
            response.json().then(data => {
                console.log(data)
                alert('An error occurred while creating your account. ' + data.error);
            })
        }
    })
});