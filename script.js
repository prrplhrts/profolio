document.addEventListener("DOMContentLoaded", () => {
  const portfolioBtn = document.getElementById("portfolioBuilderBtn");
  const authLink = document.getElementById("authLink");

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // 1. UI UPDATE: Change "Sign In" to "Sign Out" if logged in
  if (authLink) {
    if (isLoggedIn) {
      authLink.textContent = "Sign Out";
      authLink.href = "sign-out.html";
      authLink.classList.replace("btn-sign-in", "btn-sign-out"); // Optional style change
    } else {
      authLink.textContent = "Sign In";
      authLink.href = "sign-in.html";
    }
  }

  // 2. BUTTON PROTECTION: Intercept the click on Portfolio Builder
  if (portfolioBtn) {
    portfolioBtn.addEventListener("click", (e) => {
      if (!isLoggedIn) {
        e.preventDefault(); // Stop the link from working
        alert("Please sign in to access the Portfolio Builder.");
        window.location.href = "sign-in.html";
      }
      // If logged in, the <a> tag works normally and takes them to builder.html
    });
  }
});