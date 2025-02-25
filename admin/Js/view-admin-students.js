//CONSUMO DE API PARA MOSTRAR ESTUDIANTES

document.addEventListener("DOMContentLoaded", async function() {
    // Obtén el token JWT del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            // Realiza la solicitud al backend para obtener los usuarios
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }

            const data = await response.json();  // Convierte la respuesta en JSON
            
            // Imprime los datos en la consola para ver qué se está recibiendo
            console.log('Datos recibidos del backend:', data);

            // Filtrar solo los usuarios con rol "STUDENT"
            const students = data.filter(user => 
                user.roles.length > 0 && user.roles[0].roleName === 'STUDENT'
            );

            console.log('Usuarios filtrados (STUDENT):', students); // Verificar el resultado del filtrado

            displayUsers(students);  // Muestra solo los estudiantes en la tabla

        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('Token no encontrado');
    }
});

// Función para mostrar los usuarios en la tabla HTML
function displayUsers(users) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Limpia la tabla antes de mostrar los nuevos datos

    // Asegúrate de que estás iterando sobre un array de usuarios
    if (Array.isArray(users)) {
        users.forEach(user => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.userId || 'Sin ID'}</td>
                <td>${user.firstName || 'Sin nombre'}</td>
                <td>${user.lastName || 'Sin apellido'}</td>
                <td>${user.age || 'Sin edad'}</td>
                <td>${user.gender || 'Sin género'}</td>
                <td>${user.career || 'Sin carrera'}</td>
                <td>${user.semester || 'Sin semestre'}</td>
                <td>${user.phone || 'Sin telefono'}</td>

            `;
            
            tbody.appendChild(row);
        });
    } else {
        console.log('La respuesta no es un array de usuarios.');
    }
}



//FILTRO DE ESTUDIANTES 

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



