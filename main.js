// Mobile menu and the typing-mode tabs. The page works without this script, only less tidily.

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

const tabs =[...document.querySelectorAll('[role="tab"]')];
function select(tab) {
  for (const other of tabs) {
    const on = other === tab;
    other.setAttribute("aria-selected", String(on));
    other.tabIndex = on ? 0 : -1;
    document.getElementById(other.getAttribute("aria-controls")).hidden = !on;
  }
}
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
