let users = [
  { name: "Dr. Aayush", role: "Doctor", email: "aayush@hospital.com" },
  { name: "Dr. Sneha", role: "Doctor", email: "sneha@hospital.com" },
  { name: "Ritika", role: "Receptionist", email: "ritika@hospital.com" },
  { name: "Aditya", role: "Receptionist", email: "aditya@hospital.com" },
];

const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');

function renderUsers() {
  userList.innerHTML = "";
  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input value="${user.name}" onchange="editUser(${index}, 'name', this.value)"></td>
      <td><select onchange="editUser(${index}, 'role', this.value)">
            <option value="Doctor" ${user.role === 'Doctor' ? 'selected' : ''}>Doctor</option>
            <option value="Receptionist" ${user.role === 'Receptionist' ? 'selected' : ''}>Receptionist</option>
          </select></td>
      <td><input value="${user.email}" onchange="editUser(${index}, 'email', this.value)"></td>
      <td><button onclick="deleteUser(${index})">Delete</button></td>
    `;
    userList.appendChild(row);
  });
}

function editUser(index, field, value) {
  users[index][field] = value;
}

function deleteUser(index) {
  users.splice(index, 1);
  renderUsers();
}

userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value.trim();

  if (name && role && email) {
    users.push({ name, role, email });
    userForm.reset();
    renderUsers();
  }
});

renderUsers();
