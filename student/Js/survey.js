
let questions = []; // Almacenando las preguntas
let currentQuestionIndex = 0; // Índice de la pregunta actual
const progressBar = document.getElementById('progressBar'); // Barra de progreso
const totalProgressWidth = 100; // Progreso en porcentaje (100% al final)
const respuestaAudio = new Audio('/z_audios/done.mp3');

let answers = []; // Para almacenar las respuestas

// Obtener preguntas del backend
async function obtenerPreguntas() {
    try {
        const token = localStorage.getItem('token'); // Obtén el token del localStorage
        const response = await fetch('http://localhost:8080/api/question', {
            method: 'GET', // Método GET para obtener las preguntas
            headers: {
                'Authorization': 'Bearer ' + token, // Agrega el token en el encabezado de autorización
                'Content-Type': 'application/json' // Asegúrate de que el tipo de contenido sea JSON
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las preguntas: ' + response.statusText);
        }

        questions = await response.json(); // Almacena preguntas en la variable global

        if (questions.length > 0) {
            mostrarPregunta(); // Llama a la función que muestra las preguntas
            moverBarraProgreso(); // Inicializa la barra de progreso
        } else {
            console.error('¡En hora buena!');
            row.innerHTML = '<button>Continuar</button>'
        }

    } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        
    }
}


const images = [
    '/z_Images/student1.gif',
    '/z_Images/student2.gif',
    '/z_Images/student3.gif',

    // Añade más imágenes según el número de preguntas
];


// Mostrar la pregunta actual
function mostrarPregunta() {
    const questionElement = document.getElementById('question');
    questionElement.textContent = questions[currentQuestionIndex].question; // Muestra la pregunta actual

    const imageElement = document.querySelector('.questions img');
    imageElement.src = images[currentQuestionIndex % images.length]; 
}

// Avanzar a la siguiente pregunta
function avanzarPregunta() {
    if (questions[currentQuestionIndex]) { // Verificar que la pregunta existe
        const currentAnswer = {
            response: document.getElementById('responseMessage').textContent === "Sí", // Respuesta booleana
            question: {
                questionId: questions[currentQuestionIndex].questionId // Acceder solo si la pregunta existe
            },
        };

        answers.push(currentAnswer);
        currentQuestionIndex++;

        // Verifica si hay más preguntas y muestra el mensaje adecuado
        if (currentQuestionIndex < questions.length) {
            let mensaje;
            if (currentQuestionIndex === questions.length - 1) {
                mensaje = "¡Y por último!";
            } else if (currentQuestionIndex === questions.length - 5) {
                mensaje = "¡El final se acerca!";
            } else if (currentQuestionIndex === questions.length - 8) {
                mensaje = "¡Wow! ya estás por la mitad";
            } else if (currentQuestionIndex === questions.length - 12) {
                mensaje = "Te notas muy concentrado, sigamos";
            } else {
                mensaje = "Muy bien, veamos la siguiente pregunta";
            }
            mostrarDynamicText(mensaje);

            mostrarPregunta();
            moverBarraProgreso(); // Llama a moverBarraProgreso aquí
        } else {
            progressBar.style.width = '100%'; // Llena la barra completamente
            setTimeout(() => {
                guardarRespuestas().then(() => {
                    mostrarVistaAgradecimiento();
                });
            }, 1000); 
        }
    } else {
        console.error("Pregunta no encontrada en el índice", currentQuestionIndex);
    }
}

// Mover la barra de progreso
function moverBarraProgreso() {
    // Calcula el porcentaje de progreso basado en el número total de preguntas
    const progressPercentage = (currentQuestionIndex / questions.length) * totalProgressWidth;
    progressBar.style.width = progressPercentage + '%';
}



///

async function guardarRespuestas() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token en localStorage');
            return;
        }

        // Decodifica el token y extrae el username (subject)
        const decodedToken = jwt_decode(token); // La librería jwt_decode está disponible globalmente
        const username = decodedToken.sub; // El 'sub' es donde guardas el username según tu código en el backend

        if (!username) {
            console.error('No se encontró el username en el token');
            return;
        }

        console.log('Token:', token, 'username:', username);

        // Formatea las respuestas correctamente como el JSON de prueba
        const surveyData = {
            user: {
                username: username
            },
            responses: answers.map(answer => {
                return {
                    question: {
                        questionId: answer.question.questionId
                    },
                    response: answer.response // Asegúrate de que las respuestas sean booleanas
                };
            })
        };

        console.log("surveyData enviado:", surveyData);
        
        const response = await fetch('http://localhost:8080/api/surveys', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(surveyData)
        });

        if (!response.ok) {
            const errorText = await response.text();  // Lee el cuerpo de la respuesta de error
            console.error('Error al enviar las respuestas:', errorText);  // Muestra el error detallado
            throw new Error('Error al enviar las respuestas: ' + errorText);
        }

        console.log('Encuesta enviada correctamente');
    } catch (error) {
        console.error('Error al enviar la encuesta:', error);
    }
}

    




// Función para deshabilitar los botones cuando ya no hay más preguntas
function disableButtons() {
    document.getElementById('yes').disabled = true;
    document.getElementById('no').disabled = true;
}

// Eventos de los botones para las respuestas "Sí" y "No"
document.getElementById('yes').addEventListener('click', () => {
    document.getElementById('responseMessage').textContent = "Sí"; // Captura la respuesta
    respuestaAudio.play(); // Reproduce el audio

    avanzarPregunta(); // Avanza a la siguiente pregunta
});

document.getElementById('no').addEventListener('click', () => {
    document.getElementById('responseMessage').textContent = "No"; // Captura la respuesta
    respuestaAudio.play(); // Reproduce el audio
    avanzarPregunta(); // Avanza a la siguiente pregunta
});

// Inicializar la barra de progreso y cargar las preguntas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    progressBar.style.width = '0%'; // Barra comienza vacía
    obtenerPreguntas(); // Llama a la función al cargar el DOM
});

function mostrarDynamicText(mensaje) {
    const dynamicText = document.querySelector('.dynamic-text');
    const responseMessage = document.getElementById('responseMessage');

    // Configura el mensaje
    responseMessage.textContent = mensaje;

    // Muestra el `dynamic text` con transición
    dynamicText.classList.add('show');

    // Oculta el `dynamic text` después de 2 segundos
    setTimeout(() => {
        dynamicText.classList.remove('show');
    }, 2000);
}

const respuestaFinalAudio = new Audio('/z_audios/win.mp3'); // Ruta del audio final

// Muestra la vista de agradecimiento
function mostrarVistaAgradecimiento() {
    const thankYouView = document.getElementById('thankYouView');
    thankYouView.classList.add('show'); // Aplica la clase para la animación
    respuestaFinalAudio.play(); // Reproduce el audio final
}

// Evento para el botón "Continuar"
document.getElementById('continueButton').addEventListener('click', () => {
    window.location.href = '/Student/home.html'; // Redirige a la página de inicio
});
