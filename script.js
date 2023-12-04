document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const outputDiv = document.getElementById('output');
    const notesList = document.getElementById('notesList');
    const tasksList = document.getElementById('tasksList');
    const financesList = document.getElementById('financesList');
    const balanceOutput = document.getElementById('balanceOutput');
    const balanceChart = document.getElementById('balanceChart').getContext('2d');
    let recognition;
  
    let userName = localStorage.getItem('userName');
    if (!userName) {
      userName = prompt('Por favor, ingresa tu nombre:');
      localStorage.setItem('userName', userName);
    }
  
    let balance = 0;
    let finances = JSON.parse(localStorage.getItem('finances')) || [];
    updateBalance();
  
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
  
    function saveFinance(finance) {
      finances.push(finance);
      localStorage.setItem('finances', JSON.stringify(finances));
      updateBalance();
      renderFinances();
      renderBalanceChart();
    }
  
    function updateBalance() {
      balance = finances.reduce((total, finance) => {
        const amount = parseFloat(finance.split(': ')[1]) || 0;
        return total + amount;
      }, 0);
      balanceOutput.textContent = `Balance: $${balance.toFixed(2)}`;
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
  
    function renderFinances() {
      const finances = JSON.parse(localStorage.getItem('finances')) || [];
      financesList.innerHTML = '';
      finances.forEach(renderFinance);
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
  
    function renderFinance(finance, index) {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${finance}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => deleteFinance(index));
      listItem.appendChild(deleteButton);
      financesList.appendChild(listItem);
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
  
    function deleteFinance(index) {
      finances.splice(index, 1);
      localStorage.setItem('finances', JSON.stringify(finances));
      updateBalance();
      renderFinances();
      renderBalanceChart();
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
      } else if (command.includes('registrar gasto')) {
        const expense = command.replace('registrar gasto', '').trim();
        if (expense !== '') {
          saveFinance(`Gasto: $${parseFloat(expense).toFixed(2)}`);
        }
      } else if (command.includes('registrar ingreso')) {
        const income = command.replace('registrar ingreso', '').trim();
        if (income !== '') {
          saveFinance(`Ingreso: $${parseFloat(income).toFixed(2)}`);
        }
      } else if (command.includes('ver notas')) {
        renderNotes();
        const notesModal = new bootstrap.Modal(document.getElementById('notesModal'));
        notesModal.show();
      } else if (command.includes('ver tareas')) {
        renderTasks();
        const tasksModal = new bootstrap.Modal(document.getElementById('tasksModal'));
        tasksModal.show();
      } else if (command.includes('ver finanzas')) {
        renderFinances();
        const financesModal = new bootstrap.Modal(document.getElementById('financesModal'));
        financesModal.show();
      } else if (command.includes('ver balance')) {
        speak(`Tu balance actual es de $${balance.toFixed(2)}`);
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
  
    function renderBalanceChart() {
      const labels = finances.map((finance, index) => `Transacción ${index + 1}`);
      const amounts = finances.map(finance => parseFloat(finance.split(': ')[1]) || 0);
  
      new Chart(balanceChart, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Balance a lo largo del tiempo',
            data: amounts,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
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
  
    renderNotes();
    renderTasks();
    renderFinances();
    renderBalanceChart();
  });
  