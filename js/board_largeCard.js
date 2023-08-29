/**
 * Opens a larger card (PopUp) view for the current task on click, displaying detailed information and controls.
 * @param {number} id - The ID of the task for which the larger card view will be opened.
 * @param {number} i - The index of the task within the filteredTasks array.
 */
function openCard(id, i) {
  let task = getTaskByID(id);
  let largeCard = document.getElementById("popUpContainer");
  document.body.style.overflow = "hidden";
  labelColor = assignLabelColor(task.category);
  largeCard.innerHTML = generateLargeCardHTML(task, i);
  renderPrioLargeCard(task);
  renderAssignedUserList(task);
  renderSubtasksList(task);
  initCheckboxes();
}

/**
 * Generates HTML code for large card (PopUp) view.
 *
 * @param {object} task - The task object containing detailed information about the task.
 * @param {number} i - The index of the task.
 * @returns {string} The generated HTML code for the PopUp.
 */
function generateLargeCardHTML(task, i) {
  return /*html*/ `
      <div id="popUp" class="popUp">
          <div id="largeCard" class="largeCard">
            <div class="large-card-header">
              <div id="categoryLabel" style="background: ${labelColor};" class="categoryLabel">${task.category}</div>
              <img
                onclick="updateSubtasksStatus(${task.id}); closeCard('popUp');"
                id="btnCloseCard"
                class="btn-close-card"
                src="./assets/img/close-btn.svg"
              />
            </div>
  
            <div class="large-card-content">
              <h1 class="title-large-card" id="title-${i}">${task.title}</h1>
              <p class="description" id="description-${i}">${task.description}</p>
              <table>
                <tr>
                  <td class="col-width">Due date:</td>
                  <td id="dueDate">${task.dueDate}</td>
                </tr>
                <tr>
                  <td class="col-width">Priority:</td>
                  <td class="prio-btn" id="largeCardPrio"></td>
                </tr>
                <tr>
                  <td colspan="2">
                    <span>Assigned To:</span>
                    <div class="subsection" id="assignedSection">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <span>Subtasks</span>
                    <div class="subsection" id="subtaskList">
                      <div class="subtask">No subtasks</div>
                    </div>
                  </td>
                </tr>
              </table>
  
              <div class="large-card-footer">
                <div class="footer-btn" onclick="deleteTask(${task.id})">
                  <span class="delete-icon"></span>
                  <span>Delete</span>
                </div>
                <div class="btn-seperator"></div>
                <div onclick="updateSubtasksStatus(${task.id}), editTask(${task.id}), initAddTaskPage()" class="footer-btn">
                  <span class="edit-icon"></span>
                  <span>Edit</span>
                </div>
              </div>
            </div>
          </div>
          <div class="background" onclick="updateSubtasksStatus(${task.id}); closeCard('popUp');"></div>
      </div>
    `;
}

/**
 * Closes the PopUp (large Card view) by hiding it and restoring the scrolling behavior of the body content.
 * @param {string} ID - The ID of the card view element to be closed.
 */
function closeCard(ID) {
  document.getElementById(ID).style.display = "none";
  document.body.style.overflow = "scroll";
  renderAllContainersHTML();
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

async function saveTask() {
  let status;
  let id;
  if (selectedTask !== null) {
    id = selectedTask.id;
    status = selectedTask.status;
  } else {
    id = await getTaskID();
    status = "todo";
  }
  let newTask = {
    title: document.getElementById("title-input").value,
    description: document.getElementById("description-input").value,
    assignedTo: getAssignedToArrayFromForm(),
    priority: getPriorityFromForm(),
    dueDate: document.getElementById("due-date-input").value,
    category: document.getElementById("category-input").value,
    subtasks: subtasks, //getSubtasksFromForm(),
    status: status,
    id: id,
  };
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
