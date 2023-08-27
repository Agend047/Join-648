async function initSummary() {
  greetUser();
  await getDataFromBackend();
  showTotalTasks();
  showTasks();
  showUpcomingDeadline();
}

function greetUser() {
  const isGuestUser = location.search.includes("guestuser=true");

  if (screenType === "mobile" && isGuestUser) {
    loadHelloPageMobile();
    greetGuestUser(isGuestUser, "greetingMobile", "userNameMobile");
  }
  if (screenType === "mobile" && activeUser) {
    loadHelloPageMobile();
    document.getElementById("userNameMobile").innerHTML = getUserName();
  } else if (screenType === "desktop" && isGuestUser) {
    showGreeting("greetingDesktop");
    greetGuestUser(isGuestUser, "greetingDesktop", "userNameDesktop");
  } else if (screenType === "desktop" && activeUser) {
    showGreeting("greetingDesktop");
    document.getElementById("userNameDesktop").innerHTML = getUserName();
  }
}

function greetGuestUser(isGuestUser, greetingID, nameID) {
  if (isGuestUser) {
    localStorage.setItem("isGuestUser", "true");
    modifyGreetingForGuestUser(greetingID);
    hideUserName(nameID);
  } else {
    const storedIsGuestUser = localStorage.getItem("isGuestUser");

    if (storedIsGuestUser === "true") {
      modifyGreetingForGuestUser(greetingID);
      hideUserName(nameID);
    }
  }
}

function hideUserName(ID) {
  document.getElementById(ID).style.display = "none";
}

function modifyGreetingForGuestUser(ID) {
  let greeting = document.getElementById(ID);
  greeting.innerHTML = greeting.innerHTML.replace(/,/g, "!");
}

function loadHelloPageMobile() {
  if (screenType === "mobile") {
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

///////////////////////////////////////////////////////////////////////
// Render Numbers from Board into Summary Page

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

///////////////////////////////////////////////////////////////////////
// Functions to display the formatted Upcoming Deadline on the Summary Page
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
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

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
  else if (currenthour >= 12 && currenthour < 18) {
    greeting.innerHTML = "Good afternoon,";
  }
  else if (currenthour >= 18 && currenthour < 22) {
    greeting.innerHTML = "Good evening,";
  } else {
    greeting.innerHTML = "Good night,";
  }
}

