async function registerUser(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const username = document.getElementById('username1').value;
    const firstName = document.getElementById('firstname1').value;
    const lastName = document.getElementById('lastname1').value;
    const password = document.getElementById('password1').value;
    const confirmPassword = document.getElementById('password2').value;
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value, 10);
    const career = document.getElementById('career').value
    const phone = parseInt(document.getElementById('phone').value, 10); 
    const semester = document.getElementById('semester').value

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password,
                
                age: age,
                gender: gender,
                career: career,
                phone: phone,
                semester: semester
            })
            
        });

        console.log({
            username,
            firstName,
            lastName,
            password,
            age,
            gender,
            career,
            phone,
            semester
        });

        if (!response.ok) {
            // Si la respuesta no es OK, lanza un error
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.text();
        alert(result); // Muestra el resultado de la respuesta
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Hubo un problema al registrar el usuario. Inténtalo de nuevo.'); // Mensaje de error para el usuario
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", registerUser);
});




async function loginUser(event) {
    event.preventDefault(); // Evitar el envío del formulario
    const username = document.getElementById('usernamelogin').value;
    const password = document.getElementById('passwordlogin').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('token', result.accessToken);
            console.log('Token almacenado:', result.accessToken);
            window.location.href = result.redirectUrl;
        } else {
            const errorResult = await response.json(); // Obtener el cuerpo de la respuesta de error
            alert('Error: ' + (errorResult.message || 'Ocurrió un error'));
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Tus credenciales son erroneas o no te has registrado aún para continuar');
    }
}


document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", loginUser);
});