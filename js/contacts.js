let contactList = [
    {
        startingLetter: 'A',
        name: 'Anja Schulz',
        e_mail: 'schulz@hotmail.com',
        phone: 9102423513,
        initials: 'AS',
        color: '#FF7A00',
    },
    {
        startingLetter: 'A',
        name: 'Anton Mayer',
        e_mail: 'anton@gmail.com',
        phone: 491233521,
        initials: 'AM',
        color: '#6E52FF',
    },
    {
        startingLetter: 'B',
        name: 'Benjamin Schulz',
        e_mail: 'bschulz@hotmail.com',
        phone: 0o742334542,
        initials: 'BS',
        color: '#00BEE8',
    },
    {
        startingLetter: 'Z',
        name: 'Zendaya Sowas',
        e_mail: 'sowas@gmx.de',
        phone: 49876543,
        initials: 'ZS',
        color: '#FF7A00',
    },
]

let ballColorCollection = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',]
// If no Color: #D1D1D1

/**
 * 
 */
function showContacts() {
    let list = document.getElementById('contacts_list');
    list.innerHTML = '';
    let assignedLetter = '';
    // getItemInBackend('contactList')
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

// <figure class="letter_div">A</figure>
// <figure class="seperate_div"></figure>

function startAddContact() {
    let shader = document.getElementById('shader_div');
    shader.style.display = 'flex';
    let workDiv = document.getElementById('addContact_div');
    workDiv.style.display = 'flex';
}

function openContact(i) {
    alert('Soon')
}

function editContact() {
    alert('Edit')
}

function deleteContact() {
    alert('Delete!')
}


function closeContactProcess(wichDiv) {
    let shader = document.getElementById('shader_div');
    shader.style.display = 'none';
    let workDiv = document.getElementById(wichDiv);
    workDiv.style.display = 'none';
}

function cancleAddContact(wichDiv) {
    let nameInput = document.getElementById('name-input');
    let emailInput = document.getElementById('email-input');
    let phoneInput = document.getElementById('phone-input');

    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';

    closeContactProcess(wichDiv)
}

function saveContacts() {
    sortContacts()
    setItemInBackend('contactList', contactList)
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
