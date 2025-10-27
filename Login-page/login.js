document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const role = document.getElementById("role").value.toLowerCase();
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!role || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");

      // Redirect based on role
      if (role === "doctor") {
        window.location.href = "../doctor-dashboard/doctorAppointments-page/doctorAppointments.html";
      } else if (role === "receptionist") {
        window.location.href = "../receptionist-dashboard/Appointments-page/appointments.html";
      } else if (role === "admin") {
        window.location.href = "../admin-dashboard/DoctorData-page/doctorData.html";
      }
    } else {
      alert(data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Please try again later.");
  }
});
