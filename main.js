// ======================================================
// CONFIGURAÇÃO DE TEMPO (REGRA DE NEGÓCIO)
// ======================================================
const DATA_INICIO = new Date(2025, 0, 13, 1, 14, 0); // 14/01/2025 01:14
const UM_ANO_EM_MS = 365 * 24 * 60 * 60 * 1000;

// ======================================================
// ELEMENTOS DO DOM
// ======================================================
const linkRecordacao = document.getElementById("link-recordacao-1ano");
const cronometroEl = document.getElementById("cronometro");
const temporizadorEl = document.querySelector(".temporizador");

// ======================================================
// CRONÔMETRO (TEMPO DECORRIDO)
// ======================================================
function iniciarCronometro() {
  function atualizar() {
    const agora = new Date();

    if (agora < DATA_INICIO) {
      cronometroEl.textContent = "Ainda não começou.";
      return;
    }

    const diffMs = agora - DATA_INICIO;

    let segundos = Math.floor(diffMs / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);
    let anos = Math.floor(dias / 365);

    dias %= 365;
    horas %= 24;
    minutos %= 60;
    segundos %= 60;

    cronometroEl.textContent =
      `${anos} anos, ${dias} dias, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;

    verificarLiberacao(diffMs);
  }

  atualizar();
  setInterval(atualizar, 1000);
}

// ======================================================
// TEMPORIZADOR (CONTAGEM REGRESSIVA DE 1 ANO)
// ======================================================
function iniciarTemporizador() {
  const dataFinal = new Date(DATA_INICIO.getTime() + UM_ANO_EM_MS);

  function atualizar() {
    const agora = new Date();
    const diffMs = dataFinal - agora;

    if (diffMs <= 0) {
      temporizadorEl.textContent = "1 ano completo 🎉";
      return;
    }

    let segundos = Math.floor(diffMs / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);

    horas %= 24;
    minutos %= 60;
    segundos %= 60;

    temporizadorEl.textContent =
      `${dias} dias, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
  }

  atualizar();
  setInterval(atualizar, 1000);
}

// ======================================================
// CORE: LIBERAÇÃO + FESTA (SEM ESTADO, SEM STORAGE)
// ======================================================
function verificarLiberacao(diffMs) {
  if (diffMs < UM_ANO_EM_MS) return;

  revelarLink();
  iniciarFesta();
}

// ======================================================
// LINK
// ======================================================
function revelarLink() {
  linkRecordacao.style.display = "inline";
  linkRecordacao.classList.remove("bloqueado");
  linkRecordacao.classList.add("liberado");
}

// ======================================================
// FESTA 🎉 (CONFETE CONTÍNUO)
// ======================================================
function iniciarFesta() {
  if (document.body.classList.contains("modo-festa")) return;

  document.body.classList.add("modo-festa");

  // Confete infinito
  setInterval(gerarConfetes, 800);
}

function gerarConfetes() {
  for (let i = 0; i < 20; i++) {
    const confete = document.createElement("div");
    confete.className = "confete";

    confete.style.left = Math.random() * 100 + "vw";
    confete.style.backgroundColor =
      `hsl(${Math.random() * 360}, 100%, 50%)`;
    confete.style.animationDuration =
      2 + Math.random() * 3 + "s";

    document.body.appendChild(confete);

    setTimeout(() => confete.remove(), 5000);
  }
}

// ======================================================
// INIT
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  iniciarCronometro();
  iniciarTemporizador();
});
