document.addEventListener("DOMContentLoaded", async function () {
    // Obtén el token JWT del localStorage
    const token = localStorage.getItem('token');

    if (token) {
        try {
            // Decodificar el token
            const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica la parte payload
            console.log("Payload del token:", payload); // Verifica qué campos contiene

            // Intenta obtener el username del payload
            const username = payload.username || payload.sub || 'Usuario no identificado'; 
            // Puedes ajustar las claves según lo que encuentres en el payload

            // Mostrar el username en el div intro-user
            const introUserDiv = document.querySelector('.intro-user h1');
            if (introUserDiv) {
                introUserDiv.textContent = username;
            }

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

            const data = await response.json(); // Convierte la respuesta en JSON
            
            // Imprime los datos en la consola para ver qué se está recibiendo
            console.log('Datos recibidos del backend:', data);

            // Filtrar solo los usuarios con rol "STUDENT"
            const students = data.filter(user => 
                user.roles.length > 0 && user.roles[0].roleName === 'STUDENT'
            );

            console.log('Usuarios filtrados (STUDENT):', students); // Verificar el resultado del filtrado

            displayUsers(students); // Muestra solo los estudiantes en la tabla

        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('Token no encontrado');
        const introUserDiv = document.querySelector('.intro-user h1');
        if (introUserDiv) {
            introUserDiv.textContent = 'Token no encontrado';
        }
    }
});