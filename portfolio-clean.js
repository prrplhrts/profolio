// portfolio-clean.js — 
document.addEventListener("DOMContentLoaded", () => {
  const LAYOUT_KEY = "profolio_simple_layout_v9";
  const CUSTOM_SECTIONS_KEY = "profolio_custom_sections_v9";
  const BG_COLOR_KEY = "portfolioBgColor";
  // Controls from DOM
  const editDesignBtn = document.getElementById("editDesignBtn");
  const resetBtn = document.getElementById("resetLayoutBtn");
  const editContentBtn = document.getElementById("editContentBtn");
  const addCustomBtn = document.getElementById("addCustomSectionBtn");
  const portfolioContent = document.getElementById("portfolioContent");
  const footer = document.querySelector(".site-footer");
  const toolbar = document.querySelector(".toolbar");

  if (!portfolioContent || !editDesignBtn || !toolbar) {
    console.warn("portfolio-clean.js: required DOM elements missing (portfolioContent / editDesignBtn / toolbar).");
    return;
  }

  // State
  let editMode = false;
  let layout = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");
  let customSections = JSON.parse(localStorage.getItem(CUSTOM_SECTIONS_KEY) || "[]");
  const sections = () => Array.from(portfolioContent.querySelectorAll(".section"));
  const defaultLayout = {};

  /* ----------------------------
     Utility / Layout helpers
  ---------------------------- */
  function captureDefaultLayout() {
    sections().forEach(sec => {
      if (sec.classList.contains("custom-section")) return;
      const rect = sec.getBoundingClientRect();
      const parent = portfolioContent.getBoundingClientRect();
      defaultLayout[sec.id] = {
        left: rect.left - parent.left,
        top: rect.top - parent.top,
        width: rect.width,
        height: rect.height
      };
    });
  }

  function applyLayout() {
    portfolioContent.style.position = "relative";
    sections().forEach(sec => {
      const pos = layout[sec.id];
      if (!pos) {
        // reset to static flow if no saved layout
        sec.style.position = "";
        sec.style.left = "";
        sec.style.top = "";
        sec.style.width = "";
        sec.style.height = "";
        sec.style.transition = "";
        return;
      }
      sec.style.transition = "none";
      sec.style.position = "absolute";
      sec.style.left = pos.left + "px";
      sec.style.top = pos.top + "px";
      sec.style.width = pos.width + "px";
      sec.style.height = pos.height + "px";
    });
    // If no positions saved, leave flow layout
    adjustFooterPosition();
    
  }

  function saveLayout() {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
  }

  function resetLayout() {
    if (!Object.keys(defaultLayout).length) captureDefaultLayout();
    layout = { ...defaultLayout };
    saveLayout();

    // Remove all custom sections
    customSections = [];
    localStorage.removeItem(CUSTOM_SECTIONS_KEY);
    document.querySelectorAll(".custom-section").forEach(sec => sec.remove());

    // --- RESET BACKGROUND COLOR ---
    const DEFAULT_BG_COLOR = "#f5f5f5"; // ← change this if your original background was different
    document.body.style.backgroundColor = DEFAULT_BG_COLOR;
    localStorage.setItem(BG_COLOR_KEY, DEFAULT_BG_COLOR);

    // If toolbar color should match body, reset that too
    const toolbar = document.querySelector(".toolbar");
    if (toolbar) toolbar.style.backgroundColor = DEFAULT_BG_COLOR;

    // Also update the color picker UI if present
    const bgColorPicker = document.getElementById("bgColorPicker");
    if (bgColorPicker) bgColorPicker.value = DEFAULT_BG_COLOR;

    applyLayout();
    adjustFooterPosition();
  }

  function adjustFooterPosition() {
    // Ensure portfolioContent is sized to hold absolutely positioned sections
    const visibleSections = sections().filter(sec => !sec.classList.contains("hidden"));
    if (!visibleSections.length) {
      portfolioContent.style.height = "";
      footer.style.marginTop = "60px";
      return;
    }

    const parentRect = portfolioContent.getBoundingClientRect();
    let maxBottom = 0;
    visibleSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const bottom = rect.bottom - parentRect.top;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    portfolioContent.style.height = `${Math.ceil(maxBottom + 100)}px`;
    footer.style.marginTop = "40px";
  }

  /* ----------------------------
     Load Data from Builder
  ---------------------------- */
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const experience = JSON.parse(localStorage.getItem("experience") || "[]");
  const education = JSON.parse(localStorage.getItem("education") || "[]");
  const skills = JSON.parse(localStorage.getItem("skills") || "{}");

  // Avatar
  const avatarImg = document.getElementById("avatarImg");
  const storedImg = localStorage.getItem("profileImage");
  if (storedImg && avatarImg) avatarImg.src = storedImg;
  

  // PROFILE fields
  if (document.getElementById("pfName")) document.getElementById("pfName").textContent = profile.name || "";
  if (document.getElementById("pfHeadline")) document.getElementById("pfHeadline").textContent = profile.headline || "";
  if (document.getElementById("pfLocation")) document.getElementById("pfLocation").textContent = profile.location || "";
  if (document.getElementById("pfAbout")) document.getElementById("pfAbout").textContent = profile.about || "";

  // Skills list
  const pfSkillsList = document.getElementById("pfSkillsList");
  if (pfSkillsList) {
    if (skills.skills) {
      const skillItems = skills.skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => `<li>${s}</li>`)
        .join("");
      pfSkillsList.innerHTML = skillItems || "";
    } else pfSkillsList.innerHTML = "";
  }

  // Hide profile card if empty
  const profileCard = document.getElementById("profileCard");
  const hasProfileData =
    (profile.name && profile.name.trim()) ||
    (profile.headline && profile.headline.trim()) ||
    (profile.about && profile.about.trim()) ||
    (skills.skills && skills.skills.trim());
  if (profileCard && !hasProfileData) profileCard.classList.add("hidden");

  // PROJECTS
  const projectsSection = document.getElementById("projectsSection");
  const projectsList = document.getElementById("projectsList");
  if (projectsList && projectsSection) {
    const validProjects = projects.filter(
      p =>
        (p.projectName && p.projectName.trim()) ||
        (p.projectDesc && p.projectDesc.trim()) ||
        (p.projectLink && p.projectLink.trim()) ||
        (p.projectImage && p.projectImage.trim())
    );
    if (validProjects.length) {
      projectsList.innerHTML = validProjects
        .map(
          p => `
          <div class="preview-item">
            <h4>${p.projectName || ""}</h4>
            ${p.projectImage ? `<img src="${p.projectImage}" style="max-width:100%;border-radius:8px;margin:.5rem 0;">` : ""}
            <p>${p.projectDesc || ""}</p>
            ${p.projectLink ? `<a href="${p.projectLink}" target="_blank">${p.projectLink}</a>` : ""}
          </div>`
        )
        .join("");
    } else projectsSection.classList.add("hidden");
  }

  // EXPERIENCE
  const experienceSection = document.getElementById("experienceSection");
  const experienceList = document.getElementById("experienceList");
  if (experienceList && experienceSection) {
    const validExperience = experience.filter(
      e =>
        (e.jobTitle && e.jobTitle.trim()) ||
        (e.company && e.company.trim()) ||
        (e.startDate && e.startDate.trim()) ||
        (e.description && e.description.trim())
    );
    if (validExperience.length) {
      experienceList.innerHTML = validExperience
        .map(
          e => `
          <div class="preview-item">
            <h4>${e.jobTitle || ""}${e.company ? ` — ${e.company}` : ""}</h4>
            <p>${e.startDate || ""}${e.endDate ? ` → ${e.endDate}` : ""}</p>
            <p>${e.description || ""}</p>
          </div>`
        )
        .join("");
    } else experienceSection.classList.add("hidden");
  }

  // EDUCATION
  const educationSection = document.getElementById("educationSection");
  const educationList = document.getElementById("educationList");
  if (educationList && educationSection) {
    const validEducation = education.filter(
      ed =>
        (ed.school && ed.school.trim()) ||
        (ed.degree && ed.degree.trim()) ||
        (ed.eduStart && ed.eduStart.trim()) ||
        (ed.eduEnd && ed.eduEnd.trim())
    );
    if (validEducation.length) {
      educationList.innerHTML = validEducation
        .map(
          ed => `
          <div class="preview-item">
            <h4>${ed.degree || ""}${ed.school ? ` — ${ed.school}` : ""}</h4>
            <p>${ed.eduStart || ""}${ed.eduEnd ? ` → ${ed.eduEnd}` : ""}</p>
          </div>`
        )
        .join("");
    } else educationSection.classList.add("hidden");
  }

  // SKILLS & CERTS
  const extraSection = document.getElementById("extraSection");
  const skillsAndCerts = document.getElementById("skillsAndCerts");
  if (skillsAndCerts && extraSection) {
    if (skills.skills || skills.certifications) {
      const skillText = skills.skills ? skills.skills.trim() : "";
      const certText = skills.certifications ? skills.certifications.trim() : "";
      if (skillText || certText) {
        skillsAndCerts.innerHTML = `
          ${skillText ? `<div><strong>Skills:</strong> ${skillText}</div>` : ""}
          ${certText ? `<div><strong>Certifications:</strong> ${certText}</div>` : ""}
        `;
      } else extraSection.classList.add("hidden");
    } else extraSection.classList.add("hidden");
  }

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------
     Custom Sections (DOM + persistence)
  ---------------------------- */
  function saveCustomSections() {
    customSections = Array.from(document.querySelectorAll(".custom-section")).map(sec => ({
      id: sec.id,
      title: sec.querySelector("h3")?.textContent ?? "",
      content: sec.querySelector(".custom-content")?.textContent ?? "",
      image: sec.querySelector(".custom-img")?.src || null
    }));
    localStorage.setItem(CUSTOM_SECTIONS_KEY, JSON.stringify(customSections));
  }

  function addCustomSectionToDOM(sectionData = {}, isNew = false) {
    const div = document.createElement("div");
    div.className = "section custom-section";
    div.id = sectionData.id || `custom-${Date.now()}`;
    div.innerHTML = `
      <div class="section-header">
        <h3 contenteditable="false">${sectionData.title || "New Section"}</h3>
      </div>
      <div class="custom-content-area">
        <p contenteditable="false" class="custom-content">${sectionData.content || "Write something..."}</p>
        ${sectionData.image ? `<img src="${sectionData.image}" class="custom-img" alt="Section Image">` : ""}
      </div>
      <input type="file" accept="image/*" class="image-upload hidden">
      <button class="add-image hidden">Add Image</button>
      <button class="remove-custom hidden">Remove Section</button>
      <div class="resize-handle" style="display:none;"></div>
    `;
    portfolioContent.appendChild(div);

    // style/remove btn references (keeps look consistent)
    const removeBtn = div.querySelector(".remove-custom");
    if (removeBtn) {
      removeBtn.style.background = "#ff4d4d";
      removeBtn.style.color = "#fff";
      removeBtn.style.border = "none";
      removeBtn.style.borderRadius = "6px";
      removeBtn.style.padding = "6px 12px";
      removeBtn.style.marginTop = "10px";
      removeBtn.style.cursor = "pointer";
      removeBtn.addEventListener("click", () => {
        div.remove();
        saveCustomSections();
        adjustFooterPosition();
      });
    }

    const addImgBtn = div.querySelector(".add-image");
    const imgInput = div.querySelector(".image-upload");
    if (addImgBtn) {
      addImgBtn.style.background = "#4A7387";
      addImgBtn.style.color = "#fff";
      addImgBtn.style.border = "none";
      addImgBtn.style.borderRadius = "6px";
      addImgBtn.style.padding = "6px 12px";
      addImgBtn.style.marginTop = "10px";
      addImgBtn.style.cursor = "pointer";
      addImgBtn.addEventListener("click", () => imgInput.click());
    }
    if (imgInput) {
      imgInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          let img = div.querySelector(".custom-img");
          if (!img) {
            img = document.createElement("img");
            img.className = "custom-img";
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            img.style.marginTop = "10px";
            div.querySelector(".custom-content-area").appendChild(img);
          }
          img.src = ev.target.result;
          saveCustomSections();
        };
        reader.readAsDataURL(file);
      });
    }

    makeDraggableResizable(div);
    applyLayout();
    adjustFooterPosition();

    if (editMode) {
      div.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "true"));
      removeBtn?.classList.remove("hidden");
      addImgBtn?.classList.remove("hidden");
      div.querySelector(".resize-handle").style.display = "block";
    }

    if (isNew) saveCustomSections();
  }

  /* ----------------------------
     Edit Mode enter/exit
  ---------------------------- */
  function enterEditMode() {
    editMode = true;
    updatePublishButtonVisibility();
    document.body.classList.add("design-mode");
    resetBtn?.classList.remove("hidden");
    addCustomBtn?.classList.remove("hidden");
    // show color picker UI when entering edit mode
    showColorPicker(true);

    sections().forEach(sec => {
      sec.style.border = "2px dashed var(--blue)";
      sec.style.cursor = "move";
      sec.style.userSelect = "none";
      sec.style.zIndex = 10;

      let handle = sec.querySelector(".resize-handle");
      if (!handle) {
        handle = document.createElement("div");
        handle.className = "resize-handle";
        sec.appendChild(handle);
      }
      handle.style.display = "block";

      if (sec.classList.contains("custom-section")) {
        sec.querySelector(".remove-custom")?.classList.remove("hidden");
        sec.querySelector(".add-image")?.classList.remove("hidden");
        sec.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "true"));
      }

      makeDraggableResizable(sec);
    });
    adjustFooterPosition();
  }

  function exitEditMode() {
    editMode = false;
    updatePublishButtonVisibility();
    document.body.classList.remove("design-mode");
    resetBtn?.classList.add("hidden");
    addCustomBtn?.classList.add("hidden");
    // hide color picker when leaving edit mode
    showColorPicker(false);

    sections().forEach(sec => {
      sec.style.border = "";
      sec.style.cursor = "";
      sec.style.userSelect = "";
      sec.style.zIndex = "";
      const handle = sec.querySelector(".resize-handle");
      if (handle) handle.style.display = "none";
      if (sec.classList.contains("custom-section")) {
        sec.querySelector(".remove-custom")?.classList.add("hidden");
        sec.querySelector(".add-image")?.classList.add("hidden");
        sec.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "false"));
      }
    });

    saveCustomSections();
    saveLayout();
    applyLayout();
    adjustFooterPosition();
  }

  /* ----------------------------
     Drag + Resize (mouse)
     Simple mousedown-move-mouseup implementation
  ---------------------------- */
  function makeDraggableResizable(el) {
    if (!el) return;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0, startW = 0, startH = 0;
    let resizing = false;

    el.addEventListener("mousedown", (e) => {
      if (!editMode) return;
      // Ignore clicks on interactive children (buttons, inputs)
      const interactive = ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "IMG", "LABEL"];
      if (interactive.includes(e.target.tagName) && !e.target.classList.contains("resize-handle")) return;

      const isHandle = e.target.classList.contains("resize-handle");
      resizing = isHandle;

      const rect = el.getBoundingClientRect();
      const parent = portfolioContent.getBoundingClientRect();

      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left - parent.left;
      startTop = rect.top - parent.top;
      startW = rect.width;
      startH = rect.height;

      function onMove(ev) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (resizing) {
          el.style.width = Math.max(100, startW + dx) + "px";
          el.style.height = Math.max(60, startH + dy) + "px";
        } else {
          el.style.left = Math.max(0, startLeft + dx) + "px";
          el.style.top = Math.max(0, startTop + dy) + "px";
        }
        adjustFooterPosition();
      }

      function onUp() {
        const rect = el.getBoundingClientRect();
        const parent = portfolioContent.getBoundingClientRect();
        layout[el.id] = {
          left: rect.left - parent.left,
          top: rect.top - parent.top,
          width: rect.width,
          height: rect.height
        };
        saveLayout();
        adjustFooterPosition();
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  /* ----------------------------
     Buttons wiring
  ---------------------------- */
  addCustomBtn.addEventListener("click", () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      title: "New Section",
      content: "Write something..."
    };
    customSections.push(newSection);
    localStorage.setItem(CUSTOM_SECTIONS_KEY, JSON.stringify(customSections));
    addCustomSectionToDOM(newSection, true);
  });

  // Edit Design toggle: keep text syncing and ensure color picker shows only in edit mode
  editDesignBtn.addEventListener("click", () => {
    if (!editMode) {
      enterEditMode();
      editDesignBtn.textContent = "Save Design";
    } else {
      exitEditMode();
      editDesignBtn.textContent = "Edit Design";
    }
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset layout and remove custom sections?")) resetLayout();
  });

  if (editContentBtn) {
    editContentBtn.addEventListener("click", () => (window.location.href = "builder.html"));
  }

  window.addEventListener("resize", () => { if (!editMode) applyLayout(); });

/* ----------------------------
   BACKGROUND COLOR PICKER (created dynamically)
   — Only visible in edit mode
---------------------------- */
const DEFAULT_BG_COLOR = "#f5f5f5";
let colorPickerContainer, bgColorPicker;

function createColorPickerDOM() {
  if (!toolbar) return;
  if (colorPickerContainer) return; // already exists

  colorPickerContainer = document.createElement("div");
  colorPickerContainer.id = "colorPickerContainer";
  colorPickerContainer.style.display = "none"; // hidden by default
  colorPickerContainer.style.alignItems = "center";
  colorPickerContainer.style.gap = "8px";
  colorPickerContainer.style.marginLeft = "12px";

  const label = document.createElement("label");
  label.textContent = "Background:";
  label.style.fontSize = "0.95rem";
  label.style.color = "#333";

  bgColorPicker = document.createElement("input");
  bgColorPicker.type = "color";
  bgColorPicker.id = "bgColorPicker";
  bgColorPicker.title = "Pick background color";

  colorPickerContainer.appendChild(label);
  colorPickerContainer.appendChild(bgColorPicker);
  toolbar.appendChild(colorPickerContainer);

  // Attach color change listener
  bgColorPicker.addEventListener("input", (e) => {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    toolbar.style.backgroundColor = color;
    localStorage.setItem(BG_COLOR_KEY, color);
  });
}

// Create color picker immediately (but hidden)
createColorPickerDOM();

// Load saved color and apply immediately
const savedColor = localStorage.getItem(BG_COLOR_KEY) || DEFAULT_BG_COLOR;
document.body.style.backgroundColor = savedColor;
toolbar.style.backgroundColor = savedColor;
if (bgColorPicker) bgColorPicker.value = savedColor;

// Show/hide when entering edit mode
function showColorPicker(show) {
  if (!colorPickerContainer) createColorPickerDOM();
  if (!colorPickerContainer) return;

  colorPickerContainer.style.display = show ? "inline-flex" : "none";

  // Always refresh picker value when showing
  if (show && bgColorPicker) {
    const currentColor =
      localStorage.getItem(BG_COLOR_KEY) ||
      getComputedStyle(document.body).backgroundColor;
    bgColorPicker.value = rgbToHex(currentColor);
  }
}

// Utility: convert rgb() to hex
function rgbToHex(rgbStr) {
  if (!rgbStr) return "#ffffff";
  const rgb = rgbStr.match(/\d+/g);
  if (!rgb) return "#ffffff";
  return (
    "#" +
    rgb
      .slice(0, 3)
      .map((x) => ("0" + parseInt(x).toString(16)).slice(-2))
      .join("")
  );
}

  // --- PUBLISH PORTFOLIO BUTTON ---
  const publishBtn = document.getElementById("publishPortfolioBtn");
  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      // Save all current edits to localStorage
      saveCustomSections();
      saveLayout();

      const bgColor = getComputedStyle(document.body).backgroundColor;
      localStorage.setItem(BG_COLOR_KEY, bgColor);

      // Redirect immediately to portfolio.html (loading screen will show there)
      window.location.href = "portfolio.html";
    });
  }
  // hide publish button in edit mode
  function updatePublishButtonVisibility() {
    if (!publishBtn) return;
    publishBtn.classList.toggle("hidden", editMode);
  }
  /* ----------------------------
     Load layout + custom sections on page start
  ---------------------------- */
  window.addEventListener("load", () => {
    // If no layout saved, capture defaults for resetting later
    captureDefaultLayout();

    // If layout exists, keep it loaded
    applyLayout();

    // Render any saved custom sections
    customSections.forEach(addCustomSectionToDOM);

    // Ensure color picker reflects saved color
    if (bgColorPicker && localStorage.getItem(BG_COLOR_KEY)) {
      bgColorPicker.value = localStorage.getItem(BG_COLOR_KEY);
      document.body.style.backgroundColor = localStorage.getItem(BG_COLOR_KEY);
    }

    // ensure proper footer placement
    adjustFooterPosition();
  });
});
