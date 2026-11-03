
// ======================================
// OPENFEES — MAIN JAVASCRIPT
// ======================================


// --------------------------------------
// 1. WHITE LOGO ON DARK BACKGROUNDS
// --------------------------------------

// Update the shared header and footer logos
// on every page, including About, Our Work,
// Stories, Donations and Contact.

document.querySelectorAll(
  ".brand img, .footer-brand img"
).forEach(logo => {

  logo.src = "media/Openfees-white.png";

  logo.alt = "OpenFees Logo";

});


// --------------------------------------
// 2. MOBILE NAVIGATION
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
// 3. HERO BACKGROUND VIDEO
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

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (heroVideo) {

  // Start muted for reliable browser autoplay.
  heroVideo.muted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;

  const startVideo = async () => {

    if (reducedMotion.matches) {
      return;
    }

    try {

      await heroVideo.play();

    } catch (error) {

      console.info(
        "Video autoplay was blocked by the browser."
      );

    }

  };

  const updateSoundButton = () => {

    if (!soundToggle) {
      return;
    }

    const soundIsOn = !heroVideo.muted;

    if (soundLabel) {

      soundLabel.textContent = soundIsOn
        ? "Mute Video"
        : "Turn Sound On";

    }

    if (soundIcon) {

      soundIcon.textContent = soundIsOn
        ? "\u266A"
        : "\u266B";

    }

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

  // Turn sound on or off when clicked.
  if (soundToggle) {

    soundToggle.addEventListener(
      "click",
      async () => {

        const previousMuted = heroVideo.muted;

        heroVideo.muted = !previousMuted;

        try {

          if (heroVideo.paused) {
            await heroVideo.play();
          }

        } catch (error) {

          heroVideo.muted = previousMuted;

        }

        updateSoundButton();

      }
    );

  }

  heroVideo.addEventListener(
    "volumechange",
    updateSoundButton
  );

  // Start playback automatically.
  startVideo();

  // Keep playing while scrolling.
  // We do not pause the video on scroll.

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
// 4. AUTOMATIC COPYRIGHT YEAR
// --------------------------------------

document.querySelectorAll(
  "[data-current-year]"
).forEach(element => {

  element.textContent =
    new Date().getFullYear();

});


// --------------------------------------
// 5. SCROLL REVEAL ANIMATIONS
// --------------------------------------

const revealItems = document.querySelectorAll(
  "[data-reveal]"
);

if (
  revealItems.length &&
  "IntersectionObserver" in window &&
  !reducedMotion.matches
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

// Reveal hidden sections if a user
// switches to reduced-motion mode.

reducedMotion.addEventListener?.(
  "change",
  event => {

    if (event.matches) {

      revealItems.forEach(item => {

        item.classList.add("is-visible");

      });

    }

  }
);
