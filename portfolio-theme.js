// portfolio-clean.js
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const editContentBtn = document.getElementById("editContentBtn");
  const editDesignBtn = document.getElementById("editDesignBtn");
  const designPanel = document.getElementById("designPanel");
  const themeSelect = document.getElementById("themeSelect");

  editContentBtn?.addEventListener("click", () => {
    window.location.href = "builder.html";
  });

  editDesignBtn?.addEventListener("click", () => {
    designPanel.classList.toggle("hidden");
    const isEditing = !designPanel.classList.contains("hidden");
    toggleDesignEditing(isEditing);
  });

  themeSelect?.addEventListener("change", e => {
    document.documentElement.setAttribute("data-theme", e.target.value);
  });

  // -----------------------------
  // Load stored data
  // -----------------------------
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const experience = JSON.parse(localStorage.getItem("experience") || "[]");
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills") || "{}");
  const avatarImg = document.getElementById("avatarImg");

  // Fill profile
  document.getElementById("pfName").textContent = profile.name || "Your Name";
  document.getElementById("pfHeadline").textContent = profile.headline || "";
  document.getElementById("pfLocation").textContent = profile.location || "";
  document.getElementById("pfAbout").textContent = profile.about || "A short bio will appear here once you add it in the builder.";

  const img = localStorage.getItem("profileImage");
  avatarImg.src = img || "images/profile-placeholder.jpg";

  // Skills
  const pfSkillsList = document.getElementById("pfSkillsList");
  pfSkillsList.innerHTML = "";
  const skillsArr = (skills.skills || "").split(",").map(s => s.trim()).filter(Boolean);
  if (skillsArr.length) {
    skillsArr.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      pfSkillsList.appendChild(li);
    });
  } else {
    pfSkillsList.innerHTML = `<li style="background:none;color:#999">Add skills in the builder</li>`;
  }

  // Projects
  const projectsList = document.getElementById("projectsList");
  projectsList.innerHTML = projects.length
    ? projects.map(p => `
        <div class="preview-item">
          <h4>${escapeHtml(p.projectName || "Untitled Project")}</h4>
          <p>${escapeHtml(p.projectDesc || "")}</p>
          ${p.projectImage ? `<img src="${p.projectImage}" class="project-img">` : ""}
          ${p.projectLink ? `<a href="${escapeAttr(p.projectLink)}" target="_blank">${escapeHtml(p.projectLink)}</a>` : ""}
        </div>`).join("")
    : `<p class="empty">No projects added yet.</p>`;

  // Experience
  const experienceList = document.getElementById("experienceList");
  experienceList.innerHTML = experience.length
    ? experience.map(e => `
        <div class="preview-item">
          <h4>${escapeHtml(e.jobTitle || "")} ${e.company ? "— " + escapeHtml(e.company) : ""}</h4>
          <p class="duration">${escapeHtml(e.startDate || "")} → ${escapeHtml(e.endDate || "Present")}</p>
          <p>${escapeHtml(e.description || "")}</p>
        </div>`).join("")
    : `<p class="empty">No experience added yet.</p>`;

  // Skills & certs
  const skillsAndCerts = document.getElementById("skillsAndCerts");
  skillsAndCerts.innerHTML = "";
  if (skillsArr.length)
    skillsAndCerts.innerHTML += `<div class="preview-item"><strong>Skills:</strong> ${escapeHtml(skillsArr.join(", "))}</div>`;
  if (skills.certifications)
    skillsAndCerts.innerHTML += `<div class="preview-item"><strong>Certifications:</strong> ${escapeHtml(skills.certifications)}</div>`;
  if (!skillsArr.length && !skills.certifications)
    skillsAndCerts.innerHTML = `<p class="empty">No skills/certifications added yet.</p>`;

  // -----------------------------
  // Interact.js drag + grid snap
  // -----------------------------
  const gridSize = 40; // px grid spacing
  const sections = document.querySelectorAll(".portfolio-content .section");

  // restore layout
  const savedLayout = JSON.parse(localStorage.getItem("portfolioGridLayout") || "{}");
  for (const [id, pos] of Object.entries(savedLayout)) {
    const el = document.getElementById(id);
    if (el) {
      el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      el.dataset.x = pos.x;
      el.dataset.y = pos.y;
    }
  }

  function toggleDesignEditing(enabled) {
    if (enabled) {
      document.body.classList.add("design-editing");
      sections.forEach(el => el.classList.add("draggable"));
      setupDraggables();
    } else {
      document.body.classList.remove("design-editing");
      sections.forEach(el => el.classList.remove("draggable"));
      interact(".draggable").unset();
    }
  }

  function setupDraggables() {
    interact(".draggable").draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.dataset.x) || 0) + event.dx;
          const y = (parseFloat(target.dataset.y) || 0) + event.dy;

          // snap to grid
          const snappedX = Math.round(x / gridSize) * gridSize;
          const snappedY = Math.round(y / gridSize) * gridSize;

          target.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
          target.dataset.x = snappedX;
          target.dataset.y = snappedY;
        },
        end() {
          const layout = {};
          sections.forEach(sec => {
            layout[sec.id] = {
              x: parseFloat(sec.dataset.x) || 0,
              y: parseFloat(sec.dataset.y) || 0
            };
          });
          localStorage.setItem("portfolioGridLayout", JSON.stringify(layout));
        }
      },
      inertia: true
    });
  }

  // -----------------------------
  // Helpers
  // -----------------------------
  function escapeHtml(str) {
    return str
      ? String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
      : "";
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }
});
