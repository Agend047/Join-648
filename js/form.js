function initForm() {
    const form = document.forms[0];
    form.noValidate = true;
    let validationFunction;
    switch (form.id) {
        case 'login-form':
            validationFunction = validateLoginForm;
            break;
        case 'signup-form':
            validationFunction = validateSignUpForm;
            break;
        case 'resetpassword-form':
            validationFunction = validateResetPasswordForm;
            break;
        default:
            validationFunction = validateStandardForm;
            break;
    }
    form.addEventListener('submit', validationFunction);
    const passwordInputs = form.querySelectorAll('[type="password"]:has(+ img)');
    for (let i = 0; i < passwordInputs.length; i++) {
        const passwordInput = passwordInputs[i];
        passwordInput.addEventListener('focus', togglePasswordIcon);
        passwordInput.addEventListener('blur', togglePasswordIcon);
    }
}

function validateStandardForm(e) {
    const form = e.target;
    let formIsValid = true;
    const formElements = form.querySelectorAll('input, textarea, select');
    for (let i = 0; i < formElements.length; i++) {
        const formElement = formElements[i];
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

function validatePassword(formElement) {
    if (formElement.value === '') {
        formElement.setCustomValidity('Wrong password. Ups! Try again.');
    } else {
        formElement.setCustomValidity('');
    }
}

function validatePasswordConfirmation(formElement) {
    const password1 = document.getElementById('password-input').value;
    const password2 = document.getElementById('confirm-password-input').value;
    if (password1 !== password2) {
        formElement.setCustomValidity("Your passwords don't match. Try again.");
    } else {
        formElement.setCustomValidity("");
    }
}

function togglePasswordIcon(e) {
    const inputEl = this;
    const iconEl = inputEl.nextElementSibling;
    if (e.type === 'focus' && inputEl.value === '') {
        iconEl.addEventListener('click', togglePasswordVisibility);
        iconEl.classList.toggle('cursor-pointer');
        if (inputEl.type === 'password') {
            iconEl.src = './assets/img/visibility_off.png';
        } else {
            iconEl.src = './assets/img/visibility.png';
        }
    }
    else if (e.type === 'blur' && this.value === '') {
        iconEl.src = './assets/img/lock.png';
        iconEl.removeEventListener('click', togglePasswordVisibility);
        iconEl.classList.toggle('cursor-pointer');
    }
}

function togglePasswordVisibility() {
    const iconEl = this;
    const inputEl = iconEl.previousElementSibling;
    if (inputEl.type === 'password') {
        inputEl.type = 'text';
        iconEl.src = './assets/img/visibility.png';
    } else {
        inputEl.type = 'password';
        iconEl.src = './assets/img/visibility_off.png';
    }
}