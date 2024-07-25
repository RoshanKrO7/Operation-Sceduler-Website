import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6IagQ41Nr3QxU2hjdt1hMvXdlkjzNJxo",
    authDomain: "hospital-operation-scheduler.firebaseapp.com",
    databaseURL: "https://hospital-operation-scheduler-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hospital-operation-scheduler",
    storageBucket: "hospital-operation-scheduler.appspot.com",
    messagingSenderId: "210565836841",
    appId: "1:210565836841:web:fdb6368f1b44995bbdac38",
    measurementId: "G-C8X53NM98N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Fetch doctors from Firestore and populate the table
function fetchDoctors() {
    const tableBody = document.getElementById("doctor-table-body");
    tableBody.innerHTML = ""; // Clear existing table data

    getDocs(collection(db, "Doctor")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const specializationCell = document.createElement("td");
            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            const editButton = document.createElement("button");

            nameCell.textContent = data.firstname;
            specializationCell.textContent = data.specialization;
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn", "btn-danger", "mx-1");
            deleteButton.addEventListener("click", () => deleteDoctor(doc.id));

            editButton.textContent = "Edit";
            editButton.classList.add("btn", "btn-warning", "mx-1");
            editButton.addEventListener("click", () => editDoctor(doc.id, data));

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(nameCell);
            row.appendChild(specializationCell);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error getting doctors: ", error);
    });
}

// Fetch patients from Firestore and populate the table
function fetchPatients() {
    const tableBody = document.getElementById("patient-table-body");
    tableBody.innerHTML = ""; // Clear existing table data

    getDocs(collection(db, "Patient")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const ageCell = document.createElement("td");
            const conditionCell = document.createElement("td");
            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            const editButton = document.createElement("button");

            nameCell.textContent = data.name;
            ageCell.textContent = data.age;
            conditionCell.textContent = data.condition;
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn", "btn-danger", "mx-1");
            deleteButton.addEventListener("click", () => deletePatient(doc.id));

            editButton.textContent = "Edit";
            editButton.classList.add("btn", "btn-warning", "mx-1");
            editButton.addEventListener("click", () => editPatient(doc.id, data));

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(nameCell);
            row.appendChild(ageCell);
            row.appendChild(conditionCell);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error("Error getting patients: ", error);
    });
}

// Delete doctor from Firestore
function deleteDoctor(docId) {
    deleteDoc(doc(db, "Doctor", docId)).then(() => {
        console.log("Doctor successfully deleted!");
        fetchDoctors(); // Refresh table after deletion
    }).catch((error) => {
        console.error("Error removing doctor: ", error);
    });
}

// Delete patient from Firestore
function deletePatient(docId) {
    deleteDoc(doc(db, "Patient", docId)).then(() => {
        console.log("Patient successfully deleted!");
        fetchPatients(); // Refresh table after deletion
    }).catch((error) => {
        console.error("Error removing patient: ", error);
    });
}

// Edit doctor details
function editDoctor(docId, data) {
    const doctorForm = document.querySelector('#doctor-form');
    document.getElementById('doctor-name').value = data.firstname;
    document.getElementById('doctor-specialization').value = data.specialization;
    doctorForm.dataset.docId = docId;
}

// Edit patient details
function editPatient(docId, data) {
    const patientForm = document.querySelector('#patient-form');
    document.getElementById('patient-name').value = data.name;
    document.getElementById('patient-age').value = data.age;
    document.getElementById('patient-condition').value = data.condition;
    patientForm.dataset.docId = docId;
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission for adding/editing a doctor
    const doctorForm = document.querySelector('#doctor-form');
    doctorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(doctorForm);
        const docData = {
            firstname: formData.get('doctor-name'),
            specialization: formData.get('doctor-specialization'),
        };

        const docId = doctorForm.dataset.docId;
        if (docId) {
            // Update existing doctor
            try {
                await updateDoc(doc(db, 'Doctor', docId), docData);
                alert('Doctor updated successfully!');
                doctorForm.reset();
                delete doctorForm.dataset.docId; // Clear the docId from form's dataset
                fetchDoctors(); // Refresh the table data
            } catch (error) {
                console.error('Error updating doctor: ', error);
                alert('Error updating doctor.');
            }
        } else {
            // Add new doctor
            try {
                await addDoc(collection(db, 'Doctor'), docData);
                alert('Doctor added successfully!');
                doctorForm.reset();
                fetchDoctors(); // Refresh the table data
            } catch (error) {
                console.error('Error adding doctor: ', error);
                alert('Error adding doctor.');
            }
        }
    });

    // Handle form submission for adding/editing a patient
    const patientForm = document.querySelector('#patient-form');
    patientForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(patientForm);
        const docData = {
            name: formData.get('patient-name'),
            age: formData.get('patient-age'),
            condition: formData.get('patient-condition'),
        };

        const docId = patientForm.dataset.docId;
        if (docId) {
            // Update existing patient
            try {
                await updateDoc(doc(db, 'Patient', docId), docData);
                alert('Patient updated successfully!');
                patientForm.reset();
                delete patientForm.dataset.docId; // Clear the docId from form's dataset
                fetchPatients(); // Refresh the table data
            } catch (error) {
                console.error('Error updating patient: ', error);
                alert('Error updating patient.');
            }
        } else {
            // Add new patient
            try {
                await addDoc(collection(db, 'Patient'), docData);
                alert('Patient added successfully!');
                patientForm.reset();
                fetchPatients(); // Refresh the table data
            } catch (error) {
                console.error('Error adding patient: ', error);
                alert('Error adding patient.');
            }
        }
    });

    document.getElementById("fetch-doctors").addEventListener("click", fetchDoctors);
    document.getElementById("fetch-patients").addEventListener("click", fetchPatients);

});
//Operation schedule
const surgeryForm = document.querySelector('#surgery-form');
    surgeryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(surgeryForm);
        const docData = {
            doctorName: formData.get('doctor-name'),
            patientName: formData.get('patient-name'),
            date: formData.get('date') ,
            time: formData.get('time') ,
            otId: formData.get('ot-id'),
            anaesthesiaType: formData.get('anaesthesia') ,
            anaesthesiologist: formData.get('anaesthesiologist') ,
            medic: formData.get('medic') ,
            nurses: formData.get('nurses') ,
            remarks: formData.get('remarks') ,
            uniqueRequirements: formData.get('unique-requirements') 
        };        
            // Add new patient
            try {
                await addDoc(collection(db, 'OperationSchedule'), docData);
                alert('Scheduled operation successfully!');
                surgeryForm.reset();
            } catch (error) {
                console.error('Error adding patient: ', error);
                alert('Error adding patient.');
            }
        }
    );


