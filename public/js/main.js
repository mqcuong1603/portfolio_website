// Main JavaScript for Portfolio Website

document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // Animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".card, .timeline-item");
  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Loading states for buttons
  function showLoading(button) {
    const original = button.innerHTML;
    button.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    button.disabled = true;
    return original;
  }

  function hideLoading(button, originalContent) {
    button.innerHTML = originalContent;
    button.disabled = false;
  }

  // Copy to clipboard functionality
  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        showNotification("Copied to clipboard!", "success");
      })
      .catch(function (err) {
        console.error("Failed to copy: ", err);
        showNotification("Failed to copy", "error");
      });
  }

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${
      type === "error" ? "danger" : type
    } position-fixed`;
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.zIndex = "9999";
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Image lazy loading
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Form validation helper
  function validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    return isValid;
  }

  // Email validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Project filter functionality (if on projects page)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  if (filterButtons.length > 0 && projectItems.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter");

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        // Filter projects with animation
        projectItems.forEach((item, index) => {
          const category = item.getAttribute("data-category");

          if (filter === "all" || category === filter) {
            setTimeout(() => {
              item.style.display = "block";
              item.classList.add("fade-in-up");
            }, index * 100);
          } else {
            item.style.display = "none";
            item.classList.remove("fade-in-up");
          }
        });
      });
    });
  }

  // File upload handler
  function handleFileUpload(file, callback) {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          callback(null, data);
        } else {
          callback(data.error || "Upload failed");
        }
      })
      .catch((error) => {
        callback(error.message);
      });
  }

  // Utility functions
  window.portfolioUtils = {
    showLoading,
    hideLoading,
    copyToClipboard,
    showNotification,
    validateForm,
    validateEmail,
    handleFileUpload,
  };
});

// Service Worker registration for PWA capabilities
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("ServiceWorker registration successful");
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed");
      });
  });
}
