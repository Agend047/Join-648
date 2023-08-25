async function initSummary() {
  loadHelloPageMobile();
  showGreeting("greetingDesktop");
  greetGuestUser();
  await getDataFromBackend();
  showTotalTasks();
  showTasks();
}

function greetGuestUser() {
  const isGuestUser = location.search.includes("guestuser=true");

  if (isGuestUser) {
    localStorage.setItem("isGuestUser", "true");
    modifyGreetingForGuestUser("greetingDesktop");
    modifyGreetingForGuestUser("greetingMobile");
    hideUserName();
  } else {
    const storedIsGuestUser = localStorage.getItem("isGuestUser");

    if (storedIsGuestUser === "true") {
      modifyGreetingForGuestUser("greetingDesktop");
      modifyGreetingForGuestUser("greetingMobile");
      hideUserName();
    }
  }
}

function hideUserName() {
  document.getElementById("userNameDesktop").style.display = "none";
  document.getElementById("userNameMobile").style.display = "none";
}

function modifyGreetingForGuestUser(ID) {
  let greeting = document.getElementById(ID);
  greeting.innerHTML = greeting.innerHTML.replace(/,/g, "!");
}

function showTotalTasks() {
  let tasksCount = document.getElementById("tasksCount");
  tasksCount.innerHTML = "";
  let totalTasks = taskList.length;
  tasksCount.innerHTML = totalTasks;
}

function showTasks() {
  showTaskAmount("progressCount", "status", "inprogress");
  showTaskAmount("feedbackCount", "status", "feedback");
  showTaskAmount("todoCount", "status", "todo");
  showTaskAmount("doneCount", "status", "done");
  showTaskAmount("urgentCount", "priority", "urgent");
}

function showTaskAmount(ID, property, propertyValue) {
  let task = document.getElementById(ID);
  task.innerHTML = filterTasksByProperty(property, propertyValue).length;
}

function filterTasksByProperty(property, propertyValue) {
  let filteredProperty = taskList.filter((x) => x[property] === propertyValue);
  return filteredProperty;
}

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
    <h1 class="blue-text" id="userNameMobile">Sofia Müller</h1>
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
