class Patient{
    constructor(name, age, sex, diseaseSeverity, medicalHistory, otherConditions, vas = null, haq = null, das28 = null, uniqueId = null,doctorName,date,medicinesPrescribed,additionalComments) {
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.diseaseSeverity = diseaseSeverity; // 1 for low, 2 for moderate or high
        this.medicalHistory = medicalHistory;
        this.otherConditions = otherConditions;
        this.uniqueId = uniqueId;
        this.haq = haq;
        this.vas = vas;
        this.das28 = das28;
        this.date = date;
        this.doctorName=doctorName;
        this.medicinesPrescribed=medicinesPrescribed;
        this.additionalComments=additionalComments || '';
        console.log(additionalComments);
    }

    getTreatment() {
        let treatment = "";

        if (this.diseaseSeverity === 1) {
            treatment += "Initial treatment with hydroxychloroquine (Plaquenil), sulfasalazine (Azulfidine), methotrexate, and leflunomide (Arava) in this order is recommended. ";
        } else if (this.diseaseSeverity === 2) {
            treatment += "Methotrexate is the best initial treatment. ";
            if (this.otherConditions.includes("lung disease") && this.medicalHistory.includes("methotrexate")) {
                treatment += "Methotrexate should continue with careful monitoring due to lung disease. ";
            }
            if (this.otherConditions.includes("nonalcoholic fatty liver disease")) {
                treatment += "Methotrexate should be restricted due to nonalcoholic fatty liver disease. ";
            }
            treatment += "The normal dosage size for methotrexate is typically 7.5 to 20 mg once weekly.";
        }

        // ACR guidelines
        if (this.medicalHistory.includes("rheumatoid factor") || this.medicalHistory.includes("anti-CCP antibody")) {
            treatment += "Consider adding a biologic disease-modifying antirheumatic drug (bDMARD) such as adalimumab (Humira) or etanercept (Enbrel) to the treatment plan. ";
            treatment += "The normal dosage size for adalimumab is 40 mg every other week and for etanercept is 50 mg once weekly.";
        } else {
            treatment += "Consider adding a non-biologic disease-modifying antirheumatic drug (nbDMARD) such as tofacitinib (Xeljanz) to the treatment plan. ";
            treatment += "The normal dosage size for tofacitinib is 5 mg twice daily.";
        }

        return treatment;
    }

}

export default Patient