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