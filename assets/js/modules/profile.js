// assets/js/modules/profile.js

window.initProfile = function() {
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    
    if (!activeUser) {
        window.location.hash = '/';
        return;
    }

    // Populate UI
    document.getElementById('profile_name').innerText = activeUser.name;
    document.getElementById('profile_email').innerText = activeUser.email;
    document.getElementById('profile_role').innerText = activeUser.role;
    document.getElementById('profile_dept').innerText = activeUser.dept || activeUser.department || 'Not Specified';
    
    // Update ID field based on role
    const idField = document.getElementById('profile_id');
    const idLabel = document.getElementById('id_label');
    
    if (activeUser.role === 'Student') {
        idLabel.innerText = 'Matric Number';
        idField.innerText = activeUser.matric || 'N/A';
    } else {
        idLabel.innerText = 'Staff ID';
        idField.innerText = activeUser.staffId || 'N/A';
    }

    // Update Avatar
    const avatar = document.getElementById('profile_avatar');
    if (avatar) {
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.name)}&background=1FA971&color=fff&size=128`;
    }
};