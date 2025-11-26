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





/* eyes*/
/* =========================
   GLOBAL EYE STATE
========================= */
window.eyesClosed = true;   // start with eyes closed


/* =========================
   DOM READY
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeEyesBtn');
  const eyeballs = document.querySelectorAll('.eyeball');

  // If there are no eyes on this page, do nothing
  if (eyeballs.length === 0) return;

  // Start with eyes CLOSED (matches window.eyesClosed = true)
  eyeballs.forEach(eye => {
    eye.classList.add('closed');
  });

  // Pointer tracking – pupils follow mouse only when eyes are open
  document.addEventListener('pointermove', (event) => {
    if (window.eyesClosed) return; // don't move pupils when eyes closed

    const { clientX, clientY } = event;

    eyeballs.forEach(eyeball => {
      const pupil = eyeball.querySelector('.pupil');
      if (!pupil) return;

      const rect = eyeball.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;

      const dx = clientX - eyeX;
      const dy = clientY - eyeY;
      const angle = Math.atan2(dy, dx);

      const max = rect.width * 0.25; // movement based on eye size
      const x = Math.cos(angle) * max;
      const y = Math.sin(angle) * max;

      pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  });

  // If the button exists, hook up toggle behavior
  if (closeBtn) {
    
    closeBtn.addEventListener('click', () => {
      // TOGGLE GLOBAL STATE
      window.eyesClosed = !window.eyesClosed;
      if (window.eyesClosed) {
    closeBtn.textContent = "peaka";
      }  else 
      {
    closeBtn.textContent = "booh!";
      }

      // toggle eyelids
      eyeballs.forEach(eye => {
        eye.classList.toggle('closed', window.eyesClosed);
      });

      // toggle neon background
      if (!window.eyesClosed) {
        // eyes opened → neon background ON
        document.body.classList.add('neonMode');
        document.body.classList.add('colorMode');
      } else {
        // eyes closed → restore normal background
        document.body.classList.remove('neonMode');
        document.body.classList.remove('colorMode');
      }
    });
  }
});
 
function blinkEyes() {
  if (window.eyesClosed) return; 

  document.querySelectorAll('.eyeball').forEach(eye => {
    eye.classList.add('closed');
  });

  setTimeout(() => {
    if (!window.eyesClosed) { // only reopen if they should be open
      document.querySelectorAll('.eyeball').forEach(eye => {
        eye.classList.remove('closed');
      });
    }
  }, 150);
}


function startBlinkLoop() {
  const nextBlink = Math.random() * 5000 + 7000; 

  setTimeout(() => {
    if (!window.eyesClosed) {
      blinkEyes();
    }

    startBlinkLoop(); 
  }, nextBlink);
}

startBlinkLoop(); 

function longBlink() {
  if (window.eyesClosed) return;  

  const eyeballs = document.querySelectorAll('.eyeball');

  eyeballs.forEach(eye => eye.classList.add('closed'));

  setTimeout(() => {
    if (!window.eyesClosed) {
      eyeballs.forEach(eye => eye.classList.remove('closed'));
    }
  }, 500); // long blink duration
}
