// Permohonan Kad Akses & RFID - Interactive Features

document.addEventListener('DOMContentLoaded', function () {
    initializeCategorySelection();
    initializeCollapsibleSections();
    initializeMobileMenu();
    initializeCTAButton();
});

// Category Selection - Make cards interactive
function initializeCategorySelection() {
    const categoryCards = document.querySelectorAll('.app-option-row');

    categoryCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('selected'));

            // Add active class to clicked card
            this.classList.add('selected');

            // Visual feedback
            const icon = this.querySelector('.option-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            }
        });

        // Enhanced hover effect
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(8px)';
        });

        card.addEventListener('mouseleave', function () {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
}

// Collapsible Sections for "Terma Penting"
function initializeCollapsibleSections() {
    const termsCard = document.querySelector('.terms-card');

    if (termsCard) {
        const heading = termsCard.querySelector('h3');
        const termsList = termsCard.querySelector('.terms-list');

        if (heading && termsList) {
            // Add chevron icon
            heading.style.cursor = 'pointer';
            heading.style.display = 'flex';
            heading.style.alignItems = 'center';
            heading.style.justifyContent = 'space-between';

            const chevron = document.createElement('i');
            chevron.className = 'fa-solid fa-chevron-down';
            chevron.style.transition = 'transform 0.3s ease';
            heading.appendChild(chevron);

            // Initially collapsed on mobile
            if (window.innerWidth < 768) {
                termsList.style.maxHeight = '0';
                termsList.style.overflow = 'hidden';
                termsList.style.transition = 'max-height 0.3s ease';
                chevron.style.transform = 'rotate(-90deg)';
            } else {
                termsList.style.maxHeight = 'none';
            }

            // Toggle functionality
            heading.addEventListener('click', function () {
                const isCollapsed = termsList.style.maxHeight === '0px' || termsList.style.maxHeight === '';

                if (isCollapsed) {
                    termsList.style.maxHeight = termsList.scrollHeight + 'px';
                    chevron.style.transform = 'rotate(0deg)';
                } else {
                    termsList.style.maxHeight = '0';
                    chevron.style.transform = 'rotate(-90deg)';
                }
            });
        }
    }
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
}

// CTA Button Scroll Functionality
function initializeCTAButton() {
    const ctaButton = document.querySelector('.cta-main-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Scroll to category selection
            const categorySection = document.querySelector('.app-option-row');
            if (categorySection) {
                categorySection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Highlight the section briefly
                const parentCard = categorySection.closest('.card-elevated');
                if (parentCard) {
                    parentCard.style.boxShadow = '0 0 30px rgba(197, 160, 40, 0.4)';
                    setTimeout(() => {
                        parentCard.style.boxShadow = '';
                    }, 2000);
                }
            }
        });
    }
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    // Select and copy
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices

    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Failed to copy:', err);
    }

    document.body.removeChild(textarea);
}

// Show feedback when text is copied
function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        copyBtn.style.background = 'var(--accent-color)';

        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
