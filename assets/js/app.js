// assets/js/app.js

// --- 1. GLOBAL UI CONSTANTS ---
const healthTips = [
    "Calculate your BMI in seconds.",
    "Check genotype compatibility.",
    "Track your daily mental wellness.",
    "Monitor your health history securely."
];
let tipInterval;

// --- 2. BEAUTIFUL ALERT SYSTEM ---
// Replaces standard alert() and confirm()
window.showMTAlert = function(title, message, type = 'success', callback = null) {
    const modalHTML = `
    <div class="modal fade" id="mtDynamicModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content mt-card border-0 shadow-lg p-3">
                <div class="modal-body text-center">
                    <div class="bg-${type} bg-opacity-10 text-${type} rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                        <i class="bi ${type === 'success' ? 'bi-check-lg' : 'bi-exclamation-triangle'} fs-1"></i>
                    </div>
                    <h3 class="fw-bold text-dark mb-2">${title}</h3>
                    <p class="text-muted mb-4">${message}</p>
                    <button type="button" class="btn btn-primary-mt px-5 py-2 w-100" data-bs-dismiss="modal" id="mtModalConfirm">OK</button>
                </div>
            </div>
        </div>
    </div>`;

    let container = document.getElementById('mt-modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'mt-modal-container';
        document.body.appendChild(container);
    }
    container.innerHTML = modalHTML;

    const modalElement = document.getElementById('mtDynamicModal');
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();

    if (callback) {
        document.getElementById('mtModalConfirm').addEventListener('click', callback);
    }
};

// --- 3. MAIN APP LOGIC (Fired by Router) ---
window.initAppLogic = function() {
    const hash = window.location.hash.slice(1) || '/';
    clearInterval(tipInterval);

    if (hash === '/') {
        startLandingPageAnimation();
    }
};

// --- 4. ANIMATION LOGIC ---
function startLandingPageAnimation() {
    const tipElement = document.getElementById('dynamic-health-tip');
    if (!tipElement) return;

    let currentIndex = 0;
    tipInterval = setInterval(() => {
        tipElement.style.opacity = 0;
        tipElement.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % healthTips.length;
            tipElement.innerText = healthTips[currentIndex];
            tipElement.style.opacity = 1;
        }, 300);
    }, 3000);
}

// --- 5. GLOBAL EVENT DELEGATION ---

// Handle Visitor Status Toggles
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'visitor_status') {
        const schoolContainer = document.getElementById('school_name_container');
        const occupationContainer = document.getElementById('occupation_container');
        
        if (e.target.value === 'student') {
            schoolContainer.classList.remove('d-none');
            occupationContainer.classList.add('d-none');
        } else {
            occupationContainer.classList.remove('d-none');
            schoolContainer.classList.add('d-none');
        }
    }
});

// Handle Guest Access and Registration Alerts
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn_guest_access') {
        // Using our custom alert style for a "Confirm" feel
        window.showMTAlert(
            "Guest Access", 
            "Your data will not be saved in this mode. Continue?", 
            "warning", 
            () => {
                sessionStorage.setItem('meditrack_role', 'Guest');
                window.location.hash = '/dashboard';
            }
        );
    }
});

// Handle Student Registration
document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'form_student_register') {
        e.preventDefault();
        
        const pass = document.getElementById('student_password').value;
        const confirmPass = document.getElementById('student_password_confirm').value;
        
        if (pass !== confirmPass) {
            window.showMTAlert("Error", "Passwords do not match. Please re-enter.", "danger");
            return;
        }

        // Logic for handoff/DB saving goes here
        window.showMTAlert(
            "Success!", 
            "Registration Data Captured! Routing to login...", 
            "success", 
            () => { window.location.hash = '/login'; }
        );
    }
});