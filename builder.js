document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll("#builder-steps li");
  const sections = document.querySelectorAll(".builder-step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const generateBtn = document.getElementById("generatePortfolio");
  
  const yearEl = document.getElementById("year");

  const expList = document.getElementById("experienceList");
  const projList = document.getElementById("projectList");
  const eduList = document.getElementById("educationList");

  /* =====================
     SECTION NAVIGATION
  ===================== */
  function activateSection(id) {
    sections.forEach(s => s.classList.remove("active"));
    steps.forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.querySelector(`[data-section='${id}']`).classList.add("active");
    if (id === "preview") displayPreview();
  }

  steps.forEach(s => s.addEventListener("click", () => activateSection(s.dataset.section)));

  nextButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const current = e.target.closest(".builder-step").id;
      saveStep(current);
      activateSection(btn.dataset.next);
    });
  });

  /* =====================
     ADD / REMOVE BUTTONS
  ===================== */
  document.getElementById("addExperience").addEventListener("click", () => addExperience());
  document.getElementById("addProject").addEventListener("click", () => addProject());

  function createRemoveButton(container, type) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-btn";
    removeBtn.addEventListener("click", () => {
      container.remove();
      updateRemoveButtonsVisibility(type);
    });
    return removeBtn;
  }
  document.getElementById("addEducation").addEventListener("click", addEducation);
  function updateRemoveButtonsVisibility(type) {
    const lists = {
      experience: document.querySelectorAll(".experience-item"),
      project: document.querySelectorAll(".project-item"),
      education: document.querySelectorAll(".education-item")
    };
    lists[type].forEach((item, i) => {
      const removeBtn = item.querySelector(".remove-btn");
      if (removeBtn) removeBtn.style.display = i === 0 ? "none" : "inline-block";
    });
  }

  /* =====================
     ADD FIELDS
  ===================== */
  function addExperience(prefill = {}) {
    const div = document.createElement("div");
    div.classList.add("experience-item");
    div.innerHTML = `
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" class="jobTitle" value="${prefill.jobTitle || ""}">
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" class="company" value="${prefill.company || ""}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Year</label>
          <input 
            type="number" 
            class="startDate" 
            min="1900" 
            max="2100" 
            step="1" 
            value="${prefill.startDate || new Date().getFullYear()}" 
          >
        </div>
        <div class="form-group">
          <label>End Year</label>
          <input 
            type="number" 
            class="endDate" 
            min="1900" 
            max="2100" 
            step="1" 
            value="${prefill.endDate || new Date().getFullYear()}" 
          >
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="description" placeholder="Describe your responsibilities...">${prefill.description || ""}</textarea>
      </div>
    `;
    div.appendChild(createRemoveButton(div, "experience"));
    expList.appendChild(div);
    updateRemoveButtonsVisibility("experience");
  }

  function addProject(prefill = {}) {
    const div = document.createElement("div");
    div.classList.add("project-item");
    div.innerHTML = `
      <div class="form-group">
        <label>Project Name</label>
        <input type="text" class="projectName" value="${prefill.projectName || ""}">
      </div>
      <div class="form-group">
        <label>Role</label>
        <input type="text" class="projectRole" value="${prefill.projectRole || ""}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="projectDesc">${prefill.projectDesc || ""}</textarea>
      </div>
      <div class="form-group">
        <label>Project Link</label>
        <input type="url" class="projectLink" value="${prefill.projectLink || ""}">
      </div>
    `;
    div.appendChild(createRemoveButton(div, "project"));
    projList.appendChild(div);
    updateRemoveButtonsVisibility("project");
  }

  function addEducation(prefill = {}) {
    const div = document.createElement("div");
    div.classList.add("education-item");
    div.innerHTML = `
      <div class="form-group">
        <label>School</label>
        <input type="text" class="school" value="${prefill.school || ""}">
      </div>
      <div class="form-group">
        <label>Degree / Course</label>
        <input type="text" class="degree" value="${prefill.degree || ""}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Year</label>
          <input 
            type="number" 
            class="eduStart" 
            min="1900" 
            max="2100" 
            step="1" 
            value="${prefill.eduStart || new Date().getFullYear()}"
          >
        </div>
        <div class="form-group">
          <label>End Year</label>
          <input 
            type="number" 
            class="eduEnd" 
            min="1900" 
            max="2100" 
            step="1" 
            value="${prefill.eduEnd || new Date().getFullYear()}"
          >
        </div>
      </div>
    `;
    div.appendChild(createRemoveButton(div, "education"));
    eduList.appendChild(div);
    updateRemoveButtonsVisibility("education");
  }

  /* =====================
     SAVE STEP
  ===================== */
  function saveStep(id) {
    let data = {};
    let isValid = true;

    // Helper to show warnings
    function showWarning(input, message) {
      let warning = input.parentElement.querySelector(".warning");
      if (!warning) {
        warning = document.createElement("small");
        warning.className = "warning";
        warning.style.color = "#c0392b";
        warning.style.marginTop = "4px";
        input.parentElement.appendChild(warning);
      }
      warning.textContent = message;
    }

    // Helper to clear warnings
    function clearWarnings(form) {
      form.querySelectorAll(".warning").forEach(w => w.remove());
    }

    // EXPERIENCE VALIDATION
    if (id === "experience") {
      clearWarnings(document.getElementById("experienceForm"));
      const items = document.querySelectorAll(".experience-item");
      data = [...items].map(item => {
        const jobTitle = item.querySelector(".jobTitle");
        const company = item.querySelector(".company");
        const start = item.querySelector(".startDate");
        const end = item.querySelector(".endDate");
        const desc = item.querySelector(".description");

        if (!jobTitle.value.trim() || !company.value.trim() || !desc.value.trim()) {
          isValid = false;
          if (!jobTitle.value.trim()) showWarning(jobTitle, "Job title required");
          if (!company.value.trim()) showWarning(company, "Company required");
          if (!desc.value.trim()) showWarning(desc, "Description required");
        }

        return {
          jobTitle: jobTitle.value,
          company: company.value,
          startDate: start.value,
          endDate: end.value,
          description: desc.value
        };
      });
    }

    // EDUCATION VALIDATION
    else if (id === "education") {
      clearWarnings(document.getElementById("educationForm"));
      const items = document.querySelectorAll(".education-item");
      data = [...items].map(item => {
        const school = item.querySelector(".school");
        const degree = item.querySelector(".degree");
        const start = item.querySelector(".eduStart");
        const end = item.querySelector(".eduEnd");

        if (!school.value.trim() || !degree.value.trim()) {
          isValid = false;
          if (!school.value.trim()) showWarning(school, "School required");
          if (!degree.value.trim()) showWarning(degree, "Degree required");
        }

        return {
          school: school.value,
          degree: degree.value,
          eduStart: start.value,
          eduEnd: end.value
        };
      });
    }

    // OTHER SECTIONS (same as before)
    else if (id === "projects") {
      data = [...document.querySelectorAll(".project-item")].map(item => ({
        projectName: item.querySelector(".projectName").value,
        projectRole: item.querySelector(".projectRole").value,
        projectDesc: item.querySelector(".projectDesc").value,
        projectLink: item.querySelector(".projectLink").value
      }));
    } else if (id === "skills") {
      data = {
        skills: document.getElementById("skillsInput").value,
        certifications: document.getElementById("certifications").value
      };
    } else if (id === "profile") {
      data = {
        name: document.getElementById("name").value,
        headline: document.getElementById("headline").value,
        about: document.getElementById("about").value,
        location: document.getElementById("location").value,
        email: document.getElementById("email").value
      };
    }

    // Stop navigation if invalid
    if (!isValid) {
      alert("Please fill in all required fields before continuing.");
      return;
    }

    // Save valid data
    localStorage.setItem(id, JSON.stringify(data));
  }

  /* =====================
     LOAD SAVED DATA
  ===================== */
  function loadSavedData() {
    const experience = JSON.parse(localStorage.getItem("experience") || "[]");
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const education = JSON.parse(localStorage.getItem("education") || "[]");
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    const skills = JSON.parse(localStorage.getItem("skills") || "{}");

    // Always ensure at least 1 blank section
    if (experience.length > 0) experience.forEach(addExperience);
    else addExperience();

    if (projects.length > 0) projects.forEach(addProject);
    else addProject();

    if (education.length > 0) education.forEach(addEducation);
    else addEducation();

    // Load profile info
    Object.entries(profile).forEach(([key, val]) => {
      const el = document.getElementById(key);
      if (el) el.value = val;
    });

    // Load skills
    if (skills.skills) document.getElementById("skillsInput").value = skills.skills;
    if (skills.certifications) document.getElementById("certifications").value = skills.certifications;
  }

  /* =====================
     PREVIEW
  ===================== */
  function displayPreview() {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    const experience = JSON.parse(localStorage.getItem("experience") || "[]");
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const education = JSON.parse(localStorage.getItem("education") || "[]");
    const skills = JSON.parse(localStorage.getItem("skills") || "{}");
    const img = localStorage.getItem("profileImage");
    const previewBox = document.querySelector(".preview-box");

    previewBox.innerHTML = `
      <div class="preview-card">
        <div class="preview-header">
          ${img ? `<img src="${img}" class="preview-avatar" />` : ""}
          <h3>${profile.name || "Your Name"}</h3>
          <p>${profile.headline || ""}</p>
          <p>${profile.about || ""}</p>
          <p>${profile.email || ""} ${profile.location ? " | " + profile.location : ""}</p>
        </div>
        <div class="preview-section">
          <h4>Experience</h4>
          ${experience.map(e => `<p><strong>${e.jobTitle}</strong> – ${e.company}</p><p>${e.description}</p>`).join("")}
        </div>
        <div class="preview-section">
          <h4>Projects</h4>
          ${projects.map(p => `<p><strong>${p.projectName}</strong> – ${p.projectRole}</p><p>${p.projectDesc}</p>`).join("")}
        </div>
        <div class="preview-section">
          <h4>Education</h4>
          ${education.map(ed => `<p><strong>${ed.degree}</strong> – ${ed.school}</p>`).join("")}
        </div>
        <div class="preview-section">
          <h4>Skills</h4>
          <p>${skills.skills || ""}</p>
        </div>
      </div>
    `;
  }

  /* =====================
     PROFILE IMAGE
  ===================== */
  const profileImageInput = document.getElementById("profileImage");
  if (profileImageInput) {
    profileImageInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => localStorage.setItem("profileImage", reader.result);
      reader.readAsDataURL(file);
    });
  }

  /* =====================
     GENERATE PORTFOLIO
  ===================== */
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      ["profile", "experience", "projects", "education", "skills"].forEach(saveStep);
      window.location.href = "portfolio-theme.html";
    });
  }

  // Initialize everything
  loadSavedData();
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
