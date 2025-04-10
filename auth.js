function toggleVisibility(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const msg = document.getElementById("register-msg");

  if (username && password) {
    localStorage.setItem("savedUsername", username);
    localStorage.setItem("savedPassword", password);
    msg.style.color = "green";
    msg.innerText = "Registered! You can login now.";
  } else {
    msg.style.color = "red";
    msg.innerText = "Enter valid details.";
  }
}

function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const msg = document.getElementById("login-msg");

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const validUser = users.find(user => user.username === username && user.password === password);

  if (validUser) {
    msg.style.color = "green";
    msg.innerText = "Login successful!";
    localStorage.setItem("isLoggedIn", "true");
    setTimeout(() => {
      window.location.href = "index.html"; // your dashboard page
    }, 1200);
  } else {
    msg.style.color = "red";
    msg.innerText = "Invalid credentials!";
  }
}

// Add some default test users (only once)
if (!localStorage.getItem("testUsersInitialized")) {
  const testUsers = [
    { username: "raghava", password: "raghava" },
    { username: "testuser", password: "test123" },
  
  ];

  localStorage.setItem("users", JSON.stringify(testUsers));
  localStorage.setItem("testUsersInitialized", "true");
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
  }
});
