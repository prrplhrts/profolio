document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("portfolio-root");
  const theme = localStorage.getItem("selectedTheme") || "classic";
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");
  const experience = JSON.parse(localStorage.getItem("experience") || "{}");
  const projects = JSON.parse(localStorage.getItem("projects") || "{}");
  const skills = JSON.parse(localStorage.getItem("skills") || "{}");

  // Simple dynamic theme injection
  if (theme === "classic") {
    root.innerHTML = `
      <section class="portfolio-classic">
        <header>
          <h1>${profile.name || "Your Name"}</h1>
          <p>${profile.headline || ""}</p>
          <p>${profile.email || ""} | ${profile.location || ""}</p>
        </header>

        <section>
          <h2>About</h2>
          <p>${profile.about || ""}</p>
        </section>

        <section>
          <h2>Experience</h2>
          <p><strong>${experience.jobTitle || ""}</strong> – ${experience.company || ""}</p>
          <p>${experience.description || ""}</p>
        </section>

        <section>
          <h2>Projects</h2>
          <p><strong>${projects.projectName || ""}</strong> – ${projects.projectRole || ""}</p>
          <p>${projects.projectDesc || ""}</p>
        </section>

        <section>
          <h2>Skills</h2>
          <p>${skills.skills || ""}</p>
        </section>
      </section>
    `;
  }

  // You can later add: portfolio-modern, portfolio-minimal, etc.
});
