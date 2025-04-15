function toggleVisibility(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

// Helper function to show messages
function showMessage(msgElement, message, color) {
  msgElement.style.color = color;
  msgElement.innerText = message;
}

// Register new user
function registerUser(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const msg = document.getElementById("register-msg");

  if (!username || !password) {
    showMessage(msg, "Please enter both username and password.", "red");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    showMessage(msg, "Username already exists. Try a different one.", "red");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  showMessage(msg, "Registered successfully! You can now login.", "green");

  // Optionally clear fields
  document.getElementById("registerUsername").value = '';
  document.getElementById("registerPassword").value = '';
}

// Login user
function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const msg = document.getElementById("login-msg");

  if (!username || !password) {
    showMessage(msg, "Please enter both fields.", "red");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const validUser = users.find(user => user.username === username && user.password === password);

  if (validUser) {
    showMessage(msg, "Login successful!", "green");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", username);
    setTimeout(() => {
      window.location.href = "index.html"; // redirect to dashboard
    }, 1000);
  } else {
    showMessage(msg, "Invalid username or password.", "red");
  }
}

// Initialize default users once
function initializeTestUsers() {
  if (!localStorage.getItem("testUsersInitialized")) {
    const testUsers = [
      { username: "admin1", password: "admin123" },
      { username: "admin2", password: "admin456" },
      { username: "raghava", password: "raghava" },
      { username: "testuser", password: "test123" },
    ];
    localStorage.setItem("users", JSON.stringify(testUsers));
    localStorage.setItem("testUsersInitialized", "true");
  }
}

// Redirect logged-in user
window.addEventListener("DOMContentLoaded", () => {
  initializeTestUsers();
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
  }
});
