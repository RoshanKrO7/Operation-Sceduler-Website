import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
//Fetch and display OT schedules
document.addEventListener('DOMContentLoaded', async () => {
    const scheduleTableBody = document.querySelector('#schedule-table-body');
     
    async function fetchAndDisplaySchedules() {
        try {
            const querySnapshot = await getDocs(collection(db, 'OperationSchedule'));
            scheduleTableBody.innerHTML = ''; // Clear the table body

            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${data.date}</td>
                    <td>${data.time}</td>
                    <td>${data.otId}</td>
                    <td>${data.doctorName}</td>
                    <td>${data.patientName}</td>
                    <td>${data.anaesthesiaType}</td>
                    <td>${data.anaesthesiologist}</td>
                    <td>${data.medic}</td>
                    <td>${data.nurses}</td>
                    <td>${data.remarks}</td>
                    <td>${data.uniqueRequirements}</td>
                    <td>
                        <button class="btn btn-primary edit-btn" data-id="${doc.id}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${doc.id}">Delete</button>
                        <button class="btn btn-warning postpone-btn" data-id="${doc.id}">Postpone</button>
                    </td>
                `;
                scheduleTableBody.appendChild(row);

                // Add event listeners for edit and delete buttons
                row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(doc.id));
                row.querySelector('.delete-btn').addEventListener('click', () => deleteSchedule(doc.id));
                row.querySelector('.postpone-btn').addEventListener('click', () => postponeSchedule(doc.id, data.date, data.time));
            });
        } catch (error) {
            console.error('Error fetching schedules: ', error);
        }
    }

    async function deleteSchedule(id) {
        if (confirm('Are you sure you want to delete this schedule?')) {
            try {
                await deleteDoc(doc(db, 'OperationSchedule', id));
                alert('Schedule deleted successfully!');
                fetchAndDisplaySchedules(); // Refresh the table
            } catch (error) {
                console.error('Error deleting schedule: ', error);
            }
        }
    }

   
    async function postponeSchedule(id, currentDate, currentTime) {
        const newDate = prompt('Enter new date (YYYY-MM-DD):', currentDate);
        const newTime = prompt('Enter new time (HH:MM):', currentTime);
        if (newDate && newTime) {
            try {
                const docRef = doc(db, 'OperationSchedule', id);
                await updateDoc(docRef, {
                    date: newDate,
                    time: newTime
                });
                alert('Schedule postponed successfully!');
                fetchAndDisplaySchedules(); // Refresh the table
            } catch (error) {
                console.error('Error postponing schedule: ', error);
                alert('Error postponing schedule.');
            }
        } else {
            alert('Date and time are required to postpone the schedule.');
        }
    }

    
/// Open the edit modal and populate it with data
function openEditModal(docId) {
    console.log('Opening edit modal for docId:', docId);
    document.getElementById('modal-content').style.display = 'block'; 
    const docRef = doc(db, "OperationSchedule", docId);
    getDoc(docRef).then((doc) => {
        if (doc.exists()) {
            const data = doc.data();
            console.log('Fetched data:', data);
            document.getElementById('edit-doc-id').value = docId;
            document.getElementById('edit-date').value = data.date;
            document.getElementById('edit-time').value = data.time;
            document.getElementById('edit-ot-id').value = data.otId;
            document.getElementById('edit-doctor-name').value = data.doctorName;
            document.getElementById('edit-patient-name').value = data.patientName;
            document.getElementById('edit-anaesthesia-type').value = data.anaesthesiaType;
            document.getElementById('edit-anaesthesiologist').value = data.anaesthesiologist;
            document.getElementById('edit-medic').value = data.medic;
            document.getElementById('edit-nurses').value = data.nurses;
            // Reports need special handling if they are files
            document.getElementById('edit-remarks').value = data.remarks;
            document.getElementById('edit-unique-requirements').value = data.uniqueRequirements;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document: ", error);
    });
}

// Handle the form submission for updating
const editsurgeryForm = document.querySelector('#edit-schedule-form');
    editsurgeryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
       
        const formData = new FormData(editsurgeryForm);
        const docId1 = formData.get('edit-doc-id');
        const docData1 = {
            date: formData.get('edit-date'),
            time: formData.get('edit-time'),
            otId: formData.get('edit-ot-id'),
            doctorName: formData.get('edit-doctor-name'),
            patientName: formData.get('edit-patient-name'),
            anaesthesiaType: formData.get('edit-anaesthesia-type'),
            anaesthesiologist: formData.get('edit-anaesthesiologist'),
            medic: formData.get('edit-medic'),
            nurses: formData.get('edit-nurses'),
            remarks: formData.get('edit-remarks'),
            uniqueRequirements: formData.get('edit-unique-requirements')
        };        
           
            try {
                await updateDoc(doc(db, 'OperationSchedule', docId1), docData1);
                alert('Updated Scheduled operation successfully!');
                document.getElementById('modal-content').style.display = 'none';
                editsurgeryForm.reset();
                fetchAndDisplaySchedules()
            } catch (error) {
                
                alert('Error Updating Surgery Schedule.');
            }
        }
    );
    // Initial fetch
    fetchAndDisplaySchedules();
});

