/**
 * The Strata - Reusable Components Loader
 * ========================================
 * This script loads the navbar and footer dynamically into any page.
 * 
 * HOW TO USE:
 * -----------
 * 1. Add these placeholders in your HTML where you want navbar and footer:
 *    <div id="navbar-placeholder"></div>
 *    <div id="footer-placeholder"></div>
 * 
 * 2. Add this script at the end of your <body> tag:
 *    <script src="components.js"></script>
 * 
 * 3. (Optional) Mark active nav item by adding data-active-page attribute to body:
 *    <body data-active-page="panduan_majlis">
 *    
 *    Valid values: panduan_majlis, kad_akses, direktori_kecemasan, sistem_aduan
 */

// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id "${elementId}" not found.`);
        return;
    }

    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status}`);
        }
        const html = await response.text();
        element.innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Error loading component: ${error.message}`);
        return false;
    }
}

// Function to highlight active navigation item
function setActiveNavItem() {
    const activePage = document.body.getAttribute('data-active-page');

    if (!activePage) return;

    // Map page names to their link selectors
    const pageMap = {
        'panduan_majlis': 'a[href="panduan_majlis.html"]',
        'kad_akses': 'a[href*="kad akses"]',
        'direktori_kecemasan': 'a[href="direktori_kecemasan.html"]',
        'sistem_aduan': 'a[href="sistem_aduan.html"]'
    };

    // Also mark parent "Panduan Penduduk" as active
    const panduanLink = document.querySelector('.nav-panduan');
    if (panduanLink && Object.keys(pageMap).includes(activePage)) {
        panduanLink.classList.add('active');
    }

    // Mark the specific dropdown item as active
    const selector = pageMap[activePage];
    if (selector) {
        const link = document.querySelector(selector);
        if (link) {
            link.classList.add('active');
            link.style.fontWeight = 'bold';
        }
    }
}

// Function to initialize mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('show');
        });
    }
}

// Main initialization function
async function initComponents() {
    // Load navbar
    const navbarLoaded = await loadComponent('navbar-placeholder', 'navbar.html');

    // Load footer
    const footerLoaded = await loadComponent('footer-placeholder', 'footer.html');

    // After components are loaded, initialize functionality
    if (navbarLoaded) {
        setActiveNavItem();
        initMobileMenu();
    }

    console.log('✅ Components loaded successfully!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
} else {
    initComponents();
}
