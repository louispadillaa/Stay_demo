document.addEventListener("DOMContentLoaded", async function() {
    // Obtén el token JWT del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            // Realiza la solicitud al backend para obtener las alertas
            const response = await fetch('http://localhost:8080/api/alerts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las alertas');
            }

            const data = await response.json(); // Convierte la respuesta en JSON
            
            console.log('Datos recibidos del backend:', data); // Para verificar

            // Filtrar solo las alertas con rol "STUDENT" en el usuario
            const studentsAlerts = data.filter(alert => 
                alert.survey.user.roles.some(role => role.roleName === 'STUDENT')
            );

            console.log('Alertas filtradas para estudiantes:', studentsAlerts); // Verificar el resultado del filtrado

            displayUsers(studentsAlerts);  // Muestra solo las alertas de estudiantes en la tabla
            // Ya no es necesario displayDescriptions, porque ahora se maneja dinámicamente

        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('Token no encontrado');
    }
});

// Función para mostrar las alertas en la tabla HTML
function displayUsers(alerts) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Limpia la tabla antes de mostrar los nuevos datos

    // Asegúrate de que estás iterando sobre un array de alertas
    if (Array.isArray(alerts)) {
        alerts.forEach((alert, index) => {
            const user = alert.survey.user;  // Datos del usuario dentro de la alerta
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.userId || 'Sin ID'}</td>
                <td>${user.firstName || 'Sin nombre'}</td>
                <td>${user.lastName || 'Sin apellido'}</td>
                <td>${user.age || 'Sin edad'}</td>
                <td>${user.gender || 'Sin género'}</td>
                <td>${user.career || 'Sin carrera'}</td>
                <td>${user.semester || 'Sin semestre'}</td>
                <td>${alert.cause || 'Sin causa'}</td>
                <td>${alert.dropoutRate}%</td>
                <td>${alert.alertDate || 'Sin fecha'}</td>
                <td>
                    <button class="view-table" data-index="${index}">Ver</button>
                </td>

                <td>
                    <a class="link-permanence" href="/admin/permanence.html">Aplica </a>
                </td>


            `;
            
            tbody.appendChild(row);
        });

        // Ahora agregamos el event listener a los botones después de que se generen las filas
        const viewButtons = document.querySelectorAll('.view-table');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');  // Obtiene el índice desde el atributo "data-index"
                viewAlert(index, alerts);  // Llamamos a la función viewAlert pasando el índice
            });
        });
    } else {
        console.log('La respuesta no es un array de alertas.');
    }
}

// Función que se ejecuta cuando se presiona el botón "Ver"
function viewAlert(index, alerts) {
    // Verificar que el arreglo 'alerts' exista y tenga elementos
    if (alerts && alerts.length > 0 && alerts[index]) {
        const alert = alerts[index]; // Obtener la alerta correspondiente al índice
        const descriptionDiv = document.getElementById('alert-description');
        
        // Limpiar el contenido anterior
        descriptionDiv.innerHTML = '';

        // Crear el título y la descripción
        const title = document.createElement('h3');
        title.classList.add('alert-title');
        title.textContent = 'Descripción de alerta';
        descriptionDiv.appendChild(title);

        const descriptionItem = document.createElement('p');
        descriptionItem.classList.add('alert-description-item');
        descriptionItem.textContent = alert.description; // Mostrar la descripción
        descriptionDiv.appendChild(descriptionItem);

        // Mostrar la ventana emergente
        document.getElementById('detailAlert').classList.add('active');
    } else {
        console.error('No se pudo acceder a la alerta. Verifica el índice o los datos.');
    }
}

// Función para cerrar la ventana emergente
function closeAlert() {
    document.getElementById('detailAlert').classList.remove('active');
}

document.querySelectorAll('.apply-btn').forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = '/admin/permanence.html';
    });
});




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



