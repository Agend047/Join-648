function init() {
    checkWidth();
    if (loaded === 'desktop') {
        document.getElementById('login-logo').src = './assets/img/join_logo_black.png';
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
    document.getElementById('login-logo').classList.add('splash-moving');
    document.getElementById('splash-login-bg').classList.add('splash-moving');
}
/**Splash screen animation: This function changes the logo from the white to the black one during the splash screen animation. */
function changeLogo() {
    document.getElementById('login-logo').src = './assets/img/join_logo_black.png';
}
/**Splash screen animation: This function adds and removes classes to achieve the end result of the animation. */
function removeSplash() {
    document.getElementById('splash-login-bg').classList.add('d-none');
    document.getElementById('splash-login-bg').classList.remove('splash-moving');
    document.getElementById('login-logo').classList.remove('splash-moving');
    document.getElementById('login-logo').classList.remove('splash-active');
    document.getElementById('header').classList.remove('splash-active');
}