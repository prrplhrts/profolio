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
    console.warn("portfolio-clean.js: required DOM elements missing.");
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
    adjustFooterPosition();
  }

  function saveLayout() {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
  }

  function resetLayout() {
    if (!Object.keys(defaultLayout).length) captureDefaultLayout();
    layout = { ...defaultLayout };
    saveLayout();

    customSections = [];
    localStorage.removeItem(CUSTOM_SECTIONS_KEY);
    document.querySelectorAll(".custom-section").forEach(sec => sec.remove());

    const DEFAULT_BG_COLOR = "#f5f5f5"; 
    document.body.style.backgroundColor = DEFAULT_BG_COLOR;
    localStorage.setItem(BG_COLOR_KEY, DEFAULT_BG_COLOR);

    const toolbar = document.querySelector(".toolbar");
    if (toolbar) toolbar.style.backgroundColor = DEFAULT_BG_COLOR;

    const bgColorPicker = document.getElementById("bgColorPicker");
    if (bgColorPicker) bgColorPicker.value = DEFAULT_BG_COLOR;

    applyLayout();
    adjustFooterPosition();
  }

  function adjustFooterPosition() {
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

  const avatarImg = document.getElementById("avatarImg");
  const storedImg = localStorage.getItem("profileImage");
  if (storedImg && avatarImg) avatarImg.src = storedImg;

  if (document.getElementById("pfName")) document.getElementById("pfName").textContent = profile.name || "";
  if (document.getElementById("pfHeadline")) document.getElementById("pfHeadline").textContent = profile.headline || "";
  if (document.getElementById("pfLocation")) document.getElementById("pfLocation").textContent = profile.location || "";
  if (document.getElementById("pfAbout")) document.getElementById("pfAbout").textContent = profile.about || "";

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

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------
      Custom Sections (DOM + Persistence)
  ---------------------------- */
  function saveCustomSections() {
    customSections = Array.from(document.querySelectorAll(".custom-section")).map(sec => ({
      id: sec.id,
      title: sec.querySelector("h3")?.textContent ?? "",
      content: sec.querySelector(".custom-content")?.textContent ?? "",
      image: sec.querySelector(".custom-img")?.src || null,
      // Save width, default to 100% if not found
      imageWidth: sec.querySelector(".custom-img")?.style.width || "100%"
    }));
    localStorage.setItem(CUSTOM_SECTIONS_KEY, JSON.stringify(customSections));
  }

  function addCustomSectionToDOM(sectionData = {}, isNew = false) {
    const div = document.createElement("div");
    div.className = "section custom-section";
    div.id = sectionData.id || `custom-${Date.now()}`;
    
    // Default image width is 100%, parse integer for slider value
    const currentWidthVal = parseInt(sectionData.imageWidth) || 100;

    div.innerHTML = `
      <div class="section-header">
        <h3 contenteditable="false">${sectionData.title || "New Section"}</h3>
      </div>
      <div class="custom-content-area">
        <p contenteditable="false" class="custom-content">${sectionData.content || "Write something..."}</p>
        ${
          sectionData.image 
          ? `<img src="${sectionData.image}" class="custom-img" alt="Section Image" style="width: ${currentWidthVal}%; max-width: 100%;">` 
          : ""
        }
      </div>
      
      <!-- CONTROLS CONTAINER -->
      <div class="controls-area hidden">
        <input type="file" accept="image/*" class="image-upload hidden">
        <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
            <button class="add-image" style="background:#4A7387; color:#fff; border:none; border-radius:6px; padding:6px 12px; cursor:pointer;">Add/Replace Image</button>
            <button class="remove-custom" style="background:#ff4d4d; color:#fff; border:none; border-radius:6px; padding:6px 12px; cursor:pointer;">Remove Section</button>
        </div>
        
        <!-- IMAGE SIZE SLIDER -->
        <div class="img-size-container ${sectionData.image ? '' : 'hidden'}" style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
            <label style="font-size: 0.85rem; color: #333; font-weight: 500;">Image Size:</label>
            <input type="range" class="img-size-slider" min="10" max="100" value="${currentWidthVal}" style="cursor: pointer;">
        </div>
      </div>
      
      <div class="resize-handle" style="display:none;"></div>
    `;
    portfolioContent.appendChild(div);

    // --- References ---
    const controlsArea = div.querySelector(".controls-area");
    const removeBtn = div.querySelector(".remove-custom");
    const addImgBtn = div.querySelector(".add-image");
    const imgInput = div.querySelector(".image-upload");
    const sizeSlider = div.querySelector(".img-size-slider");
    const sizeContainer = div.querySelector(".img-size-container");

    // --- REMOVE SECTION ---
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        div.remove();
        saveCustomSections();
        adjustFooterPosition();
      });
    }

    // --- ADD / REPLACE IMAGE ---
    if (addImgBtn) {
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
            img.style.borderRadius = "8px";
            img.style.marginTop = "10px";
            img.style.maxWidth = "100%"; // Enforce section boundary
            img.style.width = "100%"; // Default new image to 100%
            div.querySelector(".custom-content-area").appendChild(img);
          }
          img.src = ev.target.result;
          
          // Show Slider & Reset it to 100
          if(sizeContainer) {
              sizeContainer.classList.remove("hidden");
              sizeSlider.value = 100;
          }
          saveCustomSections();
        };
        reader.readAsDataURL(file);
      });
    }

    // --- SIZE SLIDER LOGIC ---
    if (sizeSlider) {
        sizeSlider.addEventListener("input", (e) => {
            const img = div.querySelector(".custom-img");
            if (img) {
                img.style.width = e.target.value + "%";
                // Max-width is already set in HTML creation to enforce boundary
            }
        });
        // Save on change (mouse up) to avoid spamming save during slide
        sizeSlider.addEventListener("change", () => saveCustomSections());
    }

    makeDraggableResizable(div);
    applyLayout();
    adjustFooterPosition();

    // If currently in edit mode, make controls visible
    if (editMode) {
      div.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "true"));
      controlsArea.classList.remove("hidden");
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
        sec.querySelector(".controls-area")?.classList.remove("hidden");
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
    showColorPicker(false);

    sections().forEach(sec => {
      sec.style.border = "";
      sec.style.cursor = "";
      sec.style.userSelect = "";
      sec.style.zIndex = "";
      const handle = sec.querySelector(".resize-handle");
      if (handle) handle.style.display = "none";
      if (sec.classList.contains("custom-section")) {
        sec.querySelector(".controls-area")?.classList.add("hidden");
        sec.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "false"));
      }
    });

    saveCustomSections();
    saveLayout();
    applyLayout();
    adjustFooterPosition();
  }

  /* ----------------------------
      Draggable Logic
  ---------------------------- */
  function makeDraggableResizable(el) {
    if (!el) return;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0, startW = 0, startH = 0;
    let resizing = false;

    el.addEventListener("mousedown", (e) => {
      if (!editMode) return;
      // Ignore clicks on controls
      const interactive = ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "LABEL"];
      if (interactive.includes(e.target.tagName) && !e.target.classList.contains("resize-handle")) return;
      // Allow dragging by clicking image, but not interacting with slider
      if (e.target.classList.contains("img-size-slider")) return;

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
      Buttons & Color Picker
  ---------------------------- */
  addCustomBtn.addEventListener("click", () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      title: "New Section",
      content: "Write something...",
      imageWidth: "100%"
    };
    customSections.push(newSection);
    localStorage.setItem(CUSTOM_SECTIONS_KEY, JSON.stringify(customSections));
    addCustomSectionToDOM(newSection, true);
  });

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

  // Background Color Logic
  const DEFAULT_BG_COLOR = "#f5f5f5";
  let colorPickerContainer, bgColorPicker;

  function createColorPickerDOM() {
    if (!toolbar) return;
    if (colorPickerContainer) return;

    colorPickerContainer = document.createElement("div");
    colorPickerContainer.id = "colorPickerContainer";
    colorPickerContainer.style.display = "none";
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

    bgColorPicker.addEventListener("input", (e) => {
      const color = e.target.value;
      document.body.style.backgroundColor = color;
      toolbar.style.backgroundColor = color;
      localStorage.setItem(BG_COLOR_KEY, color);
    });
  }

  createColorPickerDOM();

  const savedColor = localStorage.getItem(BG_COLOR_KEY) || DEFAULT_BG_COLOR;
  document.body.style.backgroundColor = savedColor;
  toolbar.style.backgroundColor = savedColor;
  if (bgColorPicker) bgColorPicker.value = savedColor;

  function showColorPicker(show) {
    if (!colorPickerContainer) createColorPickerDOM();
    if (!colorPickerContainer) return;
    colorPickerContainer.style.display = show ? "inline-flex" : "none";
    if (show && bgColorPicker) {
      const currentColor = localStorage.getItem(BG_COLOR_KEY) || getComputedStyle(document.body).backgroundColor;
      bgColorPicker.value = rgbToHex(currentColor);
    }
  }

  function rgbToHex(rgbStr) {
    if (!rgbStr) return "#ffffff";
    const rgb = rgbStr.match(/\d+/g);
    if (!rgb) return "#ffffff";
    return "#" + rgb.slice(0, 3).map((x) => ("0" + parseInt(x).toString(16)).slice(-2)).join("");
  }

  const publishBtn = document.getElementById("publishPortfolioBtn");
  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      saveCustomSections();
      saveLayout();
      const bgColor = getComputedStyle(document.body).backgroundColor;
      localStorage.setItem(BG_COLOR_KEY, bgColor);
      window.location.href = "portfolio.html";
    });
  }

  function updatePublishButtonVisibility() {
    if (!publishBtn) return;
    publishBtn.classList.toggle("hidden", editMode);
  }

  window.addEventListener("load", () => {
    captureDefaultLayout();
    applyLayout();
    customSections.forEach(addCustomSectionToDOM);
    if (bgColorPicker && localStorage.getItem(BG_COLOR_KEY)) {
      bgColorPicker.value = localStorage.getItem(BG_COLOR_KEY);
      document.body.style.backgroundColor = localStorage.getItem(BG_COLOR_KEY);
    }
    adjustFooterPosition();
  });
});