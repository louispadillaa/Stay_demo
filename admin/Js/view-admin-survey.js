document.addEventListener("DOMContentLoaded", async function() {
    await loadQuestions();  // Llamamos a la función para cargar las preguntas
});

// Función para obtener todas las preguntas desde el backend y mostrarlas en la tabla
async function loadQuestions() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch("http://localhost:8080/api/question", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const questions = await response.json();
            const tableBody = document.getElementById("studentTableBody");
            tableBody.innerHTML = ""; // Limpiar tabla antes de cargar las preguntas

            if (Array.isArray(questions)) {
                questions.forEach((question) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="question-table">${question.question || 'Sin pregunta'}</td>
                        <td>${question.category || 'Sin categoría'}</td>
                        <td><button class="edit-btn" onclick="editQuestion(${question.id})">Editar</button></td>
                    
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('La respuesta no es un array de preguntas');
            }
        } catch (error) {
            console.error('Error al cargar las preguntas:', error);
        }
    } else {
        console.log('Token no encontrado');
    }
}

// Función para editar una pregunta (abre el modal)
function editQuestion(questionId) {
    const questionText = prompt("Editar pregunta: ");
    const category = prompt("Editar categoría: ");
    
    if (questionText && category) {
        saveQuestion(questionId, questionText, category);
    }
}

// Función para eliminar una pregunta
async function deleteQuestion(questionId) {
    try {
        const response = await fetch(`http://localhost:8080/api/question/${questionId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Pregunta eliminada');
            await loadQuestions(); // Recargar preguntas después de eliminar
        } else {
            console.error('Error al eliminar la pregunta');
        }
    } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
    }
}

// Función para guardar o actualizar una pregunta
async function saveQuestion(questionId = null, questionText, category) {
    const question = { question: questionText, category };

    if (questionId) {
        // Actualizar pregunta existente
        const response = await fetch(`http://localhost:8080/api/question/${questionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        });

        if (response.ok) {
            console.log('Pregunta actualizada');
        }
    } else {
        // Crear nueva pregunta
        const response = await fetch("http://localhost:8080/api/question", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        });

        if (response.ok) {
            console.log('Pregunta creada');
        }
    }

    await loadQuestions(); // Recargar las preguntas después de guardar
}


function filterTable() {
    // Obtener el valor del input de búsqueda
    const searchInput = document.querySelector('input[name="query"]');
    const filter = searchInput.value.toLowerCase();

    // Obtener el cuerpo de la tabla
    const tableBody = document.getElementById('studentTableBody');
    
    // Obtener el contenedor del mensaje de "sin resultados"
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Obtener todas las filas del tbody
    const rows = tableBody.getElementsByTagName('tr');
    let anyMatchFound = false; // Variable para verificar si se encontró alguna coincidencia

    // Iterar a través de todas las filas y ocultar las que no coincidan con la búsqueda
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // Obtener las celdas de la fila
        const cells = row.getElementsByTagName('td');
        let matchFound = false;

        // Iterar a través de las celdas de la fila
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell) {
                // Comprobar si el texto de la celda incluye el valor de búsqueda
                if (cell.textContent.toLowerCase().includes(filter)) {
                    matchFound = true;
                    break;
                }
            }
        }

        // Mostrar u ocultar la fila dependiendo de si se encontró una coincidencia
        row.style.display = matchFound ? '' : 'none';

        // Verificar si se encontró al menos una coincidencia
        if (matchFound) {
            anyMatchFound = true;
        }
    }

    // Mostrar o ocultar el mensaje de "sin resultados"
    noResultsMessage.style.display = anyMatchFound ? 'none' : 'block';
}
