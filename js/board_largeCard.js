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
