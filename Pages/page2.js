document.getElementById('page2-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Fetch selected user type
    const userType = document.getElementById('user-type').value;

    // Store the selected user type in sessionStorage
    sessionStorage.setItem('userType', userType);

    // Redirect to either the Customer or Retailer profile completion page
    if (userType === 'customer') {
        window.location.href = 'page3-customer.html';
    } else if (userType === 'retailer') {
        window.location.href = 'page3-retailer.html';
    }
});
