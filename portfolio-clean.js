// portfolio-clean.js — simplified version (no snap, no teleport)
document.addEventListener("DOMContentLoaded", () => {
  const LAYOUT_KEY = "profolio_simple_layout";
  const editDesignBtn = document.getElementById("editDesignBtn");
  const resetBtn = document.getElementById("resetLayoutBtn");
  const editContentBtn = document.getElementById("editContentBtn");
  const portfolioContent = document.getElementById("portfolioContent");
  const sections = Array.from(portfolioContent.querySelectorAll(".section"));

  let editMode = false;
  let layout = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");

  // Helper: apply saved layout
  function applyLayout() {
    Object.entries(layout).forEach(([id, pos]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.position = "absolute";
      el.style.left = pos.left + "px";
      el.style.top = pos.top + "px";
      el.style.width = pos.width + "px";
      el.style.height = pos.height + "px";
      el.style.margin = 0;
    });
  }

  // Helper: reset layout
  function resetLayout() {
    localStorage.removeItem(LAYOUT_KEY);
    layout = {};
    sections.forEach(s => {
      s.style.position = "";
      s.style.left = "";
      s.style.top = "";
      s.style.width = "";
      s.style.height = "";
      s.style.margin = "";
    });
  }

  // Load saved layout if any
  applyLayout();

  // --- ENTER EDIT MODE ---
  function enterEditMode() {
    editMode = true;
    document.body.classList.add("design-mode");
    resetBtn.classList.remove("hidden");
    portfolioContent.style.position = "relative";

    sections.forEach(sec => {
      sec.style.position = "absolute";
      if (!layout[sec.id]) {
        const rect = sec.getBoundingClientRect();
        const parent = portfolioContent.getBoundingClientRect();
        layout[sec.id] = {
          left: rect.left - parent.left,
          top: rect.top - parent.top,
          width: rect.width,
          height: rect.height
        };
        sec.style.left = layout[sec.id].left + "px";
        sec.style.top = layout[sec.id].top + "px";
        sec.style.width = layout[sec.id].width + "px";
        sec.style.height = layout[sec.id].height + "px";
      }
      sec.style.border = "2px dashed var(--blue)";
      sec.style.cursor = "move";
    });

    // enable dragging and resizing
    sections.forEach(sec => {
      makeDraggableResizable(sec);
    });
  }

  // --- EXIT EDIT MODE ---
  function exitEditMode() {
    editMode = false;
    document.body.classList.remove("design-mode");
    sections.forEach(sec => {
      sec.style.border = "";
      sec.style.cursor = "";
    });
    // save current layout
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
  }

  // --- DRAG + RESIZE ---
  function makeDraggableResizable(el) {
    let startX, startY, startLeft, startTop, startW, startH, resizing = false;

    el.addEventListener("mousedown", e => {
      if (!editMode) return;

      const rect = el.getBoundingClientRect();
      const offsetRight = rect.right - e.clientX;
      const offsetBottom = rect.bottom - e.clientY;

      // check if near bottom-right corner for resizing
      if (offsetRight < 15 && offsetBottom < 15) {
        resizing = true;
      } else {
        resizing = false;
      }

      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left - portfolioContent.getBoundingClientRect().left;
      startTop = rect.top - portfolioContent.getBoundingClientRect().top;
      startW = rect.width;
      startH = rect.height;

      function onMouseMove(ev) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        if (resizing) {
          el.style.width = startW + dx + "px";
          el.style.height = startH + dy + "px";
        } else {
          el.style.left = startLeft + dx + "px";
          el.style.top = startTop + dy + "px";
        }
      }

      function onMouseUp() {
        // update layout
        const rect = el.getBoundingClientRect();
        const parent = portfolioContent.getBoundingClientRect();
        layout[el.id] = {
          left: rect.left - parent.left,
          top: rect.top - parent.top,
          width: rect.width,
          height: rect.height
        };
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // --- BUTTONS ---
  editDesignBtn.addEventListener("click", () => {
    if (!editMode) enterEditMode();
    else exitEditMode();
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset to default layout?")) {
      resetLayout();
      applyLayout();
    }
  });

  if (editContentBtn) {
    editContentBtn.addEventListener("click", () => {
      window.location.href = "builder.html";
    });
  }

  // --- LOAD USER DATA (simplified from builder) ---
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const experience = JSON.parse(localStorage.getItem("experience") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills") || "{}");

  // Profile
  document.getElementById("pfName").textContent = profile.name || "Your Name";
  document.getElementById("pfHeadline").textContent = profile.headline || "";
  document.getElementById("pfLocation").textContent = profile.location || "";
  document.getElementById("pfAbout").textContent = profile.about || "No description yet.";
  const avatarImg = document.getElementById("avatarImg");
  const storedImg = localStorage.getItem("profileImage");
  if (storedImg) avatarImg.src = storedImg;

  // Projects
  const projectsList = document.getElementById("projectsList");
  if (projects.length) {
    projectsList.innerHTML = projects.map(p => `
      <div class="preview-item">
        <h4>${p.projectName || ""}</h4>
        ${p.projectImage ? `<img src="${p.projectImage}" style="max-width:100%;border-radius:8px;margin:.5rem 0;">` : ""}
        <p>${p.projectDesc || ""}</p>
        ${p.projectLink ? `<a href="${p.projectLink}" target="_blank">${p.projectLink}</a>` : ""}
      </div>
    `).join("");
  } else projectsList.innerHTML = "<p>No projects yet.</p>";

  // Experience
  const experienceList = document.getElementById("experienceList");
  if (experience.length) {
    experienceList.innerHTML = experience.map(e => `
      <div class="preview-item">
        <h4>${e.jobTitle || ""}${e.company ? ` — ${e.company}` : ""}</h4>
        <p>${e.startDate || ""} → ${e.endDate || "Present"}</p>
        <p>${e.description || ""}</p>
      </div>
    `).join("");
  } else experienceList.innerHTML = "<p>No experience yet.</p>";

  // Skills
  const skillsAndCerts = document.getElementById("skillsAndCerts");
  if (skills.skills || skills.certifications) {
    skillsAndCerts.innerHTML = `
      <div><strong>Skills:</strong> ${skills.skills || "N/A"}</div>
      <div><strong>Certifications:</strong> ${skills.certifications || "N/A"}</div>
    `;
  } else skillsAndCerts.innerHTML = "<p>No skills yet.</p>";

  document.getElementById("year").textContent = new Date().getFullYear();
});
