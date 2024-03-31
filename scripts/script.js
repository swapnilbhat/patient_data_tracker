import Patient from "./Patient.js";

document.addEventListener("DOMContentLoaded", function() {
    // Get the explanation button and modal
    var explanationButton = document.getElementById("explanation-button");
    var explanationModal = document.getElementById("explanation-modal");

    // Get the close button inside the modal
    var closeButton = explanationModal.querySelector(".close");

    // When the explanation button is clicked, show the modal
    explanationButton.addEventListener("click", function() {
        explanationModal.style.display = "block";
    });

    // When the user clicks on the close button, hide the modal
    closeButton.addEventListener("click", function() {
        explanationModal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function(event) {
        if (event.target === explanationModal) {
            explanationModal.style.display = "none";
        }
    });

    var patientForm=document.getElementById("patient-form");
    var submitButton=patientForm.querySelector("button[type='submit']");

    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Submit button clicked.");
        // Get input values
        var doctorname = document.getElementById("doctor-name").value.trim();
        var date = document.getElementById("date").value.trim();
        var name = document.getElementById("name").value.trim();
        var age = document.getElementById("age").value.trim();
        var sex = document.getElementById("sex").value.trim();
        var diseaseSeverity = document.getElementById("disease_severity").value.trim();
        var medicalHistory = document.getElementById("medical_history").value.trim();
        var otherConditions = document.getElementById("other_conditions").value.trim();
        var uniqueId = document.getElementById("unique_id").value.trim();
        var vas=document.getElementById("vas").value.trim();
        var haq=document.getElementById("haq").value.trim();
        var das28=document.getElementById("das28").value.trim();
        var medicinesprescribed=document.getElementById("medicines-prescribed").value.trim();
        var additionalcomments=document.getElementById("additional-comments").value.trim();
        
        // Generate a random unique id if not provided
        if (uniqueId === "") {
            uniqueId = Math.floor(Math.random() * 65000); // Generate random number between 0 to 65000
        }
        if (doctorname!== "" && date !== "" && name !== "" && age !== "" && sex !== "" && diseaseSeverity !== "" && medicalHistory !== "" && otherConditions !== "" && vas !=="" && haq !=="" && das28 !=="" && medicinesprescribed !== "") {
            var patient = new Patient(name, age, sex, diseaseSeverity, medicalHistory, otherConditions, vas, haq, das28, uniqueId,doctorname,date,medicinesprescribed,additionalcomments);
             displayModal(patient);
             //displayModal(message);
             document.getElementById('save-result').addEventListener('click', function() {
                // const doc = new jspdf.jsPDF();
                // let resultContent = document.getElementById('result-content').innerHTML;
                // // Convert HTML to plain text for PDF formatting
                // resultContent = resultContent.replace(/<br\s*\/?>/gi, "\n"); // Replace <br> with newlines
                // resultContent = resultContent.replace(/<[^>]*>/g, ""); // Strip other HTML tags
                
                // // Split the text into lines for proper formatting in PDF
                // let lines = doc.splitTextToSize(resultContent, 180); // 180 is the max width for lines; adjust as needed
                // doc.text(lines, 10, 10);
                // doc.save('patient-report.pdf');
                const doc = new jspdf.jsPDF();
    
                // Add KEM logo and hospital details
                doc.addImage('kem_logo.png', 'PNG', 5, 5, 35, 35);
                doc.setFontSize(12);
                doc.text('KING EDWARD MEMORIAL HOSPITAL', 65, 15);
                doc.setFontSize(10);
                doc.text('DEPARTMENT OF MEDICINE', 65, 20);
                doc.text('PAREL, MUMBAI 400 012. INDIA.', 65, 25);
                doc.text('Website: www.kem.edu', 65, 30);
                
                // Add a horizontal line
                doc.setLineWidth(0.5);
                doc.line(10, 42, 200, 42);
                
                var lineHeight=12
                doc.setFontSize(lineHeight);

                function addMultilineText(text, x, y) {
                    let splitText = doc.splitTextToSize(text, 180); // 180 is the max width for lines; adjust as needed
                    let lineHeight = 10; // Approximate line height, adjust based on your document's font size and styling
                    let blockHeight = splitText.length * lineHeight;
                
                    // Check if the current block will exceed the page height
                    if (y + blockHeight > doc.internal.pageSize.height - 10) { // 10 is bottom margin
                        doc.addPage();
                        y = 10; // Reset y to the top of the new page
                    }
                
                    splitText.forEach(line => {
                        doc.text(line, x, y);
                        y += lineHeight; // Move to the next line position
                    });
                
                    return y; // Return the updated y position
                }

                let y_axis_main=52;

                y_axis_main = addMultilineText(`Date: ${patient.date}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Unique ID: ${patient.uniqueId}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Name: ${patient.name}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Age: ${patient.age}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Sex: ${patient.sex}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Disease Severity: ${patient.diseaseSeverity}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Medical History: ${patient.medicalHistory}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Other Conditions: ${patient.otherConditions}`, 10, y_axis_main);

                const headers = [["Vas Score", "Haq Score", "Das28 Score"]];
                const data = [[patient.vas, patient.haq, patient.das28]];

                // Add the table
                doc.autoTable({
                    head: headers,
                    body: data,
                    styles: { fontSize: 12, cellPadding: 6, valign: 'middle', halign: 'center' },
                    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
                    didDrawCell: (data) => {
                        if (data.column.index < data.table.columns.length - 1) {
                            const cell = data.cell;
                            doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
                        }
                    },
                    startY: y_axis_main
                });

                y_axis_main += 40; // Adjust y_axis_main based on table height

                // Treatment and additional comments with dynamic content height
                y_axis_main = addMultilineText(`Medicines prescribed: ${patient.medicinesPrescribed}`, 10, y_axis_main);
                y_axis_main = addMultilineText(`Treatment Methodology: ${patient.getTreatment()}`, 10, y_axis_main);

                if (patient.additionalComments) {
                    y_axis_main = addMultilineText(`Additional Comments: ${patient.additionalComments}`, 10, y_axis_main);
                }

                // Always displayed so no need to adjust y_axis_main
                addMultilineText(`Doctor Name: ${patient.doctorName}`, 10, y_axis_main);
                

                doc.save('patient-report.pdf');
            });

            document.getElementById('submit-result').addEventListener('click', async function(event){
             event.preventDefault();
             const formData={name: name,
            age: age,
            sex: sex,
            diseaseSeverity: diseaseSeverity,
            medicalHistory: medicalHistory,
            otherConditions: otherConditions,
            vas: vas,
            haq: haq,
            das28:das28,
            uniqueId:uniqueId};
            console.log("submit result button pressed");
            await sendData(formData); // Call the sendData function with the form data
            });
            
        } else {
            // Show error message if any required field is empty
            alert("Please fill in all required fields.");
        }
    });
    

});

function displayModal(patient) {
    var modal = document.getElementById("result-modal");
    var resultContent = document.getElementById("result-content");

    // Set message content
    resultContent.innerHTML = '';

    //Creating container for hospital logo and details
    var hospitalHeaderHTML = `
        <div class="hospital-header">
            <img src="kem_logo.png" alt="KEM Hospital" class="hospital-logo">
            <div class="hospital-info">
                KING EDWARD MEMORIAL HOSPITAL<br>
                DEPARTMENT OF MEDICINE<br>
                PAREL, MUMBAI 400 012. INDIA.<br>
                Website: www.kem.edu<br>
            </div>
        </div>
        <hr>
    `;

    // Append the hospital header
    resultContent.insertAdjacentHTML('beforeend', hospitalHeaderHTML);

    // Creating container for patient details
    var patientDetailsHTML = `
        <div class="patient-details">
            <div class="patient-details-body">
                <p>Date: ${patient.date}</p><br>
                <p>Unique ID: ${patient.uniqueId}</p><br>
                <p>Name: ${patient.name}</p><br>
                <p>Age: ${patient.age}</p><br>
                <p>Sex: ${patient.sex}</p><br>
                <p>Disease Severity: ${patient.diseaseSeverity}</p><br>
                <p>Medical History: ${patient.medicalHistory}</p><br>
                <p>Other Conditions: ${patient.otherConditions}</p><br>
             </div>
             </div>`;

    resultContent.insertAdjacentHTML('beforeend',patientDetailsHTML);

    //Create table for vas,haq,das
    var tableHTML = `
        <table class="score-table">
            <thead>
                <tr>
                    <th scope="col">Vas Score</th>
                    <th scope="col">Haq Score</th>
                    <th scope="col">Das28 Score</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${patient.vas}</td>
                    <td>${patient.haq}</td>
                    <td>${patient.das28}</td>
                </tr>
            </tbody>
        </table><br>
    `;

    resultContent.insertAdjacentHTML('beforeend',tableHTML);
    
    var treatmentMethodology=patient.getTreatment();

    console.log("additional comments "+ patient.additionalComments); 
    if(patient.additionalComments){
    var treatmentHTML = `<div class="patient-treatment">
    <p>Medicines prescribed: ${patient.medicinesPrescribed}</p><br>
    <p>Treatment Methodology: ${treatmentMethodology}</p><br>
    <p>Additional Comments: ${patient.additionalComments}</p><br>
    <p>Doctor Name: ${patient.doctorName}</p><br>
    </div>
    `;
    resultContent.insertAdjacentHTML('beforeend',treatmentHTML);}
    else{
        var treatmentHTML = `<div class="patient-treatment">
        <p>Medicines prescribed: ${patient.medicinesPrescribed}</p><br>
        <p>Treatment Methodology: ${treatmentMethodology}</p><br>
        <p>Doctor Name: ${patient.doctorName}</p><br>
        </div>
        ` ;
        resultContent.insertAdjacentHTML('beforeend',treatmentHTML);
    }

    // Display modal
    modal.style.display = "block";

    var closeButton = modal.querySelector(".close");
    closeButton.onclick = function() {
        modal.style.display = "none";
    }
    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

async function sendData(data) {
    const response= await fetch('http://localhost:8000/store_patient_data/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const responseData=await response.json();
    console.log(responseData);
    if(response.ok) { // Check if the request was successful
        alert("Response submitted successfully!"); // Using an alert for simplicity
        // Alternatively, you could update the DOM to show the success message
    } else {
        // Handle error case
        alert("There was an error submitting the response.");
    }
}

