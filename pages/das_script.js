document.addEventListener("DOMContentLoaded", function() {
    // Function to update joint counters
    function updateJointCounter(jointType, increase = true) {
        const counterId = jointType + "Count"; // e.g., tenderCount or swollenCount
        const counter = document.getElementById(counterId);
        let currentValue = parseInt(counter.value, 10);
        counter.value = increase ? ++currentValue : --currentValue;
    }

    // Function to handle joint click
    function handleJointClick(event) {
        const joint = event.target;
        const jointId = joint.id;
        let jointType = "";

        if (jointId.includes("tender")) {
            jointType = "tender";
        } else if (jointId.includes("swollen")) {
            jointType = "swollen";
        }

        if (joint.classList.contains("clicked")) {
            joint.classList.remove("clicked");
            joint.style.fill = "blue"; // Change color back to blue
            updateJointCounter(jointType, false); // Decrease counter
        } else {
            joint.classList.add("clicked");
            joint.style.fill = "red"; // Change color to red
            updateJointCounter(jointType); // Increase counter
        }
    }

    // Function to clear all selections
    function clearSelections(jointType) {
        document.querySelectorAll(".joint").forEach(joint => {
            if (joint.id.includes(jointType) && joint.classList.contains("clicked")) {
                joint.classList.remove("clicked");
                joint.style.fill = "blue"; // Change color back to blue
            }
        });
        document.getElementById(jointType + "Count").value = 0; // Reset counter
    }

    // Add event listeners to all joint circles
    document.querySelectorAll(".joint").forEach(joint => {
        joint.addEventListener("click", handleJointClick);
    });

    // Add event listeners to clear buttons
    document.getElementById("clearTenderJoints").addEventListener("click", function() {
        clearSelections("tender");
    });

    document.getElementById("clearSwollenJoints").addEventListener("click", function() {
        clearSelections("swollen");
    });

    document.getElementById('patientGlobalHealth').addEventListener('input', function() {
        document.getElementById('patientGlobalHealthValue').textContent = this.value;
    });
    var submitButtonDAS = document.getElementById('calculate-das-score');

    submitButtonDAS.addEventListener('click', function(event) {
        // Prevent the form from submitting
        event.preventDefault();
    
        // Additional variables from the form
        let tenderJointCount = parseInt(document.getElementById('tenderCount').value.trim(), 10);
        let swollenJointCount = parseInt(document.getElementById('swollenCount').value.trim(), 10);
        var esr = parseFloat(document.getElementById('esr').value.trim());
        var crp = parseFloat(document.getElementById('crp').value.trim());
        var patientGlobalHealth = parseFloat(document.getElementById('patientGlobalHealth').value.trim());
    
        // DAS28-CRP(4) calculation
        var das28Score = (0.56 * Math.sqrt(tenderJointCount)) + (0.28 * Math.sqrt(swollenJointCount)) + (0.36 * Math.log(crp + 1)) + (0.014 * patientGlobalHealth) + 0.96;
    
        // Update the DAS28 score field
        document.getElementById('das28Score').value = das28Score.toFixed(2); // Show only two decimal places
    });
});
