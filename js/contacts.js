let contactList;
// = [
//     {
//         startingLetter: 'A',
//         name: 'Anja Schulz',
//         e_mail: 'schulz@hotmail.com',
//         phone: 9102423513,
//         initials: 'AS',
//         color: '#FF7A00',
//     },
//     {
//         startingLetter: 'A',
//         name: 'Anton Mayer',
//         e_mail: 'anton@gmail.com',
//         phone: 491233521,
//         initials: 'AM',
//         color: '#6E52FF',
//     },
//     {
//         startingLetter: 'B',
//         name: 'Benjamin Schulz',
//         e_mail: 'bschulz@hotmail.com',
//         phone: 0o742334542,
//         initials: 'BS',
//         color: '#00BEE8',
//     },
//     {
//         startingLetter: 'Z',
//         name: 'Zendaya Sowas',
//         e_mail: 'sowas@gmx.de',
//         phone: 49876543,
//         initials: 'ZS',
//         color: '#FF7A00',
//     },
// ]

let ballColorCollection = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',]
// If no Color: #D1D1D1

/**
 * 
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
            <span class="Contact_div d-flex align-items-center" onclick="openContact(${i})">
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

/**
 * Opens Div to add new Contact
 */
function startAddContact() {
    let shader = document.getElementById('shader_div');
    shader.style.display = 'flex';
    let workDiv = document.getElementById('addContact_div');
    workDiv.style.display = 'flex';
}

/**
 * Shows the choosen Contact at the side of the screen (Mobile: New Screen)
 * @param {Number} i - Index in the contactList - JSON-Array
 */
function openContact(i) {
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
                     <a href="#" onclick="deleteContact(${i})" id="delete_contact_btn" class="Contact_stage_btn">
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
}

/**
 * Opens window to edit a contact
 * @param {Number} i - Index in contactList-JSON Array 
 */
function editContact(i) {
    let contact = contactList[i]

}
/**
 * Deletes choosen Contact
 * @param {Number} i - Index in contactList-JSON Array 
 */
function deleteContact(i) {
    let contact = contactList[i]

}

/**
 * Just closes divs, but doesnt delete Data
 * @param {String} wichDiv - ID of the div, that has to be closed.
 */
function closeContactProcess(wichDiv) {
    let shader = document.getElementById('shader_div');
    shader.style.display = 'none';
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
function createContact() {

    let newContact = {
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
