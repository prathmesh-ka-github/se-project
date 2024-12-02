function runpreloader() {
    document.getElementById('preloader').classList.toggle('invisible')
}
const quiz = document.getElementById('inputForm');
quiz.addEventListener('submit', (quiz) => {
    runpreloader();
})

function updateCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}
updateCounter()