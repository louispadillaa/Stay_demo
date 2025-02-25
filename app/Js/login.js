const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider() {
  let index = this.dataset.value;

  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");
}

bullets.forEach((bullet) => {
  bullet.addEventListener("click", moveSlider);
});


document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('.image');
  const bullets = document.querySelectorAll('.bullets span');
  const titles = document.querySelectorAll('.text-group h2'); // Seleccionamos los títulos
  let currentIndex = 0;
  const intervalTime = 7000; // Tiempo en milisegundos para cambiar de imagen automáticamente
  
  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.remove('show');
      bullets[i].classList.remove('active');
      titles[i].classList.remove('show-title'); // Removemos la clase de título visible
    });
    images[index].classList.add('show');
    bullets[index].classList.add('active');
    titles[index].classList.add('show-title'); // Mostramos el título correspondiente
    currentIndex = index;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  let interval = setInterval(nextImage, intervalTime);

  bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => {
      clearInterval(interval);
      showImage(index);
      interval = setInterval(nextImage, intervalTime);
    });
  });

  // Inicializa el primer slide
  showImage(currentIndex);
});





document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');

  menuToggle.addEventListener('click', function () {
    mobileMenu.style.display = 'block';
  });

  closeMenu.addEventListener('click', function () {
    mobileMenu.style.display = 'none';
  });

  // Close the menu if clicking outside
  document.addEventListener('click', function (event) {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      mobileMenu.style.display = 'none';
    }
  });
});