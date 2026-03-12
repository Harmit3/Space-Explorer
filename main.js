/* ============================================================
   main.js - Shared JavaScript for Space Explorer Website
   Author: Student Project - COMP2057
   Description: Handles animated star field canvas, scroll
                animations, and interactive UI behaviours.
   ============================================================ */

/* --- Starfield Canvas Animation ---
   Creates an animated twinkling star background using
   the HTML5 Canvas API. Stars move slowly downward to
   simulate travelling through space. */
(function initStarfield() {
  /* Get the canvas element and its 2D drawing context */
  const canvas = document.getElementById('starfield');
  if (!canvas) return; /* Exit if canvas not found on this page */

  const ctx = canvas.getContext('2d');

  /* Total number of stars to render */
  const STAR_COUNT = 180;

  /* Array to hold all star objects */
  let stars = [];

  /* Resize the canvas to match the viewport */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /* Create a single star object with random properties */
  function createStar() {
    return {
      x:       Math.random() * canvas.width,   /* Horizontal position */
      y:       Math.random() * canvas.height,  /* Vertical position */
      radius:  Math.random() * 1.5 + 0.2,      /* Star size */
      speed:   Math.random() * 0.3 + 0.05,     /* Drift speed */
      opacity: Math.random() * 0.8 + 0.2,      /* Base opacity */
      twinkle: Math.random() * Math.PI * 2,    /* Twinkle phase offset */
      hue:     Math.random() > 0.9              /* Occasionally colour stars */
               ? (Math.random() > 0.5 ? '#00d4ff' : '#7b2fff')
               : '#ffffff'
    };
  }

  /* Initialize all stars */
  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar());
    }
  }

  /* Draw and animate all stars each frame */
  function draw() {
    /* Clear the canvas with a fully transparent fill */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.001; /* Current time in seconds */

    stars.forEach(function(star) {
      /* Twinkle by varying opacity using a sine wave */
      const twinkleOpacity = star.opacity *
        (0.6 + 0.4 * Math.sin(time * 1.5 + star.twinkle));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.hue === '#ffffff'
        ? 'rgba(255,255,255,' + twinkleOpacity + ')'
        : star.hue;
      ctx.globalAlpha = twinkleOpacity;
      ctx.fill();
      ctx.globalAlpha = 1;

      /* Slowly drift star downward */
      star.y += star.speed;

      /* If star exits bottom of screen, recycle it at the top */
      if (star.y > canvas.height + 5) {
        star.y = -5;
        star.x = Math.random() * canvas.width;
      }
    });

    /* Request next animation frame */
    requestAnimationFrame(draw);
  }

  /* Set up event listener to resize canvas on window resize */
  window.addEventListener('resize', function() {
    resize();
    initStars(); /* Re-init stars for new dimensions */
  });

  /* Initial setup */
  resize();
  initStars();
  draw();
}());

/* --- Scroll Reveal Animation ---
   Adds a 'visible' class to elements as they scroll into
   the viewport, triggering CSS fade-in transitions. */
(function initScrollReveal() {
  /* Select all elements marked for scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');

  /* If no reveal elements on this page, exit */
  if (!revealEls.length) return;

  /* Intersection observer fires when element enters viewport */
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* Stop observing once revealed (one-time animation) */
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }); /* Trigger when 10% of element is visible */

  /* Observe each reveal element */
  revealEls.forEach(function(el) {
    observer.observe(el);
  });
}());

/* --- Active Navigation Highlight ---
   Marks the current page's navigation link as active
   based on the current filename in the URL. */
(function highlightActiveNav() {
  /* Get the current page filename from the URL */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  /* Find all navigation links */
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(function(link) {
    /* Check if the link's href matches the current page */
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}());

/* --- Scroll-to-Top Button ---
   Shows a floating button when the user scrolls down,
   clicking it smoothly scrolls back to the top. */
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  /* Show/hide button based on scroll position */
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  });

  /* Smooth scroll to top on click */
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());

/* --- Form Submission Handler ---
   Prevents default form submission and shows a success
   message to the user. */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    /* Prevent the default browser form submission */
    e.preventDefault();

    /* Get references to form fields */
    const nameField = document.getElementById('fname');
    const emailField = document.getElementById('femail');

    /* Validate that required fields are filled */
    if (!nameField.value.trim() || !emailField.value.trim()) {
      alert('Please fill in your name and email address.');
      return;
    }

    /* Show a styled success confirmation message */
    const successMsg = document.getElementById('formSuccess');
    if (successMsg) {
      successMsg.style.display = 'block';
      form.style.display = 'none';
    }
  });
}());
