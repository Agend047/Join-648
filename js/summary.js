async function initSummary() {
  await getDataFromBackend();
  loadHelloPageMobile();
  showGreeting("greetingDesktop");
  greetGuestUser();
  showNumberOfTotalTasks();
}

function greetGuestUser() {
  if (location.search.includes("guestuser=true")) {
    modifyGreetingForGuestUser("greetingDesktop");
    modifyGreetingForGuestUser("greetingMobile");

    document.getElementById("userNameDesktop").style.display = "none";
    document.getElementById("userNameMobile").style.display = "none";
  }
}

function modifyGreetingForGuestUser(ID) {
  let greeting = document.getElementById(ID);
  greeting.innerHTML = greeting.innerHTML.replace(/,/g, "!");
}

function showNumberOfTotalTasks() {
  let tasksCount = document.getElementById("tasksCount");
  tasksCount.innerHTML = "";
  let totalTasks = taskList.length;
  tasksCount.innerHTML = totalTasks;
}

function showNumberOfTasks() {
  countTasksInArray("progressCount", "inprogress");
  countTasksInArray("feedbackCount", "feedback");
  countTasksInArray("doneCount", "done");
}

function countTasksInArray(ID, status) {
  let count = document.getElementById(ID);
  count.innerHTML = "";
  let tasksAmount = taskList[i]["status"].filter((x) => x === status).length;
  count.innerHTML = tasksAmount;
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
