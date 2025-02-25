
document.getElementById('logout-btn').addEventListener('click', function() {
    // Eliminar el token de localStorage
    localStorage.removeItem('token');
    
    // Redirigir a la página de inicio de sesión
    window.location.href = 'http://127.0.0.1:5500/App/index.html';
});