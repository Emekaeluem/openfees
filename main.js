
// ===========================================
// OPENFEES — MAIN JAVASCRIPT
// ===========================================


// -------------------------------------------
// 1. WHITE LOGO ON DARK BACKGROUNDS
// -------------------------------------------

document.querySelectorAll(
  ".brand img, .footer-brand img"
).forEach(logo => {

  logo.src = "media/Openfees-white.png";

  logo.alt = "OpenFees";

});


// -------------------------------------------
// 2. MOBILE NAVIGATION
// -------------------------------------------

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


// -------------------------------------------
// 3. HERO VIDEO AND SOUND CONTROL
// -------------------------------------------

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

  heroVideo.loop = true;
  heroVideo.playsInline = true;

  function updateSoundButton() {

    if (!soundToggle) return;

    const soundIsOn =
      !heroVideo.muted &&
      heroVideo.volume > 0;

    if (soundLabel) {

      soundLabel.textContent = soundIsOn
        ? "Turn Off Sound"
        : "Turn On Sound";

    }

    if (soundIcon) {

      soundIcon.textContent = soundIsOn
        ? "\u266B"
        : "\u266A";

    }

    soundToggle.setAttribute(
      "aria-pressed",
      String(soundIsOn)
    );

    soundToggle.setAttribute(
      "aria-label",
      soundIsOn
        ? "Turn off video sound"
        : "Turn on video sound"
    );

  }

  async function startVideo() {

    if (reducedMotion.matches) {
      heroVideo.pause();
      return;
    }

    try {

      // Attempt to start with sound.
      heroVideo.muted = false;
      heroVideo.volume = 1;

      await heroVideo.play();

    } catch (error) {

      // Browser autoplay restrictions
      // commonly require muted playback.

      heroVideo.muted = true;

      try {

        await heroVideo.play();

      } catch (playbackError) {

        console.info(
          "Video autoplay was blocked."
        );

      }

    }

    updateSoundButton();

  }

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

  // We do not pause the video when
  // the visitor scrolls away from the hero.

  reducedMotion.addEventListener?.(
    "change",
    event => {

      if (event.matches) {

        heroVideo.pause();

      } else if (heroVideo.paused) {

        heroVideo.play().catch(() => {

          heroVideo.muted = true;

          heroVideo.play().catch(() => {});

        });

      }

    }
  );

  startVideo();

}


// -------------------------------------------
// 4. COMMITMENT CARD INTERACTIONS
// -------------------------------------------

const commitmentCards = document.querySelectorAll(
  "[data-commitment-card]"
);

const touchDevice = window.matchMedia(
  "(hover: none)"
);

commitmentCards.forEach(card => {

  // Press Enter or Space to expand.
  card.addEventListener("keydown", event => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      if (event.target !== card) return;

      event.preventDefault();

      const isExpanded = card.classList.contains(
        "is-expanded"
      );

      commitmentCards.forEach(otherCard => {

        otherCard.classList.remove("is-expanded");

      });

      card.classList.toggle(
        "is-expanded",
        !isExpanded
      );

    }

    if (event.key === "Escape") {

      card.classList.remove("is-expanded");

    }

  });

  // On touch devices, tapping the card
  // reveals the expanded photo and text.
  card.addEventListener("click", event => {

    // Don't interfere with Learn More links.
    if (event.target.closest("a")) {
      return;
    }

    if (!touchDevice.matches) {
      return;
    }

    const isExpanded = card.classList.contains(
      "is-expanded"
    );

    commitmentCards.forEach(otherCard => {

      otherCard.classList.remove("is-expanded");

    });

    card.classList.toggle(
      "is-expanded",
      !isExpanded
    );

  });

});

// Close expanded touch cards when a
// visitor taps outside the section cards.

document.addEventListener("click", event => {

  if (event.target.closest("[data-commitment-card]")) {
    return;
  }

  commitmentCards.forEach(card => {
    card.classList.remove("is-expanded");
  });

});


// -------------------------------------------
// 5. COPYRIGHT YEAR
// -------------------------------------------

document.querySelectorAll(
  "[data-current-year]"
).forEach(element => {

  element.textContent =
    new Date().getFullYear();

});


// -------------------------------------------
// 6. SCROLL REVEAL ANIMATIONS
// -------------------------------------------

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

  const revealObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "is-visible"
          );

          revealObserver.unobserve(
            entry.target
          );

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


// -------------------------------------------
// 7. REDUCED MOTION ACCESSIBILITY
// -------------------------------------------

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
