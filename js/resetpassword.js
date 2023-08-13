function init() {
    initForm();
    initCheckboxes();
    initBackNavigator();
}

function validateResetPasswordForm(e) {
    const form = e.target;
    let formIsValid = true;
    const formElements = form.querySelectorAll('input, textarea, select');
    for (let i = 0; i < formElements.length; i++) {
        const formElement = formElements[i];
        if (formElement.id === 'confirm-password-input') {
            validatePasswordConfirmation(formElement);
        }
        formElement.checkValidity();
        if (!formElement.validity.valid) {
            formIsValid = false;
        }
        document.getElementById(`${formElement.id}-error`).textContent = formElement.validationMessage;
    }
    e.preventDefault();
    if (!formIsValid) {
        form.classList.toggle('is-validated');
    } else { showNotification('notification', "./login.html"); }
}

window.onload = init;