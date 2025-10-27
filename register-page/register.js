const form = document.getElementById("registerForm");
const roleSelect = document.getElementById("roleSelect");
const doctorFields = document.getElementById("doctorFields");

// Show/hide doctor fields
function toggleFields() {
  doctorFields.style.display = roleSelect.value === "doctor" ? "block" : "none";
}
roleSelect.addEventListener("change", toggleFields);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = roleSelect.value;
  const data = {};

  // ✅ Direct mapping for known fields
  data.name = form.querySelector('input[placeholder="Full Name"]').value;
  data.email = form.querySelector('input[placeholder="Email"]').value;
  data.phone = form.querySelector('input[placeholder="Phone Number"]').value;
  data.password = form.querySelector('input[placeholder="Password"]').value;
  data.role = role;

  // Doctor-specific fields
  if (role === "doctor") {
    data.specialization = form.querySelector('input[placeholder="Specialization"]').value;
    data.experience = form.querySelector('input[placeholder="Years of Experience"]').value;
    data.degree = form.querySelector('input[placeholder="Degree / Qualification"]').value;
    data.university = form.querySelector('input[placeholder="University / College Attended"]').value;
    data.timeSlots = form.querySelector('input[placeholder="e.g., 10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM"]').value;

    // ✅ Handle days checkboxes
    const selectedDays = [];
    document.querySelectorAll('input[name="days"]:checked').forEach((day) => {
      selectedDays.push(day.value);
    });
    data.availableDays = selectedDays;
  }

  try {
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "Registration successful!");
      window.location.href = "../Login-page/login.html"; // ✅ redirect
    } else {
      alert("Error: " + (result.error || "Registration failed"));
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting registration. Check console.");
  }
});
