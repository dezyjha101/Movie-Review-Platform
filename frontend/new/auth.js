const API_URL = "http://localhost:5000/api/users"; // backend base

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token); // save JWT
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "index.html"; // redirect to home
    } else {
      document.getElementById("loginMessage").textContent = data.message || "Login failed";
    }
  } catch (err) {
    document.getElementById("loginMessage").textContent = "Server error";
  }
});

// Signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById("signupMessage").textContent = "Signup successful! Please login.";
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } else {
      document.getElementById("signupMessage").textContent = data.message || "Signup failed";
    }
  } catch (err) {
    document.getElementById("signupMessage").textContent = "Server error";
  }
});
