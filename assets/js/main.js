const addTaskButton = document.querySelector('#add-task-button');
const tasksContainer = document.querySelector('#tasks-container');
const removeCompleteTasksButton = document.querySelector('#remove-complete-tasks-button');
const tasks = [];

const createElement = (tag, className, content) => {
  return `<${tag} class="${className}">${content || ''}</${tag}>`;
};

const createTask = (taskDescription, taskIsDone) => {
  const taskClass = `d-flex justify-content-between align-items-center mt-1 py-1 rounded-3 border border-black task${taskIsDone ? ' done' : ''}`;
  const taskDescriptionEl = createElement('span', 'ms-1', taskDescription);

  const doneButton = createElement('button', 'done-button me-1 btn btn-success', '<i class="bi bi-check2"></i>');
  const deleteButton = createElement('button', 'delete-button btn btn-danger', '<i class="bi bi-trash"></i>');
  const buttonsContainer = createElement('div', 'buttons-container me-1', doneButton + deleteButton);

  return `<div class="${taskClass}">${taskDescriptionEl}${buttonsContainer}</div>`;
};

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
  const taskInputElement = document.querySelector('#task-input');
  let taskDescription = taskInputElement.value;
  let taskDescriptionTreated = taskDescription.charAt(0).toUpperCase() + taskDescription.slice(1);

  const newTask = createTask(taskDescriptionTreated, false);

  tasks.unshift({ text: taskDescriptionTreated, done: false });
  updateLocalStorage();

  taskInputElement.value = '';
  taskInputElement.focus();

  tasksContainer.insertAdjacentHTML('afterbegin', newTask);

  updateDisplayResults();
};

const removeTask = (taskElement, mode = "no-queit") => {
  if (mode !== "quiet") {
    if (confirm("Tem certeza que deseja excluir a tarefa?")) {
      const index = Array.from(tasksContainer.children).indexOf(taskElement);
  
      if (index !== -1) {
        tasks.splice(index, 1);
        updateLocalStorage();
      }
  
      taskElement.remove();
  
      checkCompletedTasks();
      updateDisplayResults();
      reloadPageIfNoTasks();
    }
  } else {
    const index = Array.from(tasksContainer.children).indexOf(taskElement);

    if (index !== -1) {
      tasks.splice(index, 1);
      updateLocalStorage();
    }

    taskElement.remove();

    checkCompletedTasks();
    updateDisplayResults();
    reloadPageIfNoTasks();
  }
};

const checkCompletedTasks = () => {
  const doneTaskElements = document.querySelectorAll('.done');
  const removeCompleteTasksButtonContainer = document.querySelector('#remove-complete-tasks-button-container');

  removeCompleteTasksButtonContainer.classList.toggle('hide', doneTaskElements.length === 0);
};

const updateDisplayResults = () => {
  const tasksTotal = document.querySelectorAll('.task').length;

  if (tasksTotal > 0) {
    const resultsContainer = document.querySelector('#result-container');
    const resultElement = document.querySelector('#result');
    const horizontalLines = document.querySelectorAll('.horizontal-line');
    const tasksDone = document.querySelectorAll('.done').length;

    resultsContainer.classList.remove('hide');
    horizontalLines.forEach(horizontalLine => horizontalLine.classList.remove('hide'));

    resultElement.textContent = `Completas: ${tasksDone}/${tasksTotal}`;
  }
};

const reloadPageIfNoTasks = () => {
  if (tasksContainer.children.length === 0) {
    location.reload();
  }
};

const completeTask = (taskElement) => {
  const index = Array.from(tasksContainer.children).indexOf(taskElement);

  if (index !== -1) {
    tasks[index].done = !tasks[index].done;
    updateLocalStorage();
  }

  taskElement.classList.toggle('done');
  checkCompletedTasks();
  updateDisplayResults();
};

const handleTaskButtonClick = (e) => {
  const taskElement = e.target.closest('.task');
  if (e.target.classList.contains('done-button')) {
    completeTask(taskElement);
  }

  if (e.target.classList.contains('delete-button')) {
    removeTask(taskElement);
  }
};

addTaskButton.addEventListener('click', addTask);
tasksContainer.addEventListener('click', handleTaskButtonClick);

window.addEventListener('load', () => {
  if (localStorage.getItem('tasks') !== null) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(...storedTasks);

    for (const storedTask of storedTasks) {
      const newTask = createTask(storedTask.text, storedTask.done);
      tasksContainer.insertAdjacentHTML('beforeend', newTask);
    }

    checkCompletedTasks();
    updateDisplayResults();
  }
});

removeCompleteTasksButton.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja excluir tarefas concluídas?")) {
    const doneTaskElements = document.querySelectorAll('.done');

    doneTaskElements.forEach(doneTask => {
      removeTask(doneTask, "quiet");
    });

    checkCompletedTasks();
    updateDisplayResults();
    reloadPageIfNoTasks();
  }
});