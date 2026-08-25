/* =====================================================
   Kun Shan University - Recruit Site Main JS
   ===================================================== */

// ---------- Header scroll effect ----------
const header = document.getElementById("siteHeader");
let lastScroll = 0;

const handleScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 8);
  lastScroll = y;
};

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

const closeMenu = () => {
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "開啟選單");
  mobileMenu.hidden = true;
  document.body.style.overflow = "";
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "關閉選單" : "開啟選單");
  mobileMenu.hidden = !isOpen;
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 960) closeMenu();
});

// ---------- Smooth scroll with header offset ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId === "#" || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ---------- Admissions tabs ----------
const tabs = document.querySelectorAll(".admission-tabs .tab");
const panels = document.querySelectorAll(".admission-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.panel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});

// ---------- CTA form ----------
const form = document.getElementById("ctaForm");
const formNote = document.getElementById("formNote");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();

  formNote.className = "form-note";

  if (!name) {
    formNote.textContent = "請填寫您的姓名";
    formNote.classList.add("is-error");
    return;
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    formNote.textContent = "請填寫有效的 Email";
    formNote.classList.add("is-error");
    return;
  }

  // Simulated submission
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "送出中…";

  setTimeout(() => {
    formNote.textContent = `感謝 ${name}！我們已收到您的諮詢，將於 1 個工作日內與您聯繫。`;
    formNote.classList.add("is-success");
    submitBtn.disabled = false;
    submitBtn.textContent = "送出，立即收到諮詢";
    form.reset();
  }, 700);
});

// ---------- Video modal ----------
const videoModal = document.getElementById("videoModal");
const videoModalFrame = document.getElementById("videoModalFrame");
const videoModalClose = videoModal ? videoModal.querySelector(".video-modal-close") : null;
let lastFocusedVideoBtn = null;

const openVideo = (videoId, trigger) => {
  if (!videoModal || !videoModalFrame) return;
  lastFocusedVideoBtn = trigger || null;
  videoModalFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="崑山科技大學 影片" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  // Fallback link in case iframe can't load (cookie/tracker restrictions)
  setTimeout(() => {
    if (!videoModal.hidden && !videoModalFrame.querySelector('iframe')) return;
    const existingFallback = videoModalFrame.querySelector('.video-fallback');
    if (existingFallback) return;
    const fallback = document.createElement('a');
    fallback.href = `https://www.youtube.com/watch?v=${videoId}`;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.className = 'video-fallback';
    fallback.textContent = '在 YouTube 中開啟 →';
    videoModalFrame.appendChild(fallback);
  }, 1500);
  videoModal.hidden = false;
  document.body.style.overflow = "hidden";
  if (videoModalClose) videoModalClose.focus();
};

const closeVideo = () => {
  if (!videoModal) return;
  videoModal.hidden = true;
  videoModalFrame.innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocusedVideoBtn) lastFocusedVideoBtn.focus();
};

document.querySelectorAll("[data-video-id]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.videoId;
    if (id) openVideo(id, btn);
  });
});

if (videoModalClose) {
  videoModalClose.addEventListener("click", closeVideo);
}

if (videoModal) {
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideo();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && videoModal && !videoModal.hidden) closeVideo();
});

// ---------- IntersectionObserver: reveal on scroll ----------
const revealEls = document.querySelectorAll(
  ".section-head, .college-card, .feature-card, .industry-card, .campus-card, .story-card, .industry-list li"
);

// Only hide if JS is active and IntersectionObserver is supported
if ("IntersectionObserver" in window) {
  revealEls.forEach((el) => {
    el.classList.add("reveal-prep");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = (el.dataset.delay || 0) * 60;
          setTimeout(() => {
            el.classList.add("reveal-in");
            el.classList.remove("reveal-prep");
          }, delay);
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
  );

  revealEls.forEach((el) => io.observe(el));
}

// ---------- Stat counter animation ----------
const animateCounter = (el) => {
  const text = el.textContent.trim();
  const match = text.match(/^([\d,.]+)(.*)$/);
  if (!match) return;
  const target = parseFloat(match[1].replace(/,/g, ""));
  if (Number.isNaN(target)) return;
  const suffix = match[2];
  const dur = 1200;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = target * eased;
    let display;
    if (Number.isInteger(target)) {
      display = Math.round(current).toLocaleString();
    } else {
      display = current.toFixed(target % 1 === 0 ? 0 : 1);
    }
    el.textContent = display + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = (Number.isInteger(target) ? target.toLocaleString() : target) + suffix;
  };
  requestAnimationFrame(tick);
};

const counterEls = document.querySelectorAll(".hero-stats strong, .industry-card-num");
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counterEls.forEach((el) => counterIO.observe(el));

console.log("KSU Recruit Site ready.");
