import { Router } from "express";
const router = Router();

// Home page
router.get("/", (req, res) => {
  res.render("index", {
    title: "Portfolio - Home",
    page: "home",
  });
});

// About page
router.get("/about", (req, res) => {
  res.render("about", {
    title: "Portfolio - About",
    page: "about",
  });
});

// Projects page
router.get("/projects", (req, res) => {
  res.render("projects", {
    title: "Portfolio - Projects",
    page: "projects",
  });
});

// Individual project page
router.get("/projects/:slug", (req, res) => {
  const { slug } = req.params;

  // In a real application, you'd fetch project data from a database
  const projects = {
    "portfolio-website": {
      title: "Portfolio Website",
      description:
        "A responsive portfolio website built with Express.js and AWS",
      technologies: ["Node.js", "Express.js", "AWS", "EJS"],
      images: ["/images/portfolio-1.jpg"],
      liveUrl: "https://yourportfolio.com",
      githubUrl: "https://github.com/yourusername/portfolio",
    },
  };

  const project = projects[slug];
  if (!project) {
    return res.status(404).render("404", { title: "404 - Project Not Found" });
  }

  res.render("project-detail", {
    title: `Portfolio - ${project.title}`,
    page: "projects",
    project,
  });
});

// Contact page
router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Portfolio - Contact",
    page: "contact",
  });
});

// Resume/CV page
router.get("/resume", (req, res) => {
  res.render("resume", {
    title: "Portfolio - Resume",
    page: "resume",
  });
});

export default router;
