let historyState = {};

//funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {

    //gestione dei cookie per pinnare o meno il menu
    /*if (!document.cookie.includes("pinnableMenu")){
        document.cookie = "pinnableMenu=unPinnable";
        unPinnable();
    }
    else if (getCookie("pinnableMenu") == "pinnable"){
        pinnable();
        document.querySelector(".navbar-toggler").click();
    }        
    else
        unPinnable();*/

    //funzione che controlla se ci sono pagine da caricare all'inizio
    /*if (document.cookie.includes("page")){
        let page = getCookie("page");
        if(page != ""){
            setCookie("page","");
            requestPage(page, page, "yes");
        }
    }
    else*/

    //inserisce la pagina iniziale nella cronologia delle pagine
    history.pushState(historyState, '', "");
};

//funzione che permette di ruotare la freccia dei sottomenu scambiando due classi inserite nell'scss
document.addEventListener('DOMContentLoaded', function() {
    var navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function() {
            if(navLink.querySelector('.sidebarIconArrow').classList.contains('sidebarIconToggleRight'))
                navLink.querySelector('.sidebarIconArrow').classList.replace('sidebarIconToggleRight','sidebarIconToggleDown');
            else
                navLink.querySelector('.sidebarIconArrow').classList.replace('sidebarIconToggleDown','sidebarIconToggleRight');
        });
    });
});

//funzione che carica le pagine all'interno del div con classe pageContent
function requestPage(page, state, push){
    let link = "/CrimeMiner/" + page;
    fetch(link, {
        method: "GET"
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Errore nella richiesta.');
        }
    })
    .then(data => {
        if(push == "yes")
            history.pushState({ page: page }, '', state);
        document.querySelector(".pageContent").innerHTML = data;
        selectionPage(page);
        //chiude il menu laterale
        document.querySelector(".arrowLeftMenu").click();
    })
    .catch(error => {
        console.error(error);
    });
}

//funzione che richiama il metodo load delle varie pagine
function selectionPage(page){
    if(page == "chiamate_individui")
        individualWiretaps();
}

//funzione che si occupa della gestione delle finestre della single page application (SPA)
window.addEventListener("popstate", function(event) {
    if (event.state) {
        let newState = event.state;
        console.log(newState.page)

        if(newState.page != undefined)
            requestPage(newState.page, newState.page, "no")
        else
            document.querySelector(".pageContent").innerHTML = "";
    }
});


//FUNZIONI PER PINNARE IL MENU (attualmente disattivato ma funzionante, bisogna togliere nel caso i commenti anche nella window.onload)

//funzione che permette di pinnare o meno la sidebar laterale
/*function pinnableMenu() {
    if (getCookie("pinnableMenu") == "pinnable") {
        setCookie("pinnableMenu", "unPinnable");
        unPinnable();
    }
    else {
        setCookie("pinnableMenu", "pinnable");
        pinnable();
    }
}*/

//funzione che contiene al suo interno operazioni da fare quando il menu non è pinnatto
/*function unPinnable(){
    document.querySelector(".btnPinnableMenu").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="sidebarIcon" fill="currentColor" class="bi bi-pin-angle" viewBox="0 0 16 16">
                                                                    <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"/>
                                                                </svg>`;
    document.querySelector(".arrowLeftMenu").style.display = "block";
    document.querySelector(".pageContent").style.marginLeft = "0px";
}*/

//funzione che contiene al suo interno operazioni da fare quando il menu è pinnatto
/*function pinnable(){
    document.querySelector(".btnPinnableMenu").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="sidebarIcon" fill="currentColor"
                                                                    class="bi bi-pin" viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408-.002-.001.002.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z" />
                                                                </svg>`;
    document.querySelector(".arrowLeftMenu").style.display = "none";
    document.querySelector(".pageContent").style.marginLeft = "250px";
}*/