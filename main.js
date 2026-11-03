
// ==========================================
// OPENFEES — SHARED WEBSITE JAVASCRIPT
// ==========================================

// Mobile navigation
const menuButton = document.querySelector(
  "[data-menu-button]"
);

const menuList = document.querySelector(
  "[data-menu-list]"
);

if (menuButton && menuList) {

  function closeMenu() {
    menuList.classList.remove("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuList.classList.toggle("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );
  });

  menuList.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", event => {
    if (
      !menuButton.contains(event.target) &&
      !menuList.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

// Automatically update footer year
document.querySelectorAll("[data-current-year]")
  .forEach(element => {
    element.textContent = new Date().getFullYear();
  });

// Respect reduced-motion settings
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const heroVideo = document.querySelector(
  "[data-hero-video]"
);

function updateVideoMotion() {
  if (!heroVideo) return;

  if (reducedMotion.matches) {
    heroVideo.pause();
    heroVideo.removeAttribute("autoplay");
  } else {
    heroVideo.setAttribute("autoplay", "");
    const playback = heroVideo.play();

    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {
        // Browser may block autoplay.
        // The hero's background remains visible.
      });
    }
  }
}

updateVideoMotion();

if (reducedMotion.addEventListener) {
  reducedMotion.addEventListener(
    "change",
    updateVideoMotion
  );
}

// Smooth scroll reveal animations
const revealItems = document.querySelectorAll(
  "[data-reveal]"
);

if (
  revealItems.length &&
  "IntersectionObserver" in window &&
  !reducedMotion.matches
) {
  document.documentElement.classList.add("js-ready");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 40px 0px"
    }
  );

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });
}

// Reveal all items if animation preferences change
if (reducedMotion.addEventListener) {
  reducedMotion.addEventListener("change", event => {
    if (event.matches) {
      revealItems.forEach(item => {
        item.classList.add("is-visible");
      });
    }
  });
}
