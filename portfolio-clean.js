// portfolio-clean.js
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Edit buttons & design panel
  const editContentBtn = document.getElementById("editContentBtn");
  const editDesignBtn = document.getElementById("editDesignBtn");
  const designPanel = document.getElementById("designPanel");
  const themeSelect = document.getElementById("themeSelect");

  editContentBtn && editContentBtn.addEventListener("click", () => {
    // go back to builder - preserving data in localStorage
    window.location.href = "builder.html";
  });

  editDesignBtn && editDesignBtn.addEventListener("click", () => {
    designPanel.classList.toggle("hidden");
    designPanel.setAttribute("aria-hidden", designPanel.classList.contains("hidden"));
  });

  // simple theme switcher (toggles a class)
  if (themeSelect) {
    themeSelect.addEventListener("change", (e) => {
      document.documentElement.setAttribute("data-theme", e.target.value);
      // you can expand this logic to change CSS variables or load other styles
    });
  }

  // read localStorage data saved by builder.js
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const experience = JSON.parse(localStorage.getItem("experience") || "[]"); // might be object or array
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills") || "{}");

  // Helper: ensure experience/projects can be arrays or single-object
  function normalizeToArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    // If it's an object with keys like jobTitle etc, treat as single-entry
    if (typeof value === "object") return [value];
    return [];
  }

  const expArr = normalizeToArray(experience);
  const projArr = normalizeToArray(projects);

  // Populate profile left column
  const pfName = document.getElementById("pfName");
  const pfHeadline = document.getElementById("pfHeadline");
  const pfLocation = document.getElementById("pfLocation");
  const pfAbout = document.getElementById("pfAbout");
  const pfSkillsList = document.getElementById("pfSkillsList");
  const avatarImg = document.getElementById("avatarImg");

  pfName.textContent = profile.name || profile.fullName || "Your Name";
  pfHeadline.textContent = profile.headline || "";
  pfLocation.textContent = profile.location || "";
  pfAbout.textContent = profile.about || "A short bio will appear here once you add it in the builder.";

  // Skills: either comma-separated string or array
  const skillsRaw = skills.skills || skills.skillList || "";
  const skillsArray = Array.isArray(skillsRaw)
    ? skillsRaw
    : (typeof skillsRaw === "string" ? skillsRaw.split(",").map(s => s.trim()).filter(Boolean) : []);

  pfSkillsList.innerHTML = "";
  if (skillsArray.length) {
    skillsArray.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      pfSkillsList.appendChild(li);
    });
  } else {
    // fallback text
    const li = document.createElement("li");
    li.textContent = "Add skills in the builder";
    li.style.background = "#fff0";
    li.style.color = "#999";
    pfSkillsList.appendChild(li);
  }

  // Projects listing
  const projectsList = document.getElementById("projectsList");
  projectsList.innerHTML = "";
  if (projArr.length) {
    projArr.forEach(p => {
      const item = document.createElement("div");
      item.className = "preview-item";
      const name = p.projectName || p.title || "Untitled Project";
      const role = p.projectRole ? ` — ${p.projectRole}` : "";
      const desc = p.projectDesc || p.description || "";
      const link = p.projectLink || p.link || "";

      item.innerHTML = `<h4>${escapeHtml(name)}${escapeHtml(role)}</h4>
                        <p>${escapeHtml(desc)}</p>
                        ${link ? `<a href="${escapeAttr(link)}" target="_blank" rel="noopener">${escapeHtml(link)}</a>` : ""}`;
      projectsList.appendChild(item);
    });
  } else {
    projectsList.innerHTML = `<p class="empty">No projects added yet. Add them in the builder.</p>`;
  }

  // Experience listing
  const experienceList = document.getElementById("experienceList");
  experienceList.innerHTML = "";
  if (expArr.length) {
    expArr.forEach(e => {
      const item = document.createElement("div");
      item.className = "preview-item";
      const title = e.jobTitle || e.role || "";
      const company = e.company || "";
      const start = e.startDate || "";
      const end = e.endDate || e.end || "Present";
      const desc = e.description || "";

      item.innerHTML = `<h4>${escapeHtml(title)} ${company ? `— ${escapeHtml(company)}` : ""}</h4>
                        <p class="duration">${escapeHtml(start)} ${start || end ? "→" : ""} ${escapeHtml(end)}</p>
                        <p>${escapeHtml(desc)}</p>`;
      experienceList.appendChild(item);
    });
  } else {
    experienceList.innerHTML = `<p class="empty">No experience added yet. Add entries in the builder.</p>`;
  }

  // Skills & certifications block (right column)
  const skillsAndCerts = document.getElementById("skillsAndCerts");
  skillsAndCerts.innerHTML = "";
  if (skillsArray.length || (skills.certifications && skills.certifications.trim())) {
    if (skillsArray.length) {
      const skillsEl = document.createElement("div");
      skillsEl.className = "preview-item";
      skillsEl.innerHTML = `<strong>Skills:</strong> ${escapeHtml(skillsArray.join(", "))}`;
      skillsAndCerts.appendChild(skillsEl);
    }
    if (skills.certifications && skills.certifications.trim()) {
      const certEl = document.createElement("div");
      certEl.className = "preview-item";
      certEl.innerHTML = `<strong>Certifications:</strong> ${escapeHtml(skills.certifications)}`;
      skillsAndCerts.appendChild(certEl);
    }
  } else {
    skillsAndCerts.innerHTML = `<p class="empty">No skills/certifications added yet.</p>`;
  }

  // helper: escape to avoid injecting raw HTML from storage
  function escapeHtml(str) {
    if (!str && str !== 0) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }

});
