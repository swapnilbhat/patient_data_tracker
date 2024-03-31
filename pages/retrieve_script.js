document.addEventListener("DOMContentLoaded", function() {
    var submitButton = document.getElementById("submit-button-id");
    
    submitButton.addEventListener("click", async function(event){
        event.preventDefault();
        var id = document.getElementById("unique_id").value.trim();
    await getData(id);});

});

async function getData(id) {
    console.log(id);
    const response=await fetch(`http://localhost:8000/retrieve_patient_data/${id}`);
    const responseData=await response.json();
    // document.getElementById("patient-details").innerHTML = JSON.stringify(responseData, null, 2); // Format and display data

    // Create a table element
    let table = document.createElement('table');
    table.className = 'patient-data-table';

    // Create table headers
    let thead = table.createTHead();
    let row = thead.insertRow();
    let headers = ["Name", "Age", "Sex", "Disease Severity", "Medical History", "Other Conditions", "VAS", "HAQ", "DAS28", "Unique ID"];
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.textContent = headerText;
        row.appendChild(header);
    });

    // Create and fill table rows
    let tbody = table.createTBody();
    responseData.forEach(patient => {
        let row = tbody.insertRow();
        headers.forEach(header => {
            let cell = row.insertCell();
            // Assuming keys in the patient object match headers exactly
            cell.textContent = patient[header.toLowerCase().replace(/ /g, "_")]; // Convert header to match key format, e.g. "Unique ID" to "unique_id"
        });
    });

    // Append the table to a div or another container in your HTML
    document.getElementById('patient-details').innerHTML = ''; // Clear existing content
    document.getElementById('patient-details').appendChild(table); // Add the new table

    // Assume responseData is an array of patient data objects
const vasScores = responseData.map(data => data.vas);
const haqScores = responseData.map(data => data.haq);
const das28Scores = responseData.map(data => data.das28);
const labels = responseData.map((_, index) => `Entry ${index + 1}`);

// Create the chart
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'VAS Score',
            data: vasScores,
            borderColor: 'red',
            borderWidth: 1
        }, {
            label: 'HAQ Score',
            data: haqScores,
            borderColor: 'blue',
            borderWidth: 1
        }, {
            label: 'DAS28 Score',
            data: das28Scores,
            borderColor: 'green',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


}