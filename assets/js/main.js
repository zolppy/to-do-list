const addTaskButton = document.querySelector('#add-task-button');
const tasksContainer = document.querySelector('#tasks-container');
const removeCompleteTasksButton = document.querySelector('#remove-complete-tasks-button');
const addTaskInput = document.querySelector("#add-task-input");
const tasks = [];

const createElement = (tag, className, content) => {
  return `<${tag} class="${className}">${content || ''}</${tag}>`;
};

const createTask = (taskDescription, taskIsDone) => {
  const taskClass = `task${taskIsDone ? ' done' : ''}`;
  const taskDescriptionEl = createElement('span', 'task-description', taskDescription);
  const checkboxInput = `<input type="checkbox" class="task-checkbox" ${taskIsDone ? 'checked' : ''}>`;
  const taskDescriptionWrapper = createElement("div", "description-wrapper", checkboxInput + taskDescriptionEl);
  const editButton = createElement('button', 'edit-task-button', '<i class="bi bi-pencil-square"></i>');
  const deleteButton = createElement('button', 'delete-task-button', '<i class="bi bi-trash"></i>');
  const buttonsContainer = createElement('div', 'buttons-wrapper', editButton + deleteButton);

  return `<div class="${taskClass}">${taskDescriptionWrapper}${buttonsContainer}</div>`;
};

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
  const taskInputElement = document.querySelector('#add-task-input');
  let taskDescription = taskInputElement.value;
  let taskDescriptionTreated = taskDescription.charAt(0).toUpperCase() + taskDescription.slice(1);

  const newTask = createTask(taskDescriptionTreated, false);

  tasks.unshift({ text: taskDescriptionTreated, done: false });
  updateLocalStorage();

  taskInputElement.value = '';
  taskInputElement.focus();

  tasksContainer.insertAdjacentHTML('afterbegin', newTask);

  updateCategories();
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
      updateCategories();
    }
  } else {
    const index = Array.from(tasksContainer.children).indexOf(taskElement);

    if (index !== -1) {
      tasks.splice(index, 1);
      updateLocalStorage();
    }

    taskElement.remove();

    checkCompletedTasks();
    updateCategories();
  }
};

const checkCompletedTasks = () => {
  const doneTaskElements = document.querySelectorAll('.done');
  const removeCompleteTasksButtonContainer = document.querySelector('#remove-complete-tasks-button-container');

  removeCompleteTasksButtonContainer.classList.toggle('hidden', doneTaskElements.length === 0);
};

const updateCategories = () => {
  let allTotal = document.querySelectorAll(".task").length;
  let doneTotal = document.querySelectorAll(".done").length;
  let inProgressTotal = allTotal - doneTotal;
  const allEl = document.querySelector("#all-total");
  const doneEl = document.querySelector("#done-total");
  const inProgressEl = document.querySelector("#in-progress-total");

  allEl.textContent = allTotal;
  doneEl.textContent = doneTotal;
  inProgressEl.textContent = inProgressTotal;
};

const completeTask = (taskElement) => {
  const index = Array.from(tasksContainer.children).indexOf(taskElement);

  if (index !== -1) {
    tasks[index].done = !tasks[index].done;
    updateLocalStorage();
  }

  taskElement.classList.toggle('done');
  checkCompletedTasks();
  updateCategories();
};

const editTask = (taskElement) => {
  const taskDescriptionElement = taskElement.querySelector('.task-description');
  const currentTaskDescription = taskDescriptionElement.textContent;
  const updatedTaskDescription = prompt("Editar descrição da tarefa:", currentTaskDescription);

  if (updatedTaskDescription !== null) {
    const index = Array.from(tasksContainer.children).indexOf(taskElement);

    if (index !== -1) {
      tasks[index].text = updatedTaskDescription;
      updateLocalStorage();
    }

    taskDescriptionElement.textContent = updatedTaskDescription;
  }
};

const handleTaskButtonClick = (e) => {
  const taskElement = e.target.closest('.task');

  if (e.target.closest(".task-checkbox")) {
    completeTask(taskElement);
  }

  if (e.target.closest(".delete-task-button")) {
    removeTask(taskElement);
  }

  if (e.target.closest(".edit-task-button")) {
    editTask(taskElement);
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
    updateCategories();
  }
});

removeCompleteTasksButton.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja excluir tarefas concluídas?")) {
    const doneTaskElements = document.querySelectorAll('.done');

    doneTaskElements.forEach(doneTask => {
      removeTask(doneTask, "quiet");
    });

    checkCompletedTasks();
    updateCategories();
  }
});

addTaskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});