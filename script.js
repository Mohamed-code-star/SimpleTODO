const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
//my stuff 
const todayDate = document.getElementById("todaysdate");
const completedCount = document.getElementById("complete_counter");
const clearButton = document.getElementById("clearall");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function(task, index) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    if (task.completed) listItem.classList.add("completed");

    listItem.innerHTML = `
      <div class="task-left">
        <input class="task-checkbox" type="checkbox">
        <span class="task-text"></span>
      </div>
      <div class="task-actions">
        <button class="edit-button" type="button">Edit</button>
        <button class="delete-button" type="button">Delete</button>
      </div>`;

    const checkbox = listItem.querySelector(".task-checkbox");
    const taskText = listItem.querySelector(".task-text");
    const editButton = listItem.querySelector(".edit-button");
    const deleteButton = listItem.querySelector(".delete-button");

    checkbox.checked = task.completed;
    taskText.textContent = task.text;

    checkbox.addEventListener("change", function() {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      showTasks();
    });

    editButton.addEventListener("click", function() {
      const newText = prompt("Edit your task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        showTasks();
      }
    });

    deleteButton.addEventListener("click", function() {
      tasks.splice(index, 1);
      saveTasks();
      showTasks();
    });

    taskList.appendChild(listItem);
  });

  taskCount.textContent = tasks.length + (tasks.length === 1 ? " task" : " tasks");

  //summing the tasks
  let completedTotal = 0;
  tasks.forEach(function(task) {
    if (task.completed) completedTotal++;
  });
  completedCount.textContent = completedTotal + " completed";
  clearButton.disabled = tasks.length === 0;
}

taskForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  taskInput.value = "";
  saveTasks();
  showTasks();
});

// Show today's date feature
todayDate.textContent = new Date().toLocaleDateString();

// Clear every task simply
clearButton.addEventListener("click", function() {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    saveTasks();
    showTasks();
  }
});

showTasks();
