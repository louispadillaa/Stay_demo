const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

// Recuperar tareas desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(savedTasks);
});

// Manejar el envío del formulario
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const program = document.getElementById('program').value;

    // Crear el objeto tarea
    const newTask = { name, description, date, program };

    // Guardar tarea en localStorage
    saveTaskToLocalStorage(newTask);

    // Actualizar la visualización
    renderTasks(JSON.parse(localStorage.getItem('tasks')));

    // Limpiar formulario
    taskForm.reset();
});

// Guardar tarea en localStorage
function saveTaskToLocalStorage(task) {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

// Eliminar tarea de localStorage
function removeTaskFromLocalStorage(taskToRemove) {
    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks = savedTasks.filter(task =>
        task.name !== taskToRemove.name ||
        task.description !== taskToRemove.description ||
        task.date !== taskToRemove.date ||
        task.program !== taskToRemove.program
    );
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

// Renderizar tareas en la lista visual
function renderTasks(tasks) {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p>No hay estudiantes en permanencia.</p>';
        return;
    }

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <h4>${task.name}</h4>
            <p><strong>Descripción:</strong> ${task.description}</p>
            <p><strong>Fecha:</strong> ${task.date}</p>
            <p><strong>Plan de permanencia:</strong> ${task.program}</p>
            <button class="remove-btn">Eliminar</button>
        `;

        // Añadir evento para eliminar la tarea
        taskItem.querySelector('.remove-btn').addEventListener('click', () => {
            removeTaskFromLocalStorage(task);
            renderTasks(JSON.parse(localStorage.getItem('tasks')));
        });

        taskList.appendChild(taskItem);
    });
}

// Filtrar estudiantes según la búsqueda
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Filtrar tareas que coincidan con el nombre buscado
    const filteredTasks = savedTasks
        .filter(task => task.name.toLowerCase().startsWith(query))
        .concat(savedTasks.filter(task => task.name.toLowerCase().includes(query) && !task.name.toLowerCase().startsWith(query)));

    renderTasks(filteredTasks);
});
