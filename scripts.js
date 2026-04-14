
/* ═══════════════════════════════════════════
   CANDYPICKS – app.js
════════════════════════════════════════════ */

/* ── Catálogo completo de opciones ── */
const CATALOGO = [
  "🍬 Dulces de tamarindo en bolita",
  "🍯 Dulces de tamarindo suave",
  "🧂 Comprimidos de sal acidulado",
  "🥭 Gomitas enchiladas de mango",
  "🍍 Gomitas enchiladas de piña",
  "🥒 Gomitas enchiladas de pepino",
  "🍬 Caramelos macizos",
  "🍓 Gomitas de fresa con chile",
  "🍎 Manzanas caramelizadas",
  "🍎 Manzanas enchiladas",
  "🥭 Mangos en flor",
  "🫚 Jícama picada",
  "🥭 Mango picado",
  "🍉 Sandía picada",
  "🍈 Melón picado",
  "🥒 Pepino picado",
  "🍏 Manzana picada",
  "🍓 Fresas",
  "🍇 Uvas",
  "🍫 Fuente de chocolate",
  "🤍 Fuente de chocolate blanco",
  "🍪 Galletas surtidas",
  "🧁 Cupcakes",
  "🍚 Arroz con leche",
  "🟡 Gelatinas",
  "🍮 Flan",
  "🎂 Chocoflan",
  "🥐 Pan dulce",
  "🥖 Bollos",
  "🍖 Chicharrines",
  "🥜 Cacahuates",
  "🌻 Semillas",
  "🍿 Palomitas saladas",
  "🍬 Palomitas dulces",
  "🌶️ Palomitas con chile",
  "🥔 Papas",
];

/* ── Render catálogo ── */
function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  if (!grid) return;
  grid.innerHTML = CATALOGO.map(item => `
    <div class="col-6 col-sm-4 col-md-3 col-lg-2">
      <div class="catalogo-item">${item}</div>
    </div>
  `).join("");
}

/* ── Toggle paquetes (Probete / Llenetes) ── */
function togglePkg(tipo) {
  const probete  = document.getElementById("pkgProbete");
  const llenetes = document.getElementById("pkgLlenetes");
  const btnP     = document.getElementById("btnProbete");
  const btnL     = document.getElementById("btnLlenetes");

  if (tipo === "probete") {
    probete.classList.remove("d-none");
    llenetes.classList.add("d-none");
    btnP.classList.add("active");
    btnL.classList.remove("active");
  } else {
    llenetes.classList.remove("d-none");
    probete.classList.add("d-none");
    btnL.classList.add("active");
    btnP.classList.remove("active");
  }
}

/* ── Navbar scroll effect ── */
function initNavbar() {
  const nav = document.getElementById("mainNav");
  const links = nav.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Active link highlight
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── Scroll-to-top button ── */
function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ── Scroll reveal ── */
function initReveal() {
  const targets = document.querySelectorAll(
    ".pkg-card, .extra-card, .step-card, .valor-card, .gallery-item, .contact-link, .stat-item"
  );
  targets.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(el => observer.observe(el));
}

/* ── Lazy image loading + placeholder management ── */
function initImages() {
  const allImgs = document.querySelectorAll(
    ".img-frame img, .gallery-item img, .pkg-img-wrap img, .extra-img img"
  );

  allImgs.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
      img.addEventListener("error", () => {
        // Image not found – keep placeholder visible, remove broken icon
        img.style.display = "none";
      });
    }
  });
}

/* ── Contact Form validation + submission ── */
function initForm() {
  const form      = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMsg   = document.getElementById("formMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.classList.add("was-validated");

    if (!form.checkValidity()) return;

    // Gather data
    const data = {
      nombre:     document.getElementById("nombre").value.trim(),
      telefono:   document.getElementById("telefono").value.trim(),
      correo:     document.getElementById("correo").value.trim(),
      tipoEvento: document.getElementById("tipoEvento").value,
      fecha:      document.getElementById("fecha").value,
      paquete:    document.getElementById("paquete").value,
      invitados:  document.getElementById("invitados").value,
      mensaje:    document.getElementById("mensaje").value.trim(),
    };

    // Build WhatsApp pre-filled message
    const wa = buildWhatsAppMessage(data);

    // Animate button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Enviando...`;

    // Simulate short delay then open WhatsApp
    setTimeout(() => {
      window.open(wa, "_blank");
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Enviar solicitud de cotización 🍬`;
      formMsg.classList.remove("d-none");
      formMsg.style.color = "#07CFCA";
      formMsg.textContent = "✅ ¡Listo! Te redirigimos a WhatsApp para confirmar tu cotización.";
      form.reset();
      form.classList.remove("was-validated");
      setTimeout(() => formMsg.classList.add("d-none"), 6000);
    }, 800);
  });
}

function buildWhatsAppMessage(d) {
  const phone = "521XXXXXXXXXX"; // ← Reemplaza con tu número real
  const lines = [
    `¡Hola CandyPicks! 🍬 Quiero solicitar una cotización:`,
    ``,
    `👤 *Nombre:* ${d.nombre}`,
    `📞 *Teléfono:* ${d.telefono}`,
    `📧 *Correo:* ${d.correo}`,
    d.tipoEvento ? `🎉 *Tipo de evento:* ${d.tipoEvento}` : null,
    d.fecha      ? `📅 *Fecha del evento:* ${d.fecha}` : null,
    d.paquete    ? `🍭 *Paquete de interés:* ${d.paquete}` : null,
    d.invitados  ? `👥 *Invitados aproximados:* ${d.invitados}` : null,
    d.mensaje    ? `\n💬 *Mensaje adicional:* ${d.mensaje}` : null,
  ].filter(Boolean).join("\n");

  const encoded = encodeURIComponent(lines);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/* ── Footer year ── */
function setYear() {
  const el = document.getElementById("yearFooter");
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Smooth close navbar on mobile link click ── */
function initMobileNav() {
  const navLinks = document.querySelectorAll(".nav-link:not(.dropdown-toggle)");
  const navCollapse = document.getElementById("navMenu");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navCollapse && navCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
        bsCollapse.hide();
      }
    });
  });
}

/* ══════ INIT ══════ */
document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();
  initNavbar();
  initScrollTop();
  initReveal();
  initImages();
  initForm();
  setYear();
  initMobileNav();
});

