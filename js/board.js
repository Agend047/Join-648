function openCard() {
  let largeCard = document.getElementById("popUpContainer");
  document.body.style.overflow = "hidden";
  largeCard.innerHTML = renderLargeCardHTML();
}

function renderLargeCardHTML() {
  return /*html*/ `
    <div id="popUp" class="popUp">
      <div class="background" onclick="closeCard()">
        <div id="largeCard" class="largeCard">
          <div class="large-card-header">
            <div id="categoryLabel" class="category-label">User Story</div>
            <img
              onclick="closeCard()"
              id="btnCloseCard"
              class="btn-close-card"
              src="./assets/img/close-btn.svg"
            />
          </div>

          <div>
            <h1 id="title">Kochwelt Page & Recipe Recommender</h1>
            <p id="description">
              Build start page with recipe recommendation.
            </p>
            <table>
              <tr>
                <td class="col-width">Due date:</td>
                <td>10/05/2023</td>
              </tr>
              <tr>
                <td class="col-width">Priority:</td>
                <td class="prio-btn">
                  <span>Medium</span>
                  <img id="prioIcon" src="./assets/img/prio-medium.svg" />
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span>Assigned To:</span>
                  <div class="subsection">
                    <div class="assigned-user">
                      <img
                        class="user-icon"
                        src="./assets/img/profile-badge-em.png"
                      /><span>Emmanuel Mauer</span>
                    </div>
                    <div class="assigned-user">
                      <img
                        class="user-icon"
                        src="./assets/img/profile-badge-mb.png"
                      /><span>Marcel Bauer</span>
                    </div>
                    <div class="assigned-user">
                      <img
                        class="user-icon"
                        src="./assets/img/profile-badge-am.png"
                      /><span>Anton Mayer</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <span>Subtasks</span>
                  <div class="subsection">
                    <div class="subtask">
                      <img
                        class="icon-checkbox"
                        src="./assets/img/checkbox-checked.svg"
                      /><span>Implement Recipe Recommendation</span>
                    </div>
                    <div class="subtask">
                      <img
                        class="icon-checkbox"
                        src="./assets/img/checkbox-unchecked.svg"
                      /><span>Start Page Layout</span>
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <div class="large-card-footer">
              <div class="btn">
                <span class="delete-icon"></span>
                <span>Delete</span>
              </div>
              <div class="btn-seperator"></div>
              <div class="btn">
                <span class="edit-icon"></span>
                <span>Edit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function closeCard() {
  document.getElementById(`popUp`).classList.add("d-none");
  document.body.style.overflow = "scroll";
}
