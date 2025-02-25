document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Eliminar el token de localStorage
            localStorage.removeItem('token');
            
            // Redirigir a la página de inicio de sesión
            window.location.href = 'http://127.0.0.1:5500/App/index.html';
        });
    } else {
        console.error('El botón de logout no se encuentra en el DOM');
    }
});