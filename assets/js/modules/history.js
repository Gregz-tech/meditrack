// assets/js/modules/history.js

window.initHistory = async function() {
    const timeline = document.getElementById('history_timeline');
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    
    // Safety check for session
    if (!activeUser) {
        window.location.hash = '/login';
        return;
    }

    if (!timeline) return;

    // 1. Fetch real data from IndexedDB using our helper
    // This calls the function we just added to db.js
    const records = await getUserRecords(activeUser.email);

    // 2. Handle Empty State
    if (records.length === 0) {
        timeline.innerHTML = `
            <div class="text-center py-5 view-enter">
                <i class="bi bi-folder2-open display-1 text-muted opacity-25"></i>
                <h5 class="mt-3 fw-bold text-muted">No records found</h5>
                <p class="small text-muted">Your health assessments will appear here once saved.</p>
                <a href="#/dashboard" class="btn btn-primary-mt btn-sm mt-2">Go to Dashboard</a>
            </div>`;
        return;
    }

    // 3. Clear existing content and build the dynamic timeline
    timeline.innerHTML = '';
    
    records.forEach(rec => {
        // Format the date nicely (e.g., Mar 14, 2026)
        const dateObj = new Date(rec.date);
        const dateString = dateObj.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
        
        // Define module-specific styling
        let colorClass = 'primary';
        let icon = 'bi-activity';

        if (rec.type === 'Genotype') {
            colorClass = 'success';
            icon = 'bi-droplet-half';
        } else if (rec.type === 'Wellness') {
            colorClass = 'warning';
            icon = 'bi-emoji-smile';
        }

        // Create the timeline item HTML
        const itemHTML = `
            <div class="mb-5 position-relative view-enter">
                <div class="position-absolute top-0 start-0 translate-middle-x bg-${colorClass} rounded-circle" 
                     style="width: 12px; height: 12px; left: -1px; margin-left: -12px; margin-top: 8px; z-index: 2;">
                </div>
                
                <div class="mt-card border-0 shadow-sm p-3 ms-2">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-${colorClass} bg-opacity-10 text-${colorClass === 'warning' ? 'warning-emphasis' : colorClass} small">
                            <i class="bi ${icon} me-1"></i> ${rec.type}
                        </span>
                        <span class="text-muted" style="font-size: 0.75rem;">${dateString}</span>
                    </div>
                    
                    <h5 class="fw-bold mb-1 text-dark">
                        ${rec.type === 'Genotype' ? 'Pairing' : 'Result'}: ${rec.value}
                    </h5>
                    
                    ${rec.label ? `<p class="text-muted small mb-0 fw-medium">${rec.label}</p>` : ''}
                </div>
            </div>`;
        
        timeline.insertAdjacentHTML('beforeend', itemHTML);
    });

    // 4. Filtering Logic (UI Only)
    const filterButtons = document.querySelectorAll('.rounded-pill');
    filterButtons.forEach(btn => {
        btn.onclick = function() {
            // Update UI State
            filterButtons.forEach(b => b.classList.replace('btn-primary-mt', 'btn-outline-secondary'));
            this.classList.replace('btn-outline-secondary', 'btn-primary-mt');
            
            // Note: For advanced filtering, you would re-filter the 'records' array 
            // and re-run the loop above.
            console.log(`User wants to filter by: ${this.innerText}`);
        };
    });
};