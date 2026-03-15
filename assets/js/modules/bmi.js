// assets/js/modules/bmi.js

window.initBMI = function() {
    const bmiForm = document.getElementById('form_bmi_calc');
    const saveBtn = document.getElementById('btn_save_bmi');

    if (!bmiForm) return;

    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Get Values
        const weight = parseFloat(document.getElementById('bmi_weight').value);
        const height = parseFloat(document.getElementById('bmi_height').value);

        if (!weight || !height) {
            window.showMTAlert("Missing Data", "Please enter both weight and height.", "warning");
            return;
        }

        // 2. Calculate Math
        const bmi = (weight / (height * height)).toFixed(1);

        // 3. Determine Category & Colors
        let category = '';
        let badgeClass = '';
        let advice = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            badgeClass = 'bg-warning text-dark';
            advice = 'You are below the normal weight range. Consider consulting a nutritionist on campus for a balanced diet plan.';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Healthy Weight';
            badgeClass = 'bg-success text-white';
            advice = 'Great job! You are within the healthy weight range. Keep up your current balanced lifestyle.';
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
            badgeClass = 'bg-warning text-dark';
            advice = 'You are slightly above the normal weight range. Staying active and monitoring your diet can help.';
        } else {
            category = 'Obesity';
            badgeClass = 'bg-danger text-white';
            advice = 'Your BMI indicates obesity. We recommend a general check-in with the campus health center to discuss safe wellness strategies.';
        }

        // 4. Update the UI
        document.getElementById('bmi_score_display').innerText = bmi;
        
        const badgeElement = document.getElementById('bmi_category_badge');
        badgeElement.className = `badge rounded-pill px-4 py-2 fs-6 mb-3 ${badgeClass}`;
        badgeElement.innerText = category;
        
        document.getElementById('bmi_advice_text').innerText = advice;

        // 5. Transition UI
        document.getElementById('bmi_result_empty').classList.add('d-none');
        const resultCard = document.getElementById('bmi_result_card');
        resultCard.classList.remove('d-none');
        resultCard.classList.add('view-enter');
    });

    // --- 6. SAVE TO INDEXEDDB LOGIC ---
    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            const score = document.getElementById('bmi_score_display').innerText;
            const category = document.getElementById('bmi_category_badge').innerText;
            const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));

            if (!activeUser) {
                window.showMTAlert("Error", "You must be logged in to save records.", "danger");
                return;
            }

            const bmiRecord = {
                userEmail: activeUser.email,
                type: 'BMI Assessment',
                result: `${score} (${category})`,
                details: `Weight: ${document.getElementById('bmi_weight').value}kg | Height: ${document.getElementById('bmi_height').value}m`,
                date: new Date().toISOString(),
                color: 'primary' // Used for the timeline icon color
            };

            try {
                // Save using our db.js helper
                await saveToDB('records', bmiRecord);
                
                window.showMTAlert(
                    "Progress Saved", 
                    "Your BMI result has been added to your health history timeline.", 
                    "success"
                );
            } catch (error) {
                console.error("Save Error:", error);
                window.showMTAlert("Save Failed", "Could not save the record to local storage.", "danger");
            }
        });
    }
};