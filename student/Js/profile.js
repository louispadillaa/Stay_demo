document.addEventListener("DOMContentLoaded", async () => {
    // Obtén el token JWT del localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Token no encontrado en el localStorage.');
        return;
    }

    try {
        // Decodificar el token para obtener el username (desde el atributo "sub")
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub;

        if (!username) {
            console.error('No se encontró el username en el token.');
            return;
        }

        console.log(`Usuario identificado: ${username}`); // Verificar el username

        // Realiza la solicitud al backend para obtener el perfil del usuario
        const response = await fetch(`http://localhost:8080/api/users/profile/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el perfil del usuario.');
        }

        const user = await response.json();

        // Mostrar datos en la vista HTML
        document.getElementById('student-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('student-career').textContent = user.career || 'No especificada';

        document.getElementById('student-phone').textContent = user.phone || 'No especificado';
        document.getElementById('student-semester').textContent = user.semester || 'No especificado';
        document.getElementById('student-gender').textContent = user.gender || 'No especificado';
        document.getElementById('student-age').textContent = user.age || 'No especificada';
        console.log(user.gender); 
        const avatarImage = document.getElementById('avatar');
            if (user.gender === 'Femenino' || user.gender === 'Female') {
    avatarImage.src = '../z_Images/profile-female.png';  // Asegúrate de usar la ruta correcta
    } else if (user.gender === 'Masculino' || user.gender === 'Male') {
    avatarImage.src = '../z_Images/profile-male.png';
    } else {
    avatarImage.src = '../z_Images/profile-default.png';  // Imagen por defecto
    }

        
        
    } catch (error) {
        console.error('Error al procesar los datos del usuario:', error);
    }
});
