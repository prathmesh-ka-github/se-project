document.addEventListener('DOMContentLoaded', () => {
    const customerBtn = document.getElementById('customerBtn');
    const retailerBtn = document.getElementById('retailerBtn');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginBtn = document.querySelector('.login-btn');

    // Forgot Password elements
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModalBtn = document.querySelector('.close');
    const resetEmailInput = document.getElementById('resetEmail');
    const resetPasswordButton = document.getElementById('resetPasswordButton');

    function setActiveButton(activeBtn, inactiveBtn) {
        activeBtn.classList.add('active');
        inactiveBtn.classList.remove('active');
    }

    function updateFormForUserType(userType) {
        emailInput.placeholder = userType === 'Customer' ? 'Customer Email' : 'Retailer ID';
        loginBtn.textContent = `${userType} Login`;
    }

    customerBtn.addEventListener('click', () => {
        setActiveButton(customerBtn, retailerBtn);
        updateFormForUserType('Customer');
    });

    retailerBtn.addEventListener('click', () => {
        setActiveButton(retailerBtn, customerBtn);
        updateFormForUserType('Retailer');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const isRemembered = rememberMeCheckbox.checked;
        const userType = customerBtn.classList.contains('active') ? 'Customer' : 'Retailer';

        // For now, instead of API call to our backend, we'll just log the attempt and simulate a successful login

        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        setTimeout(() => {
            alert(`${userType} login successful!`);
            loginForm.reset();
            loginBtn.disabled = false;
            loginBtn.textContent = `${userType} Login`;
        }, 1500);
    });

    // Handle "Forgot Password?" click
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = 'block';
    });

    
    closeModalBtn.addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
    });

    
    window.addEventListener('click', (e) => {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });

    // Portion to handle reset password button click
    resetPasswordButton.addEventListener('click', () => {
        const resetEmail = resetEmailInput.value;
        if (resetEmail === '') {
            alert('Please enter your email address.');
        } else {
            alert(`A password reset link has been sent to ${resetEmail}`);
            resetEmailInput.value = '';
            forgotPasswordModal.style.display = 'none';
        }
    });
});
