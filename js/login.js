const headerEl = document.getElementById("header");

function init() {
  handleStartAnimation();
  initForm();
  initCheckboxes();
  initBackNavigator();
  initGuestLoginBtn();
  getStoredUserData();
}

function initGuestLoginBtn() {
  document
    .getElementById("guest-login-btn")
    .addEventListener("click", () =>
      sessionStorage.setItem("loggedIn", "true")
    );
}

function getStoredUserData() {
  if (loginData) {
    document.getElementById("email-input").value = loginData.email;
    document.getElementById("password-input").value = loginData.password;
    document.getElementById("remember-me").click();
  }
}

function validateLoginForm(e) {
  e.preventDefault();
  const form = e.target;
  let formIsValid = true;
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const user = getUserByEmail(emailInput.value);
  if (!user) {
    passwordInput.setCustomValidity("Email and/or password are incorrect.");
    formIsValid = false;
  } else {
    validatePassword(passwordInput, emailInput.value);
    passwordInput.checkValidity();
    if (!passwordInput.validity.valid) {
      formIsValid = false;
    }
  }
  document.getElementById(`${passwordInput.id}-error`).textContent =
    passwordInput.validationMessage;
  if (!formIsValid) {
    form.classList.add("is-validated");
  } else {
    proceedLogin(user);
  }
}

function proceedLogin(user) {
  if (document.getElementById("remember-me").classList.contains("checked")) {
    localStorage.setItem("loggedIn", JSON.stringify(true));
    localStorage.setItem("loginData", JSON.stringify(user));
  } else {
    sessionStorage.setItem("loggedIn", JSON.stringify(true));
    localStorage.setItem("loginData", "");
    localStorage.setItem("loggedIn", "false");
  }
  sessionStorage.setItem("activeUser", JSON.stringify(user));
  window.location.href = "./summary.html";
}

function validateLoginEmailInput(formElement) {
  if (getUserByEmail(formElement.value)) {
    formElement.setCustomValidity("");
  } else {
    formElement.setCustomValidity(
      "This combination of user and password does not exist."
    );
  }
}

window.onload = init;
