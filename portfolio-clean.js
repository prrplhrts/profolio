// portfolio-clean.js — fixed simple version (smooth, consistent positions, fixed load issue)
document.addEventListener("DOMContentLoaded", () => {
  const LAYOUT_KEY = "profolio_simple_layout_v2";
  const editDesignBtn = document.getElementById("editDesignBtn");
  const resetBtn = document.getElementById("resetLayoutBtn");
  const editContentBtn = document.getElementById("editContentBtn");
  const portfolioContent = document.getElementById("portfolioContent");
  const sections = Array.from(portfolioContent.querySelectorAll(".section"));

  let editMode = false;
  let layout = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");

  // === Helpers ===
  function applyLayout() {
    portfolioContent.style.position = "relative";
    sections.forEach(sec => {
      const pos = layout[sec.id];
      sec.style.transition = "none"; // prevent snapping animation
      if (pos) {
        sec.style.position = "absolute";
        sec.style.left = pos.left + "px";
        sec.style.top = pos.top + "px";
        sec.style.width = pos.width + "px";
        sec.style.height = pos.height + "px";
        sec.style.margin = 0;
      } else {
        sec.style.position = "";
        sec.style.left = "";
        sec.style.top = "";
        sec.style.width = "";
        sec.style.height = "";
        sec.style.margin = "";
      }
    });
  }

  function saveLayout() {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
  }

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

  // === Load user data ===
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

  // === Layout Load Fix ===
  // Run applyLayout AFTER everything (fonts, images) fully loads
  window.addEventListener("load", () => {
    applyLayout();
    // trigger a small reflow to fix wrong positions on some browsers
    portfolioContent.offsetHeight;
  });

  // === Edit Mode ===
  function enterEditMode() {
    editMode = true;
    document.body.classList.add("design-mode");
    resetBtn.classList.remove("hidden");
    portfolioContent.style.position = "relative";

    sections.forEach(sec => {
      sec.style.border = "2px dashed var(--blue)";
      sec.style.cursor = "move";
      sec.style.zIndex = 10;
      sec.style.userSelect = "none";
      if (!layout[sec.id]) {
        const rect = sec.getBoundingClientRect();
        const parent = portfolioContent.getBoundingClientRect();
        layout[sec.id] = {
          left: rect.left - parent.left,
          top: rect.top - parent.top,
          width: rect.width,
          height: rect.height
        };
      }
      sec.style.position = "absolute";
      const pos = layout[sec.id];
      sec.style.left = pos.left + "px";
      sec.style.top = pos.top + "px";
      sec.style.width = pos.width + "px";
      sec.style.height = pos.height + "px";
      makeDraggableResizable(sec);
    });
  }

  function exitEditMode() {
    editMode = false;
    document.body.classList.remove("design-mode");
    resetBtn.classList.add("hidden");

    sections.forEach(sec => {
      sec.style.border = "";
      sec.style.cursor = "";
      sec.style.zIndex = "";
      sec.style.userSelect = "";
    });

    saveLayout();
    applyLayout(); // reapply cleanly to prevent jump
  }

  // === Drag + Resize ===
  function makeDraggableResizable(el) {
    let startX, startY, startLeft, startTop, startW, startH, resizing = false;

    function onMouseDown(e) {
      if (!editMode) return;

      const rect = el.getBoundingClientRect();
      const parent = portfolioContent.getBoundingClientRect();
      const offsetRight = rect.right - e.clientX;
      const offsetBottom = rect.bottom - e.clientY;

      resizing = (offsetRight < 15 && offsetBottom < 15);
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left - parent.left;
      startTop = rect.top - parent.top;
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
        const rect = el.getBoundingClientRect();
        const parent = portfolioContent.getBoundingClientRect();
        layout[el.id] = {
          left: rect.left - parent.left,
          top: rect.top - parent.top,
          width: rect.width,
          height: rect.height
        };
        saveLayout();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    el.addEventListener("mousedown", onMouseDown);
  }

  // === Buttons ===
  editDesignBtn.addEventListener("click", () => {
    if (!editMode) enterEditMode();
    else exitEditMode();
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset layout to default positions?")) {
      resetLayout();
      applyLayout();
    }
  });

  if (editContentBtn) {
    editContentBtn.addEventListener("click", () => {
      window.location.href = "builder.html";
    });
  }

  // === Responsive update ===
  window.addEventListener("resize", () => {
    if (!editMode) applyLayout();
  });
});
