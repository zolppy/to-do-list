// Este código está podre, eu sei. Vou limpá-lo depois. É que eu estava com pressa :)

const addButton = document.getElementById('add-button');
const tasksWrap = document.getElementById('tasks-wrap');
const tasks = [];

function createTask(taskText, isDone) {
  const task = document.createElement('div');
  task.className = 'd-flex justify-content-between align-items-center mt-1 py-1 rounded-3 border border-black task';

  const taskTextEl = document.createElement('span');
  taskTextEl.className = 'ms-1';
  taskTextEl.textContent = taskText;

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
  task.appendChild(taskTextEl);
  task.appendChild(buttonsWrap);

  if (isDone) {
    task.classList.add('done');
  }

  return task;
}

function result() {
  let total = document.querySelectorAll('.task').length;

  if (total > 0) {
    const resultWrap = document.getElementById('result-wrap');
    const result = document.getElementById('result');
    const hrs = document.querySelectorAll('.horizontal-line');
    let doned = document.querySelectorAll('.done').length;

    resultWrap.classList.remove('hide');
    hrs.forEach(hr => hr.classList.remove('hide'));

    result.textContent = `Completas: ${doned}/${total}`;
  }
  
  if (total === 0) {
    location.reload();
  }
}

function addTask() {
  const taskInput = document.getElementById('task-input');
  let taskText = taskInput.value;
  const newTask = createTask(taskText, false);

  tasks.unshift({ text: taskText, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  taskInput.value = '';
  taskInput.focus();

  tasksWrap.prepend(newTask);

  result();
}

function removeTask(event) {
  const taskElement = event.target.closest('.task');
  const index = Array.from(tasksWrap.children).indexOf(taskElement);
  
  if (index !== -1) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  taskElement.remove();
  
  result();
}

function removeCompleteTasks() {
  const doneTasks = document.querySelectorAll('.done');
  const removeCompleteTasksButtonWrap = document.getElementById('remove-complete-tasks-button-wrap');

  if (doneTasks.length > 0) {
    removeCompleteTasksButtonWrap.classList.remove('hide');
  } else {
    removeCompleteTasksButtonWrap.classList.add('hide');
  }
}

function completeTask(event) {
  const taskElement = event.target.closest('.task');
  const index = Array.from(tasksWrap.children).indexOf(taskElement);

  if (index !== -1) {
    tasks[index].done = !tasks[index].done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  taskElement.classList.toggle('done');

  removeCompleteTasks();
  result();
}

addButton.addEventListener('click', addTask);
tasksWrap.addEventListener('click', event => {
  if (event.target.classList.contains('done-button')) {
    completeTask(event);
  }

  if (event.target.classList.contains('delete-button')) {
    removeTask(event);
  }
});

window.addEventListener('load', () => {
  if (localStorage.getItem('tasks') !== null) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(...storedTasks);

    for (const storedTask of storedTasks) {
      const newTask = createTask(storedTask.text, storedTask.done);
      tasksWrap.appendChild(newTask);
    }

    removeCompleteTasks();
    result();
  }
});

const removeCompleteTasksButton = document.getElementById('remove-complete-tasks-button');

removeCompleteTasksButton.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja excluir tarefas concluídas?")) {
    const doneTasks = document.querySelectorAll('.done');

    doneTasks.forEach(doneTask => {
      const index = Array.from(tasksWrap.children).indexOf(doneTask);
      if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      
      doneTask.remove();
    });
  
    removeCompleteTasks();
    result();
    alert('Tarefas removidas com sucesso.');
  }
});