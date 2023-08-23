function loadHelloPageMobile() {
  if ((screenType = "mobile")) {
    let helloPage = document.createElement("div");
    helloPage.innerHTML = generateHelloPageHTML();

    // Insert the helloPage before the mobileTemplate
    let main = document.querySelector("main");
    main.parentNode.insertBefore(helloPage, main);
    showGreeting("greetingMobile");
    fadeOutHelloPage(helloPage);
  }
}

function generateHelloPageHTML() {
  return `
    <div id="helloPageMobile" class="">
    <span id="greetingMobile"></span>
    <h1 class="blue-text">Sofia Müller</h1>
    </div>
    `;
}

function fadeOutHelloPage(helloPage) {
  setTimeout(function () {
    helloPage.classList.add("fadeOut");
  }, 1100);

  helloPage.addEventListener("transitionend", function () {
    helloPage.style.display = "none";
  });
}

function changeIcon(Id, url) {
  document.getElementById(Id).src = `./assets/img/${url}`;
}

// Greeting the User

function getHour() {
  let day = new Date();
  return day.getHours();
}

function showGreeting(ID) {
  let hour = getHour();
  let greeting = document.getElementById(ID);

  if (hour >= 4 && hour < 12) {
    greeting.innerHTML = "Good morning,";
  }
  if (hour >= 12 && hour < 18) {
    greeting.innerHTML = "Good afternoon,";
  }
  if (hour >= 18 && hour < 22) {
    greeting.innerHTML = "Good evening,";
  }
  if (hour >= 22 && hour < 4) {
    greeting.innerHTML = "Good night,";
  }
}
