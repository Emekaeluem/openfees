
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const menu = document.getElementById("academy-navigation");
  const toggle = document.getElementById("academyMenuToggle");

  function closeMenu() {
    menu?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open menu");
  }

  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );
  });

  menu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (
      menu &&
      toggle &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Compatibility for any old Academy CBT buttons.
  document.querySelectorAll("[data-start-exam]")
    .forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();

        const exam = button.dataset.startExam;

        if (["jamb", "waec", "neco"].includes(exam)) {
          window.location.href = `cbt.html?exam=${exam}`;
        }
      });
    });

  document.querySelectorAll("[data-academy-year]")
    .forEach(element => {
      element.textContent = new Date().getFullYear();
    });

});
