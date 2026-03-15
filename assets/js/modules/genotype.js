// assets/js/modules/genotype.js

window.initGenotype = function() {
    const genoForm = document.getElementById('form_genotype_check');
    const saveBtn = document.getElementById('btn_save_genotype');

    if (!genoForm) return;

    genoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const userGeno = document.getElementById('user_genotype').value;
        const partnerGeno = document.getElementById('partner_genotype').value;

        if (!userGeno || !partnerGeno) return;

        // Normalize the pairing order (so "AS+AA" is evaluated the same as "AA+AS")
        const pair = [userGeno, partnerGeno].sort().join(''); 

        let status = '';
        let badgeClass = '';
        let advice = '';

        // Medical Logic Matrix
        switch (pair) {
            case 'AAAA': // AA + AA
                status = 'Excellent Compatibility';
                badgeClass = 'bg-success text-white';
                advice = 'Highly compatible. There is no risk of having a child with Sickle Cell Disease (SS). All offspring will be AA.';
                break;
            case 'AAAC': // AA + AC
            case 'AAAS': // AA + AS
                status = 'Safe / Carrier Risk';
                badgeClass = 'bg-success text-white';
                advice = 'Compatible. There is a 50% chance offspring will be carriers (AS/AC), but 0% chance of Sickle Cell Disease (SS).';
                break;
            case 'AASS': // AA + SS
                status = 'Safe (Obligate Carrier)';
                badgeClass = 'bg-success text-white';
                advice = 'Compatible, but all children will be AS (carriers). None will have Sickle Cell Disease (SS).';
                break;
            case 'ACAS': // AC + AS
            case 'ASAS': // AS + AS
                status = 'High Risk';
                badgeClass = 'bg-danger text-white';
                advice = 'Not recommended. There is a 25% chance with each pregnancy of having a child with Sickle Cell Disease (SS/SC).';
                break;
            case 'ASSS': // AS + SS
                status = 'Very High Risk';
                badgeClass = 'bg-danger text-white';
                advice = 'Highly unadvisable. There is a 50% chance with each pregnancy of having a child with Sickle Cell Disease (SS).';
                break;
            case 'SSSS': // SS + SS
                status = 'Absolute Risk';
                badgeClass = 'bg-dark text-white';
                advice = 'Not recommended. 100% of offspring will be born with Sickle Cell Disease (SS).';
                break;
            default:
                status = 'Consult Physician';
                badgeClass = 'bg-warning text-dark';
                advice = 'Please consult a medical professional for detailed genetic counseling regarding this pairing.';
        }

        // Update UI
        document.getElementById('geno_pairing_display').innerText = `${userGeno} + ${partnerGeno}`;
        
        const badgeElement = document.getElementById('geno_status_badge');
        badgeElement.className = `badge rounded-pill px-4 py-2 fs-6 mb-3 ${badgeClass}`;
        badgeElement.innerText = status;
        
        document.getElementById('geno_advice_text').innerText = advice;

        // Transition UI
        document.getElementById('geno_result_empty').classList.add('d-none');
        const resultCard = document.getElementById('geno_result_card');
        resultCard.classList.remove('d-none');
        resultCard.classList.add('view-enter');
    });

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const pair = document.getElementById('geno_pairing_display').innerText;
            alert(`Compatibility result for ${pair} ready to be saved!`);
        });
    }
};