// Define the routes matching your views folder
const routes = {
    '/': 'views/landing.html',
    '/roles': 'views/role-selection.html',
    '/register-student': 'views/register-student.html',
    '/register-staff': 'views/register-staff.html', 
    '/register-visitor': 'views/register-visitor.html', 
    '/login': 'views/login.html',
    '/dashboard': 'views/dashboard.html',
    '/module-bmi': 'views/module-bmi.html',
    '/module-genotype': 'views/module-genotype.html',
    '/module-wellness': 'views/module-wellness.html',
    '/history': 'views/history.html'
};

const router = async () => {
    const appRoot = document.getElementById('app-root');
    let path = window.location.hash.slice(1) || '/';
    const viewPath = routes[path];

    if (!viewPath) {
        appRoot.innerHTML = `
            <div class="text-center view-enter mt-5">
                <h1 class="display-1 fw-bold text-muted">404</h1>
                <p class="lead">Module not found.</p>
                <a href="#/" class="btn btn-primary-mt">Return Home</a>
            </div>`;
        return;
    }

    try {
        const response = await fetch(viewPath);
        const html = await response.text();
        
        // --- SECURITY & SESSION CHECK ---
        // Check if current path is a "private" app area
        const isAppArea = path === '/dashboard' || path.startsWith('/module-') || path === '/history';
        const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));

        if (isAppArea && !activeUser) {
            // Redirect to Landing Page if session is missing
            window.location.hash = '/';
            return;
        }

        // Inject the HTML fragment
        appRoot.innerHTML = `<div class="view-enter">${html}</div>`;
        
        // --- NAVBAR CONTEXT LOGIC ---
        const authLinks = document.getElementById('nav-auth-links');
        const userLinks = document.getElementById('nav-user-links');

        if (isAppArea) {
            authLinks?.classList.add('d-none');
            userLinks?.classList.remove('d-none');
        } else {
            authLinks?.classList.remove('d-none');
            userLinks?.classList.add('d-none');
        }

        // --- GLOBAL LOGIC TRIGGER ---
        if (typeof window.initAppLogic === 'function') window.initAppLogic();

        // --- AUTH & DYNAMIC CONTENT TRIGGER ---
        const authPaths = ['/login', '/register-student', '/register-staff', '/register-visitor'];
        if (authPaths.includes(path) && typeof window.initAuth === 'function') {
            window.initAuth();
        }

        // --- DASHBOARD PERSONALIZATION ---
        if (path === '/dashboard' && activeUser) {
            const nameDisplay = document.getElementById('user_display_name');
            if (nameDisplay) nameDisplay.innerText = activeUser.name;
            
            const avatarImg = document.querySelector('img[alt="Profile"]');
            if (avatarImg) {
                avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.name)}&background=1FA971&color=fff`;
            }
        }

        // --- LOGOUT LOGIC ---
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                sessionStorage.removeItem('activeUser');
                // Redirect to Landing Page on manual logout
                window.location.hash = '/';
            };
        }

        // --- MODULE-SPECIFIC LOGIC TRIGGERS ---
        if (path === '/module-bmi' && typeof window.initBMI === 'function') {
            window.initBMI();
        }
        else if (path === '/module-genotype' && typeof window.initGenotype === 'function') {
            window.initGenotype();
        }
        else if (path === '/module-wellness' && typeof window.initWellness === 'function') {
            window.initWellness();
        }
        else if (path === '/history' && typeof window.initHistory === 'function') {
            window.initHistory();
        }
        else if (path === '/profile' && typeof window.initProfile === 'function') {
    window.initProfile();
}
        
        window.scrollTo(0, 0);

    } catch (error) {
        console.error("Error loading view:", error);
        appRoot.innerHTML = '<div class="alert alert-danger">Error loading system module. Please check your connection.</div>';
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);