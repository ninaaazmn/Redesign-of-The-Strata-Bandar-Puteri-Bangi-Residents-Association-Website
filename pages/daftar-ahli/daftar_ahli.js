// Modal functionality
const termsModal = document.getElementById('termsModal');
const openTermsBtn = document.getElementById('openTermsBtn');
const closeTermsBtn = document.getElementById('closeTermsBtn');
const acceptTermsBtn = document.getElementById('acceptTermsBtn');

// Open modal
openTermsBtn.addEventListener('click', () => {
    termsModal.classList.add('show');
    document.body.style.overflow = 'hidden';
});

// Close modal
closeTermsBtn.addEventListener('click', () => {
    termsModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

acceptTermsBtn.addEventListener('click', () => {
    termsModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === termsModal) {
        termsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// File Upload Handler
const fileInput = document.getElementById('bukti_kelayakan');
const fileUploadLabel = document.querySelector('.file-upload-label');
const fileNameDisplay = document.querySelector('.file-name-display');

// Click to upload
fileUploadLabel.addEventListener('click', () => {
    fileInput.click();
});

// File selection handler
fileInput.addEventListener('change', (e) => {
    handleFileUpload(e.target.files[0]);
});

// Drag and drop
fileUploadLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadLabel.style.backgroundColor = '#e3f2fd';
    fileUploadLabel.style.borderColor = 'var(--primary-dark)';
});

fileUploadLabel.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileUploadLabel.style.backgroundColor = '#fafafa';
    fileUploadLabel.style.borderColor = 'var(--primary-color)';
});

fileUploadLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadLabel.style.backgroundColor = '#fafafa';
    fileUploadLabel.style.borderColor = 'var(--primary-color)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

function handleFileUpload(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!allowedTypes.includes(file.type)) {
        alert('Format fail tidak dibenarkan. Sila gunakan PDF, JPG, atau PNG.');
        return;
    }
    
    if (file.size > maxSize) {
        alert('Saiz fail melebihi had maksimum 5MB.');
        return;
    }
    
    fileNameDisplay.textContent = '✓ ' + file.name + ' (dimuat naik dengan jayanya)';
    fileNameDisplay.style.display = 'block';
}

// Dynamic Table Row Management
function addTableRow(tableBodyId, rowType) {
    const tableBody = document.getElementById(tableBodyId);
    const currentRows = tableBody.querySelectorAll('.table-row').length;
    const newRowNumber = currentRows + 1;
    
    let newRow;
    
    if (rowType === 'isirumah') {
        newRow = document.createElement('tr');
        newRow.className = 'table-row';
        newRow.innerHTML = `
            <td class="row-number">${newRowNumber}.</td>
            <td><input type="text" name="isirumah_nama[]" class="isirumah-input"></td>
            <td><input type="text" name="isirumah_status[]" class="isirumah-input"></td>
            <td><input type="text" name="isirumah_tel[]" class="isirumah-input"></td>
            <td class="action-cell">
                <button type="button" class="btn-remove-row">✕</button>
            </td>
        `;
    } else if (rowType === 'kenderaan') {
        newRow = document.createElement('tr');
        newRow.className = 'table-row';
        newRow.innerHTML = `
            <td class="row-number">${newRowNumber}.</td>
            <td><input type="text" name="kenderaan_jenis[]" class="kenderaan-input"></td>
            <td><input type="text" name="kenderaan_no[]" class="kenderaan-input"></td>
            <td><input type="text" name="kenderaan_pelekat[]" class="kenderaan-input"></td>
            <td class="action-cell">
                <button type="button" class="btn-remove-row">✕</button>
            </td>
        `;
    }
    
    tableBody.appendChild(newRow);
    
    // Add remove functionality to the new row
    newRow.querySelector('.btn-remove-row').addEventListener('click', (e) => {
        e.preventDefault();
        removeTableRow(newRow, tableBodyId);
    });
    
    // Update row numbers and visibility of remove buttons
    updateTableDisplay(tableBodyId);
}

function removeTableRow(row, tableBodyId) {
    row.remove();
    updateTableDisplay(tableBodyId);
}

function updateTableDisplay(tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    const rows = tableBody.querySelectorAll('.table-row');
    
    rows.forEach((row, index) => {
        // Update row number
        row.querySelector('.row-number').textContent = (index + 1) + '.';
        
        // Show remove button only if there are 2 or more rows
        const removeBtn = row.querySelector('.btn-remove-row');
        if (rows.length > 1) {
            removeBtn.style.display = 'block';
        } else {
            removeBtn.style.display = 'none';
        }
    });
}

// Event listeners for add buttons
document.getElementById('addIsirumahRow').addEventListener('click', (e) => {
    e.preventDefault();
    addTableRow('isirumahTableBody', 'isirumah');
});

document.getElementById('addKenderaanRow').addEventListener('click', (e) => {
    e.preventDefault();
    addTableRow('kenderaanTableBody', 'kenderaan');
});

// Form submission
const registrationForm = document.querySelector('.registration-form');
const successModal = document.getElementById('successModal');
const okBtn = document.getElementById('okBtn');

if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Show success modal
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        registrationForm.reset();
    });
}

// OK button handler - redirect to utama page
okBtn.addEventListener('click', () => {
    window.location.href = '../../pages/utama/utama.html';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === successModal) {
        window.location.href = '../../pages/utama/utama.html';
    }
});

