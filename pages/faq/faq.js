// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.getElementById('navLinks');
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

// FAQ Accordion functionality
const faqQuestions = document.querySelectorAll('.faq-question');
const categoryBtns = document.querySelectorAll('.category-btn');
const searchInput = document.getElementById('searchInput');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Accordion toggle
faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
        const faqItem = this.closest('.faq-item');
        
        // Close other open items
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.closest('.faq-item').classList.remove('active');
            }
        });
        
        // Toggle current item
        faqItem.classList.toggle('active');
    });
});

// Category filtering (only if category buttons exist)
if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter FAQ items
            const category = this.getAttribute('data-category');
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                if (category === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const itemCategories = item.getAttribute('data-category').split(' ');
                    if (itemCategories.includes(category)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
            
            // Clear search
            if (searchInput) {
                searchInput.value = '';
            }
        });
    });
}

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const questionText = item.querySelector('.question-text').textContent.toLowerCase();
            const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
            
            if (searchTerm === '' || questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
}

// Scroll to Top Button
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
