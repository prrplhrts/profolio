document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const signUpForm = document.querySelector(".auth-form");
  const modal = document.getElementById("profileModal");
  const closeBtn = document.getElementById("closeProfileModal");

  if (signUpForm && modal) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Pretend to register user
      localStorage.setItem("isLoggedIn", "true");
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    });
  }

  const signInForm = document.querySelector(".auth-form");
  if (signInForm && !modal) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "builder.html";
    });
  }
});
