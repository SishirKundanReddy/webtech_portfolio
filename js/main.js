// Main JavaScript for Personal Portfolio

document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio Loaded");

  // Add scroll effect to navbar
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
      navbar.style.background = "rgba(5, 5, 5, 0.95)";
    } else {
      navbar.classList.remove("scrolled");
      navbar.style.background = "rgba(5, 5, 5, 0.8)";
    }
  });

  // Simple reveal animation on scroll
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });

  // Add visible class styles dynamically if not in CSS
  const style = document.createElement("style");
  style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
  document.head.appendChild(style);

  // --- Custom Cursor ---
  const cursorDot = document.createElement("div");
  cursorDot.classList.add("cursor-dot");
  const cursorOutline = document.createElement("div");
  cursorOutline.classList.add("cursor-outline");
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Smooth follow for outline
    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`,
      },
      { duration: 500, fill: "forwards" }
    );
  });

  // Hover effect for links/buttons
  const interactiveElements = document.querySelectorAll(
    "a, button, .bento-card"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.style.width = "60px";
      cursorOutline.style.height = "60px";
      cursorOutline.style.backgroundColor = "rgba(210, 255, 0, 0.1)";
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.style.width = "40px";
      cursorOutline.style.height = "40px";
      cursorOutline.style.backgroundColor = "transparent";
    });
  });

  // --- 3D Tilt Effect (Vanilla JS) ---
  const tiltCards = document.querySelectorAll(".bento-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Reduced rotation for bento cards
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
  });

  // --- Typing Effect ---
  const typingElement = document.querySelector(".typing-text");
  if (typingElement) {
    const textToType = typingElement.getAttribute("data-text");
    typingElement.textContent = "";
    let i = 0;

    function typeWriter() {
      if (i < textToType.length) {
        typingElement.textContent += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    // Start typing after a small delay
    setTimeout(typeWriter, 1000);
  }

  // --- Interactive Canvas Particle Network (Global Background) ---
  const canvas = document.getElementById("globalCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray;

    // Set canvas size to full window
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();

    // Mouse position relative to window
    let mouse = {
      x: null,
      y: null,
      radius: 150, // Increased radius for better interaction
    };

    window.addEventListener("mousemove", (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Create Particle Class
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // Method to draw individual particle
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(210, 255, 0, 0.5)"; // Neon accent color with transparency
        ctx.fill();
      }

      // Check particle position, check mouse position, move the particle, draw the particle
      update() {
        // Check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 3;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 3;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 3;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 3;
          }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Draw particle
        this.draw();
      }
    }

    // Create particle array
    function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 9000; // Reduced density for full screen
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
        let y =
          Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
        let directionX = Math.random() * 1 - 0.5;
        let directionY = Math.random() * 1 - 0.5;
        let color = "#D2FF00";

        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    // Check if particles are close enough to draw line between them
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance =
            (particlesArray[a].x - particlesArray[b].x) *
              (particlesArray[a].x - particlesArray[b].x) +
            (particlesArray[a].y - particlesArray[b].y) *
              (particlesArray[a].y - particlesArray[b].y);

          if (distance < (canvas.width / 9) * (canvas.height / 9)) {
            opacityValue = 1 - distance / 20000;
            ctx.strokeStyle = "rgba(210, 255, 0," + opacityValue * 0.2 + ")"; // Lower opacity for lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    window.addEventListener("resize", () => {
      setCanvasSize();
      init();
    });

    init();
    animate();
  }
});
