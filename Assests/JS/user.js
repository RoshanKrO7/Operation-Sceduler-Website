import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
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
const auth = getAuth(app);

// Function to fetch and display doctors
async function fetchDoctors() {
    const tableBody = document.getElementById("doctor-table-body");
    tableBody.innerHTML = ""; // Clear the table body before adding new data

    try {
        const querySnapshot = await getDocs(collection(db, "Doctor"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            const specializationCell = document.createElement("td");

            nameCell.textContent = data.firstname;
            specializationCell.textContent = data.specialization;

            row.appendChild(nameCell);
            row.appendChild(specializationCell);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error getting doctors: ", error);
    }
}

// Call fetchDoctors when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchDoctors);

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
                    <td>${data.doctorName}</td>
                    <td>${data.patientName}</td>
                    <td>${data.remarks}</td> 
                    <td>${data.otId}</td> 
                `;
                scheduleTableBody.appendChild(row);

            });
        } catch (error) {
            console.error('Error fetching schedules: ', error);
        }
    }
     fetchAndDisplaySchedules();
});
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not signed in, redirect to login page
        window.location.href = 'index.html';
    }
});

// Logout button event listener
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        alert('Successfully logged out!');
        window.location.href = 'index.html'; // Redirect to login page after logout
        window.history.pushState(null, null, 'index.html'); // Push login page to history stack
        window.history.go(0); // Reload to clear history
    }).catch((error) => {
        console.error('Logout error: ', error);
    });
});