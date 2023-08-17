const subtaskEl = document.getElementById('subtasks-container');
let subtasks = [];
function initSubtaskInput() {
    subtaskEl.firstElementChild.addEventListener('focus', toggleSubtaskIcons);
    subtaskEl.firstElementChild.addEventListener('blur', toggleSubtaskIcons);
    document.getElementById('add-subtask').addEventListener('click', () => setFocusToElement(subtaskEl.firstElementChild));
    document.getElementById('cancel-subtask').addEventListener('click', cancelSubtask);
    document.getElementById('save-subtask').addEventListener('click', saveSubtask);
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

function saveSubtask() {
    const input = document.getElementById('subtasks-input');
    subtasks.push(input.value);
    input.value = '';
    input.focus();
    toggleSubtaskIcons();
    console.log(subtasks);
}

// window.onload = initSubtaskInput;