document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const outputDiv = document.getElementById('output');
    const notesList = document.getElementById('notesList');
    const tasksList = document.getElementById('tasksList');
    let recognition;
  
    let userName = localStorage.getItem('userName');
    if (!userName) {
      userName = prompt('Por favor, ingresa tu nombre:');
      localStorage.setItem('userName', userName);
    }
  
    function startRecognition() {
      outputDiv.textContent = `Hola, ${userName}! ¿En qué puedo ayudarte?`;
      recognition.start();
    }
  
    function saveNote(note) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.push(note);
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    }
  
    function saveTask(task) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  
    function renderNotes() {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      notesList.innerHTML = '';
      notes.forEach(renderNote);
    }
  
    function renderTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasksList.innerHTML = '';
      tasks.forEach(renderTask);
    }
  
    function renderNote(note, index) {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${note}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => deleteNote(index));
      listItem.appendChild(deleteButton);
      notesList.appendChild(listItem);
    }
  
    function renderTask(task, index) {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${task}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => deleteTask(index));
      listItem.appendChild(deleteButton);
      tasksList.appendChild(listItem);
    }
  
    function deleteNote(index) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    }
  
    function deleteTask(index) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  
    function executeCommand(command) {
      if (command.includes('computadora')) {
        speak(`¡Hola ${userName}! ¿En qué puedo ayudarte?`);
        startRecognition();
      } else if (command.includes('tomar nota')) {
        const note = command.replace('tomar nota', '').trim();
        if (note !== '') {
          saveNote(note);
        }
      } else if (command.includes('anotar tarea para hoy')) {
        const task = command.replace('anotar tarea para hoy', '').trim();
        if (task !== '') {
          saveTask(task);
        }
      } else if (command.includes('ver tareas')) {
        renderTasks();
        // Mostrar el modal de tareas
        const tasksModal = new bootstrap.Modal(document.getElementById('tasksModal'));
        tasksModal.show();
      } else if (command.includes('ver notas')) {
        renderNotes();
        // Mostrar el modal de notas
        const notesModal = new bootstrap.Modal(document.getElementById('notesModal'));
        notesModal.show();
      } else if (command.includes('calcular gastos')) {
        outputDiv.textContent += '\nGastos calculados.';
      } else if (command.includes('agendar cita')) {
        outputDiv.textContent += '\nCita agendada.';
      } else {
        outputDiv.textContent += `\nComando no reconocido: ${command}`;
      }
    }
  
    function speak(text) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      synth.speak(utterance);
    }
  
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;
  
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        outputDiv.textContent = `Comando reconocido: ${result}`;
        executeCommand(result);
      };
  
      recognition.onerror = (event) => {
        outputDiv.textContent = `Error en el reconocimiento de voz: ${event.error}`;
      };
  
      startButton.addEventListener('click', startRecognition);
    } else {
      outputDiv.textContent = 'El reconocimiento de voz no es compatible con este navegador.';
    }
  
    // Cargar y renderizar notas y tareas al cargar la página
    renderNotes();
    renderTasks();
  });
  