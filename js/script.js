let docWidth;
let loaded;
let initials = 'SM'

/**
 * Checks width of shown screen, loads templates as needed and saves wich version has been loaded in global Variable.
 */
function checkWidth() {
    let htmlDocument = document.getElementsByTagName('html');
    docWidth = htmlDocument[0].offsetWidth;
    if (docWidth < 600) {
        getMatchingTemplate('mobile-template', 'desktop-template')
        loaded = 'mobile'
    } else if (docWidth > 600) {
        getMatchingTemplate('desktop-template', 'mobile-template')
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
        getMatchingTemplate('mobile-template', 'desktop-template')
        loaded = 'mobile';
    } else if (docWidth > 600 && loaded == 'mobile') {
        getMatchingTemplate('desktop-template', 'mobile-template')
        loaded = 'desktop';
    }
}

/**
 * Loads in templates for needed Version, (Mobile or Desktop) unloads the other templates, if needed.
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
 * Shows helb Document
 */
function openHelp() {
    alert("Help div is not ready!")
}

/**
 * @param {Number} i - Index of the Menu Point, that is choosen.
 */
function changeMenuColor(i) {
    removechoosen()
    giveChoosen(i)
}

function removechoosen() {
    let notAnymoreArray = document.getElementsByClassName('Choosen_field')
    if (notAnymoreArray.length > 0) {
        for (i in notAnymoreArray) {
            notAnymoreArray[i].classList.remove('Choosen_field')
        }
    }
}

function giveChoosen(i) {
    let choosenField = document.getElementById('menuPoint' + i);
    choosenField.classList.add('Choosen_field')
}