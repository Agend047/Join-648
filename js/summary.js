function loadHelloPageMobile() {
  let htmlDocument = document.getElementsByTagName("html");
  docWidth = htmlDocument[0].offsetWidth;
  if (docWidth < 820) {
    let helloPage = document.createElement("div");
    helloPage.innerHTML = generateHelloPageHTML();

    // Insert the helloPage before the mobileTemplate
    let main = document.querySelector("main");
    main.parentNode.insertBefore(helloPage, main);

    fadeOutHelloPage(helloPage);
  }
}

function generateHelloPageHTML() {
  return `
    <div id="helloPageMobile" class="">
    <span>Good morning,</span>
    <h1 class="blue-text">Sofia Müller</h1>
    </div>
    `;
}

function fadeOutHelloPage(helloPage) {
  setTimeout(function () {
    helloPage.classList.add("fadeOut");
  }, 1500);

  helloPage.addEventListener("transitionend", function () {
    helloPage.style.display = "none";
  });
}

function changeIcon(Id, url) {
  document.getElementById(Id).src = `./assets/img/${url}`;
}
