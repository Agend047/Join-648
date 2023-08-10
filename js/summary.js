function loadHelloPageMobile() {
    let htmlDocument = document.getElementsByTagName('html');
    docWidth = htmlDocument[0].offsetWidth;
    if (docWidth < 820) {

        let helloPage = document.createElement("div");
        helloPage.innerHTML = `
            <div id="helloPageMobile" class="">
            <span>Good morning,</span>
            <h1 class="blue-text">Sofia Müller</h1>
            </div>
            `;
        
        // add the newly created element and its content into the DOM
        let main = document.querySelector('main');

        // Insert the helloPage before the mobileTemplate
        main.parentNode.insertBefore(helloPage, main);
        
        setTimeout(function() {
            helloPage.classList.add("fadeOut");
        }, 1500);

        helloPage.addEventListener("transitionend", function () {
        helloPage.style.display = "none";
        })
    } 
}

function changeIcon(Id, url) {
    document.getElementById(Id).src = `./assets/img/${url}`;
}