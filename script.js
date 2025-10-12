document.addEventListener("DOMContentLoaded", () => {
  const portfolioBtn = document.getElementById("portfolioBuilderBtn");
  if (!portfolioBtn) return;

  portfolioBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // temporary auth check*
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      window.location.href = "builder.html";
    } else {
      window.location.href = "sign-up.html";
    }
  });
});