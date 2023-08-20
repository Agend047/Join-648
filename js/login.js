const headerEl = document.getElementById('header');

function init() {
    handleStartAnimation();
    initForm();
    initCheckboxes();
    initBackNavigator();
}

function validateLoginForm(e) {
    const form = e.target;
    let formIsValid = true;
    const formElements = form.querySelectorAll('input, textarea, select');
    for (let i = 0; i < formElements.length; i++) {
        const formElement = formElements[i];
        if (formElement.id === 'password-input') {
            validatePassword(formElement);
        }
        formElement.checkValidity();
        if (!formElement.validity.valid) {
            formIsValid = false;
        }
        document.getElementById(`${formElement.id}-error`).textContent = formElement.validationMessage;
    }
    if (!formIsValid) {
        e.preventDefault();
        form.classList.add('is-validated');
    }
}

window.onload = init;