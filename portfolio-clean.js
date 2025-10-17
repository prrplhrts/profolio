// portfolio-clean.js — v10 (custom sections with image upload)
document.addEventListener("DOMContentLoaded", () => {
  const LAYOUT_KEY = "profolio_simple_layout_v9";
  const CUSTOM_SECTIONS_KEY = "profolio_custom_sections_v9";

  const editDesignBtn = document.getElementById("editDesignBtn");
  const resetBtn = document.getElementById("resetLayoutBtn");
  const editContentBtn = document.getElementById("editContentBtn");
  const addCustomBtn = document.getElementById("addCustomSectionBtn");
  const portfolioContent = document.getElementById("portfolioContent");
  const footer = document.querySelector(".site-footer");

  let editMode = false;
  let layout = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");
  let customSections = JSON.parse(localStorage.getItem(CUSTOM_SECTIONS_KEY) || "[]");
  const sections = () => Array.from(portfolioContent.querySelectorAll(".section"));
  const defaultLayout = {};

  /* ----------------------------
     Layout Helpers
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
      if (!pos) return;
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

    // Remove all custom sections
    customSections = [];
    localStorage.removeItem(CUSTOM_SECTIONS_KEY);
    document.querySelectorAll(".custom-section").forEach(sec => sec.remove());

    applyLayout();
    adjustFooterPosition();
  }

  function adjustFooterPosition() {
    const visibleSections = sections().filter(sec => !sec.classList.contains("hidden"));
    if (!visibleSections.length) {
      footer.style.marginTop = "60px";
      return;
    }

    // Find the bottom-most section (in absolute coordinates)
    const maxBottom = Math.max(
      ...visibleSections.map(sec => {
        const rect = sec.getBoundingClientRect();
        const parentRect = portfolioContent.getBoundingClientRect();
        return rect.bottom - parentRect.top;
      })
    );

    // Set portfolio content height to fit all sections
    portfolioContent.style.height = `${maxBottom + 100}px`;

    // Keep footer positioned right below portfolio content
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
  if (storedImg) avatarImg.src = storedImg;

  // PROFILE
  document.getElementById("pfName").textContent = profile.name || "";
  document.getElementById("pfHeadline").textContent = profile.headline || "";
  document.getElementById("pfLocation").textContent = profile.location || "";
  document.getElementById("pfAbout").textContent = profile.about || "";

  const pfSkillsList = document.getElementById("pfSkillsList");
  if (skills.skills) {
    const skillItems = skills.skills
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<li>${s}</li>`)
      .join("");
    pfSkillsList.innerHTML = skillItems || "";
  } else pfSkillsList.innerHTML = "";

  const profileCard = document.getElementById("profileCard");
  const hasProfileData =
    (profile.name && profile.name.trim()) ||
    (profile.headline && profile.headline.trim()) ||
    (profile.about && profile.about.trim()) ||
    (skills.skills && skills.skills.trim());
  if (!hasProfileData) profileCard.classList.add("hidden");

  // PROJECTS
  const projectsSection = document.getElementById("projectsSection");
  const projectsList = document.getElementById("projectsList");
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

  // EXPERIENCE
  const experienceSection = document.getElementById("experienceSection");
  const experienceList = document.getElementById("experienceList");
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

  // EDUCATION
  const educationSection = document.getElementById("educationSection");
  const educationList = document.getElementById("educationList");
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

  // SKILLS
  const extraSection = document.getElementById("extraSection");
  const skillsAndCerts = document.getElementById("skillsAndCerts");
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

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ----------------------------
     Custom Sections
  ---------------------------- */
  function saveCustomSections() {
    customSections = Array.from(document.querySelectorAll(".custom-section")).map(sec => ({
      id: sec.id,
      title: sec.querySelector("h3").textContent,
      content: sec.querySelector(".custom-content").textContent,
      image: sec.querySelector(".custom-img")?.src || null
    }));
    localStorage.setItem(CUSTOM_SECTIONS_KEY, JSON.stringify(customSections));
  }

  function addCustomSectionToDOM(sectionData, isNew = false) {
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
      <div class="resize-handle"></div>
    `;
    portfolioContent.appendChild(div);

    // Remove button styling
    const removeBtn = div.querySelector(".remove-custom");
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
    });

    // Image button setup
    const addImgBtn = div.querySelector(".add-image");
    const imgInput = div.querySelector(".image-upload");

    addImgBtn.style.background = "#4A7387";
    addImgBtn.style.color = "#fff";
    addImgBtn.style.border = "none";
    addImgBtn.style.borderRadius = "6px";
    addImgBtn.style.padding = "6px 12px";
    addImgBtn.style.marginTop = "10px";
    addImgBtn.style.cursor = "pointer";

    addImgBtn.addEventListener("click", () => imgInput.click());

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

    makeDraggableResizable(div);
    applyLayout();
    adjustFooterPosition();

    if (editMode) {
      div.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "true"));
      removeBtn.classList.remove("hidden");
      addImgBtn.classList.remove("hidden");
    }

    if (isNew) saveCustomSections();
  }

  /* ----------------------------
     Edit Mode
  ---------------------------- */
  function enterEditMode() {
    editMode = true;
    document.body.classList.add("design-mode");
    resetBtn.classList.remove("hidden");
    addCustomBtn.classList.remove("hidden");

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
        sec.querySelector(".remove-custom").classList.remove("hidden");
        sec.querySelector(".add-image").classList.remove("hidden");
        sec.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "true"));
      }

      makeDraggableResizable(sec);
    });
    adjustFooterPosition();
  }

  function exitEditMode() {
    editMode = false;
    document.body.classList.remove("design-mode");
    resetBtn.classList.add("hidden");
    addCustomBtn.classList.add("hidden");

    sections().forEach(sec => {
      sec.style.border = "";
      sec.style.cursor = "";
      sec.style.userSelect = "";
      sec.style.zIndex = "";
      const handle = sec.querySelector(".resize-handle");
      if (handle) handle.style.display = "none";
      if (sec.classList.contains("custom-section")) {
        sec.querySelector(".remove-custom").classList.add("hidden");
        sec.querySelector(".add-image").classList.add("hidden");
        sec.querySelectorAll("[contenteditable]").forEach(el => (el.contentEditable = "false"));
      }
    });

    saveCustomSections();
    saveLayout();
    applyLayout();
    adjustFooterPosition();
  }

  /* ----------------------------
     Drag + Resize
  ---------------------------- */
  function makeDraggableResizable(el) {
    let startX, startY, startLeft, startTop, startW, startH, resizing = false;

    el.addEventListener("mousedown", e => {
      if (!editMode) return;
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
          el.style.width = startW + dx + "px";
          el.style.height = startH + dy + "px";
        } else {
          el.style.left = startLeft + dx + "px";
          el.style.top = startTop + dy + "px";
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
     Buttons
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

  editDesignBtn.addEventListener("click", () => {
    if (!editMode) {
      enterEditMode();
      editDesignBtn.textContent = "Save Design"; // 🔄 change button text
    } else {
      exitEditMode();
      editDesignBtn.textContent = "Edit Design"; // 🔙 revert back
    }
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset layout and remove custom sections?")) resetLayout();
  });

  if (editContentBtn)
    editContentBtn.addEventListener("click", () => (window.location.href = "builder.html"));

  window.addEventListener("resize", () => {
    if (!editMode) applyLayout();
  });

  // Load layout + custom sections on page start
  window.addEventListener("load", () => {
    captureDefaultLayout();
    applyLayout();
    customSections.forEach(addCustomSectionToDOM);
  });
});
