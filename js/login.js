const headerEl = document.getElementById('header');

function init() {
    handleStartAnimation();
    initForm();
    initCheckboxes();
    initBackNavigator();
}

function validateLoginForm(e) {
    e.preventDefault();
    const form = e.target;
    let formIsValid = true;
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const user = getUserByEmail(emailInput.value);
    if (!user) {
        passwordInput.setCustomValidity('Email and/or password are incorrect.');
        formIsValid = false;
    } else {
        validatePassword(passwordInput, emailInput.value);
        passwordInput.checkValidity();
        if (!passwordInput.validity.valid) {
            formIsValid = false;
        }
    }
    document.getElementById(`${passwordInput.id}-error`).textContent = passwordInput.validationMessage;
    if (!formIsValid) {
        form.classList.add('is-validated');
    } else {
        proceedLogin();
    }
}

function proceedLogin() {
    if (document.getElementById('remember-me').classList.contains('checked')) {
        localStorage.setItem('loggedIn', JSON.stringify(true));
    } else {
        sessionStorage.setItem('loggedIn', JSON.stringify(true));
    }
    window.location.href = './summary.html';
}

function validateLoginEmailInput(formElement) {
    if (getUserByEmail(formElement.value)) {
        formElement.setCustomValidity('');
    } else {
        formElement.setCustomValidity('This combination of user and password does not exist.');
    }
}

window.onload = init;