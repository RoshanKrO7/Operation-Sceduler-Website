document.getElementById('logout').addEventListener('click', function() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});

// Fetch and display doctors
db.collection('doctors').get().then((querySnapshot) => {
    const doctorTable = document.getElementById('doctor-table').getElementsByTagName('tbody')[0];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = doctorTable.insertRow();
        row.insertCell(0).innerText = data.name;
        row.insertCell(1).innerText = data.specialization;
    });
}).catch((error) => {
    console.error('Error fetching doctor details: ', error);
});

// Fetch and display surgeries
db.collection('operations').get().then((querySnapshot) => {
    const surgeryTable = document.getElementById('surgery-table').getElementsByTagName('tbody')[0];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = surgeryTable.insertRow();
        row.insertCell(0).innerText = data.date;
        row.insertCell(1).innerText = data.time;
        row.insertCell(2).innerText = data.doctor;
        row.insertCell(3).innerText = data.patient;
        row.insertCell(4).innerText = data.type;
    });
}).catch((error) => {
    console.error('Error fetching surgical information: ', error);
});
