// 1. IMMEDIATE PROTECTION CHECK
// This runs before the HTML finishes loading.
(function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn) {
    // Redirect non-logged-in users to Sign In
    window.location.href = "sign-in.html";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  
  // 2. UPDATE HEADER BUTTON (Sign In -> Sign Out)
  // Since we are protected, we know they are logged in, so we show "Sign Out"
  const authBtn = document.querySelector(".btn-sign-in");
  if (authBtn) {
    authBtn.textContent = "Sign Out";
    authBtn.href = "sign-out.html";
    authBtn.classList.remove("btn-sign-in");
    authBtn.classList.add("btn-sign-out"); // Ensure you have CSS for this class if needed
  }

  // 3. FOOTER YEAR
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 4. FILTERING LOGIC
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && cards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button visual state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        // Show/Hide cards based on category
        cards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
            // Add a small animation effect (optional)
            card.style.opacity = '0';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});