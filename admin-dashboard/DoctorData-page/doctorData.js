// doctorData.js — admin doctor management frontend
const API = "http://localhost:5000/api/admin/doctors";

const doctorTableBody = document.getElementById("doctorTableBody");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const sortSelect = document.getElementById("sortSelect");

const addDoctorForm = document.getElementById("addDoctorForm");
const clearFormBtn = document.getElementById("clearForm");

// read inputs
function readFilters() {
  const name = document.getElementById("searchName").value.trim();
  const email = document.getElementById("searchEmail").value.trim();
  const phone = document.getElementById("searchPhone").value.trim();
  const spec = document.getElementById("searchSpec").value.trim();
  let qs = [];
  if (name) qs.push(`name=${encodeURIComponent(name)}`);
  if (email) qs.push(`email=${encodeURIComponent(email)}`);
  if (phone) qs.push(`phone=${encodeURIComponent(phone)}`);
  if (spec) qs.push(`specialization=${encodeURIComponent(spec)}`);
  const sort = sortSelect.value;
  if (sort) qs.push(`sort=${encodeURIComponent(sort)}`);
  return qs.length ? `?${qs.join("&")}` : "";
}

// load doctors with optional query string
async function loadDoctors(qs = "") {
  try {
    const res = await fetch(`${API}${qs}`);
    const data = await res.json();
    doctorTableBody.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      doctorTableBody.innerHTML = `<tr><td colspan="5" class="small-muted">No doctors found.</td></tr>`;
      return;
    }
    data.forEach(d => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.name}</td>
        <td>${d.email || ""}</td>
        <td>${d.phone || ""}</td>
        <td>${d.specialization || ""}</td>
        <td>
          <button class="action-btn delete" data-id="${d._id}">Delete</button>
        </td>
      `;
      doctorTableBody.appendChild(tr);
    });
    // attach delete handlers
    document.querySelectorAll(".action-btn.delete").forEach(b => {
      b.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Delete this doctor?")) return;
        const resp = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (resp.ok) loadDoctors(readFilters());
        else alert("Delete failed");
      });
    });
  } catch (err) {
    console.error("Error loading doctors:", err);
    doctorTableBody.innerHTML = `<tr><td colspan="5" class="small-muted">Error loading doctors</td></tr>`;
  }
}

// search & reset UI
searchBtn.addEventListener("click", () => loadDoctors(readFilters()));
resetBtn.addEventListener("click", () => {
  document.getElementById("searchName").value = "";
  document.getElementById("searchEmail").value = "";
  document.getElementById("searchPhone").value = "";
  document.getElementById("searchSpec").value = "";
  sortSelect.value = "";
  loadDoctors();
});
sortSelect.addEventListener("change", () => loadDoctors(readFilters()));

// add doctor
addDoctorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById("d_name").value.trim(),
    email: document.getElementById("d_email").value.trim(),
    phone: document.getElementById("d_phone").value.trim(),
    specialization: document.getElementById("d_specialization").value.trim()
  };
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      addDoctorForm.reset();
      loadDoctors();
    } else {
      alert(data.message || "Error adding doctor");
    }
  } catch (err) {
    console.error("Error adding doctor:", err);
  }
});

clearFormBtn.addEventListener("click", () => addDoctorForm.reset());

// initial load
loadDoctors();
