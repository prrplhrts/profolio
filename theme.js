document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".select-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const selectedTheme = e.target.closest(".theme-card").dataset.theme;
      localStorage.setItem("selectedTheme", selectedTheme);
      window.location.href = "portfolio.html";
    });
  });
});
