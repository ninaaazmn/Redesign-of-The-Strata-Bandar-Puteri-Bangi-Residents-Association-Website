// Accordion Functionality
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const accordionContent = button.nextElementSibling;

        // Toggle active class on header
        button.classList.toggle('active');

        // Toggle max-height for smooth transition
        if (button.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        } else {
            accordionContent.style.maxHeight = 0;
        }

        // Close other open items (Optional, for accordion effect)
        document.querySelectorAll('.accordion-header').forEach(otherButton => {
            if (otherButton !== button && otherButton.classList.contains('active')) {
                otherButton.classList.remove('active');
                otherButton.nextElementSibling.style.maxHeight = 0;
            }
        });
    });
});

// Copy to Clipboard Functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('No. Akaun disalin: ' + text);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Mobile Menu Functionality (Common across pages)
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }
});
