// Interactive Booking Form Logic

// Data store for form values
const formData = {
    eventName: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    applicantName: '',
    email: '',
    unitNo: '',
    phoneNo: ''
};

// Next Step Function
function nextStep(targetStep) {
    if (!validateStep(targetStep - 1)) {
        return; // Stop if validation fails
    }

    // Save data from current step
    saveData(targetStep - 1);

    // Update UI
    updateStepper(targetStep);
    showStep(targetStep);

    // If going to review step, populate it
    if (targetStep === 3) {
        populateReview();
    }
}

// Previous Step Function
function prevStep(targetStep) {
    updateStepper(targetStep);
    showStep(targetStep);
}

function updateStepper(step) {
    document.querySelectorAll('.step').forEach(el => {
        const stepNum = parseInt(el.dataset.step);
        const circle = el.querySelector('.circle');

        if (stepNum < step) {
            // Completed step
            el.classList.add('active'); // Keep it colored
            el.classList.add('completed');
            circle.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (stepNum === step) {
            // Current step
            el.classList.add('active');
            el.classList.remove('completed');
            circle.innerHTML = stepNum; // Restore number
        } else {
            // Future step
            el.classList.remove('active');
            el.classList.remove('completed');
            circle.innerHTML = stepNum; // Restore number
        }
    });
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    // Add small delay for fade effect if desired, but CSS animation handles it on display:block
    document.getElementById(`step${step}`).classList.add('active');
}

function saveData(step) {
    if (step === 1) {
        formData.eventName = document.getElementById('eventName').value;
        formData.eventDate = document.getElementById('eventDate').value;
        formData.eventTime = document.getElementById('eventTime').value;
        formData.guestCount = document.getElementById('guestCount').value;
    } else if (step === 2) {
        formData.applicantName = document.getElementById('applicantName').value;
        formData.email = document.getElementById('email').value;
        formData.unitNo = document.getElementById('unitNo').value;
        formData.phoneNo = document.getElementById('phoneNo').value;
    }
}

function validateStep(step) {
    // Basic validation
    let isValid = true;
    if (step === 1) {
        const required = ['eventName', 'eventDate', 'eventTime'];
        required.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value) {
                el.style.borderColor = 'var(--primary-color)';
                el.style.boxShadow = '0 0 0 2px rgba(125, 28, 58, 0.1)';
                isValid = false;
            } else {
                el.style.borderColor = '#eee';
                el.style.boxShadow = 'none';
            }

            // Remove error on input
            el.addEventListener('input', function () {
                this.style.borderColor = '#eee';
                this.style.boxShadow = 'none';
            });
        });
    }
    return isValid;
}

function populateReview() {
    document.getElementById('reviewEvent').textContent = formData.eventName || '-';
    document.getElementById('reviewDate').textContent = formData.eventDate || '-';
    document.getElementById('reviewTime').textContent = formData.eventTime || '-';
    document.getElementById('reviewGuests').textContent = formData.guestCount || '-';
    document.getElementById('reviewName').textContent = formData.applicantName || '-';
    document.getElementById('reviewEmail').textContent = formData.email || '-';
    document.getElementById('reviewUnit').textContent = formData.unitNo || '-';
    document.getElementById('reviewPhone').textContent = formData.phoneNo || '-';
}

// Handle Form Submission
document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Simulate loading
    const btn = this.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menghantar...';
    btn.disabled = true;

    setTimeout(() => {
        alert('Permohonan anda telah berjaya dihantar! Pihak pengurusan akan menghubungi anda untuk pengesahan.');
        btn.innerHTML = originalText;
        btn.disabled = false;
        // Optional: Reset form or redirect
        // window.location.reload();
    }, 2000);
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // If this is the dropdown toggle, don't close the menu
                if (link.parentElement.classList.contains('dropdown-item')) {
                    return;
                }

                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }
});
