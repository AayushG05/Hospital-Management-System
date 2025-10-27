// -------------------- Elements --------------------
const patientForm = document.getElementById("patientForm");
const patientList = document.getElementById("patientList");
const searchBtn = document.getElementById("searchBtn");

// -------------------- Backend URL --------------------
const BACKEND_URL = "http://localhost:5000/api/patients";

// -------------------- Load Patients from Backend --------------------
async function loadPatients(query = "") {
    try {
        let url = query ? `${BACKEND_URL}/search?${query}` : `${BACKEND_URL}/all`;
        const res = await fetch(url);
        const data = await res.json();

        patientList.innerHTML = "";
        data.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${p.email}</td>
                <td>${p.phone}</td>
                <td>${p.age || ""}</td>
                <td>${p.gender || ""}</td>
                <td>${p.address || ""}</td>
                <td>
                    <button onclick="deletePatient('${p._id}')">Delete</button>
                </td>
            `;
            patientList.appendChild(tr);
        });
    } catch (err) {
        console.error("Error loading patients:", err);
    }
}

// -------------------- Add Patient --------------------
patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById("patientName").value.trim(),
        email: document.getElementById("patientEmail").value.trim(),
        phone: document.getElementById("patientPhone").value.trim(),
        age: document.getElementById("patientAge").value,
        gender: document.getElementById("patientGender").value,
        address: document.getElementById("patientAddress").value.trim()
    };

    try {
        const res = await fetch(`${BACKEND_URL}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (res.ok) {
            patientForm.reset();
            loadPatients();
        } else {
            alert(data.message || "Error adding patient");
        }
    } catch (err) {
        console.error("Error adding patient:", err);
    }
});

// -------------------- Delete Patient --------------------
async function deletePatient(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
        try {
            await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
            loadPatients();
        } catch (err) {
            console.error("Error deleting patient:", err);
        }
    }
}

// -------------------- Search Patients --------------------
searchBtn.addEventListener("click", () => {
    const name = document.getElementById("searchName").value.trim();
    const email = document.getElementById("searchEmail").value.trim();
    const phone = document.getElementById("searchPhone").value.trim();

    let query = "";
    if (name) query += `name=${name}&`;
    if (email) query += `email=${email}&`;
    if (phone) query += `phone=${phone}&`;

    query = query.slice(0, -1); // Remove trailing &
    loadPatients(query);
});

// -------------------- Initial Load --------------------
loadPatients();
