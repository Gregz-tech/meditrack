

window.initAuth = function() {
    const loginForm = document.getElementById('form_login');
    const studentForm = document.getElementById('form_student_register');

    // 1. Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login_email').value;
            const password = document.getElementById('login_password').value;

            try {
                // getFromDB is globally available from db.js
                const user = await getFromDB('users', email);

                if (user && user.password === password) {
                    sessionStorage.setItem('activeUser', JSON.stringify(user));
                    window.location.hash = '/dashboard';
                } else {
                    if (typeof window.showMTAlert === 'function') {
                        window.showMTAlert("Login Failed", "The email or password you entered is incorrect. Please try again.", "danger");
                    } else {
                        alert("Invalid email or password.");
                    }
                }
            } catch (error) {
                console.error("Database error during login:", error);
            }
        });
    }

    // 2. Handle Student Registration
    if (studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Password match check
            const pass = document.getElementById('student_password').value;
            const confirmPass = document.getElementById('student_password_confirm').value;
            
            if (pass !== confirmPass) {
                alert("Passwords do not match!");
                return;
            }

            const userData = {
                email: document.getElementById('student_email').value,
                name: document.getElementById('student_name').value,
                password: pass, 
                role: 'Student',
                matric: document.getElementById('student_matric').value,
                dept: document.getElementById('student_dept').value
            };

            try {
                // saveToDB is globally available from db.js
                await saveToDB('users', userData);
                
                if (typeof window.showMTAlert === 'function') {
                    window.showMTAlert(
                        "Success!", 
                        "Your Meditrack account has been created. Ready to log in?", 
                        "success", 
                        () => { window.location.hash = '/login'; }
                    );
                } else {
                    alert("Registration successful! Please login.");
                    window.location.hash = '/login';
                }
            } catch (error) {
                console.error("Error saving user:", error);
            }
        });
    }
};