let docWidth;
let loaded;

/**
 * Checks width of shown screen, loads templates as needed and saves wich version has been loaded in global Variable.
 */
function checkWidth() {
    let htmlDocument = document.getElementsByTagName('html');
    docWidth = htmlDocument[0].offsetWidth;
    if (docWidth < 600) {
        getMatchingTemplate('mobile-template', 'desktop-template') //HERE
        loaded = 'mobile'
    } else if (docWidth > 600) {
        getMatchingTemplate('desktop-template', 'mobile-template') //HERE
        loaded = 'desktop'
    }
}

/**
 * When Window gets resized, checks if the other template may have to be loaded.
 */
window.onresize = function () {
    let htmlDocument = document.getElementsByTagName('html');
    docWidth = htmlDocument[0].offsetWidth;
    if (docWidth < 600 && loaded == 'desktop') {
        getMatchingTemplate('mobile-template', 'desktop-template') //HERE
        // getMobileTemplates()
        loaded = 'mobile';
    } else if (docWidth > 600 && loaded == 'mobile') {
        getMatchingTemplate('desktop-template', 'mobile-template') //HERE
        // getDesktopTemplates()
        loaded = 'desktop';
    }
}

/**
 * Loads in templates for needed Version, (Mobile or Desktop) unloads the other templates, if needed.
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
}


/**
 * Undloads the not needed Template.
 * @param {*} toUnloadID ID of to unload Template
 */
function unloadTemplate(toUnloadID) {
    let toUnload = document.getElementById(toUnloadID);
    toUnload.innerHTML = '';
}