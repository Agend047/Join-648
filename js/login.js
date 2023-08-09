const splashLoginBgEl = document.getElementById('splash-login-bg');
const loginLogoEl = document.getElementById('login-logo');
const loginLogoStaticEl = document.getElementById('login-logo-static');
const headerEl = document.getElementById('header');

function init() {
    checkWidth();
    if (loaded === 'desktop') {
        loginLogoEl.src = './assets/img/join_logo_black.png';
    }
    animateSplashScreen();
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
    loginLogoEl.classList.add('splash-moving');
    splashLoginBgEl.classList.add('splash-moving');
}
/**Splash screen animation: This function changes the logo from the white to the black one during the splash screen animation. */
function changeLogo() {
    loginLogoEl.src = './assets/img/join_logo_black.png';
}
/**Splash screen animation: This function adds and removes classes to achieve the end result of the animation. */
function removeSplash() {
    splashLoginBgEl.classList.add('d-none');
    splashLoginBgEl.classList.remove('splash-moving');
    loginLogoEl.classList.remove('splash-moving');
    loginLogoEl.classList.remove('splash-active');
    loginLogoEl.classList.add('d-none');
    loginLogoStaticEl.classList.remove('splash-active');
}
/**Toggle checkbox: replaces svg code based on the checked class attribute. */
function toggleCheckbox() {
    const checkboxEl = document.getElementById('remember-me');
    if (checkboxEl.classList.contains('checked')) {
        checkboxEl.innerHTML = '<rect x="4" y="4.96582" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>';
        checkboxEl.classList.remove('checked');
    } else {
        checkboxEl.innerHTML = '<path d="M20 11.9658V17.9658C20 19.6227 18.6569 20.9658 17 20.9658H7C5.34315 20.9658 4 19.6227 4 17.9658V7.96582C4 6.30897 5.34315 4.96582 7 4.96582H15" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/><path d="M8 12.9658L12 16.9658L20 5.46582" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        checkboxEl.classList.add('checked');
    }
}

function togglePasswordIcon() {
    const iconEl = document.getElementById('password-icon');
    const inputEl = document.getElementById('password-input');
    if (inputEl.classList.contains('initial')) {
        inputEl.classList.remove('initial');
        inputEl.classList.add('hidden');
        iconEl.src = './assets/img/visibility_off.png';
        iconEl.onclick = () => togglePasswordIcon('password-icon');
    }
    if (inputEl.classList.contains('hidden')) {
        iconEl.classList.remove('hidden');
        iconEl.classList.add('password-visible');
        document.getElementById('password-input').type = 'text';
        iconEl.src = './assets/img/visibility.png';
    }    
}