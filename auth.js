document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const signUpForm = document.getElementById("signUpForm");

  if (signUpForm) {
    signUpForm.addEventListener("submit", e => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (!email || !password) {
        alert("Please fill out all required fields.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      // Simulate account creation (temporary needs backend para gumana)
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");

      // Redirect after finishing
      window.location.href = "builder.html";
    });
  }
});
