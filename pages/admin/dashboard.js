// ============================================
// ADMIN DASHBOARD JAVASCRIPT
// ============================================

// DOM Elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');

// Initialize Firebase Storage
const storage = firebase.storage();

// Current admin user
let currentAdmin = null;
let allUsers = [];
let allPosts = [];

// ============================================
// AUTHENTICATION CHECK
// ============================================
onAuthStateChange(async (user) => {
    if (user) {
        const userData = await getUserData(user.uid);
        if (userData.success && userData.data.role === 'admin') {
            currentAdmin = { ...user, ...userData.data };
            document.getElementById('adminName').textContent = userData.data.nama || 'Admin';
            initDashboard();
        } else {
            await logoutUser();
            window.location.href = '../login/login.html';
        }
    } else {
        window.location.href = '../login/login.html';
    }
});

// ============================================
// INITIALIZATION
// ============================================
function initDashboard() {
    loadStats();
    loadUsers();
    loadPosts();
    loadDocuments();
    setupEventListeners();
}

function setupEventListeners() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
            sidebar.classList.remove('open');
        });
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await logoutUser();
        window.location.href = '../login/login.html';
    });

    // User filters
    document.getElementById('statusFilter').addEventListener('change', filterUsers);
    document.getElementById('searchUser').addEventListener('input', filterUsers);

    // New post button
    document.getElementById('newPostBtn').addEventListener('click', () => {
        openPostModal();
    });

    // Post form
    document.getElementById('postForm').addEventListener('submit', handlePostSubmit);
}

function switchSection(sectionName) {
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });

    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `section-${sectionName}`) {
            section.classList.add('active');
        }
    });

    const titles = {
        'dashboard': 'Dashboard',
        'users': 'Pengurusan Ahli',
        'posts': 'Pengumuman',
        'documents': 'Dokumen'
    };
    pageTitle.textContent = titles[sectionName] || 'Dashboard';
}

// ============================================
// LOAD DATA
// ============================================
async function loadStats() {
    try {
        const usersSnapshot = await db.collection('users').get();
        const postsSnapshot = await db.collection('posts').get();

        let pending = 0, approved = 0, rejected = 0;

        usersSnapshot.forEach(doc => {
            const user = doc.data();
            if (user.role !== 'admin') {
                if (user.status === 'pending') pending++;
                else if (user.status === 'approved') approved++;
                else if (user.status === 'rejected') rejected++;
            }
        });

        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('approvedCount').textContent = approved;
        document.getElementById('rejectedCount').textContent = rejected;
        document.getElementById('postsCount').textContent = postsSnapshot.size;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadUsers() {
    try {
        const snapshot = await db.collection('users')
            .orderBy('createdAt', 'desc')
            .get();

        allUsers = [];
        snapshot.forEach(doc => {
            const user = doc.data();
            if (user.role !== 'admin') {
                allUsers.push({ id: doc.id, ...user });
            }
        });

        displayUsers(allUsers);
        displayRecentRegistrations(allUsers.slice(0, 5));
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>Tiada pengguna dijumpai</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <span class="user-name" onclick="viewUserDetails('${user.id}')">${user.nama || '-'}</span>
            </td>
            <td>${user.email || '-'}</td>
            <td>${user.alamat?.noRumah || '-'}</td>
            <td>${user.hp || '-'}</td>
            <td>
                ${user.buktiKelayakan?.url
            ? `<a href="${user.buktiKelayakan.url}" target="_blank" class="doc-link">
                        <i class="fas fa-file-alt"></i> Lihat
                       </a>`
            : '<span style="color: #999;">-</span>'}
            </td>
            <td>
                <span class="recent-item-status status-${user.status || 'pending'}">
                    ${getStatusLabel(user.status)}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    ${user.status !== 'approved'
            ? `<button class="btn-approve" onclick="approveUser('${user.id}')">
                            <i class="fas fa-check"></i>
                           </button>`
            : ''}
                    ${user.status !== 'rejected'
            ? `<button class="btn-reject" onclick="rejectUser('${user.id}')">
                            <i class="fas fa-times"></i>
                           </button>`
            : ''}
                    <button class="btn-view" onclick="viewUserDetails('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function displayRecentRegistrations(users) {
    const container = document.getElementById('recentRegistrations');

    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Tiada pendaftaran terkini</p>
            </div>
        `;
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="recent-item">
            <div class="recent-item-info">
                <div class="recent-item-avatar">${getInitials(user.nama)}</div>
                <div class="recent-item-details">
                    <h4>${user.nama || 'Pengguna'}</h4>
                    <p>${user.email || ''} • ${formatDate(user.createdAt)}</p>
                </div>
            </div>
            <span class="recent-item-status status-${user.status || 'pending'}">
                ${getStatusLabel(user.status)}
            </span>
        </div>
    `).join('');
}

function filterUsers() {
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchUser').value.toLowerCase();

    let filtered = allUsers;

    if (status !== 'all') {
        filtered = filtered.filter(user => user.status === status);
    }

    if (search) {
        filtered = filtered.filter(user =>
            (user.nama && user.nama.toLowerCase().includes(search)) ||
            (user.email && user.email.toLowerCase().includes(search))
        );
    }

    displayUsers(filtered);
}

// ============================================
// USER ACTIONS
// ============================================
async function approveUser(userId) {
    showConfirm(
        'Sahkan Keahlian?',
        'Adakah anda pasti mahu meluluskan pendaftaran ahli ini?',
        'success',
        async () => {
            showLoading(true);
            try {
                await db.collection('users').doc(userId).update({
                    status: 'approved',
                    verified: true,
                    approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    approvedBy: currentAdmin.uid
                });
                showToast('Ahli berjaya disahkan!');
                loadStats();
                loadUsers();
            } catch (error) {
                showToast('Ralat berlaku', true);
                console.error(error);
            }
            showLoading(false);
        }
    );
}

async function rejectUser(userId) {
    showConfirm(
        'Tolak Pendaftaran?',
        'Adakah anda pasti mahu menolak pendaftaran ahli ini?',
        'danger',
        async () => {
            showLoading(true);
            try {
                await db.collection('users').doc(userId).update({
                    status: 'rejected',
                    verified: false,
                    rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    rejectedBy: currentAdmin.uid
                });
                showToast('Pendaftaran telah ditolak');
                loadStats();
                loadUsers();
            } catch (error) {
                showToast('Ralat berlaku', true);
                console.error(error);
            }
            showLoading(false);
        }
    );
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    const modalBody = document.getElementById('userModalBody');
    modalBody.innerHTML = `
        <div class="user-details-grid">
            <div class="user-detail-item">
                <label>Nama Penuh</label>
                <span>${user.nama || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>E-mel</label>
                <span>${user.email || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>No. K/P</label>
                <span>${user.kp || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>Bangsa</label>
                <span>${user.bangsa || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>No. Rumah</label>
                <span>${user.alamat?.noRumah || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>Jalan Puteri</label>
                <span>${user.alamat?.jalanPuteri || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>No. H/P</label>
                <span>${user.hp || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>Status Ahli</label>
                <span>${user.statusAhli?.join(', ') || '-'}</span>
            </div>
            <div class="user-detail-item">
                <label>Status Pendaftaran</label>
                <span class="recent-item-status status-${user.status || 'pending'}">
                    ${getStatusLabel(user.status)}
                </span>
            </div>
            <div class="user-detail-item">
                <label>Tarikh Daftar</label>
                <span>${formatDate(user.createdAt)}</span>
            </div>
            
            ${user.buktiKelayakan?.url ? `
                <div class="user-detail-item user-detail-full">
                    <label>Dokumen Bukti Kelayakan</label>
                    <a href="${user.buktiKelayakan.url}" target="_blank" class="document-link" style="margin-top: 10px;">
                        <i class="fas fa-file-alt"></i> ${user.buktiKelayakan.fileName || 'Lihat Dokumen'}
                    </a>
                </div>
            ` : ''}

            ${user.isirumah && user.isirumah.length > 0 ? `
                <div class="user-detail-section">
                    <h4><i class="fas fa-users"></i> Maklumat Isirumah</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Bil</th>
                                <th>Nama</th>
                                <th>Hubungan</th>
                                <th>No. Tel</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${user.isirumah.map((person, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${person.nama || '-'}</td>
                                    <td>${person.status || '-'}</td>
                                    <td>${person.tel || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}

            ${user.kenderaan && user.kenderaan.length > 0 ? `
                <div class="user-detail-section">
                    <h4><i class="fas fa-car"></i> Maklumat Kenderaan</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Bil</th>
                                <th>Jenis/Model</th>
                                <th>No. Pendaftaran</th>
                                <th>No. Pelekat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${user.kenderaan.map((vehicle, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${vehicle.jenis || '-'}</td>
                                    <td>${vehicle.no || '-'}</td>
                                    <td>${vehicle.pelekat || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
        </div>
    `;

    openModal('userModal');
}

// ============================================
// POSTS MANAGEMENT
// ============================================
async function loadPosts() {
    try {
        const snapshot = await db.collection('posts')
            .orderBy('createdAt', 'desc')
            .get();

        allPosts = [];
        snapshot.forEach(doc => {
            allPosts.push({ id: doc.id, ...doc.data() });
        });

        displayPosts(allPosts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function displayPosts(posts) {
    const container = document.getElementById('postsGrid');

    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-newspaper"></i>
                <p>Tiada pengumuman</p>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-image">
                ${post.image
            ? `<img src="${post.image}" alt="${post.title}">`
            : '<i class="fas fa-bullhorn"></i>'}
            </div>
            <div class="post-body">
                <span class="post-category">${post.category || 'Umum'}</span>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.content}</p>
                <div class="post-meta">
                    <span class="post-date">
                        <i class="fas fa-calendar"></i> ${formatDate(post.createdAt)}
                    </span>
                    <div class="post-actions">
                        <button class="btn-edit" onclick="editPost('${post.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="deletePost('${post.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function openPostModal(post = null) {
    document.getElementById('postModalTitle').textContent = post ? 'Edit Pengumuman' : 'Tambah Pengumuman';
    document.getElementById('postId').value = post?.id || '';
    document.getElementById('postTitle').value = post?.title || '';
    document.getElementById('postCategory').value = post?.category || 'umum';
    document.getElementById('postContent').value = post?.content || '';
    document.getElementById('postImage').value = post?.image || '';

    openModal('postModal');
}

function editPost(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (post) {
        openPostModal(post);
    }
}

async function handlePostSubmit(e) {
    e.preventDefault();

    const postId = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value.trim();
    const image = document.getElementById('postImage').value.trim();

    if (!title || !content) {
        showToast('Sila lengkapkan tajuk dan kandungan', true);
        return;
    }

    showLoading(true);

    try {
        const postData = {
            title,
            category,
            content,
            image: image || null,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (postId) {
            // Update existing post
            await db.collection('posts').doc(postId).update(postData);
            showToast('Pengumuman berjaya dikemaskini!');
        } else {
            // Create new post
            postData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            postData.createdBy = currentAdmin.uid;
            await db.collection('posts').add(postData);
            showToast('Pengumuman berjaya ditambah!');
        }

        closeModal('postModal');
        loadPosts();
        loadStats();
    } catch (error) {
        showToast('Ralat berlaku', true);
        console.error(error);
    }

    showLoading(false);
}

async function deletePost(postId) {
    showConfirm(
        'Padam Pengumuman?',
        'Adakah anda pasti mahu memadam pengumuman ini?',
        'danger',
        async () => {
            showLoading(true);
            try {
                await db.collection('posts').doc(postId).delete();
                showToast('Pengumuman berjaya dipadam');
                loadPosts();
                loadStats();
            } catch (error) {
                showToast('Ralat berlaku', true);
                console.error(error);
            }
            showLoading(false);
        }
    );
}

// ============================================
// DOCUMENTS
// ============================================
async function loadDocuments() {
    const container = document.getElementById('documentsGrid');

    const usersWithDocs = allUsers.filter(u => u.buktiKelayakan?.url);

    if (usersWithDocs.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-file-alt"></i>
                <p>Tiada dokumen dimuat naik</p>
            </div>
        `;
        return;
    }

    container.innerHTML = usersWithDocs.map(user => `
        <div class="document-card">
            <div class="document-icon">
                <i class="fas fa-${getFileIcon(user.buktiKelayakan.fileType)}"></i>
            </div>
            <div class="document-info">
                <h4>${user.nama || 'Pengguna'}</h4>
                <p>${user.buktiKelayakan.fileName || 'Dokumen'}</p>
                <p style="font-size: 0.75rem; margin-top: 5px;">
                    ${formatDate(user.buktiKelayakan.uploadedAt)}
                </p>
            </div>
            <a href="${user.buktiKelayakan.url}" target="_blank" class="document-link">
                <i class="fas fa-download"></i> Muat Turun
            </a>
        </div>
    `).join('');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showToast(message, isError = false) {
    const toastEl = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toastEl.className = 'toast show' + (isError ? ' error' : '');

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function showConfirm(title, message, type, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;

    const icon = document.getElementById('confirmIcon');
    icon.className = 'confirm-icon ' + type;
    icon.innerHTML = type === 'success'
        ? '<i class="fas fa-check-circle"></i>'
        : '<i class="fas fa-exclamation-triangle"></i>';

    document.getElementById('confirmBtn').onclick = () => {
        closeModal('confirmModal');
        onConfirm();
    };

    openModal('confirmModal');
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Menunggu',
        'approved': 'Disahkan',
        'rejected': 'Ditolak'
    };
    return labels[status] || 'Menunggu';
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(timestamp) {
    if (!timestamp) return '-';

    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
    } else {
        date = new Date(timestamp);
    }

    return date.toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function getFileIcon(fileType) {
    if (!fileType) return 'file';
    if (fileType.includes('pdf')) return 'file-pdf';
    if (fileType.includes('image')) return 'file-image';
    return 'file-alt';
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});
