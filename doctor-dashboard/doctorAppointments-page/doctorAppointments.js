// doctorAppointments.js
// Shows all appointments for a doctor (filtered by ?doctor=Dr%20Name if present)

const API_BASE = "http://localhost:5000/api/appointments";
const apptListEl = document.getElementById("apptList");
const searchBtn = document.getElementById("searchBtn");
const showAllBtn = document.getElementById("showAllBtn");

// helper to read query param 'doctor' if page opened like ?doctor=Dr%20Aayush
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

let currentDoctor = getQueryParam("doctor") || ""; // if blank, will show all appts
let currentFilters = { doctor: currentDoctor };

// load appointments with optional filters
async function loadAppointments(filters = {}) {
  try {
    // build query string
    const qs = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/search?${qs}`);
    const data = await res.json();

    apptListEl.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      apptListEl.innerHTML = `<tr><td colspan="7" class="small-muted">No appointments found.</td></tr>`;
      return;
    }

    data.forEach(appt => {
      // ensure done flag default
      const done = appt.done ? 'checked' : '';
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input class="done-checkbox" type="checkbox" data-id="${appt._id}" ${done}></td>
        <td>${appt.patientName}</td>
        <td>${appt.patientPhone || ''}</td>
        <td>${appt.date || ''}</td>
        <td>${appt.time || ''}</td>
        <td>${appt.notes || ''}</td>
        <td>
          <button class="btn-delete" data-id="${appt._id}">Delete</button>
        </td>
      `;
      apptListEl.appendChild(tr);
    });

    // attach handlers (delegation could be used, but simple attach is fine)
    document.querySelectorAll(".btn-delete").forEach(b => {
      b.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Delete this appointment?")) return;
        const del = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (del.ok) loadAppointments(currentFilters);
        else alert("Delete failed");
      });
    });

    document.querySelectorAll(".done-checkbox").forEach(cb => {
      cb.addEventListener("change", async (e) => {
        const id = e.target.dataset.id;
        const done = e.target.checked;
        // call backend to update done flag
        const res = await fetch(`${API_BASE}/${id}/done`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done })
        });
        // if (!res.ok) {
        //   alert("Failed to update status");
        // }
      });
    });

  } catch (err) {
    console.error("Error loading appointments:", err);
    apptListEl.innerHTML = `<tr><td colspan="7" class="small-muted">Error loading appointments.</td></tr>`;
  }
}

// search UI
searchBtn.addEventListener("click", () => {
  const name = document.getElementById("searchName").value.trim();
  const phone = document.getElementById("searchPhone").value.trim();
  const date = document.getElementById("searchDate").value;
  const filters = { ...currentFilters };
  if (name) filters.patientName = name;
  if (phone) filters.patientPhone = phone;
  if (date) filters.date = date;
  currentFilters = filters;
  loadAppointments(filters);
});

showAllBtn.addEventListener("click", () => {
  currentFilters = currentDoctor ? { doctor: currentDoctor } : {};
  loadAppointments(currentFilters);
});

// initial load: filter by doctor if provided otherwise load all
loadAppointments(currentFilters);
