function init() {
    initForm();
    initCheckboxes();
    initBackNavigator();
    initPolicyCheckbox(); //MUST be excecuted after initCheckboxes!
}

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
        await addUser();
        showSignUpNotification('notification', 'notification-ref');
    }
}

async function addUser() {
    let newUser = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value, //ja, wir wissen, dass man das in der Praxis nicht so macht =)
        initials: getInitials(),
    }
    userList.push(newUser);
    await setItemInBackend('userList', JSON.stringify(userList));
}

function showSignUpNotification(elementId, refElementId) {
    let top = document.getElementById(refElementId).getBoundingClientRect().top + 'px';
    document.documentElement.style.setProperty('--notification-top-target', top);
    document.getElementById(elementId).classList.add('triggered');
    setTimeout(() => {
        window.location.href = './login.html';
    }, 800);
}

function initPolicyCheckbox() {
    document.getElementById('accept-privacy-policy').addEventListener('click', toggleSignUpBtn);
    document.getElementById('sign-up-btn').disabled = true;
}

function toggleSignUpBtn(e) {
    document.getElementById('sign-up-btn').disabled = !e.target.classList.contains('checked');
}

window.onload = init;