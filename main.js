
// ===========================================
// OPENFEES — WEBSITE JAVASCRIPT
// ===========================================


// -------------------------------------------
// 1. WHITE LOGO FOR DARK BACKGROUNDS
// -------------------------------------------

document.querySelectorAll(
  ".brand img, .footer-brand img"
).forEach(logo => {
  logo.src = "media/Openfees-white.png";
  logo.alt = "OpenFees Logo";
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

    const open = menuList.classList.toggle(
      "is-open"
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );

    menuButton.setAttribute(
      "aria-label",
      open
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
// 3. HERO VIDEO AND AUDIO
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
  }

  // Try to start with sound.
  // Browser restrictions may block it.
  async function startVideo() {

    if (reducedMotion.matches) return;

    try {

      heroVideo.muted = false;
      heroVideo.volume = 1;

      await heroVideo.play();

    } catch (error) {

      // Fallback: play muted so visitors
      // still see the video automatically.

      heroVideo.muted = true;

      try {
        await heroVideo.play();
      } catch (playbackError) {
        console.info(
          "Autoplay was blocked by the browser."
        );
      }

    }

    updateSoundButton();
  }

  startVideo();

  // Visitors can control the sound.
  if (soundToggle) {

    soundToggle.addEventListener(
      "click",
      async () => {

        const wasMuted = heroVideo.muted;

        heroVideo.muted = !wasMuted;

        try {

          if (heroVideo.paused) {
            await heroVideo.play();
          }

        } catch (error) {

          heroVideo.muted = wasMuted;

        }

        updateSoundButton();
      }
    );
  }

  heroVideo.addEventListener(
    "volumechange",
    updateSoundButton
  );

  // Do not pause on scroll.
  // Playback remains active where
  // permitted by the browser.

  reducedMotion.addEventListener?.(
    "change",
    event => {

      if (event.matches) {
        heroVideo.pause();
      } else if (heroVideo.paused) {
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
      }

    }
  );

  updateSoundButton();
}


// -------------------------------------------
// 4. DYNAMIC COPYRIGHT YEAR
// -------------------------------------------

document.querySelectorAll(
  "[data-current-year]"
).forEach(element => {

  element.textContent =
    new Date().getFullYear();

});


// -------------------------------------------
// 5. SCROLL REVEAL EFFECT
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
// 6. REDUCED MOTION ACCESSIBILITY
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
