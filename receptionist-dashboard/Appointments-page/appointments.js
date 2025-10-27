// receptionist-dashboard/appointments.js

const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");

// Backend API URL
const BACKEND_URL = "http://localhost:5000/api/appointments";

// Load all appointments
async function loadAppointments() {
    try {
        const res = await fetch(`${BACKEND_URL}/search`);
        const data = await res.json();

        appointmentList.innerHTML = "";
        data.forEach(appt => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${appt.patientName}</td>
                <td>${appt.patientEmail}</td>
                <td>${appt.patientPhone}</td>
                <td>${appt.doctor}</td>
                <td>${appt.date} ${appt.time}</td>
                <td>${appt.notes || ""}</td>
                <td>
                    <button onclick="deleteAppointment('${appt._id}')">Delete</button>
                </td>
            `;
            appointmentList.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading appointments:", err);
    }
}

// Add new appointment
appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datetimeValue = document.getElementById("appointmentDateTime").value; // "2025-10-27T15:30"
    const [date, time] = datetimeValue.split("T"); // split into date & time

    const formData = {
        patientName: document.getElementById("patientName").value.trim(),
        patientEmail: document.getElementById("patientEmail").value.trim(),
        patientPhone: document.getElementById("patientPhone").value.trim(),
        doctor: document.getElementById("doctorSelect").value,
        date,
        time,
        notes: document.getElementById("notes").value.trim()
    };

    try {
        const res = await fetch(`${BACKEND_URL}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            appointmentForm.reset();
            loadAppointments();
        } else {
            alert(data.message || "Error adding appointment");
        }
    } catch (err) {
        console.error("Error adding appointment:", err);
    }
});

// Delete appointment
async function deleteAppointment(id) {
    if (confirm("Are you sure you want to delete this appointment?")) {
        try {
            await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
            loadAppointments();
        } catch (err) {
            console.error("Error deleting appointment:", err);
        }
    }
}

// Initial load
loadAppointments();
