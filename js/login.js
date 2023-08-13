const headerEl = document.getElementById('header');

function init() {
    handleStartAnimation();
    initForm();
    initCheckboxes();
    initBackNavigator();
}

function handleStartAnimation() {
    const appStarted = getSessionData();
    if (!appStarted) {
        getAnimationHtml();
        const loginLogoEl = document.getElementById('login-logo');
        checkWidth(true);
        if (loaded === 'desktop') {
            loginLogoEl.src = './assets/img/join_logo_black.png';
        }
        animateSplashScreen();
    }
}

function getSessionData() {
    const appStarted = JSON.parse(sessionStorage.getItem('appStarted'));
    if (!appStarted) { sessionStorage.setItem('appStarted', 'true'); }
    return appStarted;
}

function getAnimationHtml() {
    document.body.innerHTML += `<div id="splash-login-bg"></div>
    <img
      src="./assets/img/join_logo_white.png"
      alt="Join logo"
      class="img-large splash-active"
      id="login-logo"
    />`;
}

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


function initCheckboxes() {
    const checkboxes = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        checkbox.addEventListener('click', toggleCheckbox);
        checkbox.addEventListener('mouseover', toggleCheckboxHover);
        checkbox.addEventListener('mouseout', toggleCheckboxHover);
    }
}

function initBackNavigator() {
    const backNavigator = document.getElementById('back-navigation-img');
    if (!backNavigator) { return; }
    backNavigator.addEventListener('mouseover', toggleBackIconOnHover);
    backNavigator.addEventListener('mouseout', toggleBackIconOnHover);
}

/**Splash screen animation: This function coordinates the splash screen animation by calling three sub-functions with increasing timeouts. Change of delay requires change of login.css rules (transition property) as well */
function animateSplashScreen() {
    const SPLASH_DURATION = 1000;
    setTimeout(startSplashAnimation, SPLASH_DURATION);
    setTimeout(changeLogo, SPLASH_DURATION + 250);
    setTimeout(removeSplash, SPLASH_DURATION + 1000);
}
/**Splash screen animation: This functions starts the splash screen animation by adding the 'splash-moving' class to the logo and background container. */
function startSplashAnimation() {
    const loginLogoStaticEl = document.getElementById('login-logo-static');
    const splashLoginBgEl = document.getElementById('splash-login-bg');
    const loginLogoEl = document.getElementById('login-logo');
    loginLogoEl.classList.add('splash-moving');
    splashLoginBgEl.classList.add('splash-moving');
    loginLogoStaticEl.classList.add('splash-active');
}
/**Splash screen animation: This function changes the logo from the white to the black one during the splash screen animation. */
function changeLogo() {
    const loginLogoEl = document.getElementById('login-logo');
    loginLogoEl.src = './assets/img/join_logo_black.png';
}
/**Splash screen animation: This function adds and removes classes to achieve the end result of the animation. */
function removeSplash() {
    const splashLoginBgEl = document.getElementById('splash-login-bg');
    const loginLogoEl = document.getElementById('login-logo');
    const loginLogoStaticEl = document.getElementById('login-logo-static');
    splashLoginBgEl.classList.add('d-none');
    splashLoginBgEl.classList.remove('splash-moving');
    loginLogoEl.classList.remove('splash-moving');
    loginLogoEl.classList.remove('splash-active');
    loginLogoEl.classList.add('d-none');
    loginLogoStaticEl.classList.remove('splash-active');
}

function toggleBackIconOnHover(ev) {
    if (ev.type === 'mouseover') {
        this.src = './assets/img/arrow-left-hover.png';
    } else {
        this.src = './assets/img/arrow-left-line.png';
    }
}

function toggleCheckboxHover(ev) {
    if (ev.type === 'mouseover') {
        if (this.classList.contains('checked')) {
            this.src = './assets/img/checkbox-checked-hover.png';
        } else {
            this.src = './assets/img/checkbox-unchecked-hover.png';
        }
    } else {
        if (this.classList.contains('checked')) {
            this.src = './assets/img/checkbox-checked.svg';
        } else {
            this.src = './assets/img/checkbox-unchecked.svg';
        }
    }
}

/**Toggle checkbox: changes src attribute of checkbox img based on the checked class attribute and toggles the checked class attribute. */
function toggleCheckbox() {
    const checkboxEl = this;
    if (checkboxEl.classList.contains('checked')) {
        checkboxEl.src = './assets/img/checkbox-unchecked.svg';
    } else {
        checkboxEl.src = './assets/img/checkbox-checked.svg';
    }
    checkboxEl.classList.toggle('checked');
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
        form.classList.toggle('is-validated');
    }
}

function validateSignUpForm(e) {
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
        form.classList.toggle('is-validated');
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

window.onload = init;