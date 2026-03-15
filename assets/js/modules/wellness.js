// assets/js/modules/wellness.js

window.initWellness = function() {
    const wellForm = document.getElementById('form_wellness_check');
    const saveBtn = document.getElementById('btn_save_wellness');

    if (!wellForm) return;

    // Real-time slider value updates
    const updateSliderValue = (sliderId, valId) => {
        const slider = document.getElementById(sliderId);
        const valDisplay = document.getElementById(valId);
        if (slider && valDisplay) {
            slider.addEventListener('input', (e) => {
                valDisplay.innerText = `${e.target.value} / 10`;
            });
        }
    };

    updateSliderValue('well_sleep', 'val_sleep');
    updateSliderValue('well_stress', 'val_stress');
    updateSliderValue('well_mood', 'val_mood');

    // Form Submission Logic
    wellForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get Values
        const sleep = parseInt(document.getElementById('well_sleep').value);
        const stress = parseInt(document.getElementById('well_stress').value);
        const mood = parseInt(document.getElementById('well_mood').value);

        // Simple scoring algorithm:
        // High sleep + Low stress + High mood = Good
        // Notice we invert the stress score so higher is worse
        const invertedStress = 10 - stress; 
        const totalScore = sleep + invertedStress + mood; 
        // Max score is 30, Min is 3.

        let status = '';
        let emoji = '';
        let advice = '';
        let colorClass = '';

        if (totalScore >= 24) {
            status = 'Thriving';
            emoji = '🌟';
            colorClass = 'text-success';
            advice = 'You are in a great headspace! Keep up your healthy habits, stay hydrated, and carry this positive energy into your classes.';
        } else if (totalScore >= 16) {
            status = 'Balanced';
            emoji = '😊';
            colorClass = 'text-primary';
            advice = 'You are doing okay, but there is room for improvement. Try to prioritize a little more rest tonight or take a short walk around campus to clear your head.';
        } else if (totalScore >= 10) {
            status = 'Fatigued';
            emoji = '🔋'; // Low battery
            colorClass = 'text-warning';
            advice = 'Campus life is catching up to you. Please ensure you are not skipping meals. Take a deliberate break from studying today to recharge.';
        } else {
            status = 'Burnout Risk';
            emoji = '🛑';
            colorClass = 'text-danger';
            advice = 'Your stress is high and your mood/sleep are low. Please take this seriously. Consider reaching out to the campus counseling unit or a trusted advisor. Your health comes before academics.';
        }

        // Update UI
        const statusDisplay = document.getElementById('well_status_display');
        statusDisplay.innerText = status;
        statusDisplay.className = `fw-bolder mb-3 ${colorClass}`;
        
        document.getElementById('well_emoji_display').innerText = emoji;
        document.getElementById('well_advice_text').innerText = advice;

        // Transition UI
        document.getElementById('well_result_empty').classList.add('d-none');
        const resultCard = document.getElementById('well_result_card');
        resultCard.classList.remove('d-none');
        resultCard.classList.add('view-enter');
    });

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const status = document.getElementById('well_status_display').innerText;
            alert(`Wellness check-in (${status}) ready to be saved!`);
        });
    }
};