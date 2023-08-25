async function initSummary() {
  loadHelloPageMobile();
  showGreeting("greetingDesktop");
  greetGuestUser();
  await getDataFromBackend();
  showTotalTasks();
  showTasks();
  showUpcomingDeadline();
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

function showUpcomingDeadline() {
  let deadline = document.getElementById("deadline");
  let deadlinesArray = filteredDeadlines();

  if (deadlinesArray.length === 0) {
    deadline.innerHTML = `<div style="font-weight: 400; margin-bottom: 10px;">Sit back & relax:</div><div>No</div>`; // If no tasks are in Board, hence no deadlines to display.
  } else {
    deadline.innerHTML = formatUpcomingDeadline();
  }
}

function filteredDeadlines() {
  let deadlines = [];

  for (let x of taskList) {
    if (x.dueDate) {
      deadlines.push(x.dueDate);
    }
  }
  return deadlines;
}

function getUpcomingDeadline() {
  let deadlinesArray = filteredDeadlines();

  let sortedDeadlines = deadlinesArray.sort((a, b) => {
    let nearestDate = new Date(a.split("/").reverse().join("/"));
    let distantDate = new Date(b.split("/").reverse().join("/"));
    return distantDate - nearestDate;
  });

  let upcomingDeadline = sortedDeadlines[0];
  return upcomingDeadline;
}

function formatUpcomingDeadline() {
  let upcomingDeadline = getUpcomingDeadline();
  let months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  let datePartsAsArray = upcomingDeadline.split("/");
  let year = datePartsAsArray[2];
  let monthIndex = parseInt(datePartsAsArray[1]) - 1;
  let day = datePartsAsArray[0];

  let formattedDeadline = `${months[monthIndex]} ${day}, ${year}`;
  return formattedDeadline;
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

function currentHour() {
  let day = new Date();
  return day.getHours();
}

function showGreeting(ID) {
  let currenthour = currentHour();
  let greeting = document.getElementById(ID);

  if (currenthour >= 4 && currenthour < 12) {
    greeting.innerHTML = "Good morning,";
  }
  if (currenthour >= 12 && currenthour < 18) {
    greeting.innerHTML = "Good afternoon,";
  }
  if (currenthour >= 18 && currenthour < 22) {
    greeting.innerHTML = "Good evening,";
  } else {
    greeting.innerHTML = "Good night,";
  }
}
