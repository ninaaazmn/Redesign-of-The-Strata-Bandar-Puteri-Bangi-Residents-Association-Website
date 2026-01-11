// Hubungi Kami - Contact Page Script

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupFeedbackButton();
});

// Setup contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (!validateContactForm(formData)) {
                return;
            }
            
            // Submit form (in production, send to backend)
            submitContactForm(formData);
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    // Check required fields
    if (!data.name.trim()) {
        showAlert('Sila masukkan nama anda', 'error');
        return false;
    }
    
    if (!data.email.trim()) {
        showAlert('Sila masukkan email anda', 'error');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showAlert('Sila masukkan email yang sah', 'error');
        return false;
    }
    
    if (!data.subject.trim()) {
        showAlert('Sila masukkan subjek', 'error');
        return false;
    }
    
    if (!data.message.trim()) {
        showAlert('Sila masukkan mesej anda', 'error');
        return false;
    }
    
    return true;
}

// Submit contact form
function submitContactForm(formData) {
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'MENGHANTAR...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual backend call)
    setTimeout(function() {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showAlert('Terima kasih! Kami telah menerima mesej anda. Kami akan menghubungi anda dalam masa 48 jam.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
    }, 1500);
    
    // In production, use:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     submitBtn.textContent = originalText;
    //     submitBtn.disabled = false;
    //     
    //     if (data.success) {
    //         showAlert(data.message, 'success');
    //         document.getElementById('contactForm').reset();
    //     } else {
    //         showAlert(data.message, 'error');
    //     }
    // })
    // .catch(error => {
    //     submitBtn.textContent = originalText;
    //     submitBtn.disabled = false;
    //     showAlert('Terjadi ralat. Sila cuba lagi.', 'error');
    // });
}

// Setup feedback button
function setupFeedbackButton() {
    const feedbackBtn = document.querySelector('.btn-feedback');
    
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Open Google Form in new window
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSfc_rtuEJTd0DFIiznl8t66rn7fi3fw7jcx3qScs74mudDQBg/viewform?usp=send_form', '_blank');
        });
    }
}

// Show alert message
function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Style the alert
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set color based on type
    if (type === 'success') {
        alert.style.backgroundColor = '#A8D5BA';
        alert.style.color = '#2D5A3D';
    } else if (type === 'error') {
        alert.style.backgroundColor = '#F5A5A5';
        alert.style.color = '#7D2C2C';
    } else if (type === 'info') {
        alert.style.backgroundColor = '#D4E6F1';
        alert.style.color = '#1A4D6D';
    }
    
    // Add to body
    document.body.appendChild(alert);
    
    // Remove after 4 seconds
    setTimeout(function() {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            alert.remove();
        }, 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
