document.addEventListener("DOMContentLoaded", async function() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const username = payload.sub || 'Usuario';
            console.log("Username obtenido del token:", username);

            const response = await fetch(`http://localhost:8080/api/alerts/username/${username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las alertas');
            }

            const data = await response.json();
            console.log('Datos recibidos del backend:', data);

            // Verificar la estructura completa de los datos
            data.forEach((alert, index) => {
                console.log(`Estructura de alerta ${index}:`, alert);
                // Verificar si el username está dentro de un objeto 'user'
                console.log('Username dentro de user:', alert.user ? alert.user.username : 'No encontrado');
            });

            // Filtrar alertas por username, ajustando la ruta de acceso si está dentro de un objeto 'user'
            const userAlerts = data.filter(alert => alert.user && alert.user.username === username);

            console.log('Alertas filtradas para el estudiante:', userAlerts);

            displayAlerts(userAlerts);

        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('Token no encontrado');
        alert('No se encontró el token, por favor inicie sesión nuevamente.');
    }
});

function displayAlerts(alerts) {
    const notificationContainer = document.querySelector('.content-noti'); // Cambia el selector si es necesario

    notificationContainer.innerHTML = ''; // Limpiar contenido previo

    if (alerts.length === 0) {
        notificationContainer.innerHTML = '<p>No has presentado notificaciones.</p>';
        return;
    }

    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.classList.add('content-noti');

        alertElement.innerHTML = `
            <div class="header-intro"> 
                <div class="intro-user">
                    <h1> Hola! Queremos informarte. </h1> 
                    <p> Hemos recibido una alerta de tu parte y queremos ayudarte. </p> <br>
                    <h3> Porcentaje de alerta: ${alert.dropoutRate || 'Usuario'}%</h3> 
                    <h3> Fecha: ${alert.alertDate || 'Usuario'}</h3> 
                    <h3> Causa: ${alert.cause || 'Usuario'}</h3> 

                    <p class="text">Queremos que sepas que estamos aquí para apoyarte.
                        Entendemos que las cosas pueden ser difíciles, 
                        pero juntos podemos encontrar soluciones para que sigas adelante.  
                        <br><br><strong>Acércate al centro de atención psicológica de Tecnológico Comfenalco - Barrio España. 
                        Juntos podemos brindarte una solución. Te esperamos.</strong>
                    </p>
                </div>
            </div>
            <hr>
        `;

        notificationContainer.appendChild(alertElement);
    });
}

// Luego llamas a displayAlerts
document.addEventListener('DOMContentLoaded', async function() {
    const alerts = await obtenerAlertas();
    displayAlerts(alerts);
});