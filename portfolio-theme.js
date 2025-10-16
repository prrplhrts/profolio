document.addEventListener("DOMContentLoaded", () => {
  const themeCards = document.querySelectorAll(".theme-card");
  const yearSpan = document.getElementById("year");

  themeCards.forEach(card => {
    card.querySelector(".select-btn").addEventListener("click", () => {
      const selectedTheme = card.dataset.theme;
      localStorage.setItem("selectedTheme", selectedTheme);

      alert(`Theme "${selectedTheme}" selected!`);
      window.location.href = "portfolio-clean.html"; // redirect for now

      // dynamic thingy ignore for now
      // if (selectedTheme === "clean") window.location.href = "portfolio-clean.html";
      // else if (selectedTheme === "modern") window.location.href = "portfolio-modern.html";
      // else window.location.href = "portfolio-classic.html";
    });
  });

  yearSpan.textContent = new Date().getFullYear();
});
