const subtaskEl = document.getElementById('subtasks-container');
const backdrop = document.getElementById('backdrop');
let formControl;
let subtasks = [];
async function initAddTaskPage() {
    initSubtaskInput();
    initClearBtn();
    initForm();
    initAddContactOverlayForm();
    document.getElementById('add-contact-btn').addEventListener('click', () => document.getElementById('add-contact-overlay').showModal());
    document.getElementById('add-contact-btn').addEventListener('click', () => document.getElementById('add-contact-overlay').showModal());
    await getContacts();
    renderAssignedToContactList(contactList);
    initSelectInputs();
}

function initAddContactOverlayForm() {
    const dialogEl = document.getElementById('add-contact-overlay');
    const closeBtns = dialogEl.querySelectorAll('.close-icn');
    for (let i = 0; i < closeBtns.length; i++) {
        const closeBtn = closeBtns[i];
        closeBtn.addEventListener('click', () => {
            dialogEl.close();
        })
    }
}

async function getContacts() {
    contactList = await getItemFromBackend('contactList');
}

function initClearBtn(ev) {
    document.getElementById('clear-btn').addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById('addtask-form').reset();
        document.getElementById('selected-contacts').innerHTML = '';
        document.getElementById('subtasks-list').innerHTML = '';
        renderAssignedToContactList(contactList);
    });
}

function initSubtaskInput() {
    subtaskEl.firstElementChild.addEventListener('focus', toggleSubtaskIcons);
    subtaskEl.firstElementChild.addEventListener('blur', toggleSubtaskIcons);
    document.getElementById('add-subtask').addEventListener('click', () => setFocusToElement(subtaskEl.firstElementChild));
    document.getElementById('cancel-subtask').addEventListener('click', cancelSubtask);
    document.getElementById('save-subtask').addEventListener('click', addSubtask);
}

function initSelectInputs() {
    const selectElements = document.getElementsByClassName('select-input');
    for (let i = 0; i < selectElements.length; i++) {
        const element = selectElements[i];
        const list = element.parentElement.querySelector('ul');
        element.addEventListener('click', toggleDropdown);
        switch (list.id) {
            case 'category-options':
                initCategorySelectItems(list);
                break;
            case 'assigned-to-options':
                element.addEventListener('click', activateSearchInput);
                element.querySelector('img').addEventListener('click', toggleDropdown);
                element.querySelector('img').addEventListener('click', activateSearchInput);
                initAssignedToSelectItems(list);
                break;
        }
    }
}

function activateSearchInput(e) {
    e.stopPropagation();
    formControl = document.getElementById('assigned-to-form-control');
    const input = formControl.querySelector('input');
    const inputContainer = formControl.querySelector('.input');
    document.getElementById('selected-contacts').classList.toggle('d-none');
    input.readOnly = false;
    input.value = '';
    input.focus();
    input.addEventListener('keyup', filterAssignedToContacts);
    inputContainer.removeEventListener('click', toggleDropdown);
    inputContainer.removeEventListener('click', activateSearchInput);
    inputContainer.querySelector('img').removeEventListener('click', activateSearchInput);
    inputContainer.querySelector('img').addEventListener('click', deactivateSearchInput);
    inputContainer.classList.add('search-active');
    backdrop.addEventListener('click', deactivateSearchInput);
}

function deactivateSearchInput(e) {
    e.stopPropagation();
    formControl = document.getElementById('assigned-to-form-control');
    const input = formControl.querySelector('input');
    const inputContainer = formControl.querySelector('.input');
    document.getElementById('selected-contacts').classList.toggle('d-none');
    input.removeEventListener('keyup', filterAssignedToContacts);
    input.value = '';
    filterAssignedToContacts();
    input.readOnly = true;
    input.value = "Select contacts to assign";
    inputContainer.addEventListener('click', toggleDropdown);
    inputContainer.addEventListener('click', activateSearchInput);
    inputContainer.querySelector('img').addEventListener('click', activateSearchInput);
    inputContainer.querySelector('img').removeEventListener('click', deactivateSearchInput);
    inputContainer.classList.remove('search-active');
    backdrop.removeEventListener('click', deactivateSearchInput);
}

function initCategorySelectItems(list) {
    const categoryOptions = list.querySelectorAll('li');
    for (let i = 0; i < categoryOptions.length; i++) {
        const option = categoryOptions[i];
        option.addEventListener('click', selectCategory);
    }
}

function initAssignedToSelectItems(list) {
    const contacts = list.querySelectorAll('li');
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contact.addEventListener('click', toggleContactSelection);
    }
}

function selectCategory(e) {
    const input = document.getElementById('category-input');
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
    const listContainer = formControl.querySelector('.select-options-container');
    if (listContainer.classList.contains('d-none')) {
        expandDropdown();
    } else {
        collapseDropdown();
    }
}

function expandDropdown() {
    const inputContainer = formControl.querySelector('.input');
    const dropdownImg = inputContainer.querySelector('img');
    const listContainer = formControl.querySelector('.select-options-container');
    dropdownImg.src = './assets/img/arrow_dropdown_up.png';
    backdrop.addEventListener('click', collapseDropdown);
    inputContainer.style.zIndex = 2;
    listContainer.style.zIndex = 1;
    listContainer.classList.toggle('d-none');
    backdrop.classList.toggle('d-none');
}

function collapseDropdown() {
    const inputContainer = formControl.querySelector('.input');
    const dropdownImg = inputContainer.querySelector('img');
    const listContainer = formControl.querySelector('.select-options-container');
    dropdownImg.src = './assets/img/arrow_dropdown_down.png';
    backdrop.removeEventListener('click', collapseDropdown);
    inputContainer.style.zIndex = 0;
    listContainer.style.zIndex = 0;
    listContainer.classList.toggle('d-none');
    backdrop.classList.toggle('d-none');
}

function toggleSubtaskIcons() {
    if (subtaskEl.firstElementChild.value === '') {
        const elements = subtaskEl.getElementsByTagName('img')
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.classList.toggle('d-none');
        }
    }
}

function setFocusToElement(element) {
    element.focus();
}

function cancelSubtask() {
    document.getElementById('subtasks-input').value = '';
    toggleSubtaskIcons();
}

function addSubtask() {
    const input = document.getElementById('subtasks-input');
    if (input.value) {
        subtasks.push(input.value);
        input.value = '';
        input.focus();
        toggleSubtaskIcons();
        renderSubtasks();
    }
}

function renderSubtasks() {
    const subtasksList = document.getElementById('subtasks-list');
    subtasksList.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        subtasksList.innerHTML += renderNewListItemHtml(subtask, i);
    }
}

function renderNewListItemHtml(subtask, index) {
    let html;
    html = '<li class="subtask">';
    html += renderListItemHtml(subtask, index);
    html += '</li>';
    return html;
}

function renderListItemHtml(subtask, index) {
    return /*html*/`
    <img src="./assets/img/bullet.png" class='bullet-icon'><input type="text" class="no-validation" readonly value="${subtask}"/>
    <div class="subtask-read-icons subtask-icons"><img src="./assets/img/pencil.png" class='edit-subtask-icon input-icon cursor-pointer' onclick="editSubtask(${index})"/><img
      src="./assets/img/subtask-separator.png"
    /><img src="./assets/img/trash-bin.png" class="input-icon cursor-pointer" onclick="deleteSubtask(${index})"/></div>
    <div class="subtask-edit-icons subtask-icons"><img src="./assets/img/trash-bin.png" class="input-icon cursor-pointer" onclick="deleteSubtask(${index})"/><img
      src="./assets/img/subtask-separator.png"
    /><img src="./assets/img/subtask-save.png" class="input-icon cursor-pointer" onclick="updateSubtask(${index})"/></div>`
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}

function editSubtask(index) {
    const subtasksList = document.getElementById('subtasks-list');
    const subtaskListEl = subtasksList.children[index];
    subtaskListEl.classList.add('subtask-edit');
    subtaskListEl.querySelector('input').readOnly = false;
}

function updateSubtask(index) {
    const subtasksList = document.getElementById('subtasks-list');
    const subtaskListEl = subtasksList.children[index];
    const subtask = subtaskListEl.querySelector('input').value;
    subtaskListEl.classList.remove('subtask-edit');
    subtasks[index] = subtask;
    subtaskListEl.innerHTML = renderListItemHtml(subtask, index);
}

function toggleContactSelection(event) {
    const listItem = event.currentTarget;
    listItem.classList.toggle('selected');
    const selectedContactsEl = document.getElementById('selected-contacts');
    if (listItem.classList.contains('selected')) {
        listItem.querySelector('img').src = './assets/img/checkbox-checked-white.png';
        selectedContactsEl.innerHTML += renderContactBubbleHtml(getContactById(listItem.value));
    } else {
        listItem.querySelector('img').src = './assets/img/checkbox-unchecked.svg';
        selectedContactsEl.getElementsByClassName('contact-bubble-' + listItem.value)[0].remove();
    }
}

function renderContactBubbleHtml(contact) {
    return /*html*/`<svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="contact-bubble-${contact.id}"
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
  </svg>`
}

function getContactById(id) {
    return contactList.find((contact) => contact.id === id);
}

function validateAddTaskForm(e) {
    e.preventDefault();
    const form = e.target;
    let formIsValid = true;
    let prioValidationMessage;
    const formElements = form.querySelectorAll('input:not([type="radio"]):not(.no-validation), textarea, div.custom-validation');
    for (let i = 0; i < formElements.length; i++) {
        const formElement = formElements[i];
        if (formElement.classList.contains('custom-validation')) {
            switch (formElement.id) {
                case 'assigned-to-input':
                    formElement.readOnly = false;
                    validateAssignedToInput(formElement);
                    break;
                case 'prio-inputs':
                    prioValidationMessage = validatePrioInput(formElement);
                    break;
                case 'category-input':
                    formElement.readOnly = false;
                    validateCategoryInput(formElement);
                    break;
            }
        }
        if (formElement.id === 'prio-inputs') {
            if (prioValidationMessage !== '') {
                formIsValid = false;
            }
            document.getElementById(`${formElement.id}-error`).textContent = prioValidationMessage;
        } else {
            document.getElementById(`${formElement.id}-error`).textContent = formElement.validationMessage;
            if (!formElement.validity.valid) {
                formIsValid = false;
            }
        }
        if (formElement.id === 'assigned-to-input' || formElement.id === 'category-input') {
            formElement.readOnly = true;
        }
    }
    if (!formIsValid) {
        form.classList.add('is-validated');
    } else {
        addTask();
        showNotification('notification', './board.html');
    }
}

function validateCategoryInput(formElement) {
    if (formElement.value === 'Select task category') {
        formElement.setCustomValidity("This field is required.");
    } else {
        formElement.setCustomValidity("");
    }
}

function validatePrioInput(formElement) {
    const inputs = formElement.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.checked) {
            return '';
        }
    }
    return 'This field is required.';
}

function validateAssignedToInput(formElement) {
    const assignedToCount = document.getElementById('selected-contacts').children.length;
    if (assignedToCount > 0) {
        formElement.setCustomValidity('');
    } else {
        formElement.setCustomValidity('Assign this task to at least one contact.');
    }
}

function renderAssignedToContactList(contacts) {
    const list = document.getElementById('assigned-to-options');
    let html = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        html += renderAssignedToContactListItemHtml(contact);
    }
    list.innerHTML = html;
}

function renderAssignedToContactListItemHtml(contact) {
    let html = '';
    html = /*html*/`<li class="assign-to-li" value="${contact.id}">`;
    html += renderContactBubbleHtml(contact);
    html += /*html*/`<span class="assign-to-li-name">${contact.name}</span>
        <img src="./assets/img/checkbox-unchecked.svg" /></li>`
    return html;
}

function filterAssignedToContacts() {
    const searchTerm = document.getElementById('assigned-to-input').value.toLowerCase();
    const assignedToList = document.getElementById('assigned-to-options');
    const listItems = assignedToList.querySelectorAll('li');
    if (searchTerm === '') {
        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            listItem.style.display = 'flex';
        }
    }
    else {
        const results = filterContactListByName(searchTerm);
        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            if (results.find((contact) => contact.id === listItem.value)) {
                listItem.style.display = 'flex';
            } else {
                listItem.style.display = 'none';
            }
        }
    };
}

function filterContactListByName(nameQuery) {
    const results = contactList.filter((contact) => {
        const names = contact.name.toLowerCase().split(' ');
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

async function addTask() {
    let newTask = {
        title: document.getElementById('title-input').value,
        description: document.getElementById('description-input').value,
        assignedTo: getAssignedToArrayFromForm(),
        priority: getPriorityFromForm(),
        dueDate: document.getElementById('due-date-input').value,
        category: document.getElementById('category-input').value,
        subtasks: getSubtasksFromForm()
    }
    taskList.push(newTask);
    await setItemInBackend('taskList', JSON.stringify(taskList));
}

function getSubtasksFromForm() {
    let subtasksArray = [];
    const inputs = document.getElementById('subtasks-list').querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        subtasksArray.push(input.value);
    }
    return subtasksArray;
}

function getPriorityFromForm() {
    const prioInputs = document.getElementById('prio-inputs').querySelectorAll('input');
    for (let i = 0; i < prioInputs.length; i++) {
        const prioInput = prioInputs[i];
        if (prioInput.checked) {
            return prioInput.value;
        }
    }
}

function getAssignedToArrayFromForm() {
    let assignedToArray = [];
    const selectedContactElements = document.getElementById('assigned-to-options').querySelectorAll('.selected');
    for (let i = 0; i < selectedContactElements.length; i++) {
        const element = selectedContactElements[i];
        assignedToArray.push(getContactById(element.value));
    }
    return assignedToArray;
}