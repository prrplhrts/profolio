document.addEventListener("DOMContentLoaded", () => {
  
  /* ----------------------------------------------------
     0. CLEANUP & INIT
  ---------------------------------------------------- */
  document.querySelectorAll("pre").forEach(el => {
    if (!el.innerText.trim()) el.remove();
  });

  const contentContainer = document.getElementById("portfolioContent");
  const footer = document.querySelector(".site-footer");
  const loadingScreen = document.getElementById("loadingScreen");

  /* ----------------------------------------------------
     1. LOADING SCREEN LOGIC
  ---------------------------------------------------- */
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      loadingScreen.style.pointerEvents = "none";
      document.body.style.overflowY = "auto"; 
      setTimeout(() => loadingScreen.remove(), 1000); 
    }
  }, 1500);

  /* ----------------------------------------------------
     2. DATA RETRIEVAL
  ---------------------------------------------------- */
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const skills = JSON.parse(localStorage.getItem("skills") || "{}");
  
  const ensureArray = (item) => Array.isArray(item) ? item : (item ? [item] : []);
  
  const projects = ensureArray(JSON.parse(localStorage.getItem("projects")));
  const experience = ensureArray(JSON.parse(localStorage.getItem("experience")));
  const education = ensureArray(JSON.parse(localStorage.getItem("education")));
  const customSections = JSON.parse(localStorage.getItem("profolio_custom_sections_v9") || "[]");
  const savedBgColor = localStorage.getItem("portfolioBgColor");
  const layout = JSON.parse(localStorage.getItem("profolio_simple_layout_v9") || "{}");

  /* ----------------------------------------------------
     3. APPLY GLOBAL STYLES
  ---------------------------------------------------- */
  if (savedBgColor) {
    document.body.style.backgroundColor = savedBgColor;
  }

  /* ----------------------------------------------------
     4. POPULATE PROFILE CARD
  ---------------------------------------------------- */
  if(document.getElementById("pfName")) document.getElementById("pfName").textContent = profile.name || "Your Name";
  if(document.getElementById("pfHeadline")) document.getElementById("pfHeadline").textContent = profile.headline || "";
  
  let loc = "";
  if(profile.city && profile.country) loc = `${profile.city}, ${profile.country}`;
  else loc = profile.country || profile.city || "";
  if(document.getElementById("pfLocation")) document.getElementById("pfLocation").textContent = loc;
  
  if(document.getElementById("pfAbout")) document.getElementById("pfAbout").textContent = profile.about || "";

  const avatarImg = document.getElementById("avatarImg");
  const storedImg = localStorage.getItem("profileImage");
  if(storedImg && avatarImg) avatarImg.src = storedImg;

  // Sidebar Skills List
  const pfSkillsList = document.getElementById("pfSkillsList");
  if (pfSkillsList && skills.skills) {
    const items = String(skills.skills).split(",").map(s => s.trim()).filter(s => s);
    pfSkillsList.innerHTML = items.map(s => `<li>${s}</li>`).join("");
  }

  /* ----------------------------------------------------
     5. POPULATE SECTIONS
  ---------------------------------------------------- */
  
  // Projects
  const projList = document.getElementById("projectsList");
  if(projList) {
    if(projects.length > 0) {
      projList.innerHTML = projects.map(p => `
        <div class="preview-item">
          <h4>${p.projectName || "Project"}</h4>
          ${p.projectImage ? `<img src="${p.projectImage}" style="max-width:100%; border-radius:8px; margin: 10px 0;">` : ""}
          <p>${p.projectDesc || ""}</p>
          ${p.projectLink ? `<a href="${p.projectLink}" target="_blank">View Project &rarr;</a>` : ""}
        </div>
      `).join("");
      document.getElementById("projectsSection").style.display = "block";
    } else {
      document.getElementById("projectsSection").style.display = "none";
    }
  }

  // Experience
  const expList = document.getElementById("experienceList");
  if(expList) {
    if(experience.length > 0) {
      expList.innerHTML = experience.map(e => `
        <div class="preview-item">
          <h4>${e.jobTitle || "Job Title"} ${e.company ? `— ${e.company}` : ""}</h4>
          <p class="date" style="color:#666; font-size:0.9rem; margin-bottom:5px;">
            ${e.startDate || ""} ${e.endDate ? `— ${e.endDate}` : ""}
          </p>
          <p>${e.description || ""}</p>
        </div>
      `).join("");
      document.getElementById("experienceSection").style.display = "block";
    } else {
      document.getElementById("experienceSection").style.display = "none";
    }
  }

  // Education
  const eduList = document.getElementById("educationList");
  if(eduList) {
    if(education.length > 0) {
      eduList.innerHTML = education.map(e => `
        <div class="preview-item">
          <h4>${e.school || "School"}</h4>
          <p>${e.degree || "Degree"} <span style="color:#666; font-size:0.9rem;">(${e.eduStart || ""} - ${e.eduEnd || ""})</span></p>
        </div>
      `).join("");
      document.getElementById("educationSection").style.display = "block";
    } else {
      document.getElementById("educationSection").style.display = "none";
    }
  }

  /* ----------------------------------------------------
     SKILLS & CERTIFICATIONS (EXACT COPY FROM EDITOR)
  ---------------------------------------------------- */
  const extraSection = document.getElementById("extraSection");
  const skillsAndCerts = document.getElementById("skillsAndCerts");
  
  if (skillsAndCerts && extraSection) {
    if (skills.skills || skills.certifications) {
      const skillText = skills.skills ? String(skills.skills).trim() : "";
      const certText = skills.certifications ? String(skills.certifications).trim() : "";
      
      if (skillText || certText) {
        skillsAndCerts.innerHTML = `
          ${skillText ? `<div><strong>Skills:</strong> ${skillText}</div>` : ""}
          ${certText ? `<div style="margin-top: 10px;"><strong>Certifications:</strong> ${certText}</div>` : ""}
        `;
        extraSection.style.display = "block";
        extraSection.classList.remove("hidden");
      } else {
        extraSection.style.display = "none";
        extraSection.classList.add("hidden");
      }
    } else {
      extraSection.style.display = "none";
      extraSection.classList.add("hidden");
    }
  }

  /* ----------------------------------------------------
     6. RENDER CUSTOM SECTIONS
  ---------------------------------------------------- */
  if (customSections.length > 0) {
    customSections.forEach(sec => {
      if(document.getElementById(sec.id)) return;

      const div = document.createElement("div");
      div.className = "section custom-section";
      div.id = sec.id;
      const widthVal = parseInt(sec.imageWidth) || 100;

      div.innerHTML = `
        <div class="section-header">
          <h3>${sec.title || "Custom Section"}</h3>
        </div>
        <div class="custom-content-area">
          <p>${sec.content || ""}</p>
          ${
            sec.image 
            ? `<img src="${sec.image}" style="width: ${widthVal}%; max-width: 100%; border-radius: 8px; margin-top: 10px;">` 
            : ""
          }
        </div>
      `;
      contentContainer.appendChild(div);
    });
  }

  if(document.getElementById("year")) {
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------
     7. APPLY LAYOUT & FIX FOOTER
  ---------------------------------------------------- */
  function applyLayoutAndFixFooter() {
    const sections = Array.from(contentContainer.querySelectorAll(".section"));
    let hasSavedLayout = Object.keys(layout).length > 0;

    if (hasSavedLayout) {
      contentContainer.style.position = "relative";
      sections.forEach(sec => {
        const pos = layout[sec.id];
        if (pos) {
          sec.style.position = "absolute";
          sec.style.left = pos.left + "px";
          sec.style.top = pos.top + "px";
          sec.style.width = pos.width + "px";
          sec.style.height = pos.height + "px";
        } else {
          sec.style.position = "relative"; 
          sec.style.width = "100%"; 
        }
      });
    }

    setTimeout(() => {
        const parentTop = contentContainer.getBoundingClientRect().top + window.scrollY;
        let maxBottom = 0;

        sections.forEach(sec => {
            if(sec.style.display === 'none' || sec.classList.contains('hidden')) return; 

            const rect = sec.getBoundingClientRect();
            const absBottom = (rect.top + window.scrollY) + rect.height;
            const relBottom = absBottom - parentTop;

            if (relBottom > maxBottom) maxBottom = relBottom;
        });

        if (maxBottom > 0) {
            contentContainer.style.minHeight = `${Math.ceil(maxBottom + 150)}px`;
            if(footer) {
                footer.style.marginTop = "60px";
            }
        }
    }, 50);
  }

  applyLayoutAndFixFooter();

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("load", applyLayoutAndFixFooter);
  });

  window.addEventListener("resize", applyLayoutAndFixFooter);

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => applyLayoutAndFixFooter());
    observer.observe(contentContainer);
    Array.from(contentContainer.children).forEach(child => observer.observe(child));
  }
});