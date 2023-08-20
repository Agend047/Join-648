const subtaskEl = document.getElementById('subtasks-container');
const backdrop = document.getElementById('backdrop');
let formControl;
let subtasks = [];
async function initAddTaskPage() {
    initSubtaskInput();
    initClearBtn();
    initForm();
    await getContacts();
    renderAssignedToContactList(contactList);
    initSelectInputs();
}

async function getContacts() {
    contactList = await getItemFromBackend('contactList');
}

function initClearBtn() {
    document.getElementById('clear-btn').addEventListener('click', () => { document.forms[0].reset() })
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
    <img src="./assets/img/bullet.png" class='bullet-icon'><input type="text" readonly value="${subtask}"/>
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
    event.currentTarget.classList.toggle('selected');
    if (event.currentTarget.classList.contains('selected')) {
        event.currentTarget.querySelector('img').src = './assets/img/checkbox-checked-white.png';
    } else {
        event.currentTarget.querySelector('img').src = './assets/img/checkbox-unchecked.svg';
    }
}

function validateAddTaskForm(e) {
    const form = e.target;
    let formIsValid = true;
    let prioValidationMessage;
    const formElements = form.querySelectorAll('input:not([type="radio"]), textarea, div.custom-validation');
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
    e.preventDefault();
    if (!formIsValid) {
        form.classList.add('is-validated');
    } else {
        alert('Task created!');
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
    return /*html*/`<li class="assign-to-li" value="${contact.id}">
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 42 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="21"
                        cy="21"
                        r="20"
                        fill="#00BEE8"
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
                    <span class="assign-to-li-name">${contact.name}</span>
                    <img src="./assets/img/checkbox-unchecked.svg" />
                  </li>`
}

function filterAssignedToContacts() {
    const searchTerm = document.getElementById('assigned-to-input').value;
    if (searchTerm === '') {
        renderAssignedToContactList(contactList);
    }
    else {
        const results = contactList.filter((contact) => {
            const names = contact.name.toLowerCase().split(' ');
            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                if (name.startsWith(searchTerm)) {
                    return true;
                }
            }
            return false;
        });
        renderAssignedToContactList(results);
    }   
}
