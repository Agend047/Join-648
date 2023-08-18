const subtaskEl = document.getElementById('subtasks-container');
const backdrop = document.getElementById('category-backdrop');
let subtasks = [];
function initAddTaskPage() {
    initSubtaskInput();
    initCategoryInput();
}

function initSubtaskInput() {
    subtaskEl.firstElementChild.addEventListener('focus', toggleSubtaskIcons);
    subtaskEl.firstElementChild.addEventListener('blur', toggleSubtaskIcons);
    document.getElementById('add-subtask').addEventListener('click', () => setFocusToElement(subtaskEl.firstElementChild));
    document.getElementById('cancel-subtask').addEventListener('click', cancelSubtask);
    document.getElementById('save-subtask').addEventListener('click', addSubtask);
}

function initCategoryInput() {
    document.getElementById('category-input-container').addEventListener('click', toggleDropdown);
    const categoryOptions = document.getElementById('category-options').querySelectorAll('li');
    for (let i = 0; i < categoryOptions.length; i++) {
        const option = categoryOptions[i];
        option.addEventListener('click', selectCategory);
    }
}

function selectCategory(e) {
    const input = document.getElementById('category-input');
    input.value = e.target.textContent;
    toggleDropdown();
}

// function toggleDropdown() {
//     const dropdownImg = document.getElementById('dropdown-arrow');
//     const list = document.getElementById('category-options');
//     const backdrop = document.getElementById('category-backdrop');
//     const input = document.getElementById('category-input-container');
//     if (list.classList.contains('d-none')) {
//         dropdownImg.src = './assets/img/arrow_dropdown_up.png';
//         backdrop.addEventListener('click', toggleDropdown);
//         input.style.zIndex = 2;
//         list.style.zIndex = 1;
//     } else {
//         dropdownImg.src = './assets/img/arrow_dropdown_down.png';
//         backdrop.removeEventListener('click', toggleDropdown);
//         input.style.zIndex = 0;
//         list.style.zIndex = 0;
//     }
//     list.classList.toggle('d-none');
//     backdrop.classList.toggle('d-none');
// }

function toggleDropdown(ev) {
    const formControl = ev.currentTarget.parentElement;
    const list = formControl.querySelector('ul');
    if (list.classList.contains('d-none')) {
        expandDropdown(formControl);
    } else {
        collapseDropdown(formControl);
    }
}

function expandDropdown(formControl) {
    const inputContainer = formControl.querySelector('.input');
    const dropdownImg = inputContainer.querySelector('img');
    const list = formControl.querySelector('ul');
    dropdownImg.src = './assets/img/arrow_dropdown_up.png';
    backdrop.addEventListener('click', () => collapseDropdown(formControl));
    inputContainer.style.zIndex = 2;
    list.style.zIndex = 1;
    list.classList.toggle('d-none');
    backdrop.classList.toggle('d-none');
}

function collapseDropdown(formControl) {
    const inputContainer = formControl.querySelector('.input');
    const dropdownImg = inputContainer.querySelector('img');
    const list = formControl.querySelector('ul');
    dropdownImg.src = './assets/img/arrow_dropdown_down.png';
    backdrop.removeEventListener('click', () => collapseDropdown(formControl));
    inputContainer.style.zIndex = 0;
    list.style.zIndex = 0;
    list.classList.toggle('d-none');
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

// window.onload = initSubtaskInput;