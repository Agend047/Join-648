function animateSplashScreen() {
    const SPLASH_DURATION = 1000;
    setTimeout(startSplashAnimation, SPLASH_DURATION);
    setTimeout(changeLogo, SPLASH_DURATION + 250);
    setTimeout(removeSplash, SPLASH_DURATION + 1000);
}

function startSplashAnimation() {
    document.getElementById('login-logo').classList.add('splash-moving');
    document.getElementById('splash-login-bg').classList.add('splash-moving');
}

function changeLogo() {
    document.getElementById('login-logo').src = './assets/img/join_logo_black.png'
}

function removeSplash() {
    document.getElementById('splash-login-bg').classList.add('d-none');
    document.getElementById('splash-login-bg').classList.remove('splash-moving');
    document.getElementById('login-logo').classList.remove('splash-moving');
    document.getElementById('login-logo').classList.remove('splash-active');
    document.getElementById('header').classList.remove('splash-active');
}