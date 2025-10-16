document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll("#builder-steps li");
  const sections = document.querySelectorAll(".builder-step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const yearEl = document.getElementById("year");

  // =========================
  // SECTION NAVIGATION
  // =========================
  function activateSection(sectionId) {
    sections.forEach(sec => sec.classList.remove("active"));
    steps.forEach(step => step.classList.remove("active"));

    document.getElementById(sectionId).classList.add("active");
    document
      .querySelector(`#builder-steps li[data-section="${sectionId}"]`)
      .classList.add("active");

    if (sectionId === "preview") displayPreview();
  }

  steps.forEach(step => {
    step.addEventListener("click", () => activateSection(step.dataset.section));
  });

  nextButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const currentStep = e.target.closest(".builder-step").id;
      saveStepData(currentStep);
      activateSection(btn.dataset.next);
    });
  });

  // =========================
  // TEMPORARY DATA STORAGE USING LOCALSTORAGE
  // =========================
  function saveStepData(stepId) {
    const stepSection = document.getElementById(stepId);
    const inputs = stepSection.querySelectorAll("input, textarea");
    const data = {};

    inputs.forEach(input => {
      data[input.id] = input.value;
    });

    localStorage.setItem(stepId, JSON.stringify(data));
  }

  function loadStepData(stepId) {
    const stored = localStorage.getItem(stepId);
    if (stored) {
      const data = JSON.parse(stored);
      Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field) field.value = data[key];
      });
    }
  }

  const allSteps = ["profile", "experience", "projects", "skills"];
  allSteps.forEach(loadStepData);

  // =========================
  // PREVIEW SECTION
  // =========================
  function displayPreview() {
    const previewBox = document.querySelector(".preview-box");
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    const experience = JSON.parse(localStorage.getItem("experience") || "{}");
    const projects = JSON.parse(localStorage.getItem("projects") || "{}");
    const skills = JSON.parse(localStorage.getItem("skills") || "{}");

    previewBox.innerHTML = `
      <div class="preview-card">
        <div class="preview-header">
          <h3>${profile.name || "Your Name"}</h3>
          <p class="headline">${profile.headline || ""}</p>
          <p class="about">${profile.about || ""}</p>
          <p class="contact">
            ${profile.email ? `<span>${profile.email}</span>` : ""}
            ${profile.location ? ` | <span>${profile.location}</span>` : ""}
          </p>
        </div>

        <div class="preview-section">
          <h4>Experience</h4>
          ${
            experience.jobTitle || experience.company
              ? `
            <div class="preview-item">
              <p><strong>${experience.jobTitle || ""}</strong> – ${experience.company || ""}</p>
              <p class="duration">${experience.startDate || ""} → ${experience.endDate || "Present"}</p>
              <p>${experience.description || ""}</p>
            </div>
          `
              : `<p class="empty">No experience added yet.</p>`
          }
        </div>

        <div class="preview-section">
          <h4>Projects</h4>
          ${
            projects.projectName
              ? `
            <div class="preview-item">
              <p><strong>${projects.projectName}</strong> – ${projects.projectRole || ""}</p>
              <p>${projects.projectDesc || ""}</p>
              ${
                projects.projectLink
                  ? `<a href="${projects.projectLink}" target="_blank">${projects.projectLink}</a>`
                  : ""
              }
            </div>
          `
              : `<p class="empty">No projects added yet.</p>`
          }
        </div>

        <div class="preview-section">
          <h4>Skills</h4>
          <p>${skills.skills || "No skills added yet."}</p>
          ${
            skills.certifications
              ? `<p><em>Certifications:</em> ${skills.certifications}</p>`
              : ""
          }
        </div>
      </div>
    `;

    // attach actions
    document
      .getElementById("generatePortfolio")
      .addEventListener("click", generatePortfolio);
    document
      .getElementById("clearData")
      .addEventListener("click", clearAllData);
  }

  // =========================
  // GENERATE PORTFOLIO (STEP 4)
  // =========================
  function generatePortfolio() {
    // Redirect user to theme selection page
    window.location.href = "portfolio-theme.html";
  }

  // =========================
  // CLEAR ALL DATA
  // =========================
  function clearAllData() {
    localStorage.clear();
    alert("All saved data cleared!");
    location.reload();
  }

  // =========================
  // FOOTER YEAR
  // =========================
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
