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
/**Splash screen animation: This function coordinates the splash screen animation by calling three sub-functions with increasing timeouts. */
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