// builder.js

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll("#builder-steps li");
  const sections = document.querySelectorAll(".builder-step");
  const nextButtons = document.querySelectorAll(".next-btn");

  function activateSection(sectionId) {
    sections.forEach(sec => sec.classList.remove("active"));
    steps.forEach(step => step.classList.remove("active"));

    document.getElementById(sectionId).classList.add("active");
    document.querySelector(`#builder-steps li[data-section="${sectionId}"]`).classList.add("active");
  }

  steps.forEach(step => {
    step.addEventListener("click", () => activateSection(step.dataset.section));
  });

  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => activateSection(btn.dataset.next));
  });

  // footer year
  document.getElementById("year").textContent = new Date().getFullYear();
});
