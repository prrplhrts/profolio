document.addEventListener("DOMContentLoaded", () => {
  /* =====================
     GLOBAL HELPERS
  ===================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================
     SIGN OUT PAGE LOGIC
  ===================== */
  // Check if we are on the Sign Out page by looking for a specific element or URL
  if (document.title.includes("Sign Out") || document.querySelector(".btn-confirm-logout")) {
    const logoutBtn = document.querySelector(".btn-confirm-logout");
    
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Clear session data
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        
        // Redirect to Home
        window.location.href = "index.html";
      });
    }
    return; // Stop here if on Sign Out page
  }

  /* =====================
     SIGN IN / SIGN UP LOGIC
  ===================== */
  const form = document.querySelector(".auth-form");
  const messageBox = document.getElementById("authMessage");
  if (!form) return;

  const inputs = form.querySelectorAll("input");
  const emailInput = inputs[0];
  const passwordInput = inputs[1];
  // If there is a 3rd input, it's the Confirm Password field (Sign Up page)
  const confirmInput = inputs.length === 3 ? inputs[2] : null; 

  // Toggle Password Visibility Logic
  const toggle1 = document.getElementById("togglePassword");
  const toggle2 = document.getElementById("togglePassword1");
  const toggle3 = document.getElementById("togglePassword2");

  function setupToggle(toggle, input) {
    if (!toggle || !input) return;
    let visible = false;
    toggle.addEventListener("click", () => {
      visible = !visible;
      input.type = visible ? "text" : "password";
      
      // SVG Icons
      const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>`;
      const slashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>`;

      toggle.innerHTML = visible ? slashIcon : eyeIcon;
    });
  }

  setupToggle(toggle1, passwordInput);
  setupToggle(toggle2, passwordInput);
  setupToggle(toggle3, confirmInput);

  function showMessage(msg, success = false) {
    messageBox.textContent = msg;
    messageBox.style.display = "block";
    messageBox.style.color = success ? "#27ae60" : "#c0392b";
    messageBox.style.backgroundColor = success ? "#eafaf1" : "#fdedec";
    messageBox.style.padding = "10px";
    messageBox.style.borderRadius = "6px";
    messageBox.style.marginTop = "10px";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePassword(password) {
    // Min 8 chars, 1 Uppercase, 1 Special char
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
  }

  /* =====================
     FORM SUBMISSION
  ===================== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmInput ? confirmInput.value.trim() : null;
    const isSignUp = !!confirmInput;

    // 1. Frontend Validation
    if (!email || !password || (isSignUp && !confirm)) {
      showMessage("⚠️ Please fill out all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      showMessage("❌ Invalid email format.");
      return;
    }

    if (!validatePassword(password)) {
      showMessage("❌ Password must be 8+ chars, include uppercase & special char.");
      return;
    }

    if (isSignUp && password !== confirm) {
      showMessage("❌ Passwords do not match.");
      return;
    }

    // 2. API Call to Node.js Backend
    const button = form.querySelector("button");
    const originalText = button.textContent;
    button.textContent = "Processing...";
    button.disabled = true;

    // Determine Endpoint
    const endpoint = isSignUp 
      ? "http://localhost:3000/signup" 
      : "http://localhost:3000/signin";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(`✅ ${data.message}`, true);
        
        if (!isSignUp) {
          // LOGIN SUCCESS: Save session and redirect
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userId", data.userId);
          setTimeout(() => (window.location.href = "builder.html"), 1000);
        } else {
          // SIGN UP SUCCESS: Redirect to login
          setTimeout(() => (window.location.href = "sign-in.html"), 1500);
        }

      } else {
        // Backend returned an error (e.g., "Email already exists")
        showMessage(`❌ ${data.message || "An error occurred"}`);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      showMessage("❌ Server error. Ensure backend is running.");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });
});