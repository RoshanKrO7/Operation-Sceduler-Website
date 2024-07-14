document.getElementById('logout').addEventListener('click', function() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});

// Add Doctor
document.getElementById('doctor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('doctor-name').value;
    const specialization = document.getElementById('doctor-specialization').value;
    db.collection('doctors').add({
        name: name,
        specialization: specialization
    }).then(() => {
        alert('Doctor added successfully');
        // Optionally, refresh the doctor list
    }).catch((error) => {
        console.error('Error adding doctor: ', error);
    });
});

// Add Patient
document.getElementById('patient-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('patient-name').value;
    const age = document.getElementById('patient-age').value;
    const condition = document.getElementById('patient-condition').value;
    db.collection('patients').add({
        name: name,
        age: age,
        condition: condition
    }).then(() => {
        alert('Patient added successfully');
        // Optionally, refresh the patient list
    }).catch((error) => {
        console.error('Error adding patient: ', error);
    });
});

// Post Operation Schedule
document.getElementById('operation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('operation-date').value;
    const time = document.getElementById('operation-time').value;
    const doctor = document.getElementById('operation-doctor').value;
    const patient = document.getElementById('operation-patient').value;
    const type = document.getElementById('operation-type').value;
    db.collection('operations').add({
        date: date,
        time: time,
        doctor: doctor,
        patient: patient,
        type: type
    }).then(() => {
        alert('Operation schedule posted successfully');
        // Optionally, refresh the operation schedule list
    }).catch((error) => {
        console.error('Error posting operation schedule: ', error);
    });
});
