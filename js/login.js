const headerEl = document.getElementById('header');

function init() {
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
    initLoginForm();
    initCheckboxes();
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

function getSessionData() {
    const appStarted = JSON.parse(sessionStorage.getItem('appStarted'));
    if (!appStarted) { sessionStorage.setItem('appStarted', 'true'); }
    return appStarted;
}

function initCheckboxes() {
    const checkboxes = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        checkbox.addEventListener('click', toggleCheckbox);
    }
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
/**Toggle checkbox: replaces svg code based on the checked class attribute and toggles the checked class attribute. */
function toggleCheckbox() {
    const checkboxEl = this;
    if (checkboxEl.classList.contains('checked')) {
        checkboxEl.innerHTML = '<rect x="4" y="4.96582" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>';
    } else {
        checkboxEl.innerHTML = '<path d="M20 11.9658V17.9658C20 19.6227 18.6569 20.9658 17 20.9658H7C5.34315 20.9658 4 19.6227 4 17.9658V7.96582C4 6.30897 5.34315 4.96582 7 4.96582H15" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/><path d="M8 12.9658L12 16.9658L20 5.46582" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    checkboxEl.classList.toggle('checked');
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.noValidate = true;
    loginForm.addEventListener('submit', validateLoginForm);
    const passwordInput = document.getElementById('password-input');
    passwordInput.addEventListener('focus', togglePasswordIcon);
    passwordInput.addEventListener('blur', togglePasswordIcon);
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

function validatePassword(formElement) {
    if (formElement.value === '') {
        formElement.setCustomValidity('Wrong password. Ups! Try again.');
    } else {
        formElement.setCustomValidity('');
    }
}

function togglePasswordIcon(e) {
    const iconEl = document.getElementById('password-icon');
    const inputEl = this;
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
    const inputEl = document.getElementById('password-input');
    const iconEl = this;
    if (inputEl.type === 'password') {
        inputEl.type = 'text';
        iconEl.src = './assets/img/visibility.png';
    } else {
        inputEl.type = 'password';
        iconEl.src = './assets/img/visibility_off.png';
    }
}

window.onload = init;