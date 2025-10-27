// Prescription.js
const PRESC_API = "http://localhost:5000/api/prescriptions";
const PAT_API = "http://localhost:5000/api/patients";

const patientSelect = document.getElementById("patientSelect");
const patientMatches = document.getElementById("patientMatches");
const prescForm = document.getElementById("prescriptionForm");
const prescList = document.getElementById("prescList");

// live search patients (type and press Enter or blur)
let searchTimeout;
patientSelect.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  const q = patientSelect.value.trim();
  if (!q) { patientMatches.innerText = ""; return; }
  searchTimeout = setTimeout(async () => {
    const res = await fetch(`${PAT_API}/search?name=${encodeURIComponent(q)}&email=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      patientMatches.innerHTML = data.slice(0,5).map(p => `<div class="small-muted match" data-name="${p.name}" data-email="${p.email}" data-phone="${p.phone}">${p.name} — ${p.email} — ${p.phone}</div>`).join("");
      document.querySelectorAll(".match").forEach(el => {
        el.addEventListener("click", () => {
          document.getElementById("prescPatientName").value = el.dataset.name;
          document.getElementById("prescPatientEmail").value = el.dataset.email;
          document.getElementById("prescPatientPhone").value = el.dataset.phone;
          patientMatches.innerHTML = "";
          patientSelect.value = "";
        });
      });
    } else {
      patientMatches.innerText = "No matches";
    }
  }, 350);
});

// submit prescription
prescForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    patientName: document.getElementById("prescPatientName").value.trim(),
    patientEmail: document.getElementById("prescPatientEmail").value.trim(),
    patientPhone: document.getElementById("prescPatientPhone").value.trim(),
    medicines: document.getElementById("medicines").value.trim().split("\n").map(s=>s.trim()).filter(Boolean),
    notes: document.getElementById("notes").value.trim()
  };
  try {
    const res = await fetch(`${PRESC_API}/add`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      prescForm.reset();
      loadPrescriptions();
    } else {
      const err = await res.json().catch(()=>null);
      alert(err?.message || "Error saving prescription");
    }
  } catch(err) {
    console.error(err);
  }
});

async function loadPrescriptions() {
  try {
    const res = await fetch(`${PRESC_API}/all`);
    const data = await res.json();
    prescList.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      prescList.innerHTML = `<tr><td colspan="5" class="small-muted">No prescriptions yet.</td></tr>`;
      return;
    }
    data.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.patientName} <div class="small-muted">${p.patientEmail}</div></td>
        <td>${Array.isArray(p.medicines) ? p.medicines.join("<br/>") : p.medicines}</td>
        <td>${p.notes || ""}</td>
        <td>${new Date(p.createdAt).toLocaleString()}</td>
        <td><button class="btn-delete" data-id="${p._id}">Delete</button></td>
      `;
      prescList.appendChild(tr);
    });
    document.querySelectorAll(".btn-delete").forEach(b => {
      b.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Delete prescription?")) return;
        const del = await fetch(`${PRESC_API}/${id}`, { method: "DELETE" });
        if (del.ok) loadPrescriptions(); else alert("Delete failed");
      });
    });
  } catch(err) {
    console.error("Error loading prescriptions:", err);
  }
}

loadPrescriptions();
