let subtaskEl;
let backdrop;
let formControl;
let subtasks = [];
let selectedContactIds = [];
let selectedTask = null;
let taskDestinationStatus;

/**Gets 2 container for further use. */
function getAddContactElements() {
  subtaskEl = document.getElementById("subtasks-container");
  backdrop = document.getElementById("backdrop");
}

/**The order for the functions, so the Add-Task page works correct. */
async function initAddTaskPage() {
  getAddContactElements();
  initSubtaskInput();
  initForm();
  if (location.href.endsWith("add_task.html")) {
    initClearBtn();
    initAddContactOverlayForm();
    document
      .getElementById("add-contact-btn")
      .addEventListener("click", () =>
        document.getElementById("add-contact-overlay").showModal()
      );
  }
  await getContacts();
  renderAssignedToContactList(contactList);
  initSelectInputs();
  renderSubtasksInForm();
  getTaskDestination()
}


function initAddContactOverlayForm() {
  const dialogEl = document.getElementById("add-contact-overlay");
  const closeBtns = dialogEl.querySelectorAll(".close-icn");
  for (let i = 0; i < closeBtns.length; i++) {
    const closeBtn = closeBtns[i];
    closeBtn.addEventListener("click", () => {
      dialogEl.close();
    });
  }
}

/**Gettinig the contactList out of backend */
async function getContacts() {
  contactList = await getItemFromBackend("contactList");
}

function initClearBtn() {
  document.getElementById("clear-btn").addEventListener("click", (ev) => {
    ev.preventDefault();
    document.getElementById("addtask-form").reset();
    document.getElementById("selected-contacts").innerHTML = "";
    document.getElementById("subtaskList").innerHTML = "";
    selectedContactIds = [];
    renderAssignedToContactList(contactList);
    initAssignedToSelectItems(document.getElementById('assigned-to-options'));
  });
}

function initCategorySelectItems(list) {
  const categoryOptions = list.querySelectorAll("li");
  for (let i = 0; i < categoryOptions.length; i++) {
    const option = categoryOptions[i];
    option.addEventListener("click", selectCategory);
  }
}

function initAssignedToSelectItems(list) {
  const contacts = list.querySelectorAll("li");
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contact.addEventListener("click", toggleContactSelection);
  }
}

function selectCategory(e) {
  const input = document.getElementById("category-input");
  input.value = e.target.textContent;
  collapseDropdown();
}

function toggleDropdown(ev) {
  ev.stopPropagation();
  if (ev.currentTarget.tagName === "DIV") {
    formControl = ev.currentTarget.parentElement;
  } else {
    formControl = ev.currentTarget.parentElement.parentElement;
  }
  const listContainer = formControl.querySelector(".select-options-container");
  if (listContainer.classList.contains("d-none")) {
    expandDropdown();
  } else {
    collapseDropdown();
  }
}

function expandDropdown() {
  const inputContainer = formControl.querySelector(".input");
  const dropdownImg = inputContainer.querySelector("img");
  const listContainer = formControl.querySelector(".select-options-container");
  dropdownImg.src = "./assets/img/arrow_dropdown_up.png";
  backdrop.addEventListener("click", collapseDropdown);
  inputContainer.style.zIndex = 2;
  listContainer.style.zIndex = 1;
  listContainer.classList.toggle("d-none");
  backdrop.classList.toggle("d-none");
}

function collapseDropdown() {
  const inputContainer = formControl.querySelector(".input");
  const dropdownImg = inputContainer.querySelector("img");
  const listContainer = formControl.querySelector(".select-options-container");
  dropdownImg.src = "./assets/img/arrow_dropdown_down.png";
  backdrop.removeEventListener("click", collapseDropdown);
  inputContainer.style.zIndex = 0;
  listContainer.style.zIndex = 0;
  listContainer.classList.toggle("d-none");
  backdrop.classList.toggle("d-none");
}

function toggleSubtaskIcons() {
  if (subtaskEl.firstElementChild.value === "") {
    const elements = subtaskEl.getElementsByTagName("img");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.classList.toggle("d-none");
    }
  }
}

function setFocusToElement(element) {
  element.focus();
}

function cancelSubtask() {
  document.getElementById("subtasks-input").value = "";
  toggleSubtaskIcons();
}

function addSubtask() {
  const input = document.getElementById("subtasks-input");
  if (input.value) {
    subtasks.push({ text: input.value, status: 'todo' });
    input.value = "";
    input.focus();
    toggleSubtaskIcons();
    renderSubtasksInForm();
  }
}

function renderSubtasksInForm() {
  const subtasksList = document.getElementById("subtaskList");
  subtasksList.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i].text;

    subtasksList.innerHTML += renderNewListItemHtml(subtask, i);
  }
}

function renderNewListItemHtml(subtask, index) {
  let html;
  html = '<li class="subtask">';
  html += renderListItemHtml(subtask, index);
  html += "</li>";
  return html;
}

function renderListItemHtml(subtask, index) {
  return /*html*/ `
    <img src="./assets/img/bullet.png" class='bullet-icon'><input type="text" class="no-validation" readonly value="${subtask}"/>
    <div class="subtask-read-icons subtask-icons"><img src="./assets/img/pencil.png" class='edit-subtask-icon input-icon cursor-pointer' onclick="editSubtask(${index})"/><img
      src="./assets/img/subtask-separator.png"
    /><img src="./assets/img/trash-bin.png" class="input-icon cursor-pointer" onclick="deleteSubtask(${index})"/></div>
    <div class="subtask-edit-icons subtask-icons"><img src="./assets/img/trash-bin.png" class="input-icon cursor-pointer" onclick="deleteSubtask(${index})"/><img
      src="./assets/img/subtask-separator.png"
    /><img src="./assets/img/subtask-save.png" class="input-icon cursor-pointer" onclick="updateSubtask(${index})"/></div>`;
}

function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasksInForm();
}

function editSubtask(index) {
  const subtasksList = document.getElementById("subtaskList");
  const subtaskListEl = subtasksList.children[index];
  subtaskListEl.classList.add("subtask-edit");
  subtaskListEl.querySelector("input").readOnly = false;
}

function updateSubtask(index) {
  const subtasksList = document.getElementById("subtaskList");
  const subtaskListEl = subtasksList.children[index];
  const subtask = subtaskListEl.querySelector("input").value;
  subtaskListEl.classList.remove("subtask-edit");
  subtasks[index] = subtask;
  subtaskListEl.innerHTML = renderListItemHtml(subtask, index);
}

function toggleContactSelection(event) {
  const listItem = event.currentTarget;
  listItem.classList.toggle("selected");
  const selectedContactsEl = document.getElementById("selected-contacts");
  if (listItem.classList.contains("selected")) {
    selectedContactIds.push(listItem.value);
    listItem.querySelector("img").src =
      "./assets/img/checkbox-checked-white.png";
    selectedContactsEl.innerHTML += renderContactBubbleHtml(
      getContactById(listItem.value)
    );
  } else {
    listItem.querySelector("img").src = "./assets/img/checkbox-unchecked.svg";
    selectedContactsEl
      .getElementsByClassName("contact-bubble-" + listItem.value)[0]
      .remove();
    selectedContactIds.splice(selectedContactIds.indexOf(listItem.value), 1);
  }
}

function getContactById(id) {
  return contactList.find((contact) => contact.id === id);
}

async function validateOverlayAddcontactForm(e) {
  const form = document.getElementById("overlay-add-contact-form");
  let formIsValid = true;
  const formElements = form.querySelectorAll("input, textarea, select");
  for (let i = 0; i < formElements.length; i++) {
    const formElement = formElements[i];
    formElement.checkValidity();
    if (!formElement.validity.valid) {
      formIsValid = false;
    }
    document.getElementById(`${formElement.id}-error`).textContent =
      formElement.validationMessage;
  }
  e.preventDefault();
  if (!formIsValid) {
    form.classList.add("is-validated");
  } else {
    await addContactWithinTaskForm();
    form.parentElement.close();
    document.getElementById("dropdown-arrow").dispatchEvent(new Event("click"));
  }
}

async function addContactWithinTaskForm() {
  const newContact = await createContact();
  sortContacts();
  await setItemInBackend("contactList", JSON.stringify(contactList));
  const assignedtoContactList = document.getElementById("assigned-to-options");
  selectedContactIds.push(newContact.id);
  renderAssignedToContactList(contactList);
  initAssignedToSelectItems(assignedtoContactList);
  document.getElementById("selected-contacts").innerHTML +=
    renderContactBubbleHtml(newContact);
  document.getElementById("overlay-add-contact-form").reset();
}

async function validateAddTaskForm(e) {
  e.preventDefault();
  const form = e.target;
  let formIsValid = true;
  let prioValidationMessage;
  const formElements = form.querySelectorAll(
    'input:not([type="radio"]):not(.no-validation), textarea, div.custom-validation'
  );
  for (let i = 0; i < formElements.length; i++) {
    const formElement = formElements[i];
    if (formElement.classList.contains("custom-validation")) {
      switch (formElement.id) {
        case "assigned-to-input":
          formElement.readOnly = false;
          break;
        case "prio-inputs":
          prioValidationMessage = validatePrioInput(formElement);
          break;
        case "category-input":
          formElement.readOnly = false;
          validateCategoryInput(formElement);
          break;
      }
    }
    if (formElement.id === "prio-inputs") {
      if (prioValidationMessage !== "") {
        formIsValid = false;
      }
      document.getElementById(`${formElement.id}-error`).textContent =
        prioValidationMessage;
    } else {
      document.getElementById(`${formElement.id}-error`).textContent =
        formElement.validationMessage;
      if (!formElement.validity.valid) {
        formIsValid = false;
      }
    }
    if (
      formElement.id === "assigned-to-input" ||
      formElement.id === "category-input"
    ) {
      formElement.readOnly = true;
    }
  }
  if (!formIsValid) {
    form.classList.add("is-validated");
  } else {
    await saveTask();
  }
}

function validateCategoryInput(formElement) {
  if (formElement.value === "Select task category") {
    formElement.setCustomValidity("This field is required.");
  } else {
    formElement.setCustomValidity("");
  }
}

function validatePrioInput(formElement) {
  const inputs = formElement.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input.checked) {
      return "";
    }
  }
  return "This field is required.";
}

function renderAssignedToContactList(contacts) {
  const list = document.getElementById("assigned-to-options");
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    let selectedAttrValue = "";
    let checkboxSrc = "./assets/img/checkbox-unchecked.svg";
    const contact = contacts[i];
    if (selectedContactIds.indexOf(contact.id) !== -1) {
      selectedAttrValue = " selected";
      checkboxSrc = "./assets/img/checkbox-checked-white.png";
    }
    html += renderAssignedToContactListItemHtml(
      contact,
      selectedAttrValue,
      checkboxSrc
    );
  }
  list.innerHTML = html;
}

function renderAssignedToContactListItemHtml(
  contact,
  selectedAttrValue,
  checkboxSrc
) {
  let html = "";
  html = /*html*/ `<li class="assign-to-li${selectedAttrValue}" value="${contact.id}">`;
  html += renderContactBubbleHtml(contact);
  html += /*html*/ `<span class="assign-to-li-name">${contact.name}</span>
        <img src=${checkboxSrc} /></li>`;
  return html;
}

function filterAssignedToContacts() {
  const searchTerm = document
    .getElementById("assigned-to-input")
    .value.toLowerCase();
  const assignedToList = document.getElementById("assigned-to-options");
  const listItems = assignedToList.querySelectorAll("li");
  if (searchTerm === "") {
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      listItem.style.display = "flex";
    }
  } else {
    const results = filterContactListByName(searchTerm);
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      if (results.find((contact) => contact.id === listItem.value)) {
        listItem.style.display = "flex";
      } else {
        listItem.style.display = "none";
      }
    }
  }
}