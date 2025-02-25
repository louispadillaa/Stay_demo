let scrollTriggered = false;
let lastScrollTop = 0; // Para evitar que se muestren demasiadas secciones de una vez

// Detecta el scroll y activa las animaciones
window.addEventListener('scroll', function () {
    let contentSections = document.querySelectorAll('.content');
    let progressBar = document.querySelector('.progress');
    
    // Mide el progreso del scroll
    let scrollPosition = window.scrollY;
    let documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    let scrollProgress = (scrollPosition / documentHeight) * 100;
    progressBar.style.width = scrollProgress + '%';

    // Verifica la dirección del scroll
    let scrollDirection = scrollPosition > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition; // Evitar que el valor sea negativo

    // Animación de las secciones cuando se vean en el scroll
    contentSections.forEach(function (section, index) {
        let sectionPosition = section.getBoundingClientRect().top; // Distancia de la sección desde el top de la ventana
        let screenPosition = window.innerHeight / 1.5; // Umbral de visibilidad (cuando la sección está cerca del centro)

        // Solo añadir clase visible si la sección está cerca de la vista y la dirección del scroll es hacia abajo
        if (sectionPosition < screenPosition && sectionPosition > 0 && !section.classList.contains('visible') && scrollDirection === 'down') {
            section.classList.add('visible');
        }
    });

    // Desaparece el mensaje de bienvenida después del primer scroll
    if (!scrollTriggered && scrollPosition > 50) {
        scrollTriggered = true;
        let introMessage = document.getElementById('introMessage');
        introMessage.classList.add('hide');
    }
});
