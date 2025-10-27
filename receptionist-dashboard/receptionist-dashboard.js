// ------------------ Mock Data ------------------ //
let appointments = [
  { patient: "Ravi Mehta", doctor: "Dr. Aayush", datetime: "2025-07-27T10:00" },
  { patient: "Sneha Sharma", doctor: "Dr. Sneha", datetime: "2025-07-27T11:30" },
  { patient: "Amit Verma", doctor: "Dr. Aayush", datetime: "2025-07-27T12:15" },
  { patient: "Meena Joshi", doctor: "Dr. Sneha", datetime: "2025-07-27T14:00" },
];

let patients = [
  { name: "Ravi Mehta", age: 34, contact: "9876543210" },
  { name: "Sneha Sharma", age: 27, contact: "8765432109" },
  { name: "Amit Verma", age: 22, contact: "7654321098" },
  { name: "Meena Joshi", age: 40, contact: "6543210987" },
];

// ------------------ Appointment Section ------------------ //
function loadAppointments() {
  const tbody = document.getElementById("appointmentList");
  tbody.innerHTML = "";
  appointments.forEach((appt, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true" onblur="editAppointment(${index}, 'patient', this.innerText)">${appt.patient}</td>
      <td contenteditable="true" onblur="editAppointment(${index}, 'doctor', this.innerText)">${appt.doctor}</td>
      <td contenteditable="true" onblur="editAppointment(${index}, 'datetime', this.innerText)">${appt.datetime}</td>
      <td><button onclick="deleteAppointment(${index})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function editAppointment(index, field, value) {
  if (value.trim() !== "") {
    appointments[index][field] = value.trim();
  }
}

function deleteAppointment(index) {
  if (confirm("Are you sure you want to delete this appointment?")) {
    appointments.splice(index, 1);
    loadAppointments();
  }
}

// ------------------ Patient Section (Fixed for <tbody>) ------------------ //
function loadPatients() {
  const tbody = document.getElementById("patientList");
  tbody.innerHTML = "";
  patients.forEach((pat, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true" onblur="editPatient(${index}, 'name', this.innerText)">${pat.name}</td>
      <td contenteditable="true" onblur="editPatient(${index}, 'age', this.innerText)">${pat.age}</td>
      <td contenteditable="true" onblur="editPatient(${index}, 'contact', this.innerText)">${pat.contact}</td>
      <td><button onclick="deletePatient(${index})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function editPatient(index, field, value) {
  if (value.trim() !== "") {
    patients[index][field] = value.trim();
  }
}

function deletePatient(index) {
  if (confirm("Are you sure you want to delete this patient?")) {
    patients.splice(index, 1);
    loadPatients();
  }
}

// ------------------ Forms ------------------ //
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = this[0].value.trim();
  const age = this[1].value.trim();
  const contact = this[2].value.trim();

  if (name && age && contact) {
    patients.push({ name, age, contact });
    loadPatients();
    this.reset();
  } else {
    alert("All fields are required.");
  }
});

document.getElementById('appointmentForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const patient = this[0].value.trim();
  const doctor = this[1].value.trim();
  const datetime = this[2].value.trim();

  if (patient && doctor && datetime) {
    appointments.push({ patient, doctor, datetime });
    loadAppointments();
    this.reset();
  } else {
    alert("All fields are required.");
  }
});

// ------------------ Initial Load ------------------ //
loadAppointments();
loadPatients();
