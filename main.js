const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
}

/*
  IMPORTANT:
  Most browsers block autoplay with sound until the user interacts with the page.
  This script tries to unmute and play, but if the browser blocks it,
  the video will continue muted until the user interacts.
*/

const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  heroVideo.play().catch(() => {});

  const tryPlayWithSound = async () => {
    try {
      heroVideo.muted = false;
      heroVideo.volume = 1;
      await heroVideo.play();
    } catch (error) {
      heroVideo.muted = true;
      heroVideo.play().catch(() => {});
    }
  };

  window.addEventListener("load", tryPlayWithSound);

  document.addEventListener(
    "click",
    () => {
      if (heroVideo.muted) {
        heroVideo.muted = false;
        heroVideo.play().catch(() => {});
      }
    },
    { once: true }
  );
}
