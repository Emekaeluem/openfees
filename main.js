
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
// 3. VIDEO AUTOPLAY AND AUDIO CONTROL
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
      !heroVideo.muted && heroVideo.volume > 0;

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

      // Try immediate sound playback.
      heroVideo.muted = false;
      heroVideo.volume = 1;

      await heroVideo.play();

    } catch (error) {

      // Fallback for browsers that block
      // unmuted autoplay.
      heroVideo.muted = true;

      try {
        await heroVideo.play();
      } catch (playbackError) {
        console.info(
          "Browser blocked automatic video playback."
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

  // Video is not intentionally paused
  // as visitors scroll the page.
  startVideo();
}


// -------------------------------------------
// 4. AUTOMATIC COPYRIGHT YEAR
// -------------------------------------------

document.querySelectorAll(
  "[data-current-year]"
).forEach(element => {
  element.textContent =
    new Date().getFullYear();
});


// -------------------------------------------
// 5. SCROLL REVEAL ANIMATIONS
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
// 6. REDUCED MOTION
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
