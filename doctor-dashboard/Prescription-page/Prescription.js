// doctor-dashboard/Prescription-page/Prescription.js
const PRESC_API = "http://localhost:5000/api/prescriptions";

const prescForm = document.getElementById("prescriptionForm");
const prescList = document.getElementById("prescList");

// ----------------- ADD PRESCRIPTION -----------------
prescForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    patientName: document.getElementById("prescPatientName").value.trim(),
    patientEmail: document.getElementById("prescPatientEmail").value.trim(),
    patientPhone: document.getElementById("prescPatientPhone").value.trim(),
    gender: document.getElementById("prescGender").value,
    age: document.getElementById("prescAge").value.trim(),
    weight: document.getElementById("prescWeight").value.trim(),
    problem: document.getElementById("problem").value.trim(),
    medicines: document
      .getElementById("medicines")
      .value.trim()
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    notes: document.getElementById("notes").value.trim(),
  };

  try {
    const res = await fetch(`${PRESC_API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Prescription added successfully!");
      prescForm.reset();
      loadPrescriptions();
    } else {
      const err = await res.json().catch(() => null);
      alert(err?.message || "Error saving prescription");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Network error");
  }
});

// ----------------- LOAD PRESCRIPTIONS -----------------
// ----------------- LOAD PRESCRIPTIONS -----------------
async function loadPrescriptions() {
  try {
    const res = await fetch(`${PRESC_API}/all`);
    const data = await res.json();

    prescList.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      prescList.innerHTML = `<tr><td colspan="9" class="small-muted">No prescriptions yet.</td></tr>`;
      return;
    }

    data.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <strong>${escapeHtml(p.patientName)}</strong>
          <div class="small-muted">${escapeHtml(p.patientEmail || "-")}</div>
        </td>
        <td>${escapeHtml(p.gender || "-")}</td>
        <td>${p.age ? escapeHtml(p.age) : "-"}</td>
        <td>${p.weight ? escapeHtml(p.weight) : "-"}</td>
        <td>${escapeHtml(p.problem || "-")}</td>
        <td>${
          Array.isArray(p.medicines)
            ? p.medicines.map((m) => escapeHtml(m)).join("<br>")
            : escapeHtml(p.medicines || "")
        }</td>
        <td>${escapeHtml(p.notes || "-")}</td>
        <td>${new Date(p.createdAt).toLocaleString()}</td>
        <td><button class="btn-delete" data-id="${p._id}">Delete</button></td>
      `;
      prescList.appendChild(tr);
    });

    attachDeleteHandlers();
  } catch (err) {
    console.error("Error loading prescriptions:", err);
  }
}

// ----------------- DELETE HANDLER -----------------
function attachDeleteHandlers() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Delete this prescription?")) return;
      try {
        const del = await fetch(`${PRESC_API}/${id}`, { method: "DELETE" });
        if (del.ok) loadPrescriptions();
        else alert("Delete failed");
      } catch (err) {
        console.error("Error deleting:", err);
      }
    });
  });
}

// ----------------- HELPER -----------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Initial load
loadPrescriptions();
