const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
let efeitoAtivo = false;
const botao = document.getElementById('ativar-pata');

document.getElementById('cor').addEventListener('input', function() {
  document.body.style.backgroundColor = this.value;
});

document.getElementById('imagem').addEventListener('input', function () {
  const url = this.value.trim();
  if (url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  }
});

document.getElementById('imagemUpload').addEventListener('change', function () {
  const file = this.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.body.style.backgroundImage = `url('${e.target.result}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
  };
  reader.readAsDataURL(file);
});


botao.addEventListener('click', () => {
  efeitoAtivo = !efeitoAtivo;
  botao.textContent = efeitoAtivo ? '❌ Desativar Pata' : '🐾 Ativar Pata';

  if (!efeitoAtivo) {
    document.querySelectorAll('.pata').forEach(el => el.remove());
  }
});

document.addEventListener('click', function (event) {
  if (!efeitoAtivo || event.target === botao) return;

  const img = document.createElement('img');
  img.src = './img/ChatGPT Image 30 de mai. de 2025, 22_19_39.png';
  img.className = 'pata';
  img.style.left = `${event.pageX}px`;
  img.style.top = `${event.pageY}px`;
  document.body.appendChild(img);
});

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

function iniciarCronometro() {
  const dataInicial = new Date(2025, 0, 14, 1, 4, 0);

  function atualizarCronometro() {
    const agora = new Date();
    let diffMs = agora - dataInicial;

    if (diffMs < 0) {
      document.getElementById("cronometro").textContent = "Ainda não começou.";
      return;
    }

    let segundos = Math.floor(diffMs / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);

    segundos %= 60;
    minutos %= 60;
    horas %= 24;

    let dataParcial = new Date(dataInicial.getTime());
    dataParcial.setDate(dataParcial.getDate() + dias);

    let anos = dataParcial.getFullYear() - dataInicial.getFullYear();
    let meses = dataParcial.getMonth() - dataInicial.getMonth();

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    dias = dataParcial.getDate() - dataInicial.getDate();
    if (dias < 0) {
      meses--;
      const mesAnterior = new Date(dataParcial.getFullYear(), dataParcial.getMonth(), 0).getDate();
      dias += mesAnterior;
      if (meses < 0) {
        anos--;
        meses += 12;
      }
    }

    document.getElementById("cronometro").textContent =
      `${anos} anos, ${meses} meses, ${dias} dias, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
  }

  setInterval(atualizarCronometro, 1000);
  atualizarCronometro();
}

iniciarCronometro();
