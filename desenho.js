const input = document.getElementById('upload');
  const preview = document.getElementById('preview');

  const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}


  input.addEventListener('change', function () {
    const file = input.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '300px';
        img.style.display = 'block';
        preview.innerHTML = ''; // limpa imagens anteriores
        preview.appendChild(img);
      };

      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = '<p>Por favor, selecione um arquivo de imagem válido.</p>';
    }
  });