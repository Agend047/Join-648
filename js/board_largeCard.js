/**
 * Opens a larger card (PopUp) view for the current task on click.
 * @param {number} id - The ID of the task for which the larger card view will be opened.
 * @param {number} i - The index of the task within the filteredTasks array.
 */
function openCard(id, i) {
  let task = getTaskByID(id);
  let largeCard = document.getElementById("popUpContainer");
  document.body.style.overflow = "hidden";
  let smallCard = document.getElementById(task.id);
  smallCard.classList.add("nohover");
  let mobileTemplate = document.getElementById("mobile-template");
  mobileTemplate.style.zIndex = "0";
  renderLargeCard(largeCard, task, i);
  flyInCard(task.id);
}

/**
 * Renders different parts and information on the large Card.
 * @param {number} id - The ID of the task for which the larger card view will be opened.
 * @param {number} i - The index of the task within the filteredTasks array.
 * @param {number} largeCard - The container of the LargeCard PopUp Window.
 */
function renderLargeCard(largeCard, task, i) {
  labelColor = assignLabelColor(task.category);
  largeCard.innerHTML = generateLargeCardHTML(task, i);
  renderPrioLargeCard(task);
  renderAssignedUserList(task);
  renderSubtasksList(task);
  initCheckboxes();
}

/**
 * Closes the PopUp (large Card view) by hiding it and restoring the scrolling behavior of the body content.
 * @param {string} ID - The ID of the card view element to be closed.
 */
function closeCard(task, ID) {
  flyInCard(task);
  document.getElementById(ID).style.display = "none";
  document.body.style.overflow = "scroll";
  let mobileTemplate = document.getElementById("mobile-template");
  mobileTemplate.style.zIndex = "3";
  renderAllContainersHTML();
}

/**
 * Makes Slide In Animation when opening the Large Card
 */
function flyInCard(taskID) {
  let card = document.getElementById(`popUp-${taskID}`);
  if (card.classList.contains("visually-hidden")) {
    setTimeout(function () {
      card.classList.remove("visually-hidden");
      card.classList.add("popUp");
    }, 2); // Delay the animation by a small amount (adjust as needed)
  } else {
    setTimeout(function () {
      card.classList.add("visually-hidden");
      card.classList.remove("popUp");
    }, 10); // Delay the animation by a small amount (adjust as needed)
  }
}

function initSubtaskInput() {
  subtaskEl.firstElementChild.addEventListener("focus", toggleSubtaskIcons);
  subtaskEl.firstElementChild.addEventListener("blur", toggleSubtaskIcons);
  document
    .getElementById("add-subtask")
    .addEventListener("click", () =>
      setFocusToElement(subtaskEl.firstElementChild)
    );
  document
    .getElementById("cancel-subtask")
    .addEventListener("click", cancelSubtask);
  document.getElementById("save-subtask").addEventListener("click", addSubtask);
}

function initSelectInputs() {
  const selectElements = document.getElementsByClassName("select-input");
  for (let i = 0; i < selectElements.length; i++) {
    const element = selectElements[i];
    const list = element.parentElement.querySelector("ul");
    element.addEventListener("click", toggleDropdown);
    switch (list.id) {
      case "category-options":
        initCategorySelectItems(list);
        break;
      case "assigned-to-options":
        element.addEventListener("click", activateSearchInput);
        element.querySelector("img").addEventListener("click", toggleDropdown);
        element
          .querySelector("img")
          .addEventListener("click", activateSearchInput);
        initAssignedToSelectItems(list);
        break;
    }
  }
}

function activateSearchInput(e) {
  e.stopPropagation();
  formControl = document.getElementById("assigned-to-form-control");
  const input = formControl.querySelector("input");
  const inputContainer = formControl.querySelector(".input");
  document.getElementById("selected-contacts").classList.toggle("d-none");
  input.readOnly = false;
  input.value = "";
  input.focus();
  input.addEventListener("keyup", filterAssignedToContacts);
  inputContainer.removeEventListener("click", toggleDropdown);
  inputContainer.removeEventListener("click", activateSearchInput);
  inputContainer
    .querySelector("img")
    .removeEventListener("click", activateSearchInput);
  inputContainer
    .querySelector("img")
    .addEventListener("click", deactivateSearchInput);
  inputContainer.classList.add("search-active");
  backdrop.addEventListener("click", deactivateSearchInput);
}

function deactivateSearchInput(e) {
  e.stopPropagation();
  formControl = document.getElementById("assigned-to-form-control");
  const input = formControl.querySelector("input");
  const inputContainer = formControl.querySelector(".input");
  document.getElementById("selected-contacts").classList.toggle("d-none");
  input.removeEventListener("keyup", filterAssignedToContacts);
  input.value = "";
  filterAssignedToContacts();
  input.readOnly = true;
  input.value = "Select contacts to assign";
  inputContainer.addEventListener("click", toggleDropdown);
  inputContainer.addEventListener("click", activateSearchInput);
  inputContainer
    .querySelector("img")
    .addEventListener("click", activateSearchInput);
  inputContainer
    .querySelector("img")
    .removeEventListener("click", deactivateSearchInput);
  inputContainer.classList.remove("search-active");
  backdrop.removeEventListener("click", deactivateSearchInput);
}

function filterContactListByName(nameQuery) {
  const results = contactList.filter((contact) => {
    const names = contact.name.toLowerCase().split(" ");
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      if (name.startsWith(nameQuery)) {
        return true;
      }
    }
    return false;
  });
  return results;
}

/**
 * Saves all needed Data inside the new Task variable and then it gets saved - as new one or as edited one.
 */
async function saveTask() {
  let newTask = {
    title: document.getElementById("title-input").value,
    description: document.getElementById("description-input").value,
    assignedTo: getAssignedToArrayFromForm(),
    priority: getPriorityFromForm(),
    dueDate: getDate(),
    category: document.getElementById("category-input").value,
    subtasks: subtasks,
    status: getStatus(),
    id: await getID(),
  };

  orderTasks(newTask);
}

function getAssignedToArrayFromForm() {
  let assignedToArray = [];
  const selectedContactElements = document
    .getElementById("assigned-to-options")
    .querySelectorAll(".selected");
  for (let i = 0; i < selectedContactElements.length; i++) {
    const element = selectedContactElements[i];
    assignedToArray.push(getContactById(element.value));
  }
  return assignedToArray;
}

function getPriorityFromForm() {
  const prioInputs = document
    .getElementById("prio-inputs")
    .querySelectorAll("input");
  for (let i = 0; i < prioInputs.length; i++) {
    const prioInput = prioInputs[i];
    if (prioInput.checked) {
      return prioInput.value;
    }
  }
}

/**
 * Takes data from date-Input field and transforms it into European style. Otherwise it would have format:
 * @returns Date in german date format (dd.mm.yyyy)
 */
function getDate() {
  let date = document.getElementById("due-date-input").value;
  date = date.split("-").reverse();
  return date.join(".");
}

/**
 * Checks if a task is edited or not, and returns either Status of selected Task, or a new one.
 * Variable 'taskDestinationStatus' is 'todo' except another destination was set from taskDestination()
 * @returns  Status of selected Task, or a new one for the new task.
 */
function getStatus() {
  let result;
  selectedTask !== null
    ? (result = selectedTask.status)
    : (result = taskDestinationStatus);
  return result;
}

/**
 * Checks if a task is edited or not, and returns either ID of selected Task, or a new one
 * @returns ID of selected Task, or a new one for the new task.
 */
async function getID() {
  let result;
  selectedTask !== null
    ? (result = selectedTask.id)
    : (result = await getTaskID());
  return result;
}

/**
 * Checks again if a task was edited or not. If its a new one, the task gets pushed, the list saved in Backend and the page leads to the Board.
 * If a task was edited, the Old Task gets overwritten, the List saved in Backend and Edit popup get closed.
 * @param {Object} newTask the Task wich has been edited or created.
 */
async function orderTasks(newTask) {
  if (selectedTask === null) {
    taskList.push(newTask);
    await setItemInBackend("taskList", JSON.stringify(taskList));
    showNotification("notification", "./board.html");
  } else {
    taskList[getTaskIndexByID(selectedTask.id)] = newTask;
    await setItemInBackend("taskList", JSON.stringify(taskList));
    closeCard("editPopUp");
    initBoardPage();
  }
}

/**
 * On the Board Page the Plus-Symbols can be used to add a new task directly with a specific status. (todo, feedback or progress)
 * Here this will be setup in localStorage, and recieved by getTaskDestination()
 * @param {String} target the name of the targeted Status (todo, feedback or progress) of the new task.
 */
async function taskDestination(target) {
  taskDestinationStatus = target;
  localStorage.setItem("taskDestination", JSON.stringify(target));
}

/**
 * Sets a variable value. The Variale will be used to create a task, wich is supposed to have a specific status from beginning. (todo, feedback or progress)
 * Then resets Value in local Storage with standard status (todo)
 */
async function getTaskDestination() {
  let getJSON = localStorage.getItem("taskDestination");
  if (getJSON) {
    taskDestinationStatus = JSON.parse(getJSON);
  }
  localStorage.setItem("taskDestination", JSON.stringify("todo"));
}
