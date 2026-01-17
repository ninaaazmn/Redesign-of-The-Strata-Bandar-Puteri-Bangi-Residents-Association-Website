// Step Management
const emailForm = document.getElementById('emailForm');
const verifyBtn = document.getElementById('verifyBtn');
const cancelBtn = document.getElementById('cancelBtn');
const backBtn = document.getElementById('backBtn');
const emailInput = document.getElementById('email');
const verifyMessage = document.getElementById('verifyMessage');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const accountForm = document.getElementById('accountForm');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');
const errorOkBtn = document.getElementById('errorOkBtn');
const okBtn = document.getElementById('okBtn');
const emailDisplay = document.getElementById('email-display');

let verifiedEmail = '';

// Cancel button - redirect to login page
cancelBtn.addEventListener('click', () => {
    window.location.href = '../../pages/login/login.html';
});

// Back button - return to email verification
backBtn.addEventListener('click', () => {
    verifiedEmail = '';
    step1.classList.add('active');
    step2.classList.remove('active');
    emailInput.value = '';
    accountForm.reset();
});

// Email Verification Handler
verifyBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        showError('Sila masukkan e-mel anda');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Format e-mel tidak sah');
        return;
    }
    
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Memproses...';
    verifyMessage.innerHTML = '';
    
    try {
        // Check if email exists in Firebase
        const emailExists = await checkEmailInDatabase(email);
        
        if (emailExists) {
            // Email found - proceed to password creation
            verifiedEmail = email;
            emailDisplay.value = email;
            
            // Hide step 1, show step 2
            step1.classList.remove('active');
            step2.classList.add('active');
        } else {
            // Email not found - show error
            showError('E-mel ini tidak didaftarkan dalam sistem ahli. Sila daftar ahli terlebih dahulu di halaman "Daftar Ahli".');
        }
    } catch (error) {
        showError('Terjadi ralat semasa menyahkan e-mel. Sila cuba lagi.');
        console.error('Error:', error);
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = 'SETERUSNYA <i class="fas fa-chevron-right"></i>';
    }
});

// Check if email exists in Firebase (Realtime Database)
async function checkEmailInDatabase(email) {
    try {
        // Query Firebase Realtime Database to check if email exists in ahli collection
        const response = await fetch(
            `https://redesign-of-the-strata.firebaseio.com/ahli.json?orderBy="email"&equalTo="${email}"`
        );
        const data = await response.json();
        
        // If data is not null and not empty, email exists
        return data !== null && Object.keys(data).length > 0;
    } catch (error) {
        console.error('Error checking email:', error);
        throw error;
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Account Form Handler
accountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    // Validation
    if (!password || !confirmPassword) {
        showError('Sila isi semua medan yang diperlukan.');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Kata laluan tidak sepadan.');
        return;
    }
    
    if (password.length < 8) {
        showError('Kata laluan mesti sekurang-kurangnya 8 aksara.');
        return;
    }
    
    try {
        // Create account in Firebase Authentication
        await createUserAccount(verifiedEmail, password);
        
        // Show success modal
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        showError('Terjadi ralat semasa membuat akaun: ' + error.message);
        console.error('Error:', error);
    }
});

// Create user account in Firebase
async function createUserAccount(email, password) {
    try {
        // Use Firebase SDK to create user account
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save additional user data to Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            role: 'member',
            status: 'active'
        });

        return { success: true, user: user };
    } catch (error) {
        throw new Error(getErrorMessage(error.code));
    }
}

// Show error message
function showError(message) {
    const errorTitle = document.getElementById('errorTitle');
    const errorMessage = document.getElementById('errorMessage');
    errorTitle.textContent = 'RALAT';
    errorMessage.textContent = message;
    errorModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Error OK Button Handler
errorOkBtn.addEventListener('click', () => {
    errorModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// OK Button Handler - redirect to login page
okBtn.addEventListener('click', () => {
    window.location.href = '../../pages/login/login.html';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === successModal) {
        window.location.href = '../../pages/login/login.html';
    }
    if (event.target === errorModal) {
        errorModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});
