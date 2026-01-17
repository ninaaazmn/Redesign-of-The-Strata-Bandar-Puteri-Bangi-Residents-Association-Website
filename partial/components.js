/**
 * The Strata - Reusable Components Loader
 * ========================================
 * This script loads the navbar and footer dynamically into any page.
 * 
 * LOKASI FILE: /partial/components.js
 * 
 * HOW TO USE:
 * -----------
 * 1. Add these placeholders in your HTML where you want navbar and footer:
 *    <div id="navbar-placeholder"></div>
 *    <div id="footer-placeholder"></div>
 * 
 * 2. Add this script at the end of your <body> tag:
 *    <script src="../partial/components.js"></script>
 * 
 * 3. (Optional) Mark active nav item by adding data-active-page attribute to body:
 *    <body data-active-page="panduan_majlis">
 *    
 *    Valid values: panduan_majlis, kad_akses, direktori_kecemasan, sistem_aduan
 */

// Get the base path to the partial folder from the script's src
function getPartialBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        if (src.includes('components.js')) {
            // Extract the path up to and including /partial/
            const pathEnd = src.lastIndexOf('/');
            return src.substring(0, pathEnd + 1);
        }
    }
    // Fallback to relative path
    return '../partial/';
}

const PARTIAL_PATH = getPartialBasePath();

// Function to load HTML components
async function loadComponent(elementId, componentFile) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id "${elementId}" not found.`);
        return false;
    }

    const componentPath = PARTIAL_PATH + componentFile;

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
    // Get the current URL path
    const currentPath = window.location.pathname.toLowerCase();

    // Detect which page we're on by checking the URL
    let activePage = '';

    if (currentPath.includes('hubungi')) {
        activePage = 'hubungi_kami';
    } else if (currentPath.includes('kutipan')) {
        activePage = 'kutipan_sekuriti';
    } else if (currentPath.includes('pengumuman')) {
        activePage = 'pengumuman';
    } else if (currentPath.includes('panduan_majlis')) {
        activePage = 'panduan_majlis';
    } else if (currentPath.includes('kad') && currentPath.includes('akses')) {
        activePage = 'kad_akses';
    } else if (currentPath.includes('direktori')) {
        activePage = 'direktori_kecemasan';
    } else if (currentPath.includes('sistem') && currentPath.includes('aduan')) {
        activePage = 'sistem_aduan';
    }

    // Map page names to their link selectors
    const pageMap = {
        'hubungi_kami': 'a[href*="hubungi"]',
        'kutipan_sekuriti': 'a[href*="kutipan"]',
        'pengumuman': 'a[href*="Pengumuman"]',
        'panduan_majlis': 'a[href*="panduan_majlis"]',
        'kad_akses': 'a[href*="kad"]',
        'direktori_kecemasan': 'a[href*="direktori"]',
        'sistem_aduan': 'a[href*="sistem"]'
    };

    // Remove active class from all nav links first
    document.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        link.style.fontWeight = 'normal';
    });

    // Highlight the current page
    if (activePage && pageMap[activePage]) {
        const selector = pageMap[activePage];
        const link = document.querySelector(selector);
        if (link) {
            link.classList.add('active');
            link.style.fontWeight = 'bold';
        }
    }

    // Mark parent "Panduan Penduduk" as active for dropdown items
    const panduanLink = document.querySelector('.nav-panduan');
    if (panduanLink && ['panduan_majlis', 'kad_akses', 'direktori_kecemasan', 'sistem_aduan'].includes(activePage)) {
        panduanLink.classList.add('active');
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

function initDropdownToggle() {
    // Select all dropdown items to handle multiple dropdowns (Tentang Kami, Panduan Penduduk, etc.)
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        // Find the toggle link inside the dropdown item
        const link = item.querySelector('a');

        if (link) {
            link.addEventListener('click', function (event) {
                // Only toggle on mobile/tablet
                if (window.matchMedia('(max-width: 992px)').matches) {
                    // Prevent navigation only if it's a pure toggle (href="#") or if user wants to toggle dropdown
                    // For links with real hrefs (like Tentang Kami), we might want to navigate
                    // BUT usually in mobile menus, clicking the parent toggles the submenu.

                    // Logic: If submenu exists, toggle it and prevent default if needed
                    const submenu = item.querySelector('.dropdown-menu');
                    if (submenu) {
                        event.preventDefault();
                        item.classList.toggle('open');
                    }
                }
            });
        }
    });
}

// Function to handle navbar scroll behavior
function initNavbarScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    const topBar = document.querySelector('.top-bar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Show navbar if at top of page (within 100px) or scrolling up
        if (currentScroll <= 100) {
            navbar.style.transform = 'translateY(0)';
            if (topBar) topBar.style.transform = 'translateY(0)';
        } else if (currentScroll < lastScrollTop) {
            // Scrolling UP - show navbar
            navbar.style.transform = 'translateY(0)';
        } else {
            // Scrolling DOWN - hide navbar
            navbar.style.transform = 'translateY(-100%)';
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// Function to handle User Authentication state in Navbar
function initAuthUI() {
    // Dynamically load Firebase if it's missing (crucial for pages that forget to include it)
    if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK not found. Attempting to load dynamically...');

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const loadFirebase = async () => {
            try {
                // Determine relative path to js folder properly
                // PARTIAL_PATH ends in '/partial/', so we go up one level
                const basePath = PARTIAL_PATH.replace('partial/', '');

                await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
                await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js');
                await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js');
                await loadScript(basePath + 'js/firebase-config.js');

                // Now retry initAuthUI
                initAuthUI();
            } catch (error) {
                console.error('Failed to dynamic load Firebase:', error);
            }
        };

        loadFirebase();
        return;
    }

    // Safety check: if firebase is loaded but not initialized properly yet
    if (typeof onAuthStateChange !== 'function') {
        setTimeout(initAuthUI, 500);
        return;
    }

    const loginLink = document.getElementById('loginLink');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    const userDisplayName = document.getElementById('userDisplayName');
    const logoutBtn = document.getElementById('logoutBtn');

    onAuthStateChange(async (user) => {
        if (user) {
            // User is logged in - show profile dropdown, hide login link
            if (loginLink) loginLink.style.display = 'none';
            if (userProfileDropdown) userProfileDropdown.style.display = 'block';

            // Get user data and display name
            if (typeof getUserData === 'function') {
                const userData = await getUserData(user.uid);
                if (userData.success && userDisplayName) {
                    userDisplayName.textContent = userData.data.nama || user.email || 'Pengguna';
                }
            }
        } else {
            // User is NOT logged in - show login link, hide profile dropdown
            if (loginLink) loginLink.style.display = 'block';
            if (userProfileDropdown) userProfileDropdown.style.display = 'none';
        }
    });

    // Logout button handler
    if (logoutBtn) {
        // Remove existing listeners to avoid duplicates
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

        newLogoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (typeof logoutUser === 'function') {
                await logoutUser();
                window.location.href = '../Utama/utama.html';
            }
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
        initAuthUI(); // Auth decides which nav to show first
        setActiveNavItem();
        initMobileMenu();
        initDropdownToggle();
        initNavbarScroll();
        initChatbot(); // Initialize Chatbot
    }

    console.log('✅ Components loaded successfully from:', PARTIAL_PATH);
}

// Function to initialize Chatbot
function initChatbot() {
    // 1. Check if we are on the "Tentang Kami" page
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('tentang')) {
        return; // Do not show chatbot on Tentang Kami page
    }

    // 2. Determine image path relative to partials
    const imagePath = PARTIAL_PATH + '../public/robott-removebg-preview.png';

    // 3. Create Chatbot styles
    const style = document.createElement('style');
    style.textContent = `
        .chatbot-wrapper {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-family: 'Poppins', sans-serif;
        }

        .chatbot-trigger {
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: floatRobot 3s ease-in-out infinite;
            position: relative;
            z-index: 10001;
        }

        .chatbot-trigger:hover {
            transform: scale(1.05);
        }

        .chatbot-img {
            width: 80px; /* Back to original size */
            height: auto;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
            transition: all 0.3s ease;
        }

        /* Tooltip/Bubble */
        .chatbot-bubble {
            position: absolute;
            bottom: 90%;
            right: 10%;
            background: white;
            padding: 10px 15px;
            border-radius: 20px 20px 0 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            font-size: 0.9rem;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            opacity: 1; /* Always show initially */
            transform: translateY(0);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        /* Chat Window */
        .chatbot-window {
            position: absolute;
            bottom: 110px;
            right: 0;
            width: 320px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px) scale(0.9);
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10000;
            display: flex;
            flex-direction: column;
        }

        .chatbot-window.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .chat-header {
            background: linear-gradient(135deg, #7D1C3A 0%, #561025 100%); /* Maroon Theme */
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-header h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
        }

        .close-chat {
            background: none;
            border: none;
            color: rgba(255,255,255,0.8);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0;
        }

        .close-chat:hover {
            color: white;
        }

        .chat-body {
            padding: 15px;
            background: #f8f9fa;
            max-height: 400px;
            overflow-y: auto;
        }

        .chat-message {
            background: white;
            padding: 12px;
            border-radius: 12px;
            border-top-left-radius: 2px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            margin-bottom: 12px;
            font-size: 0.9rem;
            line-height: 1.5;
            color: #444;
            animation: slideIn 0.3s ease;
        }

        .chat-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 10px;
        }

        .chat-option-btn {
            background: white;
            border: 1px solid #ddd;
            padding: 10px 15px;
            border-radius: 20px;
            text-align: left !important;
            font-size: 0.85rem;
            color: #7D1C3A;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }

        .chat-option-btn:hover {
            background: #7D1C3A;
            color: white;
            border-color: #7D1C3A;
            transform: translateX(3px);
        }

        @keyframes floatRobot {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .chatbot-wrapper {
                bottom: 20px;
                right: 20px;
            }
            .chatbot-img {
                width: 60px;
            }
            .chatbot-window {
                width: 280px;
                bottom: 90px;
            }
        }
    `;
    document.head.appendChild(style);

    // 4. Create Chatbot Elements
    const wrapper = document.createElement('div');
    wrapper.className = 'chatbot-wrapper';

    // Chat Window HTML
    wrapper.innerHTML = `
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chat-header">
                <h3>Bantuan The Strata</h3>
                <button class="close-chat" id="closeChat">&times;</button>
            </div>
            <div class="chat-body" id="chatBody">
                <div class="chat-message">
                    Hai! 👋 Saya Strabot. Ada apa-apa yang boleh saya bantu hari ini? Pilih soalan di bawah:
                </div>
                <div class="chat-options" id="chatOptions">
                    <button class="chat-option-btn" data-answer="<strong>Ogos 2022 - Dis 2024:</strong> Melalui Toyyib Pay.<br><strong>2025 - Sekarang:</strong> Melalui Jaga App 2.0.">💰 Cara Pembayaran Sekuriti?</button>
                    <button class="chat-option-btn" data-answer="Untuk melihat rekod bayaran, anda perlu <strong>Log Masuk (Login)</strong> ke akaun anda terlebih dahulu.">� Cara lihat history bayaran?</button>
                    <button class="chat-option-btn" data-answer="Anda boleh membuat aduan kerosakan atau masalah kejiranan melalui menu 'Sistem Aduan'. Klik butang 'Lapor' pada kategori yang berkaitan.">📢 Macam mana nak buat aduan?</button>
                    <button class="chat-option-btn" data-answer="Sewa dewan boleh dilakukan di Pejabat Pengurusan. Sila bawa salinan kad pengenalan dan deposit tempahan RM100.">🏢 Macam mana nak sewa dewan serbaguna?</button>
                    <button class="chat-option-btn" data-answer="Waktu operasi pejabat pengurusan adalah Isnin-Jumaat (9pg - 5ptg) dan Sabtu (9pg - 1tgh hari). Ahad & Cuti Umum tutup.">🕒 Pukul berapa pejabat buka?</button>
                    <button class="chat-option-btn" data-answer="Borang pelekat kenderaan boleh didapati di pejabat pengurusan atau dimuat turun dari bahagian 'Dokumen' dalam profil anda.">🚗 Cara mohon sticker kereta?</button>
                </div>
            </div>
        </div>
        
        <div class="chatbot-trigger" id="chatbotTrigger">
            <div class="chatbot-bubble" id="chatBubble">Haii, boleh saya bantuu? 👋</div>
            <img src="${imagePath}" alt="Chatbot" class="chatbot-img">
        </div>
    `;

    document.body.appendChild(wrapper);

    // 5. Logic
    const trigger = document.getElementById('chatbotTrigger');
    const windowEl = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('closeChat');
    const bubble = document.getElementById('chatBubble');
    const chatBody = document.getElementById('chatBody');
    const chatOptions = document.getElementById('chatOptions');

    // Toggle Window
    trigger.addEventListener('click', () => {
        windowEl.classList.toggle('open');
        if (windowEl.classList.contains('open')) {
            bubble.style.opacity = '0'; // Hide bubble when open
            // Optionally stop animation or change icon
        } else {
            bubble.style.opacity = '1';
        }
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        windowEl.classList.remove('open');
        bubble.style.opacity = '1';
    });

    // Handle Options Click
    chatOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-option-btn')) {
            const answer = e.target.getAttribute('data-answer');
            const question = e.target.textContent;

            // Optional: User bubble
            // appendMessage(question, 'user');

            // Bot Response
            // Clear previous response if you want simple Q&A, or append for chat history
            // Let's reset the view to: Question -> Answer -> Back to Options

            chatBody.innerHTML = `
                <div class="chat-message" style="background: #FFF0F5; color: #7D1C3A; font-weight: 500;">
                    ${question}
                </div>
                <div class="chat-message">
                    ${answer}
                </div>
                <div class="chat-options">
                     <button class="chat-option-btn" onclick="resetChat()">↩ Tanyasoalan lain</button>
                     <button class="chat-option-btn" onclick="window.location.href='../hubungi kami/hubungi_kami.html'">📞 Hubungi Admin</button>
                </div>
            `;
        }
    });

    // Helper to reset chat
    window.resetChat = function () {
        chatBody.innerHTML = `
            <div class="chat-message">
                Hai! 👋 Saya Strabot. Ada apa-apa yang boleh saya bantu hari ini? Pilih soalan di bawah:
            </div>
            <div class="chat-options" id="chatOptions">
                <button class="chat-option-btn" data-answer="<strong>Ogos 2022 - Dis 2024:</strong> Melalui Toyyib Pay.<br><strong>2025 - Sekarang:</strong> Melalui Jaga App 2.0.">💰 Cara Pembayaran Sekuriti?</button>
                <button class="chat-option-btn" data-answer="Untuk melihat rekod bayaran, anda perlu <strong>Log Masuk (Login)</strong> ke akaun anda terlebih dahulu.">� Cara lihat history bayaran?</button>
                <button class="chat-option-btn" data-answer="Anda boleh membuat aduan kerosakan atau masalah kejiranan melalui menu 'Sistem Aduan'. Klik butang 'Lapor' pada kategori yang berkaitan.">📢 Macam mana nak buat aduan?</button>
                <button class="chat-option-btn" data-answer="Sewa dewan boleh dilakukan di Pejabat Pengurusan. Sila bawa salinan kad pengenalan dan deposit tempahan RM100.">🏢 Macam mana nak sewa dewan serbaguna?</button>
                <button class="chat-option-btn" data-answer="Waktu operasi pejabat pengurusan adalah Isnin-Jumaat (9pg - 5ptg) dan Sabtu (9pg - 1tgh hari). Ahad & Cuti Umum tutup.">🕒 Pukul berapa pejabat buka?</button>
                <button class="chat-option-btn" data-answer="Borang pelekat kenderaan boleh didapati di pejabat pengurusan atau dimuat turun dari bahagian 'Dokumen' dalam profil anda.">🚗 Cara mohon sticker kereta?</button>
            </div>
        `;
        // Re-attach listener is tricky with innerHTML reset, better to use delegation or just reload the initial structure
        // Since we are using innerHTML for the whole body, the delegation on 'chatOptions' (which was a variable pointing to the OLD element) might break if we don't handle it right.
        // Actually, the 'chat-options' div is recreated. We need to re-add the event listener OR attach listener to chatBody.

        // Let's attach listener to chatBody for delegation, which persists.
    };

    // Improved Event Delegation on Body instead of Options container
    chatBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-option-btn')) {
            if (e.target.hasAttribute('onclick')) return; // Allow inline onclicks (reset/contact) to work

            const answer = e.target.getAttribute('data-answer');
            const question = e.target.textContent;

            if (answer) {
                chatBody.innerHTML = `
                    <div class="chat-message" style="background: #E8F5E9; color: #1B5E20; text-align:right; align-self: flex-end; margin-left: auto;">
                        ${question}
                    </div>
                    <div class="chat-message">
                        ${answer}
                    </div>
                    <div class="chat-options">
                            <button class="chat-option-btn" onclick="resetChat()">↩ Tanya soalan lain</button>
                            <button class="chat-option-btn" onclick="window.location.href='../hubungi kami/hubungi_kami.html'">📞 Hubungi Admin</button>
                    </div>
                `;
            }
        }
    });

}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
} else {
    initComponents();
}

