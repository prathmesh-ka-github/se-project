document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('styleQuizForm');

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const bodyType = document.getElementById('bodyType').value;
        const occasions = Array.from(document.querySelectorAll('input[name="occasions"]:checked')).map(el => el.value);
        const style = document.getElementById('style').value;
        const colors = Array.from(document.querySelectorAll('input[name="colors"]:checked')).map(el => el.value);
        const fit = document.getElementById('fit').value;
        const budget = document.getElementById('budget').value;
        const materials = Array.from(document.querySelectorAll('input[name="materials"]:checked')).map(el => el.value);
        const specialNeeds = document.getElementById('specialNeeds').value;
        const climate = document.getElementById('climate').value;
        const prints = Array.from(document.querySelectorAll('input[name="prints"]:checked')).map(el => el.value);

        // Log responses 
        console.log({
            bodyType,
            occasions,
            style,
            colors,
            fit,
            budget,
            materials,
            specialNeeds,
            climate,
            prints
        });

        // Simulate sending data to the backend for processing
        alert('Thank you! Your recommendations are being generated.');
    });

    // Logout functionality
    const logoutLink = document.querySelector('.logout-link');
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('You have been logged out.');
        window.location.href = 'login.html';  
    });
});

function updateCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}
updateCounter()