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
  getTaskDestination();
}

/**Adds close function to close buttons of Add contact overlay form */
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

/**adds reset function to clear btn, resetting the entire add task form */
function initClearBtn() {
  document.getElementById("clear-btn").addEventListener("click", (ev) => {
    ev.preventDefault();
    document.getElementById("addtask-form").reset();
    document.getElementById("selected-contacts").innerHTML = "";
    document.getElementById("subtaskList").innerHTML = "";
    selectedContactIds = [];
    renderAssignedToContactList(contactList);
    initAssignedToSelectItems(document.getElementById("assigned-to-options"));
  });
}

/**adds selectCategory function to eacj category option */
function initCategorySelectItems(list) {
  const categoryOptions = list.querySelectorAll("li");
  for (let i = 0; i < categoryOptions.length; i++) {
    const option = categoryOptions[i];
    option.addEventListener("click", selectCategory);
  }
}

/**adds toggleContactSelection function to each contact list item in assigned to dropdown */
function initAssignedToSelectItems(list) {
  const contacts = list.querySelectorAll("li");
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contact.addEventListener("click", toggleContactSelection);
  }
}

/**sets category dropdown input to selected value and collapses dropdown */
function selectCategory(e) {
  const input = document.getElementById("category-input");
  input.value = e.target.textContent;
  collapseDropdown();
}

/**expands or collapses a clicked dropdown based on its current state */
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

/**expands dropdown: changing arrow image from down to up, displaying the list with options and setting a backdrop so nothing else can be selected */
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

/**collapses dropdown: changing arrow image from up to down, hiding the options list and backdrop */
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

/**toggles the subtask icons for either default (+) or editing (cancel and save) */
function toggleSubtaskIcons() {
  if (subtaskEl.firstElementChild.value === "") {
    const elements = subtaskEl.getElementsByTagName("img");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.classList.toggle("d-none");
    }
  }
}

/**sets focus to provided element */
function setFocusToElement(element) {
  element.focus();
}

/**deletes input text of subtask input and toggles buttons */
function cancelSubtask() {
  document.getElementById("subtasks-input").value = "";
  toggleSubtaskIcons();
}

/**adds subtask to array, resets subtask input to default and renders subtask list */
function addSubtask() {
  const input = document.getElementById("subtasks-input");
  if (input.value) {
    subtasks.push({ text: input.value, status: "todo" });
    input.value = "";
    input.focus();
    toggleSubtaskIcons();
    renderSubtasksInForm();
  }
}

/**loops through subtasksList array and calls render function for each subtask */
function renderSubtasksInForm() {
  const subtasksList = document.getElementById("subtaskList");
  subtasksList.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i].text;

    subtasksList.innerHTML += renderNewListItemHtml(subtask, i);
  }
}

/**renders one subtask list item */
function renderNewListItemHtml(subtask, index) {
  let html;
  html = '<li class="subtask">';
  html += renderListItemHtml(subtask, index);
  html += "</li>";
  return html;
}

/**renders innerHtml of one subtask list item */
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

/**deletes selected subtask from array and renders subtasks */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasksInForm();
}

/**sets subtask inline into edit mode */
function editSubtask(index) {
  const subtasksList = document.getElementById("subtaskList");
  const subtaskListEl = subtasksList.children[index];
  subtaskListEl.classList.add("subtask-edit");
  subtaskListEl.querySelector("input").readOnly = false;
}

/**saves edit to subtask array and render innerHtml of subtask */
function updateSubtask(index) {
  const subtasksList = document.getElementById("subtaskList");
  const subtaskListEl = subtasksList.children[index];
  const subtask = subtaskListEl.querySelector("input").value;
  subtaskListEl.classList.remove("subtask-edit");
  subtasks[index] = subtask;
  subtaskListEl.innerHTML = renderListItemHtml(subtask, index);
}

/**changes html (background-color and checkbox) of assigned to option reflecting user's (de)selection of option */
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

/**gets contact from contactlist by its Id */
function getContactById(id) {
  return contactList.find((contact) => contact.id === id);
}

/**validates form and displays error messages if not successful. If successful, contact is added and form is closed */
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

/**validates due date input to ensure it's neither empty nor the selected date is in the past */
function validateDueDateInput(formElement) {
  debugger;
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let inputDate = new Date(formElement.value);
  inputDate.setHours(0, 0, 0, 0);
  if (inputDate < today) {
    formElement.setCustomValidity("Date must not be in the past.");
  } else if (formElement.validity.valueMissing) {
    formElement.setCustomValidity("This field is required.");
  } else {
    formElement.setCustomValidity("");
  }
}

/**creates contact, saves it in backend, adds it to the selected assigned to options, adds contact bubble and resets add contact form */
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

/**validates add task form and calls custom validations if required */
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
        case "due-date-input":
          validateDueDateInput(formElement);
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

/**validates that category is selected */
function validateCategoryInput(formElement) {
  if (formElement.value === "Select task category") {
    formElement.setCustomValidity("This field is required.");
  } else {
    formElement.setCustomValidity("");
  }
}

/**validates that priority is selected */
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

/**loops through contacts and checks selectedContactIds array to check if the contact is selected. Sets arguments for call of render function for list items. */
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

/**renders assigned to contact list item depending on whether that contact is currently selected */
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

/**filters assigned to contact list based on user input. checks for each name if it starts with user input */
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

/** Disable selection of previous dates in datepicker */
// Get the current date in the "YYYY-MM-DD" format
const currentDate = new Date().toISOString().split("T")[0];

// Set the min attribute of the input field to the current date
document.getElementById("due-date-input").min = currentDate;
