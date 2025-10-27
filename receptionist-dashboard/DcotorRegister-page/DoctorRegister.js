// -------------------- Elements --------------------
const doctorForm = document.getElementById("doctorForm");
const doctorList = document.getElementById("doctorList");
const searchBtn = document.getElementById("searchBtn");

// -------------------- Backend URL --------------------
const BACKEND_URL = "http://localhost:5000/api/doctors";

// -------------------- Load Doctors --------------------
async function loadDoctors(query = "") {
    try {
        const res = await fetch(`${BACKEND_URL}/search${query}`);
        const data = await res.json();

        doctorList.innerHTML = "";
        data.forEach(doc => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${doc.name}</td>
                <td>${doc.email}</td>
                <td>${doc.phone}</td>
                <td>${doc.specialization}</td>
                <td>${doc.availability}</td>
                <td>
                    <button class="delete-btn" onclick="deleteDoctor('${doc._id}')">Delete</button>
                </td>
            `;
            doctorList.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading doctors:", err);
    }
}

// -------------------- Add Doctor --------------------
doctorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById("doctorName").value.trim(),
        email: document.getElementById("doctorEmail").value.trim(),
        phone: document.getElementById("doctorPhone").value.trim(),
        specialization: document.getElementById("specialization").value.trim(),
        availability: document.getElementById("availability").value
    };

    try {
        const res = await fetch(`${BACKEND_URL}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
            doctorForm.reset();
            loadDoctors();
        } else {
            alert(data.message || "Error adding doctor");
        }
    } catch (err) {
        console.error("Error adding doctor:", err);
    }
});

// -------------------- Delete Doctor --------------------
async function deleteDoctor(id) {
    if (confirm("Are you sure you want to delete this doctor?")) {
        try {
            await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
            loadDoctors();
        } catch (err) {
            console.error("Error deleting doctor:", err);
        }
    }
}

// -------------------- Search Doctor --------------------
searchBtn.addEventListener("click", () => {
    const name = document.getElementById("searchName").value.trim();
    const email = document.getElementById("searchEmail").value.trim();
    const phone = document.getElementById("searchPhone").value.trim();
    const specialization = document.getElementById("searchSpecialization").value.trim();
    const availability = document.getElementById("searchAvailability").value;

    const query = `?name=${name}&email=${email}&phone=${phone}&specialization=${specialization}&availability=${availability}`;
    loadDoctors(query);
});

// -------------------- Initial Load --------------------
loadDoctors();
