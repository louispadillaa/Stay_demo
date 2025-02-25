function logoutUser(){
    localStorage.removeItem('token');
    alert('Has cerrado sesión exitosamente');
    window.location.href = '/app/login';
}

document.getElementById('logout-btn').addEventListener('click, logoutUser');

