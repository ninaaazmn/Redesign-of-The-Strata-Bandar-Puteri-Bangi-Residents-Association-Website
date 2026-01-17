// ============================================
// FIREBASE CONFIGURATION
// ============================================
// IMPORTANT: Replace the values below with your actual Firebase config
// Get this from: Firebase Console → Project Settings → Your Apps → Config
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyAzve41UX3p4yjU_MeZg36cR6yuzmxldpc",
    authDomain: "user-strata.firebaseapp.com",
    projectId: "user-strata",
    storageBucket: "user-strata.firebasestorage.app",
    messagingSenderId: "225363662978",
    appId: "1:225363662978:web:825fc4e6033b1cc9d03c9b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Login with email and password
async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// Register new user
async function registerUser(email, password, userData) {
    try {
        // Create auth user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save additional user data to Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            ...userData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            role: 'member'
        });

        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// Logout user
async function logoutUser() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Check if user is logged in
function isLoggedIn() {
    return auth.currentUser !== null;
}

// Listen for auth state changes
function onAuthStateChange(callback) {
    auth.onAuthStateChanged(callback);
}

// Get user data from Firestore
async function getUserData(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        } else {
            return { success: false, error: 'User data not found' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Update user data
async function updateUserData(uid, data) {
    try {
        await db.collection('users').doc(uid).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Password reset
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// ============================================
// ERROR MESSAGES (in Malay)
// ============================================
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'E-mel ini telah didaftarkan. Sila gunakan e-mel lain.',
        'auth/invalid-email': 'Format e-mel tidak sah.',
        'auth/operation-not-allowed': 'Operasi tidak dibenarkan. Sila hubungi pentadbir.',
        'auth/weak-password': 'Kata laluan terlalu lemah. Gunakan sekurang-kurangnya 6 aksara.',
        'auth/user-disabled': 'Akaun ini telah dilumpuhkan. Sila hubungi pentadbir.',
        'auth/user-not-found': 'E-mel tidak dijumpai. Sila daftar akaun baru.',
        'auth/wrong-password': 'Kata laluan salah. Sila cuba lagi.',
        'auth/too-many-requests': 'Terlalu banyak percubaan. Sila cuba sebentar lagi.',
        'auth/network-request-failed': 'Masalah rangkaian. Sila semak sambungan internet anda.',
        'auth/invalid-credential': 'E-mel atau kata laluan tidak sah.',
        'auth/missing-password': 'Sila masukkan kata laluan.',
        'auth/missing-email': 'Sila masukkan e-mel.'
    };

    return errorMessages[errorCode] || 'Ralat berlaku. Sila cuba lagi.';
}

// ============================================
// REDIRECT HELPERS
// ============================================

// Redirect to login if not authenticated
function requireAuth(redirectUrl = '../login/login.html') {
    onAuthStateChange((user) => {
        if (!user) {
            window.location.href = redirectUrl;
        }
    });
}

// Redirect to dashboard if already logged in
function redirectIfLoggedIn(redirectUrl = '../Utama/utama.html') {
    onAuthStateChange((user) => {
        if (user) {
            window.location.href = redirectUrl;
        }
    });
}

console.log('🔥 Firebase initialized successfully!');
