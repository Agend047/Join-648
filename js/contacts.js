let exampleContacts = [
    {
        startingLetter: 'A',
        name: 'Anja Schulz',
        e_mail: 'schulz@hotmail.com',
        phone: 9102423513,
        initials: 'AS',
        color: 'orange',
    },
    {
        startingLetter: 'B',
        name: 'Benjamin Schulz',
        e_mail: 'bschulz@hotmail.com',
        phone: 0o742334542,
        initials: 'BS',
        color: 'blue',
    }

]

let ballColorCollection = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B',]
// If no Color: #D1D1D1

function startAddContact() {
    alert('Patience!')
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
