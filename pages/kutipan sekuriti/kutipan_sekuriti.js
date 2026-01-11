// Kutipan Sekuriti - Payment Page Script

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePaymentTable('2024');
    setupYearSelector();
    setupStatusFilter();
    setupFAQ();
});

// Year selector functionality
function setupYearSelector() {
    document.querySelectorAll('.year-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Reset filter to 'semua' when changing year
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="semua"]').classList.add('active');
            
            // Update payment table based on selected year
            const year = this.dataset.year;
            updatePaymentTable(year);
        });
    });
}

// Status filter functionality
function setupStatusFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get current year and filter
            const year = document.querySelector('.year-btn.active').dataset.year;
            const filter = this.dataset.filter;
            
            // Update table with filter
            updatePaymentTable(year, filter);
        });
    });
}

// Update payment table data
function updatePaymentTable(year, filter = 'semua') {
    // Check if year is 2025 or beyond
    if (year >= 2025) {
        showMessageFor2025AndBeyond();
        return;
    }

    // Sample data for different years
    const paymentData = {
        2022: [
            { month: 'Januari', status: 'selesai', action: '–' },
            { month: 'Februari', status: 'selesai', action: '–' },
            { month: 'Mac', status: 'selesai', action: '–' },
            { month: 'April', status: 'selesai', action: '–' },
            { month: 'Mei', status: 'selesai', action: '–' },
            { month: 'Jun', status: 'selesai', action: '–' },
            { month: 'Julai', status: 'selesai', action: '–' },
            { month: 'Agustus', status: 'selesai', action: '–' },
            { month: 'September', status: 'selesai', action: '–' },
            { month: 'Oktober', status: 'selesai', action: '–' },
            { month: 'November', status: 'selesai', action: '–' },
            { month: 'Disember', status: 'selesai', action: '–' }
        ],
        2023: [
            { month: 'Januari', status: 'selesai', action: '–' },
            { month: 'Februari', status: 'selesai', action: '–' },
            { month: 'Mac', status: 'selesai', action: '–' },
            { month: 'April', status: 'selesai', action: '–' },
            { month: 'Mei', status: 'selesai', action: '–' },
            { month: 'Jun', status: 'tertunggak', action: 'BAYAR' },
            { month: 'Julai', status: 'selesai', action: '–' },
            { month: 'Agustus', status: 'selesai', action: '–' },
            { month: 'September', status: 'selesai', action: '–' },
            { month: 'Oktober', status: 'selesai', action: '–' },
            { month: 'November', status: 'selesai', action: '–' },
            { month: 'Disember', status: 'selesai', action: '–' }
        ],
        2024: [
            { month: 'Januari', status: 'selesai', action: '–' },
            { month: 'Februari', status: 'selesai', action: '–' },
            { month: 'Mac', status: 'selesai', action: '–' },
            { month: 'April', status: 'selesai', action: '–' },
            { month: 'Mei', status: 'selesai', action: '–' },
            { month: 'Jun', status: 'tertunggak', action: 'BAYAR' },
            { month: 'Julai', status: 'selesai', action: '–' },
            { month: 'Agustus', status: 'selesai', action: '–' },
            { month: 'September', status: 'tertunggak', action: 'BAYAR' },
            { month: 'Oktober', status: 'selesai', action: '–' },
            { month: 'November', status: 'tertunggak', action: 'BAYAR' },
            { month: 'Disember', status: 'selesai', action: '–' }
        ],
    
    };

    // Get current data
    const currentData = paymentData[year];
    
    // Filter data based on selected filter
    let filteredData = currentData;
    if (filter !== 'semua') {
        filteredData = currentData.filter(item => item.status === filter);
    }
    
    // Update table
    const tableBody = document.getElementById('paymentTableBody');
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" style="text-align: center; padding: 30px; color: #998F92;">Tiada data untuk paparan</td>';
        tableBody.appendChild(row);
    } else {
        filteredData.forEach((item) => {
            const row = document.createElement('tr');
            const originalIndex = currentData.findIndex(d => d.month === item.month) + 1;
            const actionCell = item.action === 'BAYAR' 
                ? `<button class="btn-bayar" onclick="initiatePayment('${item.month}', '${year}')">BAYAR</button>`
                : '–';
            
            row.innerHTML = `
                <td>${originalIndex}.</td>
                <td>${item.month}</td>
                <td><span class="status-badge ${item.status}">${item.status === 'selesai' ? 'SELESAI' : 'TERTUNGGAK'}</span></td>
                <td>${actionCell}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Update summary
    updateSummary(currentData);
}

// Show message for 2025 and beyond
function showMessageFor2025AndBeyond() {
    const tableBody = document.getElementById('paymentTableBody');
    tableBody.innerHTML = '';
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td colspan="4" style="text-align: center; padding: 40px; color: var(--text-dark);">
            <div style="line-height: 1.8;">
                <p style="margin-bottom: 15px; font-weight: 600; font-size: 1.1em;">Bayaran masih boleh guna link ToyyibPay untuk Sekuriti 2025</p>
                <p style="margin-bottom: 20px; color: var(--text-grey);">Untuk 2025 keatas, perlu melalui aplikasi JagaApp 2.0.</p>
                <p style="color: var(--text-grey); font-size: 0.95em;">Link ToyyibPay hanya untuk backdated payment sahaja (Aug 2022 - Dec 2024)</p>
            </div>
        </td>
    `;
    tableBody.appendChild(row);
    
    // Clear summary for 2025
    document.getElementById('completedCount').textContent = '–';
    document.getElementById('outstandingCount').textContent = '–';
    document.getElementById('outstandingAmount').textContent = '–';
}

// Update summary section
function updateSummary(data) {
    const completedCount = data.filter(item => item.status === 'selesai').length;
    const outstandingCount = data.filter(item => item.status === 'tertunggak').length;
    const outstandingAmount = outstandingCount * 100; // Assuming RM100 per month

    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('outstandingCount').textContent = outstandingCount;
    document.getElementById('outstandingAmount').textContent = `RM ${outstandingAmount}`;
}

// Payment initiation
function initiatePayment(month, year) {
    // Create TOYYIBPAY URL based on month and year
    // Format: Sekuriti-{Month}-{YearShort}
    const monthMap = {
        'Januari': 'Jan',
        'Februari': 'Feb',
        'Mac': 'Mar',
        'April': 'Apr',
        'Mei': 'May',
        'Jun': 'Jun',
        'Julai': 'Jul',
        'Agustus': 'Aug',
        'September': 'Sep',
        'Oktober': 'Oct',
        'November': 'Nov',
        'Disember': 'Dec'
    };
    
    const monthAbbrev = monthMap[month];
    const yearShort = year.toString().slice(-2); // Get last 2 digits of year
    const toyyibPayUrl = `https://toyyibpay.com/Sekuriti-${monthAbbrev}-${yearShort}`;
    
    // Redirect to TOYYIBPAY
    window.location.href = toyyibPayUrl;
}

// FAQ Accordion
function setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            
            // Close other open items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
        });
    });
}