
// ======================================
// OPENFEES — MAIN JAVASCRIPT
// ======================================

// --------------------------------------
// MOBILE NAVIGATION
// --------------------------------------

const menuButton = document.querySelector(
  "[data-menu-button]"
);

const menuList = document.querySelector(
  "[data-menu-list]"
);

if (menuButton && menuList) {

  const closeMenu = () => {
    menuList.classList.remove("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  };

  menuButton.addEventListener("click", () => {

    const isOpen = menuList.classList.toggle(
      "is-open"
    );

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


// --------------------------------------
// VIDEO BACKGROUND
// --------------------------------------

const heroVideo = document.getElementById(
  "heroVideo"
);

const soundToggle = document.getElementById(
  "soundToggle"
);

const soundLabel = document.getElementById(
  "soundLabel"
);

const soundIcon = document.getElementById(
  "soundIcon"
);

// Browser autoplay policies generally
// require a video to begin muted.

if (heroVideo) {

  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;

  // Continue playing while the page scrolls.
  // No scroll listener pauses the video.

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const startVideo = async () => {
    if (reducedMotion.matches) return;

    try {
      await heroVideo.play();
    } catch (error) {
      // Some browsers block autoplay.
      // The visitor can use their browser's
      // media controls or interact with the page.
      console.info(
        "Video autoplay was blocked by the browser."
      );
    }
  };

  startVideo();

  // Update sound button appearance
  const updateSoundButton = () => {

    if (!soundToggle) return;

    const soundIsOn = !heroVideo.muted;

    soundLabel.textContent = soundIsOn
      ? "Mute Video"
      : "Turn Sound On";

    soundIcon.textContent = soundIsOn
      ? "\u266A"
      : "\u266B";

    soundToggle.setAttribute(
      "aria-pressed",
      String(soundIsOn)
    );

    soundToggle.setAttribute(
      "aria-label",
      soundIsOn
        ? "Mute video sound"
        : "Turn video sound on"
    );
  };

  // Sound requires a visitor interaction
  if (soundToggle) {

    soundToggle.addEventListener(
      "click",
      async () => {

        heroVideo.muted = !heroVideo.muted;

        try {
          if (heroVideo.paused) {
            await heroVideo.play();
          }
        } catch (error) {
          heroVideo.muted = true;
        }

        updateSoundButton();

      }
    );
  }

  heroVideo.addEventListener(
    "volumechange",
    updateSoundButton
  );

  // The video intentionally keeps playing
  // after the visitor scrolls past the hero.
  // No intersection observer pauses it.

  reducedMotion.addEventListener?.(
    "change",
    event => {

      if (event.matches) {
        heroVideo.pause();
      } else {
        startVideo();
      }

    }
  );

  updateSoundButton();
}


// --------------------------------------
// CURRENT YEAR
// --------------------------------------

document.querySelectorAll(
  "[data-current-year]"
).forEach(element => {

  element.textContent =
    new Date().getFullYear();

});


// --------------------------------------
// SCROLL REVEAL ANIMATION
// --------------------------------------

const revealItems = document.querySelectorAll(
  "[data-reveal]"
);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (
  revealItems.length &&
  "IntersectionObserver" in window &&
  !prefersReducedMotion
) {

  document.documentElement.classList.add(
    "js-ready"
  );

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 40px 0px"
    }
  );

  revealItems.forEach(item => {
    observer.observe(item);
  });
}
