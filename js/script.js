let docWidth;
let loaded;
let initials = 'SM'
let currentPage = 'summary.html';


/**
 * Checks width of shown screen, loads templates as needed and saves wich version has been loaded in global Variable.
 *
 * @param {boolean} trigger - Only used, if the templates shall not be loaded in. In that case, trigger is true.
 */
async function checkWidth(trigger) {
    let htmlDocument = document.getElementsByTagName('html');
    docWidth = htmlDocument[0].offsetWidth;
    if (docWidth < 820) {
        if (!trigger) { await getMatchingTemplate('mobile-template', 'desktop-template') }
        loaded = 'mobile'
    } else if (docWidth > 820) {
        if (!trigger) { await getMatchingTemplate('desktop-template', 'mobile-template') }
        loaded = 'desktop'
    }
}



/**
 * When Window gets resized, checks if the other template may have to be loaded.
 */
window.onresize = function () {
    let htmlDocument = document.getElementsByTagName('html');
    docWidth = htmlDocument[0].offsetWidth;
    if (docWidth < 820 && loaded == 'desktop') {
        getMatchingTemplate('mobile-template', 'desktop-template')
        loaded = 'mobile';
    } else if (docWidth > 820 && loaded == 'mobile') {
        getMatchingTemplate('desktop-template', 'mobile-template')
        loaded = 'desktop';
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
        toChoose.classList.add('Choosen_field')
    } else {
        let helpIcon = document.getElementById('header_help_icon_d');
        helpIcon.classList.add('d-none')
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
    let originSide = getDocumentName()
    localStorage.setItem('originSide', JSON.stringify(originSide));
    window.location.href = "/help.html";
}

function backToOrigin() {
    let originSideFromLocalStorage = localStorage.getItem('originSide');

    if (originSideFromLocalStorage) {
        let test = JSON.parse(originSideFromLocalStorage)
        originSide = test
        localStorage.removeItem(originSide);
        window.location.href = "/" + originSide + ".html";
    }
}




