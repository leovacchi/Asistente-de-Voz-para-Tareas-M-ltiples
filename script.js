document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const outputDiv = document.getElementById('output');
    const notesList = document.getElementById('notesList');
    const tasksList = document.getElementById('tasksList');
    const financesList = document.getElementById('financesList');
    const balanceOutput = document.getElementById('balanceOutput');
    const balanceChart = document.getElementById('balanceChart');
    const notesListModal = document.getElementById('notesListModal');
    const tasksListModal = document.getElementById('tasksListModal');
    const financesListModal = document.getElementById('financesListModal');
    let recognition;
    let userName = localStorage.getItem('userName') || '';
  
    // Función para iniciar el reconocimiento de voz
    function startRecognition() {
      outputDiv.textContent = 'Escuchando...';
      recognition.start();
    }
  
    // Función para guardar una nota en localStorage
    function saveNote(note) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.push(note);
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    }
  
    // Función para renderizar las notas en la interfaz
    function renderNotes() {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      notesList.innerHTML = '';
      notes.forEach((note, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${note}`;
        notesList.appendChild(listItem);
      });
      renderNotesModal();
    }
  
    // Función para eliminar una nota
    function deleteNote(index) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.splice(index, 1);
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    }
  
    // Función para guardar una tarea en localStorage
    function saveTask(task) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  
    // Función para renderizar las tareas en la interfaz
    function renderTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasksList.innerHTML = '';
      tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${task}`;
        tasksList.appendChild(listItem);
      });
      renderTasksModal();
    }
  
    // Función para eliminar una tarea
    function deleteTask(index) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  
    // Función para guardar un registro financiero en localStorage
    function saveFinance(finance) {
      let finances = JSON.parse(localStorage.getItem('finances')) || [];
      finances.push(finance);
      localStorage.setItem('finances', JSON.stringify(finances));
      renderFinances();
    }
  
    // Función para renderizar los registros financieros en la interfaz
    function renderFinances() {
      const finances = JSON.parse(localStorage.getItem('finances')) || [];
      financesList.innerHTML = '';
      finances.forEach((finance, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${finance}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => deleteFinance(index));
        listItem.appendChild(deleteButton);
        financesList.appendChild(listItem);
      });
      renderFinancesModal();
      renderBalanceModal();
      renderBalanceChart();
    }
  
    // Función para eliminar un registro financiero
    function deleteFinance(index) {
      let finances = JSON.parse(localStorage.getItem('finances')) || [];
      finances.splice(index, 1);
      localStorage.setItem('finances', JSON.stringify(finances));
      renderFinances();
    }
  
    // Función para ejecutar comandos
    function executeCommand(command) {
      if (command.includes('computadora')) {
        outputDiv.textContent = `¡Hola ${userName}! ¿En qué puedo ayudarte?`;
        startRecognition(); // Iniciar el reconocimiento de voz después de la respuesta de audio
      } else if (command.includes('tomar nota')) {
        const note = command.replace('tomar nota', '').trim();
        if (note !== '') {
          saveNote(note);
        }
      } else if (command.includes('anotar tarea')) {
        const task = command.replace('anotar tarea', '').trim();
        if (task !== '') {
          saveTask(task);
        }
      } else if (command.includes('calcular gastos')) {
        // Lógica para calcular gastos
        outputDiv.textContent += '\nGastos calculados.';
      } else if (command.includes('agendar cita')) {
        // Lógica para agendar cita
        outputDiv.textContent += '\nCita agendada.';
      } else if (command.includes('registrar ingreso')) {
        const income = command.replace('registrar ingreso', '').trim();
        if (income !== '') {
          saveFinance(`Ingreso: ${income}`);
        }
      } else if (command.includes('registrar gasto')) {
        const expense = command.replace('registrar gasto', '').trim();
        if (expense !== '') {
          saveFinance(`Gasto: ${expense}`);
        }
      } else {
        outputDiv.textContent += `\nComando no reconocido: ${command}`;
      }
    }
  
    // Función para renderizar las notas en el modal
    function renderNotesModal() {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      notesListModal.innerHTML = '';
      notes.forEach((note, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${note}`;
        notesListModal.appendChild(listItem);
      });
    }
  
    // Función para renderizar las tareas en el modal
    function renderTasksModal() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasksListModal.innerHTML = '';
      tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${task}`;
        tasksListModal.appendChild(listItem);
      });
    }
  
    // Función para renderizar las finanzas en el modal
    function renderFinancesModal() {
      const finances = JSON.parse(localStorage.getItem('finances')) || [];
      financesListModal.innerHTML = '';
      finances.forEach((finance, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${finance}`;
        financesListModal.appendChild(listItem);
      });
    }
  
    // Función para renderizar el balance en el modal
    function renderBalanceModal() {
      const finances = JSON.parse(localStorage.getItem('finances')) || [];
      const balance = calculateBalance(finances);
      balanceOutput.textContent = `Balance actual: ${balance}`;
    }
  
    // Función para calcular el balance
    function calculateBalance(finances) {
      let totalIncome = 0;
      let totalExpense = 0;
  
      finances.forEach((finance) => {
        if (finance.startsWith('Ingreso')) {
          totalIncome += parseFloat(finance.split(':')[1].trim()) || 0;
        } else if (finance.startsWith('Gasto')) {
          totalExpense += parseFloat(finance.split(':')[1].trim()) || 0;
        }
      });
  
      return totalIncome - totalExpense;
    }
  
    // Función para renderizar el gráfico de balance
    function renderBalanceChart() {
      const finances = JSON.parse(localStorage.getItem('finances')) || [];
      const dates = [];
      const balances = [];
  
      let runningBalance = 0;
  
      finances.forEach((finance) => {
        const date = new Date();
        dates.push(`${date.getDate()}/${date.getMonth() + 1}`);
        if (finance.startsWith('Ingreso')) {
          runningBalance += parseFloat(finance.split(':')[1].trim()) || 0;
        } else if (finance.startsWith('Gasto')) {
          runningBalance -= parseFloat(finance.split(':')[1].trim()) || 0;
        }
        balances.push(runningBalance);
      });
  
      const ctx = balanceChart.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Balance a lo largo del tiempo',
            data: balances,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
            },
            y: {
              type: 'linear',
              position: 'left',
            },
          },
        },
      });
    }
  
    // Inicializar el reconocimiento de voz
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
  
    // Cargar y renderizar notas, tareas y finanzas al cargar la página
    renderNotes();
    renderTasks();
    renderFinances();
    renderBalanceChart();
  });
  