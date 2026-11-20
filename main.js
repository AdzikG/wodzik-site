// Mobile menu and the tabs. The page works without this script, only less tidily.

const header = document.getElementById("top");
const menuButton = header.querySelector(".menu-btn");
menuButton.addEventListener("click", () => {
  const open = header.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
document.getElementById("menu").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    header.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

// The address is put together here, so it never appears whole in the page source for harvesters.
const mail = document.getElementById("mail");
const address = `${mail.dataset.user}@${mail.dataset.domain}`;
mail.href = `mailto:${address}?subject=${encodeURIComponent(mail.dataset.subject)}`;
document.getElementById("mail-text").textContent = address;

// Each tab list switches its own panels (typing modes, typing without clicking, more keys).
for (const list of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  // Lazy images in hidden panels load only once shown, so a switch showed an empty frame first
  // (or, in some browsers, until the next scroll). Fetch them as soon as the tab list is in reach.
  const warm = () => {
    for (const img of panels.flatMap((panel) => [...panel.querySelectorAll('img[loading="lazy"]')])) {
      img.loading = "eager";
    }
  };
  for (const type of ["pointerenter", "focusin", "touchstart"]) {
    list.addEventListener(type, warm, { once: true, passive: true });
  }
  const select = (tab) => {
    warm();
    for (const other of tabs) {
      const on = other === tab;
      other.setAttribute("aria-selected", String(on));
      other.tabIndex = on ? 0 : -1;
      document.getElementById(other.getAttribute("aria-controls")).hidden = !on;
    }
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (step) {
        const next = tabs[(i + step + tabs.length) % tabs.length];
        select(next);
        next.focus();
      }
    });
  });
}
