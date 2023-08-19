let ballColorCollection = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',]
// If no Color: #D1D1D1

/**
 * Creates the visible contact list out of the backend Data 
 */
async function showContacts() {
    let list = document.getElementById('contacts_list');
    list.innerHTML = '';
    let assignedLetter = '';
    contactList = await getItemFromBackend('contactList');
    for (i in contactList) {
        let contact = contactList[i];
        if (assignedLetter != contact.startingLetter) {
            list.innerHTML += /*html*/`
                <figure class="letter_div">${contact.startingLetter}</figure>
                <figure class="seperate_div"></figure>
            `
            assignedLetter = contact.startingLetter;
        }
        list.innerHTML += /*html*/`
            <span id="contact_div${i}"class="Contact_div d-flex align-items-center" onclick="openContact(${i})">
                <div class="Initiald_svg_div">
                    <svg width="50" height="50" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="21" cy="21" r="20" fill="${contact.color}" stroke="white" stroke-width="2" />
                         <text style="font-size: small;" x="11" y="25" fill="white">${contact.initials}</text>
                    </svg>
                </div>
                <div class="Name_Mail_div">
                    <p>${contact.name}</p>
                    <p class="Mail_text">${contact.e_mail}</p>
                </div>
            </span>
        `
    }
}


/**sets shader */
function activateShader() {
    let shader = document.getElementById('shader_div');
    shader.style.display = 'flex';
}

/**disables shader */
function deactivateShader() {
    let shader = document.getElementById('shader_div');
    shader.style.display = 'none';
}

/**
 * Opens Div to add new Contact
 */
function startAddContact() {
    activateShader()
    let workDiv = document.getElementById('addContact_div');
    workDiv.style.display = 'flex';
}

/**
 * Shows the choosen Contact at the side of the screen (Mobile: New Screen)
 * @param {Number} i - Index in the contactList - JSON-Array
 */
function openContact(i) {
    markContact(i)
    let contact = contactList[i]
    let stage = document.getElementById('contacts_stage')
    stage.innerHTML = '';
    stage.innerHTML += /*html*/`
        <span class="Stage_head d-flex align-items-center">
            <div id="initial_ball_big" style="background-color: ${contact.color}" class="d-flex">${contact.initials}</div>
            <div id="stage_head_right">
                <p id="contact_name">${contact.name}</p>
                <div class=" d-flex align-items-center">
                    <a href="#" onclick="editContact(${i})" id="edit_contact_btn" class="Contact_stage_btn">
                        <img src="assets/img/contacts_editContact_icon.png" alt="">
                                Edit
                    </a>
                     <a href="#" onclick="startDeleteProcess(${i})" id="delete_contact_btn" class="Contact_stage_btn">
                        <img src="assets/img/contacts_deleteContacts_icon.png" alt="">
                                Delete
                    </a>
                </div>
            </div>
        </span>
        <span class="Contacts_stage_data">
            <p>Contact Information</p>
            <h5>E-Mail</h5>
            <p class="Mail_text">${contact.e_mail}</p>
            <h5>Phone</h5>
            <p>${contact.phone}</p>
        </span>
    `
    showInMobile()
}

/**Unmarks former marked contact, and marks the contact that was choosen. */
function markContact(i) {
    try {
        let formerChoosen = document.querySelector('.Contact_div_choosen')
        formerChoosen.classList.remove('Contact_div_choosen')
    }
    catch { }
    let choosen = document.getElementById('contact_div' + i)
    choosen.classList.add('Contact_div_choosen');
}

function showInMobile() {
    if (loaded == 'mobile') {
        let stage = document.getElementById('contacts_stage');
        stage.style.display = 'flex';
    }
}

/**
 * Opens window to edit a contact
 * @param {Number} i - Index in contactList-JSON Array 
 */
function editContact(i) {
    let contact = contactList[i]
}

/**Showing an alert over a shader, before final deleting. */
function startDeleteProcess(i) {
    activateShader()
    showConfirmAlert(i)
}

/**Fills the delete-confirm-alert with information and functions. */
function showConfirmAlert(i) {
    let deleteAlert = document.getElementById('delete_question')

    deleteAlert.innerHTML = /*html*/`
        <div class="align-items-center">
            <p>Do you really want to delete <br><j id="show_deleting_name">${contactList[i].name}</j>?</p>
            <div id="" class="delete_btn_div">
                <button class="btn btn-secondary" onclick="closeContactProcess('delete_question')">Cancel</button>
                <button id='deleteBtn' onclick="deleteContact(${i}), closeContactProcess('delete_question')" class="btn btn-primary">Confirm</button>
            </div>
        </div>
    `
    deleteAlert.style.display = 'block';
}

/**
 * Deletes choosen Contact
 * @param {Number} i - Index in contactList-JSON Array 
 */
function deleteContact(i) {
    contactList.splice(i, 1)
    deactivateShader()
    saveContacts()
    cleanupMess()
}

/** After deleting a contact, unused html text gets removed. */
function cleanupMess() {
    let deleteAlert = document.getElementById('delete_question');
    deleteAlert.innerHTML = '';
    deleteAlert.style.display = 'none';

    let stage = document.getElementById('contacts_stage');
    stage.innerHTML = '';
}


/**
 * Just closes divs, but doesnt delete Data
 * @param {String} wichDiv - ID of the div, that has to be closed.
 */
function closeContactProcess(wichDiv) {
    deactivateShader()
    let workDiv = document.getElementById(wichDiv);
    workDiv.style.display = 'none';
}

/**
 * Deletes input and then calls a function to close the open windows.
 * @param {String} wichDiv -  ID of the div, that has to be closed.
 */
function cancleAddContact(wichDiv) {
    let nameInput = document.getElementById('name-input');
    let emailInput = document.getElementById('email-input');
    let phoneInput = document.getElementById('phone-input');

    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';

    closeContactProcess(wichDiv)
}

/**
 * Creates new contact for contactList
 */
async function createContact() {

    let newContact = {
        id: await getID(),
        startingLetter: getStartingLetter(document.getElementById('name-input').value),
        name: document.getElementById('name-input').value,
        e_mail: document.getElementById('email-input').value,
        phone: document.getElementById('phone-input').value,
        initials: getInitials(),
        color: getColor(),
    }
    contactList.push(newContact)
    saveContacts()
    cancleAddContact('addContact_div')
}


/**Counts ID's in backend, and returns one for the new contact. */
async function getID() {
    let id = await getItemFromBackend('contactIDcounter');
    let newID = Number(id) + 1;
    await setItemInBackend('contactIDcounter', newID);
    return newID;
}

/**
 * Gets first letter of a string for Initials and startingletter
 * @param {String} toGet - The string, from wich we need the first letter
 * @returns first letter of a word in Uppercase
 */
function getStartingLetter(toGet) {
    let nameArray = toGet.split('');
    return nameArray[0].toUpperCase();
}

/**
 * @returns Initials of the name in the input field
 */
function getInitials() {
    let name = document.getElementById('name-input');
    let nameArray = name.value.split(' ');
    return getStartingLetter(nameArray[0]) + getStartingLetter(nameArray[1]);
}

/**
 * Picks a random color for the new contact
 */
function getColor() {
    let random = Math.floor(Math.random() * 15);
    return ballColorCollection[random]
}

/**
 * Sotzs, saves and shows contactList. Gets called after change in contactsList
 */
async function saveContacts() {
    sortContacts();
    await setItemInBackend('contactList', contactList);
    showContacts()
}

/**
 * Sorts the contact List in alphabetical order
 */
function sortContacts() {
    contactList.sort(function (a, b) {
        a = a.startingLetter.toLowerCase();
        b = b.startingLetter.toLowerCase();

        return a < b ? -1 : a > b ? 1 : 0;
    });
}

/**
 * Checks, if the Phone NUmber is an actual number, or wont allow it as part of the Phone Number.
 * @param {object} evt -Typed Key at the "Phone Number" field.
 * @returns true, if the typed Key was a Numbers Key, or false, if not.
 */
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) { return false; }

    return true;
}