let docWidth;
let screenType;
let loaded;
let initials = 'SM';
let currentPage = 'summary.html';
let STORAGE_TOKEN = 'G1OERBUF0NPIB8DLZPT41ZZ5I569IQR3G99JW22P';


/**
 * Inits getting the Templates
 */
function initTemplates() {
    getTemplates()
}

/**
 * Checks Screen Width and sets the global variable loaded to 'mobile' or 'desktop'.
 * @returns  form of actual Screen.
 */
function getScreenType() {
    let htmlDocument = document.getElementsByTagName('html');
    let docWidth = htmlDocument[0].offsetWidth;
    if (docWidth < 820) {
        screenType = 'mobile';
    } else if (docWidth > 820) {
        screenType = 'desktop';
    }
    return screenType;
}

/**
 * Loads in the needed Templates for Desktop or Mobile Version
 */
async function getTemplates() {
    getScreenType()
    if (screenType == 'mobile') {
        await getMatchingTemplate('mobile-template', 'desktop-template')
        loaded = 'mobile';
    } else if (screenType == 'desktop') {
        await getMatchingTemplate('desktop-template', 'mobile-template')
        loaded = 'desktop';
    }
}

/**
 * Checks, if Screentyoe still matches the actual loaded Template Versions.
 */
window.onresize = function () {
    if (getScreenType() != loaded) {
        getTemplates()
    }
}

/**
 * Loads in templates for needed Version, (Mobile or Desktop) unloads the other templates, if needed.
 * Then triggers a function to mark the actual Side on the template.
 * @param {string} toLoadID - The ID of the html-template, that has to be loaded.
 * @param {string} toUnloadID - The ID of that html-template, that has to be unloaded.
 */
async function getMatchingTemplate(toLoadID, toUnloadID) {
    let includeElement = document.getElementById(toLoadID);
    const element = includeElement;
    file = element.getAttribute("include-templates"); // "assets/templates/desktop_template.html" or mobile_template.html
    let resp = await fetch(file);
    if (resp.ok) {
        element.innerHTML = await resp.text();
    } else {
        element.innerHTML = 'Page not found';
    }
    unloadTemplate(toUnloadID)
    showInitialsHeader(initials)
    markCorrectMenuPoint()
}

/**
 * Undloads the not needed Template.
 * @param {*} toUnloadID ID of to unload Template
 */
function unloadTemplate(toUnloadID) {
    let toUnload = document.getElementById(toUnloadID);
    toUnload.innerHTML = '';
}

/**
 * Initials of current User are going to be written into the Header Circle.
 * If there are no, then its a "G" for "Guest User".
 * @param {string} initials - Initials of current User.
 * 
 */
function showInitialsHeader(initials) {
    let svgText = document.getElementById('svg_text');
    if (initials) { svgText.textContent = initials; } else { svgText.textContent = 'G'; }
}

/**  
 * Marks Point on the Sider/Footer that is currently open.
 */
function markCorrectMenuPoint() {
    let activeSide = getDocumentName()

    let toChoose = document.getElementById(activeSide + "ID");
    if (toChoose) {
        toChoose.classList.add('Choosen_field');
    } else {
        let helpIcon = document.getElementById('header_help_icon_d');
        helpIcon.classList.add('d-none');
    }
}

/**  
 * Returns name of actual page, for marking the right Spot on header/footer in "markCorrectMenuPoint()"
 */
function getDocumentName() {
    var path = window.location.pathname;
    var path = path.split("/").pop();
    let page = path.split(".html");
    return page[0];
}

/**
 * Saves current Page in local Storage, so its possible to return later.
 */
function getHelp() {
    let originSide = getDocumentName();
    localStorage.setItem('originSide', JSON.stringify(originSide));
    window.location.href = "/help.html";
}

function backToOrigin() {
    let originSideFromLocalStorage = localStorage.getItem('originSide');

    if (originSideFromLocalStorage) {
        let test = JSON.parse(originSideFromLocalStorage);
        originSide = test;
        localStorage.removeItem(originSide);
        window.location.href = "/" + originSide + ".html";
    }
}

async function setItemInBackend(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch('https://remote-storage.developerakademie.org/', { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItemInBackend(key) {
    const url = `https://remote-storage.developerakademie.org/?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}

function showNotification(elementId) {
    document.getElementById(elementId).classList.add('triggered');
}