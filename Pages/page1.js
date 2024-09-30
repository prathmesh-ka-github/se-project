document.getElementById('page1-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Fetch input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Store the data in sessionStorage to persist it across steps
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('password', password);

    // Move to the next page (Step 2: Choose account type)
    window.location.href = 'page2.html';
});
