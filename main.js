const heroVideo = document.getElementById("heroVideo");
const soundBtn = document.getElementById("soundBtn");

/*
  IMPORTANT:
  Most modern browsers block autoplay with sound until user interaction.
  This script tries the best possible approach:
  1. autoplay video immediately
  2. attempt to unmute and play with sound
  3. if blocked, show the sound button for manual enable
*/

function tryPlayWithSound() {
  heroVideo.muted = false;
  heroVideo.volume = 1;

  const playPromise = heroVideo.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        soundBtn.style.display = "none";
      })
      .catch(() => {
        // Browser blocked autoplay with sound
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
        soundBtn.style.display = "inline-flex";
      });
  }
}

window.addEventListener("load", () => {
  // Start playing immediately
  heroVideo.muted = true;
  heroVideo.play().catch(() => {});

  // Then try to switch to sound
  setTimeout(() => {
    tryPlayWithSound();
  }, 800);
});

soundBtn.addEventListener("click", () => {
  heroVideo.muted = false;
  heroVideo.volume = 1;
  heroVideo.play()
    .then(() => {
      soundBtn.style.display = "none";
    })
    .catch(() => {
      alert("Your browser is still blocking autoplay with sound.");
    });
});

// Optional: if the user clicks anywhere once, try to enable sound again
document.addEventListener("click", () => {
  if (heroVideo.muted) {
    heroVideo.muted = false;
    heroVideo.volume = 1;
    heroVideo.play().then(() => {
      soundBtn.style.display = "none";
    }).catch(() => {});
  }
}, { once: true });
