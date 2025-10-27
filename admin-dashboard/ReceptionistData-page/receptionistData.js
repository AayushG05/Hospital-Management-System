// receptionistData.js — admin receptionist page frontend
const API = "http://localhost:5000/api/receptionistdata";

const tableBody = document.getElementById("receptionistTableBody");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const sortSelect = document.getElementById("sortSelect");

const addForm = document.getElementById("receptionistForm");
const clearBtn = document.getElementById("clearForm");

// helpers
function buildQueryString(q) {
  return q ? `?query=${encodeURIComponent(q)}` : "";
}

// load receptionists (optionally by server-side search query)
async function loadReceptionists(query = "") {
  try {
    const url = query ? `${API}/search?query=${encodeURIComponent(query)}` : `${API}`;
    const res = await fetch(url);
    const data = await res.json();

    tableBody.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="small-muted">No receptionists found.</td></tr>`;
      return;
    }

    data.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-key="name">${r.name}</td>
        <td data-key="email">${r.email || ""}</td>
        <td data-key="phone">${r.phone || ""}</td>
        <td data-key="shift">${r.shift || ""}</td>
        <td data-key="address">${r.address || ""}</td>
        <td>
          <button class="action-btn delete" data-id="${r._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // attach delete handlers
    document.querySelectorAll(".action-btn.delete").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Delete this receptionist?")) return;
        try {
          const resp = await fetch(`${API}/${id}`, { method: "DELETE" });
          if (resp.ok) {
            loadReceptionists(document.getElementById("searchInput").value.trim());
          } else {
            const err = await resp.json().catch(()=>({ message: "Delete failed" }));
            alert(err.message || "Delete failed");
          }
        } catch (err) {
          console.error(err);
          alert("Delete failed");
        }
      });
    });

  } catch (err) {
    console.error("Error loading receptionists:", err);
    tableBody.innerHTML = `<tr><td colspan="6" class="small-muted">Error loading receptionists.</td></tr>`;
  }
}

// add receptionist
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById("r_name").value.trim(),
    email: document.getElementById("r_email").value.trim(),
    phone: document.getElementById("r_phone").value.trim(),
    shift: document.getElementById("r_shift").value.trim(),
    address: document.getElementById("r_address").value.trim()
  };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      addForm.reset();
      loadReceptionists();
    } else {
      alert(data.message || data.error || "Failed to add receptionist");
    }
  } catch (err) {
    console.error("Error adding receptionist:", err);
    alert("Error adding receptionist");
  }
});

// clear form
clearBtn.addEventListener("click", () => addForm.reset());

// search
searchBtn.addEventListener("click", () => {
  const q = document.getElementById("searchInput").value.trim();
  loadReceptionists(q);
});

// reset
resetBtn.addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  sortSelect.value = "";
  loadReceptionists();
});

// client-side sort (applies to currently rendered rows)
sortSelect.addEventListener("change", () => {
  const key = sortSelect.value;
  if (!key) return;
  const rows = Array.from(document.querySelectorAll("#receptionistTableBody tr"));
  rows.sort((a,b) => {
    const aVal = (a.querySelector(`td[data-key="${key}"]`)?.innerText || "").toLowerCase();
    const bVal = (b.querySelector(`td[data-key="${key}"]`)?.innerText || "").toLowerCase();
    return aVal.localeCompare(bVal);
  });
  tableBody.innerHTML = "";
  rows.forEach(r => tableBody.appendChild(r));
});

// initial load
loadReceptionists();
