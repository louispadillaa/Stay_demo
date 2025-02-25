document.getElementById('sendButton').addEventListener('click', sendMessage);

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const pregunta = userInput.value.trim();  // Tomamos el mensaje del usuario

    // Si el campo está vacío, no hacemos nada
    if (!pregunta) {
        alert('Por favor, escribe algo.');
        return;
    }

    // Crear y mostrar el mensaje del usuario
    const messagesContainer = document.getElementById('messages');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('user-message');
    userMessageDiv.textContent = pregunta;
    messagesContainer.appendChild(userMessageDiv);

    // Desplazar el contenedor para ver el último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Hacer la solicitud al chatbot para obtener la respuesta
    const url = `https://magicloops.dev/api/loop/c1690267-758b-4d50-9d79-3fd4ec6ab413/run?pregunta=${encodeURIComponent(pregunta)}`;

    console.log('Enviando solicitud a la API...');
    console.log(`URL de solicitud: ${url}`);

    try {
        const response = await fetch(url);  // Esperamos la respuesta de la API
        console.log('Respuesta de la API:', response);

        if (!response.ok) {
            throw new Error('No se pudo obtener una respuesta de la API');
        }

        const data = await response.json();  // Parseamos la respuesta como JSON
        console.log('Datos recibidos de la API:', data);

        // Asegurémonos de que la respuesta contiene el texto correcto
        const respuesta = data.answer || data; // Si no tiene "answer", tomamos todo el objeto (puede ser texto directo)

        // Crear el contenedor del mensaje del bot
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('bot-message');
        messagesContainer.appendChild(botMessageDiv); // Lo agregamos antes de mostrar el texto

        // Llamamos a la función para escribir la respuesta palabra por palabra
        typeWriterEffect(botMessageDiv, respuesta);

        // Desplazar el contenedor para ver el último mensaje
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Limpiar el campo de entrada
        userInput.value = '';
    } catch (error) {
        console.error('Error al obtener la respuesta:', error);
        alert('Hubo un error al intentar obtener la respuesta.');
    }
}

// Función para crear el efecto de máquina de escribir
function typeWriterEffect(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text.charAt(index); // Agregar una letra a la vez
        index++;
        setTimeout(() => typeWriterEffect(element, text, index), 20); // Ajusta el tiempo para velocidad
    }
}
