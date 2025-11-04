document.addEventListener("DOMContentLoaded", () => {
  const BG_COLOR_KEY = "portfolioBgColor";
  const CUSTOM_SECTIONS_KEY = "profolio_custom_sections_v9";
  const LAYOUT_KEY = "profolio_simple_layout_v9";
  const loadingScreen = document.getElementById("loadingScreen");
  const body = document.body;

  // Apply saved background color immediately (for smoother transition)
  const savedColor = localStorage.getItem(BG_COLOR_KEY);
  if (savedColor) document.body.style.backgroundColor = savedColor;

  // Set body to loading state (content hidden but pre-rendered)
  body.classList.add("loading-active");

  // Fade-out animation after 4.5s
  setTimeout(() => {
    loadingScreen.classList.add("fade-out");
    body.classList.add("fade-in-content");

    // After fade completes, remove loader
    setTimeout(() => {
      loadingScreen.remove();
      body.classList.remove("loading-active");
      body.classList.remove("fade-in-content");
    }, 500); // match CSS duration
  }, 2000);

  // === Load portfolio data ===
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const experience = JSON.parse(localStorage.getItem("experience") || "[]");
  const education = JSON.parse(localStorage.getItem("education") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills") || "{}");
  const customSections = JSON.parse(localStorage.getItem(CUSTOM_SECTIONS_KEY) || "[]");
  const layout = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");

  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt || "";
  };

  const avatarImg = document.getElementById("avatarImg");
  const storedImg = localStorage.getItem("profileImage");
  if (storedImg && avatarImg) avatarImg.src = storedImg;

  setText("pfName", profile.name);
  setText("pfHeadline", profile.headline);
  setText("pfLocation", profile.location);
  setText("pfAbout", profile.about);
  setText("year", new Date().getFullYear());

  const pfSkillsList = document.getElementById("pfSkillsList");
  if (skills.skills)
    pfSkillsList.innerHTML = skills.skills
      .split(",")
      .map(s => `<li>${s.trim()}</li>`)
      .join("");

  // Projects
  const projectsList = document.getElementById("projectsList");
  if (projectsList)
    projectsList.innerHTML = projects.map(p => `
      <div class="preview-item">
        <h4>${p.projectName || ""}</h4>
        ${p.projectImage ? `<img src="${p.projectImage}" style="max-width:100%;border-radius:8px;">` : ""}
        <p>${p.projectDesc || ""}</p>
        ${p.projectLink ? `<a href="${p.projectLink}" target="_blank">${p.projectLink}</a>` : ""}
      </div>`).join("");

  // Experience
  const experienceList = document.getElementById("experienceList");
  if (experienceList)
    experienceList.innerHTML = experience.map(e => `
      <div class="preview-item">
        <h4>${e.jobTitle || ""}${e.company ? ` — ${e.company}` : ""}</h4>
        <p>${e.startDate || ""}${e.endDate ? ` → ${e.endDate}` : ""}</p>
        <p>${e.description || ""}</p>
      </div>`).join("");

  // Education
  const educationList = document.getElementById("educationList");
  if (educationList)
    educationList.innerHTML = education.map(ed => `
      <div class="preview-item">
        <h4>${ed.degree || ""}${ed.school ? ` — ${ed.school}` : ""}</h4>
        <p>${ed.eduStart || ""}${ed.eduEnd ? ` → ${ed.eduEnd}` : ""}</p>
      </div>`).join("");

  // Skills & Certifications
  const skillsAndCerts = document.getElementById("skillsAndCerts");
  if (skillsAndCerts)
    skillsAndCerts.innerHTML = `
      ${skills.skills ? `<div><strong>Skills:</strong> ${skills.skills}</div>` : ""}
      ${skills.certifications ? `<div><strong>Certifications:</strong> ${skills.certifications}</div>` : ""}
    `;

  // Custom Sections
  const portfolioContent = document.getElementById("portfolioContent");
  customSections.forEach(sec => {
    const div = document.createElement("div");
    div.className = "section custom-section";
    div.id = sec.id;
    div.innerHTML = `
      <div class="section-header"><h3>${sec.title}</h3></div>
      <div class="custom-content-area">
        <p>${sec.content}</p>
        ${sec.image ? `<img src="${sec.image}" class="custom-img">` : ""}
      </div>`;
    portfolioContent.appendChild(div);
  });

  // Apply saved layout
  const sections = Array.from(portfolioContent.querySelectorAll(".section"));
  portfolioContent.style.position = "relative";
  sections.forEach(sec => {
    const pos = layout[sec.id];
    if (pos) {
      sec.style.position = "absolute";
      sec.style.left = pos.left + "px";
      sec.style.top = pos.top + "px";
      sec.style.width = pos.width + "px";
      sec.style.height = pos.height + "px";
    }
  });
});
