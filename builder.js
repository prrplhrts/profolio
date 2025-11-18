// 1. IMMEDIATE PROTECTION CHECK
(function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) window.location.href = "sign-in.html";
})();

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll("#builder-steps li");
  const sections = document.querySelectorAll(".builder-step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const generateBtn = document.getElementById("generatePortfolio");
  
  const yearEl = document.getElementById("year");
  const expList = document.getElementById("experienceList");
  const projList = document.getElementById("projectList");
  const eduList = document.getElementById("educationList");
  const userId = localStorage.getItem("userId"); 

  // --- FULL COUNTRY LIST ---
  const countryList = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", 
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde (Cabo Verde)", "Central African Republic", 
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Republic of the", "Congo, Democratic Republic of the", "Costa Rica", 
    "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", 
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",  
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Koswait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", 
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", 
    "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal", 
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", 
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", 
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  /* --- RESUME UPLOAD LOGIC (AI) --- */
  const resumeUploadInput = document.getElementById("resumeUpload");
  const uploadLabel = document.querySelector("label[for='resumeUpload']");

  if (resumeUploadInput) {
    resumeUploadInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const originalText = uploadLabel.textContent;
      uploadLabel.textContent = "Analyzing with AI...";
      uploadLabel.style.opacity = "0.7";
      uploadLabel.style.pointerEvents = "none";

      const formData = new FormData();
      formData.append("resume", file);

      try {
        const res = await fetch("http://localhost:3000/parse-resume", {
          method: "POST",
          body: formData
        });

        if (!res.ok) throw new Error("Failed to parse resume");

        const data = await res.json();
        autofillBuilder(data); // Fill the UI
        alert("✨ Resume analyzed! Fields autofilled.");

      } catch (err) {
        console.error(err);
        alert("❌ Error analyzing resume.");
      } finally {
        uploadLabel.textContent = originalText;
        uploadLabel.style.opacity = "1";
        uploadLabel.style.pointerEvents = "all";
        resumeUploadInput.value = "";
      }
    });
  }

  function autofillBuilder(data) {
    // Profile
    if (data.profile) {
      if (data.profile.name) document.getElementById("name").value = data.profile.name;
      if (data.profile.headline) document.getElementById("headline").value = data.profile.headline;
      if (data.profile.email) document.getElementById("email").value = data.profile.email;
      if (data.profile.about) document.getElementById("about").value = data.profile.about;
      
      // --- IMPROVED COUNTRY/CITY LOGIC ---
      if (data.profile.location) {
         const rawLoc = data.profile.location;
         const parts = rawLoc.split(',').map(s => s.trim());
         
         let potentialCity = "";
         let potentialCountry = "";

         // Basic heuristic: Last part is country, rest is city
         if (parts.length > 1) {
             potentialCountry = parts[parts.length - 1];
             potentialCity = parts.slice(0, parts.length - 1).join(', ');
         } else {
             potentialCountry = rawLoc; // Try to see if the whole string is a country
             potentialCity = rawLoc;    // Default fallback
         }

         // Try to match Country in the Dropdown
         const countrySelect = document.getElementById("country");
         let countryMatched = false;

         for(let i=0; i<countrySelect.options.length; i++) {
             const opt = countrySelect.options[i].value.toLowerCase();
             const target = potentialCountry.toLowerCase();

             // Check exact match OR if the target contains the option (e.g. "United States of America" vs "United States")
             if (opt === target || (target.length > 3 && (opt.includes(target) || target.includes(opt)))) {
                 countrySelect.selectedIndex = i;
                 countryMatched = true;
                 break;
             }
         }

         // Set City
         if (countryMatched) {
             document.getElementById("city").value = potentialCity;
         } else {
             // If we couldn't find the country in the dropdown, put the FULL string in City
             // so the user doesn't lose the info.
             document.getElementById("city").value = rawLoc;
         }
      }
    }

    // Lists
    document.getElementById("experienceList").innerHTML = "";
    document.getElementById("projectList").innerHTML = "";
    document.getElementById("educationList").innerHTML = "";

    if (data.experience?.length) data.experience.forEach(addExperience);
    if (data.projects?.length) data.projects.forEach(addProject);
    if (data.education?.length) data.education.forEach(addEducation);
    
    // Skills
    if (data.skills) {
      if(data.skills.skills) document.getElementById("skillsInput").value = data.skills.skills;
      if(data.skills.certifications) document.getElementById("certifications").value = data.skills.certifications;
    }
  }

  /* --- SECTION NAVIGATION --- */
  function activateSection(id) {
    sections.forEach(s => s.classList.remove("active"));
    steps.forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.querySelector(`[data-section='${id}']`).classList.add("active");
    if (id === "preview") displayPreview();
  }

  steps.forEach(s => s.addEventListener("click", () => activateSection(s.dataset.section)));

  nextButtons.forEach(btn => {
    const newBtn = btn.cloneNode(true); 
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", e => {
      const current = e.target.closest(".builder-step").id;
      if (saveStepLocal(current)) {
        activateSection(newBtn.dataset.next);
      }
    });
  });

  /* --- HELPERS --- */
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

  function updateRemoveButtonsVisibility(type) {
    const lists = {
      experience: document.querySelectorAll(".experience-item"),
      project: document.querySelectorAll(".project-item"),
      education: document.querySelectorAll(".education-item")
    };
    lists[type].forEach((item) => {
      const removeBtn = item.querySelector(".remove-btn");
      if (removeBtn) removeBtn.style.display = "inline-block"; 
    });
  }

  document.getElementById("addExperience").addEventListener("click", () => addExperience());
  document.getElementById("addProject").addEventListener("click", () => addProject());
  document.getElementById("addEducation").addEventListener("click", () => addEducation());

  /* --- ADD FIELDS --- */
  
  function setupDateConstraints(container, startClass, endClass) {
    const startInput = container.querySelector(`.${startClass}`);
    const endInput = container.querySelector(`.${endClass}`);
    if (!startInput || !endInput) return;

    endInput.min = startInput.value;
    startInput.addEventListener("input", () => {
      const startVal = parseInt(startInput.value);
      const endVal = parseInt(endInput.value);
      endInput.min = startInput.value;
      if (endInput.value && endVal < startVal) endInput.value = startVal;
    });
    endInput.addEventListener("change", () => {
      const startVal = parseInt(startInput.value);
      const endVal = parseInt(endInput.value);
      if (startInput.value && endVal < startVal) endInput.value = startVal; 
    });
  }

  function addExperience(prefill = {}) {
    const div = document.createElement("div");
    div.classList.add("experience-item");
    div.innerHTML = `
      <div class="form-group"><label>Job Title</label><input type="text" class="jobTitle" value="${prefill.jobTitle || ""}"></div>
      <div class="form-group"><label>Company</label><input type="text" class="company" value="${prefill.company || ""}"></div>
      <div class="form-row">
        <div class="form-group"><label>Start Year</label><input type="number" class="startDate" value="${prefill.startDate || new Date().getFullYear()}"></div>
        <div class="form-group"><label>End Year</label><input type="number" class="endDate" value="${prefill.endDate || new Date().getFullYear()}"></div>
      </div>
      <div class="form-group"><label>Description</label><textarea class="description">${prefill.description || ""}</textarea></div>
    `;
    div.appendChild(createRemoveButton(div, "experience"));
    expList.appendChild(div);
    setupDateConstraints(div, "startDate", "endDate");
    updateRemoveButtonsVisibility("experience");
  }

  function addProject(prefill = {}) {
    const div = document.createElement("div");
    div.classList.add("project-item");
    div.innerHTML = `
      <div class="form-group"><label>Project Name</label><input type="text" class="projectName" value="${prefill.projectName || ""}"></div>
      <div class="form-group"><label>Role</label><input type="text" class="projectRole" value="${prefill.projectRole || ""}"></div>
      <div class="form-group"><label>Description</label><textarea class="projectDesc">${prefill.projectDesc || ""}</textarea></div>
      <div class="form-group"><label>Project Link</label><input type="url" class="projectLink" value="${prefill.projectLink || ""}"></div>
    `;
    div.appendChild(createRemoveButton(div, "project"));
    projList.appendChild(div);
    updateRemoveButtonsVisibility("project");
  }

  function addEducation(prefill = {}) {
    const div = document.createElement("div");
    div.classList.add("education-item");
    div.innerHTML = `
      <div class="form-group"><label>School</label><input type="text" class="school" value="${prefill.school || ""}"></div>
      <div class="form-group"><label>Degree / Course</label><input type="text" class="degree" value="${prefill.degree || ""}"></div>
      <div class="form-row">
        <div class="form-group"><label>Start Year</label><input type="number" class="eduStart" value="${prefill.eduStart || new Date().getFullYear()}"></div>
        <div class="form-group"><label>End Year</label><input type="number" class="eduEnd" value="${prefill.eduEnd || new Date().getFullYear()}"></div>
      </div>
    `;
    div.appendChild(createRemoveButton(div, "education"));
    eduList.appendChild(div);
    setupDateConstraints(div, "eduStart", "eduEnd");
    updateRemoveButtonsVisibility("education");
  }

  /* --- SAVE LOCAL STEP WITH VALIDATION --- */
  function saveStepLocal(id) {
    let data = {};
    let isValid = true;

    function showWarning(input, message) {
      let warning = input.parentElement.querySelector(".warning");
      if (!warning) {
        warning = document.createElement("small");
        warning.className = "warning";
        warning.style.color = "#c0392b";
        warning.style.marginTop = "4px";
        warning.style.display = "block";
        input.parentElement.appendChild(warning);
      }
      warning.textContent = message;
    }

    function clearWarnings(form) { 
        form.querySelectorAll(".warning").forEach(w => w.remove()); 
    }

    // 1. EXPERIENCE VALIDATION (Description NOT required)
    if (id === "experience") {
      clearWarnings(document.getElementById("experienceForm"));
      const items = document.querySelectorAll(".experience-item");
      data = [...items].map(item => {
        const jobTitle = item.querySelector(".jobTitle");
        const company = item.querySelector(".company");
        const start = item.querySelector(".startDate");
        const end = item.querySelector(".endDate");
        const desc = item.querySelector(".description");

        if (!jobTitle.value.trim() || !company.value.trim()) {
          isValid = false;
          if (!jobTitle.value.trim()) showWarning(jobTitle, "Job Title is required");
          if (!company.value.trim()) showWarning(company, "Company is required");
        }
        return { jobTitle: jobTitle.value, company: company.value, startDate: start.value, endDate: end.value, description: desc.value };
      });
    } 
    
    // 2. PROFILE VALIDATION
    else if (id === "profile") {
        clearWarnings(document.getElementById("profileForm"));
        const name = document.getElementById("name");
        const email = document.getElementById("email");

        if (!name.value.trim()) {
            isValid = false;
            showWarning(name, "Full Name is required");
        }
        if (!email.value.trim()) {
            isValid = false;
            showWarning(email, "Email is required");
        }

        data = {
            name: name.value,
            headline: document.getElementById("headline").value,
            about: document.getElementById("about").value,
            country: document.getElementById("country").value,
            city: document.getElementById("city").value,
            email: email.value
        };
    } 
    
    // 3. PROJECTS VALIDATION (Description NOT required)
    else if (id === "projects") {
        clearWarnings(document.getElementById("projectForm"));
        const items = document.querySelectorAll(".project-item");
        data = [...items].map(item => {
            const name = item.querySelector(".projectName");
            const role = item.querySelector(".projectRole");
            const desc = item.querySelector(".projectDesc");
            const link = item.querySelector(".projectLink");

            if (!name.value.trim()) {
                isValid = false;
                showWarning(name, "Project Name is required");
            }
            return {
                projectName: name.value,
                projectRole: role.value,
                projectDesc: desc.value,
                projectLink: link.value
            };
        });
    } 
    
    // 4. EDUCATION VALIDATION
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
                if (!school.value.trim()) showWarning(school, "School name is required");
                if (!degree.value.trim()) showWarning(degree, "Degree is required");
            }
            return {
                school: school.value,
                degree: degree.value,
                eduStart: start.value,
                eduEnd: end.value
            };
        });
    } 
    
    // 5. SKILLS
    else if (id === "skills") {
        data = {
            skills: document.getElementById("skillsInput").value,
            certifications: document.getElementById("certifications").value
        }
    }

    if (!isValid) return false; // Stop navigation if invalid

    localStorage.setItem(id, JSON.stringify(data));
    return true;
  }

  /* --- SAVE TO BACKEND --- */
  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
        if (!saveStepLocal("skills")) return;

        const originalText = generateBtn.textContent;
        generateBtn.textContent = "Saving...";
        generateBtn.disabled = true;

        const profile = JSON.parse(localStorage.getItem("profile") || "{}");
        const skills = JSON.parse(localStorage.getItem("skills") || "{}");
        const experience = JSON.parse(localStorage.getItem("experience") || "[]");
        const projects = JSON.parse(localStorage.getItem("projects") || "[]");
        const education = JSON.parse(localStorage.getItem("education") || "[]");
        const profileImage = localStorage.getItem("profileImage");

        if (profileImage) profile.profileImage = profileImage;
        
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          profile.timezone = tz;
        } catch(e) { profile.timezone = "UTC"; }

        const payload = { userId, profile, skills, experience, projects, education };

        try {
            const res = await fetch("http://localhost:3000/portfolio/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("✅ Saved! Generating your portfolio...");
                window.location.href = "portfolio-theme.html";
            } else {
                const json = await res.json();
                alert(`❌ Save Failed: ${json.error || "Unknown"}`);
                generateBtn.textContent = originalText;
                generateBtn.disabled = false;
            }
        } catch (err) {
            alert("❌ Network Error. Check if backend is running.");
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        }
    });
  }

  /* --- LOAD DATA --- */
  async function loadSavedData() {
    try {
      const res = await fetch(`http://localhost:3000/portfolio/${userId}`);
      if (!res.ok) return;
      const data = await res.json();

      localStorage.setItem("profile", JSON.stringify(data.profile));
      localStorage.setItem("skills", JSON.stringify({ skills: data.skills.skills_list, certifications: data.skills.certifications }));
      localStorage.setItem("experience", JSON.stringify(data.experience));
      localStorage.setItem("projects", JSON.stringify(data.projects));
      localStorage.setItem("education", JSON.stringify(data.education));
      
      if (data.profile.profile_image) {
          localStorage.setItem("profileImage", data.profile.profile_image);
          const imgPreview = document.getElementById("profilePreviewImg");
          if(imgPreview) imgPreview.src = data.profile.profile_image;
      }

      if (data.experience) data.experience.forEach(addExperience);
      if (data.projects) data.projects.forEach(addProject);
      if (data.education) data.education.forEach(addEducation);
      
      if (data.profile) {
          if(data.profile.name) document.getElementById("name").value = data.profile.name;
          if(data.profile.headline) document.getElementById("headline").value = data.profile.headline;
          if(data.profile.about) document.getElementById("about").value = data.profile.about;
          if(data.profile.country) document.getElementById("country").value = data.profile.country;
          if(data.profile.city) document.getElementById("city").value = data.profile.city;
          if(data.profile.email) document.getElementById("email").value = data.profile.email;
      }
      if (data.skills) {
          document.getElementById("skillsInput").value = data.skills.skills_list || "";
          document.getElementById("certifications").value = data.skills.certifications || "";
      }
    } catch(e) {}
  }

  /* --- IMAGE PREVIEW --- */
  const profileImageInput = document.getElementById("profileImage");
  if (profileImageInput) {
    profileImageInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("profileImage", reader.result);
        document.getElementById("profilePreviewImg").src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* --- INIT HELPERS --- */
  function initProfileHelpers() {
    const countrySelect = document.getElementById("country");
    if (countrySelect) {
      countryList.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        countrySelect.appendChild(opt);
      });
    }
  }

  function displayPreview() {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    const experience = JSON.parse(localStorage.getItem("experience") || "[]");
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const education = JSON.parse(localStorage.getItem("education") || "[]");
    const skills = JSON.parse(localStorage.getItem("skills") || "{}");
    const img = localStorage.getItem("profileImage");
    const previewBox = document.querySelector(".preview-box");

    let locationString = "";
    if (profile.city && profile.country) locationString = `${profile.city}, ${profile.country}`;
    else locationString = profile.country || profile.city || "";
    if (profile.timezone) locationString += ` (${profile.timezone})`;

    previewBox.innerHTML = `
      <div class="preview-card">
        <div class="preview-header">
          ${img ? `<img src="${img}" class="preview-avatar" />` : ""}
          <h3>${profile.name || "Your Name"}</h3>
          <p>${profile.headline || ""}</p>
          <p>${profile.about || ""}</p>
          <p>${profile.email || ""} ${locationString ? " | " + locationString : ""}</p>
        </div>
        <div class="preview-section"><h4>Experience</h4>${experience.map(e => `<p><strong>${e.jobTitle}</strong> – ${e.company}</p><p>${e.description}</p>`).join("")}</div>
        <div class="preview-section"><h4>Projects</h4>${projects.map(p => `<p><strong>${p.projectName}</strong> – ${p.projectRole}</p><p>${p.projectDesc}</p>`).join("")}</div>
        <div class="preview-section"><h4>Education</h4>${education.map(ed => `<p><strong>${ed.degree}</strong> – ${ed.school}</p>`).join("")}</div>
        <div class="preview-section"><h4>Skills</h4><p>${skills.skills || ""}</p></div>
      </div>
    `;
  }

  initProfileHelpers();
  loadSavedData();
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});