let currentDraggedElement;
let labelColor;

async function initBoardPage() {
  await getDataFromBackend();
  renderAllContainersHTML();
}

function renderAllContainersHTML() {
  const statusArr = ["todo", "inprogress", "feedback", "done"];
  for (let i = 0; i < statusArr.length; i++) {
    const status = statusArr[i];
    updateHTML(status, status);
  }
}

function updateHTML(status, id) {
  let filteredTasks = taskList.filter((t) => t["status"] == status);
  const taskContainer = document.getElementById(id);
  taskContainer.innerHTML = "";
  if (filteredTasks.length === 0) {
    const placeholderText = renderPlaceholderText(status);
    taskContainer.innerHTML = generatePlaceholderHTML(placeholderText);
  } else {
    for (let i = 0; i < filteredTasks.length; i++) {
      const task = filteredTasks[i];
      let totalSubtasks = getSubtasksCount(filteredTasks, i);
      let subtasksDone = getSubtasksDone();
      labelColor = assignLabelColor(task.category);
      taskContainer.innerHTML += generateSmallCardHTML(
        totalSubtasks,
        subtasksDone,
        task,
        i
      );
    }
  }
  renderSmallCard(filteredTasks);
}

function renderSmallCard(filteredTasks) {
  renderProgressSection(filteredTasks);
  renderAssignedBadges(filteredTasks);
  renderPrio(filteredTasks);
}

function renderProgressSection(filteredTasks) {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const progress = document.getElementById(
      `progress-section-${filteredTask.id}`
    );
    const assignedSubtasks = filteredTask["subtasks"];
    if (assignedSubtasks.length === 0) {
      progress.style.display = "none";
    } else {
      updateProgressBar();
    }
  }
}

function assignLabelColor(category) {
  if (category === "User Story") {
    return "#0038ff"; // Blue color
  } else if (category === "Technical Task") {
    return "#1FD7C1"; // Turquoise color
  }
  // Default color Orange, if category doesn't match
  return "#FF7A00";
}

// i = i in filteredTasks! Attention!
function generateSmallCardHTML(totalSubtasks, subtasksDone, task, i) {
  return /*html*/ `
              <div id="${task.id}" draggable="true" ondragstart="startDragging(${task.id})" class="cardSmall" onclick="openCard(${task.id}, ${i})">
                <div class="category">
                  <div class="categoryLabel" style="background: ${labelColor};" id="categoryLabel">${task.category}</div>
                </div>
                <div>
                  <h1 class="title" id="title-${i}">${task.title}</h1>
                  <p class="description" id="description-${i}">${task.description}</p>
                </div>
                <div class="progress-section" id="progress-section-${task.id}">
                  <div id="progress">
                    <div
                    id="progress-bar"
                      class="progress-bar"
                      role="progressbar"
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div>${subtasksDone}/${totalSubtasks} Subtasks</div>
                </div>
                <div class="card-footer">
                  <div class="w-100 d-flex justify-content-space-btw align-items-center">
                    <div class="profileBadges" id="profileBadges-${task.id}">
                    </div>
                    <div class="prioIcon" id="prioIcon-${task.id}">
                    </div>
                  </div>
                </div>
              </div>
            `;
}

function generatePlaceholderHTML(status) {
  return `<div class="placeholder">No Tasks ${status}</div>`;
}

function renderPlaceholderText(status) {
  switch (status) {
    case "todo":
      return "To Do";
    case "inprogress":
      return "In Progress";
    case "feedback":
      return "Await Feedback";
    case "done":
      return "Done";
  }
}

function renderAssignedBadges(filteredTasks) {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const badge = document.getElementById(`profileBadges-${filteredTask.id}`);
    const assignedContacts = filteredTask["assignedTo"];

    badge.innerHTML = "";

    for (let j = 0; j < assignedContacts.length; j++) {
      const assignedContact = assignedContacts[j];
      badge.innerHTML += generateBadgeHTML(assignedContact);
    }
  }
}

function generateBadgeHTML(contact) {
  return /*html*/ `
  <svg
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="21"
      cy="21"
      r="20"
      fill="${contact.color}"
      stroke="white"
      stroke-width="2"
    />
    <text
      x="21"
      y="21"
      alignment-baseline="central"
      text-anchor="middle"
      fill="white"
    >
    ${contact.initials}
    </text>
  </svg>
  `;
}

function renderPrio(filteredTasks) {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const prio = document.getElementById(`prioIcon-${filteredTask.id}`);
    const assignedPrio = filteredTask["priority"];
    prio.innerHTML = "";
    prio.innerHTML += generatePrioHTML(assignedPrio);
  }
}

function generatePrioHTML(prio) {
  return /*html*/ `
  <img src="./assets/img/prio-${prio}.svg">
`;
}

//////////////////////////////////////////////////////////////////////
// DRAG & DROP FUNCTIONS
/** Sets the Task ID to the currently dragged Element and saves it in a variable */
function startDragging(id) {
  currentDraggedElement = id;
}

/**  */
function allowDrop(event) {
  event.preventDefault();
}

/** Moves the Task into another Column by setting the new Status and saving it in the Array */
async function moveTo(status) {
  const taskIndex = taskList.findIndex(
    (task) => task.id === currentDraggedElement
  );
  taskList[taskIndex]["status"] = status;
  await setItemInBackend("taskList", JSON.stringify(taskList));
  renderAllContainersHTML();
}

/** Highlights the droparea */
function addHighlight(ID) {
  document.getElementById(ID).classList.add("drag-area-highlight");
}

/** Removes the Highlight from the droparea */
function removeHighlight(ID) {
  document.getElementById(ID).classList.remove("drag-area-highlight");
}
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// FUNCTIONS FOR LARGE CARD (OPEN POPUP)

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

function generateLargeCardHTML(task, i) {
  return /*html*/ `
    <div id="popUp" class="popUp">
        <div id="largeCard" class="largeCard">
          <div class="large-card-header">
            <div id="categoryLabel" style="background: ${labelColor};" class="categoryLabel">${task.category}</div>
            <img
              onclick="updateSubtasksStatus(${task.id}, closeCard('popUp'))"
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
              <div onclick="editTask(${task.id}), initAddTaskPage()" class="footer-btn">
                <span class="edit-icon"></span>
                <span>Edit</span>
              </div>
            </div>
          </div>
        </div>
        <div class="background" onclick="closeCard('popUp')"></div>
    </div>
  `;
}

function closeCard(ID) {
  document.getElementById(ID).style.display = "none";
  document.body.style.overflow = "scroll";
}

/**
 * Deleting a task out of TaskList
 * @param {Number} taskID - ID ot the to delete Task
 */
async function deleteTask(taskID) {
  let taskIndex = getTaskIndexByID(taskID);

  taskList.splice(taskIndex, 1);

  await setItemInBackend("taskList", JSON.stringify(taskList));
  closeCard("popUp");
  renderAllContainersHTML();
}

/**
 * Searches for the task within the taskList, by a specific id.
 * @param {Number} findID - The Id, we are looking for
 * @returns - the task (Object) we wanted.
 */
function getTaskByID(findID) {
  let task = taskList.find((t) => t.id === findID);
  return task;
}

/**
 * Gets task through other function, then gets Index
 * @param {Number} taskID - ID of searched Task
 * @returns - Indexof searched Task inside of taskList
 */
function getTaskIndexByID(taskID) {
  let task = getTaskByID(taskID);
  let taskIndex = taskList.indexOf(task);
  return taskIndex;
}

function renderPrioLargeCard(task) {
  for (let i = 0; i < taskList.length; i++) {
    const prioLargeCard = document.getElementById("largeCardPrio");
    const assignedPrio = taskList[i]["priority"];
    prioLargeCard.innerHTML = "";
    prioLargeCard.innerHTML += generateLargeCardPrioHTML(task, assignedPrio);
  }
}

function generateLargeCardPrioHTML(task) {
  return /*html*/ `
  <div class="prio-btn">
    <span>${task.priority}</span>
    <img src="./assets/img/prio-${task.priority}.svg">
  </div>
  `;
}

function renderAssignedUserList(task) {
  const list = document.getElementById("assignedSection");
  let html = "";

  const users = task["assignedTo"];

  for (let i = 0; i < users.length; i++) {
    const assignedUser = users[i];
    html += generateAssignedUserListItemHTML(assignedUser);
  }
  list.innerHTML = html;
}

function generateAssignedUserListItemHTML(contact) {
  let html = "";
  html = `<div class="assigned-user">`;
  html += generateBadgeHTML(contact);
  html += `<span>${contact.name}<span></div>`;
  return html;
}


/**
 * Writes the subtask into the Big Card 
 * @param {Object} task The Task we want to show 
 */
function renderSubtasksList(task) {
  const list = document.getElementById("subtaskList");
  list.innerHTML = "";

  const subtasks = task["subtasks"];
  if (subtasks.length === 0) {
    list.innerHTML = `<div class="subtask">No subtasks</div>`;
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];

      let srcImg = getImgBySubtaskStatus(subtask);

      list.innerHTML += generateSubtasksListHTML(srcImg, subtask.text);
    }
  }
}

/**
 * Checks Status of a subtask and returns the status (Checked or unchecked) for Image source
 * @param {Object} subtask the Subtask inside of the Task we want to show
 * @returns Status of Subtask (Checked or unchecked) for IMG
 */
function getImgBySubtaskStatus(subtask) {
  let srcImg;
  let subtaskStatus = subtask["status"];
  if (subtaskStatus === "todo") {
    srcImg = "unchecked";
  } else {
    srcImg = "checked";
  }
  return srcImg;
}

/**
 * Changes the Subtask Status depending on the Checked Boxes on the BigCard
 * @param {Number} taskID ID Of the Task we opened
 */
function updateSubtasksStatus(taskID) {
  let checkboxes = document.getElementsByClassName("checkbox");
  const task = getTaskByID(taskID)
  const subtasks = task["subtasks"];
  for (let i = 0; i < checkboxes.length; i++) {

    if (checkboxes[i].classList.contains("checked")) {
      subtasks[i].status = "done";
    } else {
      subtasks[i].status = "todo";
    }
  }
}

function generateSubtasksListHTML(srcImg, subtask) {
  html = `<div class="subtask">`;
  html += `<img src="./assets/img/checkbox-${srcImg}.svg" class="icon-checkbox checkbox ${srcImg}"/>`;
  html += `<span>${subtask}<span></div>`;
  return html;
}

function getSubtasksCount(filteredTasks, i) {
  const filteredSubTask = filteredTasks[i]["subtasks"];
  return filteredSubTask.length;
}

function getSubtasksDone() {
  const checkboxes = document.getElementsByClassName("checkbox");
  let subtasksDone = 0;
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].classList.contains("checked")) subtasksDone++;
  }
  return subtasksDone;
}

function updateProgressBar(totalSubtasks) {
  const subtasksDone = getSubtasksDone();
  let percent = subtasksDone / totalSubtasks;
  percent = Math.round(percent * 100);

  document.getElementById("progress-bar").style = `width: ${percent}%;`;
}

//////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// SEARCH FUNCIONS

/**Searches through all Tasks if one may be the one, were looking for. */
function searchTask() {
  let term = document.getElementById("findTask").value;
  term = term.toLowerCase();
  let foundTasks = [];

  for (i in taskList) {
    let taskTitle = taskList[i].title.toLowerCase();
    let taskDesc = taskList[i].description.toLowerCase();
    if (taskTitle.includes(term) || taskDesc.includes(term)) {
      foundTasks.push(taskList[i].id);
    }
  }
  hideNotSearchedTasks(foundTasks);
}

/**
 * Hides tasks, the user doesn't look for by checking, if the id of a task is inside of the foundTasks - Array.
 * @param {Array} foundTasks collection of ID´s from those Tasks, wich involve things, the user is looking for.
 */
function hideNotSearchedTasks(foundTasks) {
  for (task of taskList) {
    if (foundTasks.indexOf(task.id) + 1) {
      //+1 because if the index is 0, it will be handled as 'false'!
      document.getElementById(task.id).style.display = "flex";
    } else {
      document.getElementById(task.id).style.display = "none";
    }
  }
}
