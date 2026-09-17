"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initLogoFallback();
  initImagePerformance();
  initMobileMenu();
  initRevealAnimations();
  initOrderModal();
  initScrollToTop();
  initStickyHeader();
  initCurrentYear();
});

function initLogoFallback() {
  document
    .querySelectorAll(".brand-logo, .footer-logo img")
    .forEach((image) => {
      const showFallback = () => {
        image.style.display = "none";
        const fallback = image.nextElementSibling;
        if (fallback) fallback.style.display = "flex";
      };
      image.addEventListener("error", showFallback);
      if (image.complete && image.naturalWidth === 0) showFallback();
    });
}

function initImagePerformance() {
  document.querySelectorAll("main img:not([loading])").forEach((image) => {
    image.loading = "lazy";
    image.decoding = "async";
  });
}

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-list");
  const overlay = document.querySelector(".nav-overlay");
  if (!toggle || !menu || !overlay) return;

  const closeMenu = () => {
    toggle.classList.remove("active");
    menu.classList.remove("open");
    overlay.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("no-scroll");
  };

  const openMenu = () => {
    toggle.classList.add("active");
    menu.classList.add("open");
    overlay.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("no-scroll");
  };

  toggle.addEventListener("click", () =>
    menu.classList.contains("open") ? closeMenu() : openMenu(),
  );
  overlay.addEventListener("click", closeMenu);
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) closeMenu();
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        instance.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px" },
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
    observer.observe(item);
  });
}

function initOrderModal() {
  const modal = document.getElementById("order-modal");
  if (!modal) return;
  const panel = modal.querySelector(".modal-panel");
  const closeButton = modal.querySelector(".modal-close");
  const selectedPerfume = modal.querySelector("#selected-perfume");
  const form = modal.querySelector("#order-form");
  const status = modal.querySelector(".form-status");
  let previousFocus = null;

  const openModal = (perfumeName = "اختيار من مجموعة SILYA") => {
    previousFocus = document.activeElement;
    if (selectedPerfume) selectedPerfume.value = perfumeName;
    if (status) status.textContent = "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    window.setTimeout(
      () => modal.querySelector("input:not([readonly])")?.focus(),
      150,
    );
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (previousFocus) previousFocus.focus();
  };

  document.querySelectorAll(".order-btn").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.perfume));
  });
  closeButton?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  panel?.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open"))
      closeModal();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      return form.reportValidity();
    }

    const data = Object.fromEntries(new FormData(form).entries());

    const whatsappNumber = "212649755224";

    const message = `
السلام عليكم، بغيت نطلب عطر من SILYA Parfum 🌸

العطر: ${data.perfume}
الاسم: ${data.fullName}
رقم الهاتف: ${data.phone}
المدينة: ${data.city}
ملاحظة: ${data.note || "لا توجد"}

شكراً.
  `.trim();

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  });
}

function initScrollToTop() {
  const button = document.querySelector(".scroll-top");
  if (!button) return;
  const toggleButton = () =>
    button.classList.toggle("visible", window.scrollY > 550);
  window.addEventListener("scroll", toggleButton, { passive: true });
  toggleButton();
  button.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

function initStickyHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const updateHeader = () =>
    header.classList.toggle("scrolled", window.scrollY > 35);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

function initCurrentYear() {
  document
    .querySelectorAll(".current-year")
    .forEach((year) => (year.textContent = new Date().getFullYear()));
}
