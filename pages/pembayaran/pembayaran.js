// Step Management
const paymentBtn = document.getElementById('paymentBtn');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step1Indicator = document.getElementById('step1-indicator');
const step2Indicator = document.getElementById('step2-indicator');
const accountForm = document.getElementById('accountForm');
const successModal = document.getElementById('successModal');
const okBtn = document.getElementById('okBtn');

// Payment Button Handler
paymentBtn.addEventListener('click', () => {
    // Simulate payment processing
    paymentBtn.textContent = 'Memproses...';
    paymentBtn.disabled = true;
    
    setTimeout(() => {
        // Mark step 1 as completed
        step1Indicator.classList.add('completed');
        step1Indicator.classList.remove('active');
        
        // Activate step 2
        step2Indicator.classList.add('active');
        
        // Hide step 1, show step 2
        step1.classList.remove('active');
        step2.classList.add('active');
        
        // Reset button
        paymentBtn.textContent = '✓ BAYAR SEKARANG';
    }, 2000);
});

// Account Form Handler
accountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    // Validation (commented out for testing)
    // if (!email || !password || !confirmPassword) {
    //     alert('Sila isi semua medan yang diperlukan.');
    //     return;
    // }
    
    // if (password !== confirmPassword) {
    //     alert('Kata laluan tidak sepadan.');
    //     return;
    // }
    
    // if (password.length < 6) {
    //     alert('Kata laluan mesti sekurang-kurangnya 6 aksara.');
    //     return;
    // }
    
    // Mark step 2 as completed
    step2Indicator.classList.add('completed');
    step2Indicator.classList.remove('active');
    
    // Show success modal
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
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
