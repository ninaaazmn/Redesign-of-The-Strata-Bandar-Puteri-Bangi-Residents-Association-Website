// Login Form Handler
const loginForm = document.getElementById('loginForm');
const successModal = document.getElementById('successModal');
const okBtn = document.getElementById('okBtn');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show success modal (no validation for testing)
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    loginForm.reset();
});

// OK Button Handler - redirect to utama page
okBtn.addEventListener('click', () => {
    window.location.href = '../../pages/utama/utama.html';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === successModal) {
        window.location.href = '../../pages/utama/utama.html';
    }
});
