
// Espera a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", function() {
    // Obtén el token de localStorage cuando la página esté lista
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No se encontró el token en localStorage');
        alert('No estás autenticado');
        return; // Si no hay token, no se hace nada más
    }

    // Decodificar el token para obtener el username
    const decodedToken = jwt_decode(token);
    const username = decodedToken.sub; // Suponiendo que 'sub' contiene el username (esto depende de cómo tu backend emita el token)

    // Llamar a la función para actualizar el contenido y obtener las encuestas
    updateContent(username, token);
});

function updateContent(username, token) {
    // Solicitar las encuestas
    fetchSurveys(username, token);
}

// Función para obtener las encuestas

async function fetchSurveys(username, token) {
    try {
        const response = await fetch(`http://localhost:8080/api/surveys/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const surveys = await response.json();
            console.log('Encuestas obtenidas: ', surveys);
            displaySurveys(surveys);
        } else {
            throw new Error('Error al obtener las encuestas');
        }
    } catch (error) {
        console.error(error.message);
        
    }
}

// Función para mostrar las encuestas en la interfaz
function displaySurveys(surveys) {
    const surveyContainer = document.querySelector('.section-survey');
    
    // Limpiar contenido previo
    surveyContainer.innerHTML = '';

    surveys.forEach(survey => {
        console.log(survey);
        const surveyElement = document.createElement('div');
        surveyElement.classList.add('survey');
        
        // Agregar el SVG y el botón para cada encuesta
        surveyElement.innerHTML = `
          
            <svg class="image-survey" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <button class="open-survey" style="display:none;" onclick="openSurvey(${survey.surveyId})"></button>
            

        `;

        // Añadir un listener para el clic en el SVG
        const svgElement = surveyElement.querySelector('svg');
        svgElement.addEventListener('click', () => {
            console.log('ID de encuesta:', survey.surveyId);
            openSurvey(survey.surveyId);
        });

        // Añadir el elemento de encuesta al contenedor
        surveyContainer.appendChild(surveyElement);
    });
}

// Función para obtener la fecha de la encuesta y mostrarla
function openSurvey(surveyId) {
    console.log('Abriendo encuesta con ID:', surveyId);

    // Obtener el token desde localStorage
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté guardado correctamente

    if (!token) {
        console.error('No se ha encontrado el token de autenticación');
        return;
    }

    if (!surveyId) {
        console.error('El ID de la encuesta no es válido');
        return;
    }

    // Llamada a la API para obtener los detalles de la encuesta
    fetch(`http://localhost:8080/api/surveys/surveys/${surveyId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Encuesta no encontrada');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de la encuesta:', data);
            const infoContainer = document.querySelector('.content-aside .info');
    
            // Mostrar solo la fecha de la encuesta (surveyDate)
            infoContainer.innerHTML = `
                <div>
                    <div class="figure"> 
                        <svg class="image-survey img-figure" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                    </div>
                    
                </div> 

                <div class="text"> 
                    <div class="inline-content">
                        <h3>ID Encuesta:</h3>
                        <p>${data.surveyId}</p>
                    </div>
                        <h3 >Fecha de la Encuesta:</h3>
                        <p>${data.surveyDate}</p>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al obtener la encuesta:', error);
            alert('Error al obtener los detalles de la encuesta');
        });
}


