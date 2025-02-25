const textArray = ["Hola, yo soy robby.", "Estoy aquí para ayudarte en tus planes.", "Tu satisfacción es nuestra prioridad."];
const textElement = document.getElementById("dynamic-text");
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function type() {
    const currentText = textArray[currentTextIndex];
    
    if (isDeleting) {
        currentCharIndex--;
    } else {
        currentCharIndex++;
    }

    textElement.textContent = currentText.slice(0, currentCharIndex);

    if (!isDeleting && currentCharIndex === currentText.length) {
        // Cambia a borrar después de un tiempo
        setTimeout(() => {
            isDeleting = true;
        }, 1000); // Mantener el texto por 2 segundos
    } else if (isDeleting && currentCharIndex === 0) {
        // Cambiar al siguiente texto después de borrar
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % textArray.length; // Ciclar entre los textos
    }

    const speed = isDeleting ? 40 : 40; // Velocidad al escribir y borrar
    setTimeout(type, speed);
}

// Iniciar el efecto
type();



