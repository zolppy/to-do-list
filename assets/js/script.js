const addTaskButton = document.querySelector('#add-button');
const tasksContainer = document.querySelector('#tasks-wrap');
const tasks = [];

function createTask(taskDescription, taskIsDone) {
  const task = document.createElement('div');
  task.className = 'd-flex justify-content-between align-items-center mt-1 py-1 rounded-3 border border-black task';

  const taskDescriptionEl = document.createElement('span');
  taskDescriptionEl.className = 'ms-1';
  taskDescriptionEl.textContent = taskDescription;

  const buttonsWrap = document.createElement('div');
  buttonsWrap.className = 'buttons-wrap me-1';

  const doneButton = document.createElement('button');
  doneButton.type = 'button';
  doneButton.className = 'done-button me-1 btn btn-success';

  const doneButtonIcon = document.createElement('i');
  doneButtonIcon.className = 'bi bi-check2';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button btn btn-danger';

  const deleteButtonIcon = document.createElement('i');
  deleteButtonIcon.className = 'bi bi-trash';

  doneButton.appendChild(doneButtonIcon);
  deleteButton.appendChild(deleteButtonIcon);
  buttonsWrap.appendChild(doneButton);
  buttonsWrap.appendChild(deleteButton);
  task.appendChild(taskDescriptionEl);
  task.appendChild(buttonsWrap);

  if (taskIsDone) {
    task.classList.add('done');
  }

  return task;
}

function addTask() {
  const taskInputElement = document.querySelector('#task-input');
  let taskDescription = taskInputElement.value;
  const newTask = createTask(taskDescription, false);

  tasks.unshift({ text: taskDescription, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  taskInputElement.value = '';
  taskInputElement.focus();

  tasksContainer.prepend(newTask);

  displayResults();
}

function removeTask(event) {
  if (confirm("Tem certeza que deseja excluir a tarefa?")) {
    const taskElement = event.target.closest('.task');
    const index = Array.from(tasksContainer.children).indexOf(taskElement);
    
    if (index !== -1) {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    taskElement.remove();
    
    checkCompletedTasks();
    displayResults();
    reloadPageIfNoTasks();

    alert('Tarefa removida com sucesso!');
  }
}

function checkCompletedTasks() {
  const doneTaskElements = document.querySelectorAll('.done');
  const removeCompleteTasksButtonContainer = document.querySelector('#remove-complete-tasks-button-wrap');

  if (doneTaskElements.length > 0) {
    removeCompleteTasksButtonContainer.classList.remove('hide');
  } else {
    removeCompleteTasksButtonContainer.classList.add('hide');
  }
}

function completeTask(e) {
  const taskElement = e.target.closest('.task');
  const index = Array.from(tasksContainer.children).indexOf(taskElement);

  if (index !== -1) {
    tasks[index].done = !tasks[index].done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  taskElement.classList.toggle('done');
  checkCompletedTasks();
  displayResults();
}

addTaskButton.addEventListener('click', addTask);
tasksContainer.addEventListener('click', e => {
  if (e.target.classList.contains('done-button')) {
    completeTask(e);
  }

  if (e.target.classList.contains('delete-button')) {
    removeTask(e);
  }
});

window.addEventListener('load', () => {
  if (localStorage.getItem('tasks') !== null) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(...storedTasks);

    for (const storedTask of storedTasks) {
      const newTask = createTask(storedTask.text, storedTask.done);
      tasksContainer.appendChild(newTask);
    }

    checkCompletedTasks();
    displayResults();
  }
});

function displayResults() {
  let tasksTotal = document.querySelectorAll('.task').length;

  if (tasksTotal > 0) {
    const resultsContainer = document.querySelector('#result-wrap');
    const resultElement = document.querySelector('#result');
    const horizontalLines = document.querySelectorAll('.horizontal-line');
    let tasksDoned = document.querySelectorAll('.done').length;

    resultsContainer.classList.remove('hide');
    horizontalLines.forEach(horizontalLine => horizontalLine.classList.remove('hide'));

    resultElement.textContent = `Completas: ${tasksDoned}/${tasksTotal}`;
  }
}

function reloadPageIfNoTasks() {
  if (document.querySelectorAll('.task').length === 0) {
    location.reload();
  }
}

const removeCompleteTasksButton = document.querySelector('#remove-complete-tasks-button');

removeCompleteTasksButton.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja excluir tarefas concluídas?")) {
    const doneTaskElements = document.querySelectorAll('.done');

    doneTaskElements.forEach(doneTask => {
      const index = Array.from(tasksContainer.children).indexOf(doneTask);

      if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      
      doneTask.remove();
    });
    
    
    checkCompletedTasks();
    displayResults();
    reloadPageIfNoTasks();

    alert('Tarefas removidas com sucesso!');
  }
});