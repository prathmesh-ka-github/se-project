document.getElementById('page3-customer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Fetch form values
    const countryCode = document.getElementById('country-code').value;
    const phone = document.getElementById('phone').value;
    const addressLine1 = document.getElementById('address-line1').value;
    const addressLine2 = document.getElementById('address-line2').value || '';  // Optional
    const city = document.getElementById('city').value;
    const county = document.getElementById('county').value;
    const zip = document.getElementById('zip').value;

    // Simple validation for required fields
    if (countryCode && phone && addressLine1 && city && county && zip) {
        // Store the customer profile data (optional)
        sessionStorage.setItem('customerPhone', `${countryCode}${phone}`);
        sessionStorage.setItem('customerAddress', `${addressLine1}, ${addressLine2}, ${city}, ${county}, ${zip}`);

        // Show success message
        alert('Customer profile completed successfully!');

        // Proceed to submit data to the server or next step
        // You can use AJAX, Fetch API, or any other method to send the data to the server.
    } else {
        alert('Please fill in all the required fields.');
    }
});
