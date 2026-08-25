// ============================================================
// MI ZONA DE PODER — lógica del quiz
// ============================================================

// --- CONFIGURACIÓN -------------------------------------------------
const ACCESS_CODE = "poder2026";

// TODO: reemplazar por el link real cuando se defina la oferta final
// (llamada exploratoria por Calendly, WhatsApp, etc. — punto pendiente
// del "Cuaderno maestro": "Definir la oferta final a la que apunta el CTA").
const CTA_LINK = "https://wa.me/5210000000000?text=Quiero%20agendar%20mi%20llamada%20exploratoria";

// --- CONTENIDO -------------------------------------------------------
const ARCHETYPES = {
  dispersion: {
    key: "dispersion",
    name: "La Experta Dispersa",
    blockLabel: "Tu bloqueo: la dispersión",
    description: "Sabes hacer muchas cosas — y eso es tu fortaleza, pero también lo que hoy te detiene. Mientras no elijas una dirección clara, tu experiencia se queda repartida en mil direcciones, y tu negocio no logra la estabilidad que buscas. No te falta talento — te falta soltar para poder enfocar.",
    cta: "Hablemos de cómo elegir tu enfoque sin perder lo que ya construiste.",
    icon: "compass"
  },
  precio: {
    key: "precio",
    name: "La Especialista sin Precio",
    blockLabel: "Tu bloqueo: el precio",
    description: "Sabes exactamente qué haces y lo haces bien — pero tus tarifas no han crecido al ritmo de tu experiencia. Hoy trabajas mucho para lo que realmente ganas, y eso no es falta de mercado: es el permiso que aún no te has dado para cobrar lo que vale tu trayectoria.",
    cta: "Hablemos de cómo poner precio a lo que ya sabes hacer bien.",
    icon: "tag"
  },
  sistema: {
    key: "sistema",
    name: "La Creativa sin Sistema",
    blockLabel: "Tu bloqueo: la falta de sistema",
    description: "Brillas en cada proyecto — pero cada uno empieza de cero. Sin un proceso repetible, tu negocio depende 100% de tu energía del día, y eso te está costando el equilibrio que buscas en esta etapa. Tu experiencia ya sabe qué funciona; solo falta convertirlo en un método que puedas repetir sin agotarte.",
    cta: "Hablemos de cómo convertir lo que haces en un proceso repetible.",
    icon: "cycle"
  },
  visibilidad: {
    key: "visibilidad",
    name: "La Invisible con Trayectoria",
    blockLabel: "Tu bloqueo: la visibilidad",
    description: "Tienes años de experiencia y resultados sólidos — pero tu mensaje no está llegando a quien lo necesita. No es falta de preparación: es que tu trayectoria aún no se ve con la claridad que merece, y eso frena que lleguen los ingresos recurrentes que buscas.",
    cta: "Hablemos de cómo hacer que tu experiencia se vea.",
    icon: "eye"
  }
};

// Orden fijo de desempate: si dos arquetipos empatan en puntaje,
// gana el que aparece primero en esta lista.
// (Pendiente según el cuaderno maestro: definir si se construye una
// pregunta de desempate real; por ahora usamos este criterio simple.)
const TIEBREAK_ORDER = ["dispersion", "precio", "sistema", "visibilidad"];

const QUESTIONS = [
  {
    text: 'Cuando alguien te pregunta "¿en qué te especializas?", ¿qué te pasa?',
    options: [
      { text: "Me cuesta responder en una frase, siento que hago de todo un poco", value: "dispersion" },
      { text: "Sé exactamente qué hago, pero me cuesta ponerle un precio justo", value: "precio" },
      { text: "Explico bien lo que hago, pero cada proyecto es distinto, no tengo un proceso fijo", value: "sistema" },
      { text: "Tengo clarísimo mi expertise, pero siento que casi nadie nuevo me encuentra", value: "visibilidad" }
    ]
  },
  {
    text: "¿Cómo describirías tu semana de trabajo hoy?",
    options: [
      { text: "Salto entre distintos tipos de servicios, cada semana es diferente", value: "dispersion" },
      { text: "Trabajo mucho, pero mis ingresos suben y bajan sin razón clara", value: "precio" },
      { text: "Repito lo mismo con cada clienta, pero empezando desde cero cada vez", value: "sistema" },
      { text: "Tengo procesos claros y buenos resultados, pero llegan pocas clientas nuevas", value: "visibilidad" }
    ]
  },
  {
    text: "Cuando piensas en todo lo que has estudiado y certificado...",
    options: [
      { text: "Siento que podría ofrecer varias cosas distintas y no sé por cuál decidirme", value: "dispersion" },
      { text: "Sé cuál es mi fuerte, pero cobro casi lo mismo que hace años", value: "precio" },
      { text: "Tengo mucho conocimiento, pero no lo he convertido en un método propio", value: "sistema" },
      { text: "Tengo el conocimiento, pero nadie lo asocia conmigo todavía", value: "visibilidad" }
    ]
  },
  {
    text: "¿Qué te frustra más hoy de tu negocio?",
    options: [
      { text: "No sé en qué enfocarme, y eso me hace decir sí a todo", value: "dispersion" },
      { text: "Trabajo mucho para lo que realmente gano", value: "precio" },
      { text: "Cada clienta me consume un tiempo distinto, no puedo predecir mi carga", value: "sistema" },
      { text: "Sé que hago un buen trabajo, pero pocas personas nuevas lo saben", value: "visibilidad" }
    ]
  },
  {
    text: "Si pudieras soltar algo de tu negocio hoy mismo...",
    options: [
      { text: "Soltaría la mitad de los servicios que ofrezco", value: "dispersion" },
      { text: "Soltaría el miedo a subir mis precios", value: "precio" },
      { text: "Soltaría la costumbre de improvisar cada proyecto desde cero", value: "sistema" },
      { text: 'Soltaría la idea de que "el buen trabajo habla por sí solo"', value: "visibilidad" }
    ]
  },
  {
    text: "Cuando imaginas tu negocio dentro de un año, funcionando de forma rentable y equilibrada, ¿qué es lo primero que tendría que cambiar?",
    options: [
      { text: 'Tendría una oferta clara, no "un poco de todo"', value: "dispersion" },
      { text: "Cobraría lo que realmente valgo", value: "precio" },
      { text: "Tendría un proceso que no dependiera de reinventarme cada vez", value: "sistema" },
      { text: "Sería conocida por lo que hago, sin tener que explicarlo cada vez", value: "visibilidad" }
    ]
  }
];

const ICONS = {
  compass: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" stroke="#C1603C" stroke-width="2.5"/>
    <path d="M42 22L28 28L22 42L36 36L42 22Z" fill="#C1603C" opacity="0.9"/>
    <circle cx="32" cy="32" r="3" fill="#4B2B17"/>
  </svg>`,
  tag: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10H30L54 34L34 54L10 30V10Z" stroke="#C1603C" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="20" cy="20" r="4" fill="#C1603C"/>
  </svg>`,
  cycle: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20A18 18 0 1 0 50 32" stroke="#C1603C" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M40 10L50 20L38 24" stroke="#C1603C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  eye: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 32C6 32 16 16 32 16C48 16 58 32 58 32C58 32 48 48 32 48C16 48 6 32 6 32Z" stroke="#C1603C" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="32" cy="32" r="8" stroke="#C1603C" stroke-width="2.5"/>
  </svg>`
};

// --- ESTADO ------------------------------------------------------------
let currentQuestion = 0;
const answers = new Array(QUESTIONS.length).fill(null);
let resultArchetype = null;

// --- HELPERS DE PANTALLA -------------------------------------------------
function showScreen(id) {
  document.querySelectorAll("[data-screen]").forEach(el => el.hidden = true);
  document.getElementById(id).hidden = false;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function setProgressVisible(visible) {
  document.getElementById("progressWrap").hidden = !visible;
}

function updateProgress() {
  const pct = ((currentQuestion) / QUESTIONS.length) * 100;
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressLabel").textContent =
    `Pregunta ${currentQuestion + 1} de ${QUESTIONS.length}`;
}

// --- PANTALLA 0: CONTRASEÑA -------------------------------------------
document.getElementById("passwordForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("passwordInput");
  const errorMsg = document.getElementById("passwordError");
  if (input.value.trim().toLowerCase() === ACCESS_CODE) {
    errorMsg.hidden = true;
    showScreen("screen-intro");
  } else {
    errorMsg.hidden = false;
  }
});

// --- PANTALLA 1: ENTRADA ------------------------------------------------
document.getElementById("btnToInstructions").addEventListener("click", () => {
  showScreen("screen-instructions");
});

// --- PANTALLA 2: INSTRUCCIONES ------------------------------------------
document.getElementById("btnStartQuiz").addEventListener("click", () => {
  currentQuestion = 0;
  renderQuestion();
  setProgressVisible(true);
  showScreen("screen-quiz");
});

// --- PANTALLA 3: QUIZ ----------------------------------------------------
function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  document.getElementById("questionText").textContent = q.text;

  const container = document.getElementById("optionsContainer");
  container.innerHTML = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.textContent = opt.text;
    if (answers[currentQuestion] === opt.value) btn.classList.add("selected");
    btn.addEventListener("click", () => selectAnswer(opt.value));
    container.appendChild(btn);
  });

  document.getElementById("btnBack").style.visibility =
    currentQuestion === 0 ? "hidden" : "visible";

  updateProgress();
}

function selectAnswer(value) {
  answers[currentQuestion] = value;
  if (currentQuestion < QUESTIONS.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

document.getElementById("btnBack").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

// --- CÁLCULO DE RESULTADO -------------------------------------------------
function finishQuiz() {
  const counts = { dispersion: 0, precio: 0, sistema: 0, visibilidad: 0 };
  answers.forEach(a => { if (a) counts[a]++; });

  let winner = TIEBREAK_ORDER[0];
  let maxScore = -1;
  TIEBREAK_ORDER.forEach(key => {
    if (counts[key] > maxScore) {
      maxScore = counts[key];
      winner = key;
    }
  });

  resultArchetype = ARCHETYPES[winner];
  renderResult();
  setProgressVisible(false);
  showScreen("screen-result");
}

function renderResult() {
  document.getElementById("resultVisual").innerHTML = ICONS[resultArchetype.icon];
  document.getElementById("resultBlockLabel").textContent = resultArchetype.blockLabel;
  document.getElementById("resultName").textContent = resultArchetype.name;
  document.getElementById("resultDescription").textContent = resultArchetype.description;
}

// --- PANTALLA 4: CAPTURA DE EMAIL ------------------------------------------
// Guarda el lead en dos lugares en paralelo:
//  1. Netlify Forms (respaldo simple, siempre queda un registro aquí)
//  2. La función /subscribe, que crea/actualiza el contacto en Systeme.io
//     con sus campos "bloqueo" y "pdf_link", y le asigna la etiqueta
//     que dispara el correo automático con el PDF.
// Ninguno de los dos bloquea el avance de la usuaria si falla.
document.getElementById("emailForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("emailInput");
  const errorMsg = document.getElementById("emailError");
  const email = emailInput.value.trim();

  const formData = new URLSearchParams();
  formData.append("form-name", "zona-de-poder-leads");
  formData.append("email", email);
  formData.append("arquetipo", resultArchetype.name);

  const netlifyFormsSubmit = fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  }).catch(() => null);

  const systemeSubmit = fetch("/.netlify/functions/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, archetype: resultArchetype.key })
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.ok) console.warn("Systeme.io:", data.error);
    })
    .catch((err) => console.warn("No se pudo contactar la función /subscribe:", err));

  Promise.allSettled([netlifyFormsSubmit, systemeSubmit]).finally(() => {
    errorMsg.hidden = true;
    renderFinalScreen();
    showScreen("screen-final");
  });
});

// --- PANTALLA 5: FINAL — PDF + CTA ----------------------------------------
function renderFinalScreen() {
  const ctaBtn = document.getElementById("btnCta");
  ctaBtn.textContent = resultArchetype.cta;
  ctaBtn.href = CTA_LINK;
}

document.getElementById("btnDownloadPdf").addEventListener("click", generatePdf);

function generatePdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const marginX = 56;
  let y = 90;

  // Fondo tipo "crema"
  doc.setFillColor(244, 241, 232);
  doc.rect(0, 0, 595, 842, "F");

  doc.setTextColor(75, 43, 23);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("MI ZONA DE PODER", marginX, y);

  y += 34;
  doc.setFontSize(22);
  doc.text("Tu diagnóstico", marginX, y);

  y += 34;
  doc.setTextColor(193, 96, 60);
  doc.setFontSize(14);
  doc.text(resultArchetype.blockLabel, marginX, y);

  y += 28;
  doc.setTextColor(75, 43, 23);
  doc.setFontSize(20);
  doc.text(resultArchetype.name, marginX, y);

  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(99, 76, 57);
  const descLines = doc.splitTextToSize(resultArchetype.description, 595 - marginX * 2);
  doc.text(descLines, marginX, y);
  y += descLines.length * 16 + 20;

  const noteLines = doc.splitTextToSize(
    "Esto es lo que te está deteniendo hoy. El siguiente paso — la llamada — es donde resolvemos el qué hacer con eso.",
    595 - marginX * 2
  );
  doc.setFont("helvetica", "italic");
  doc.text(noteLines, marginX, y);
  y += noteLines.length * 16 + 34;

  doc.setFillColor(193, 96, 60);
  doc.roundedRect(marginX, y, 595 - marginX * 2, 46, 8, 8, "F");
  doc.setTextColor(255, 253, 253);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  const ctaLines = doc.splitTextToSize(resultArchetype.cta, 595 - marginX * 2 - 24);
  doc.text(ctaLines, marginX + 12, y + 28);

  doc.save(`mi-zona-de-poder-${resultArchetype.key}.pdf`);
}
