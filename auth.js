document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.querySelector(".auth-form");
  const messageBox = document.getElementById("authMessage");
  if (!form) return;

  const inputs = form.querySelectorAll("input");
  const emailInput = inputs[0];
  const passwordInput = inputs[1];
  const confirmInput = inputs.length === 3 ? inputs[2] : null;

  const toggle1 = document.getElementById("togglePassword");
  const toggle2 = document.getElementById("togglePassword1");
  const toggle3 = document.getElementById("togglePassword2");

  // toggle function
  function setupToggle(toggle, input) {
    if (!toggle || !input) return;
    let visible = false;
    toggle.addEventListener("click", () => {
      visible = !visible;
      input.type = visible ? "text" : "password";
      toggle.innerHTML = visible
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
              <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
            </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>`;
    });
  }
  setupToggle(toggle1, passwordInput);
  setupToggle(toggle2, passwordInput);
  setupToggle(toggle3, confirmInput);

  function showMessage(msg, success = false) {
    messageBox.textContent = msg;
    messageBox.style.display = "block";
    messageBox.style.color = success ? "#2ecc71" : "#c0392b";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmInput ? confirmInput.value.trim() : null;
    const isSignUp = !!confirmInput;

    if (!email || !password || (isSignUp && !confirm)) {
      showMessage("⚠️ Please fill out all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      showMessage("❌ Invalid email format.");
      return;
    }

    if (!validatePassword(password)) {
      showMessage("❌ Password must be at least 8 characters, include one uppercase letter, and one special character.");
      return;
    }

    if (isSignUp) {
      if (password !== confirm) {
        showMessage("❌ Passwords do not match.");
        return;
      }
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      showMessage("✅ Account created successfully!", true);
      setTimeout(() => (window.location.href = "builder.html"), 800);
      return;
    }

    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (email === storedEmail && password === storedPassword) {
      showMessage("✅ Sign in successful!", true);
      setTimeout(() => (window.location.href = "builder.html"), 800);
    } else {
      showMessage("❌ Email/Password combination not recognized. Create an account to sign in.");
    }
  });
});
