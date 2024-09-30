document.getElementById('page3-retailer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Fetch form values
    const shopPhone = document.getElementById('shop-phone').value;
    const shopAddress = document.getElementById('shop-address').value;
    const ein = document.getElementById('ein').value; // Fetch EIN
    const salesTaxNumber = document.getElementById('sales-tax-number').value; // Fetch Sales Tax Number response

    // Simple validation for required fields
    if (shopPhone && shopAddress && ein && salesTaxNumber) {
        // Store the retailer profile data
        sessionStorage.setItem('shopPhone', shopPhone);
        sessionStorage.setItem('shopAddress', shopAddress);
        sessionStorage.setItem('ein', ein); // Store EIN
        sessionStorage.setItem('salesTaxNumber', salesTaxNumber); // Store Sales Tax Number response

        // Show success message
        alert('Retailer profile completed successfully!');

        // Proceed to submit data to the server or next step
        // You can use AJAX, Fetch API, or any other method to send the data to the server.
    } else {
        alert('Please fill in all the required fields.');
    }
});
