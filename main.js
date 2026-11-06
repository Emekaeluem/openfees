
// ==========================================
// OPENFEES — COMPLETE MAIN.JS
// ==========================================


// ==========================================
// 1. WHITE LOGOS ON DARK BACKGROUNDS
// ==========================================

document.querySelectorAll(
  ".brand img, .footer-brand img"
).forEach(logo => {
  logo.src = "media/Openfees-white.png";
  logo.alt = "OpenFees";
});


// ==========================================
// 2. MOBILE NAVIGATION
// ==========================================

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


// ==========================================
// 3. HERO VIDEO AND SOUND CONTROL
// ==========================================

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

      // Try to play with sound.
      heroVideo.muted = false;
      heroVideo.volume = 1;

      await heroVideo.play();

    } catch (error) {

      // Browser autoplay policies may block
      // sound until the visitor interacts.
      heroVideo.muted = true;

      try {
        await heroVideo.play();
      } catch (playbackError) {
        console.info(
          "Automatic video playback was blocked."
        );
      }
    }

    updateSoundButton();
  }

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

  // Do not pause the video on scroll.
  // Browsers may still limit background
  // playback for power-saving reasons.

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


// ==========================================
// 4. COMMITMENT CARD INTERACTIONS
// ==========================================

const commitmentCards = document.querySelectorAll(
  "[data-commitment-card]"
);

const touchDevice = window.matchMedia(
  "(hover: none)"
);

function closeCommitmentCards() {

  commitmentCards.forEach(card => {
    card.classList.remove("is-expanded");
  });
}

function toggleCommitmentCard(card) {

  const wasExpanded = card.classList.contains(
    "is-expanded"
  );

  closeCommitmentCards();

  if (!wasExpanded) {
    card.classList.add("is-expanded");
  }
}

commitmentCards.forEach(card => {

  card.addEventListener("keydown", event => {

    if (event.target !== card) return;

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      toggleCommitmentCard(card);
    }

    if (event.key === "Escape") {
      card.classList.remove("is-expanded");
    }
  });

  card.addEventListener("click", event => {

    if (event.target.closest("a")) {
      return;
    }

    if (touchDevice.matches) {
      toggleCommitmentCard(card);
    }
  });
});

document.addEventListener("click", event => {

  if (
    event.target.closest("[data-commitment-card]")
  ) {
    return;
  }

  closeCommitmentCards();
});


// ==========================================
// 5. FUND A FUTURE — INTERACTIVE DONATIONS
// ==========================================

const fundFrequencyInputs = document.querySelectorAll(
  "[data-fund-frequency]"
);

const fundAmountInputs = document.querySelectorAll(
  "[data-fund-amount]"
);

const fundCustomAmount = document.getElementById(
  "fundCustomAmount"
);

const fundSelectedAmount = document.getElementById(
  "fundSelectedAmount"
);

const fundSelectedFrequency = document.getElementById(
  "fundSelectedFrequency"
);

const fundDonateButton = document.getElementById(
  "fundDonateButton"
);

const fundValidation = document.getElementById(
  "fundValidation"
);

const minimumDonation = 100;

const nairaFormatter = new Intl.NumberFormat(
  "en-NG",
  {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }
);

if (
  fundAmountInputs.length &&
  fundCustomAmount &&
  fundSelectedAmount &&
  fundSelectedFrequency &&
  fundDonateButton
) {

  let selectedAmount = 10000;
  let selectedFrequency = "once";
  let usingCustomAmount = false;

  function showFundError(message) {

    if (fundValidation) {
      fundValidation.textContent = message;
      fundValidation.hidden = !message;
    }
  }

  function getSelectedPresetAmount() {

    const checked = document.querySelector(
      '[data-fund-amount]:checked'
    );

    return checked
      ? Number(checked.value)
      : 10000;
  }

  function updateFundSummary() {

    fundSelectedFrequency.textContent =
      selectedFrequency === "monthly"
        ? "per month"
        : "one-time";

    const amountIsValid =
      Number.isSafeInteger(selectedAmount) &&
      selectedAmount >= minimumDonation;

    if (!amountIsValid) {

      fundSelectedAmount.textContent = "—";

      fundDonateButton.classList.add(
        "is-disabled"
      );

      fundDonateButton.setAttribute(
        "aria-disabled",
        "true"
      );

      fundDonateButton.removeAttribute("href");

      showFundError(
        "Please enter a valid amount of at least ₦100."
      );

      return;
    }

    showFundError("");

    fundSelectedAmount.textContent =
      nairaFormatter.format(selectedAmount);

    fundDonateButton.classList.remove(
      "is-disabled"
    );

    fundDonateButton.removeAttribute(
      "aria-disabled"
    );

    // The next page must read these
    // URL values to use them in checkout.

    const params = new URLSearchParams({
      amount: String(selectedAmount),
      frequency: selectedFrequency
    });

    fundDonateButton.href =
      "donate.html?" + params.toString();
  }

  // ONE-TIME OR MONTHLY

  fundFrequencyInputs.forEach(input => {

    input.addEventListener("change", () => {

      if (!input.checked) return;

      selectedFrequency = input.value;

      updateFundSummary();
    });
  });

  // PRESET DONATION AMOUNTS

  fundAmountInputs.forEach(input => {

    input.addEventListener("change", () => {

      if (!input.checked) return;

      usingCustomAmount = false;

      selectedAmount = Number(input.value);

      // Remove any previously typed
      // custom amount when selecting a preset.

      fundCustomAmount.value = "";

      updateFundSummary();
    });
  });

  // CUSTOM DONATION AMOUNT

  fundCustomAmount.addEventListener(
    "input",
    () => {

      const rawAmount = fundCustomAmount.value.trim();

      if (rawAmount === "") {

        usingCustomAmount = false;

        const checkedPreset =
          document.querySelector(
            '[data-fund-amount]:checked'
          );

        if (!checkedPreset) {
          const defaultPreset =
            document.querySelector(
              '[data-fund-amount][value="10000"]'
            );

          if (defaultPreset) {
            defaultPreset.checked = true;
          }
        }

        selectedAmount = getSelectedPresetAmount();

        updateFundSummary();
        return;
      }

      usingCustomAmount = true;

      // Uncheck the preset choices
      // because custom amount is active.

      fundAmountInputs.forEach(input => {
        input.checked = false;
      });

      const numericAmount = Number(rawAmount);

      selectedAmount = numericAmount;

      updateFundSummary();
    }
  );

  // PREVENT INVALID CONTINUATION

  fundDonateButton.addEventListener(
    "click",
    event => {

      const valid =
        Number.isSafeInteger(selectedAmount) &&
        selectedAmount >= minimumDonation;

      if (!valid) {

        event.preventDefault();

        updateFundSummary();

        fundCustomAmount.focus();

        return;
      }

      // No payment happens here.
      // Navigation continues to donate.html.
    }
  );

  // INITIAL DEFAULT SELECTION

  const checkedFrequency = document.querySelector(
    '[data-fund-frequency]:checked'
  );

  if (checkedFrequency) {
    selectedFrequency = checkedFrequency.value;
  }

  selectedAmount = getSelectedPresetAmount();

  updateFundSummary();
}


// ==========================================
// 6. AUTOMATIC COPYRIGHT YEAR
// ==========================================

document.querySelectorAll(
  "[data-current-year]"
).forEach(element => {

  element.textContent =
    new Date().getFullYear();

});


// ==========================================
// 7. SCROLL REVEAL ANIMATIONS
// ==========================================

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


// ==========================================
// 8. REDUCED MOTION
// ==========================================

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
