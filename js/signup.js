/**calls init functions for form, checkboxes, back navigation and policy checkbox */
function init() {
    initForm();
    initCheckboxes();
    initBackNavigator();
    initPolicyCheckbox(); //MUST be excecuted after initCheckboxes!
}

/**validates all fields are filled out and password entries match each other. */
async function validateSignUpForm(e) {
    const form = e.target;
    let formIsValid = true;
    const formElements = form.querySelectorAll('input, textarea, select');
    for (let i = 0; i < formElements.length; i++) {
        const formElement = formElements[i];
        if (formElement.id === 'confirm-password-input') {
            validatePasswordConfirmation(formElement);
        }
        formElement.checkValidity();
        if (!formElement.validity.valid) {
            formIsValid = false;
        }
        document.getElementById(`${formElement.id}-error`).textContent = formElement.validationMessage;
    }
    e.preventDefault();
    if (!formIsValid) {
        form.classList.add('is-validated');
    } else {
        let newUser = await addUser();
        await newUserToContact(newUser);
        saveContacts();
        showSignUpNotification('notification', 'notification-ref');
    }
}

/**gets values from add user form and adds a new user to array, then saves array to backend 
 * @returns the new USer for further work.
*/
async function addUser() {
    let newUser = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value, //ja, wir wissen, dass man das in der Praxis nicht so macht =)
        initials: getInitials(),
        id: await getContactID(),
    }
    userList.push(newUser);
    await setItemInBackend('userList', JSON.stringify(userList));
    return newUser
}

/**
 * Saving the new registered User as Contact for himself.
 * @param {Object} newUser The just registered new User
 */
async function newUserToContact(newUser) {
    let newContact = {
        id: newUser.id,
        startingLetter: getStartingLetter(newUser.name),
        name: newUser.name,
        e_mail: newUser.email,
        phone: ' ',
        initials: getInitials(),
        color: getColor(),
    }
    contactList.push(newContact)
}

/**called upon successful sign up. triggers notification animation and positions notification right above the form button */
function showSignUpNotification(elementId, refElementId) {
    let top = document.getElementById(refElementId).getBoundingClientRect().top + 'px';
    document.documentElement.style.setProperty('--notification-top-target', top);
    document.getElementById(elementId).classList.add('triggered');
    setTimeout(() => {
        window.location.href = './login.html';
    }, 800);
}

/**adds function to privacy policy checkbox and disables button */
function initPolicyCheckbox() {
    document.getElementById('accept-privacy-policy').addEventListener('click', toggleSignUpBtn);
    document.getElementById('sign-up-btn').disabled = true;
}

/**when the privacy policy checkbox is checked by the user, enables the sign up button */
function toggleSignUpBtn(e) {
    document.getElementById('sign-up-btn').disabled = !e.target.classList.contains('checked');
}

window.onload = init;