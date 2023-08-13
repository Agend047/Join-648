function init() {
    initForm();
    initCheckboxes();
    initBackNavigator();
}

function validateSignUpForm(e) {
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
    if (!formIsValid) {
        e.preventDefault();
        form.classList.toggle('is-validated');
    }
}

function showSignUpNotification(elementId, refElementId) {
    let top = document.getElementById(refElementId).getBoundingClientRect().top + 'px';    
    document.documentElement.style.setProperty('--notification-top-target', top);
    document.getElementById(elementId).classList.add('triggered');
    setTimeout(() => {
        window.location.href = './login.html';
    }, 800);
}

window.onload = init;