//funzione che permette di ruotare la freccia dei sottomenu scambiando due classi inserite nell'scss
document.addEventListener('DOMContentLoaded', function() {
    let navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function() {
            if(navLink.querySelector('.sidebarIconArrow').classList.contains('sidebarIconToggleRight'))
                navLink.querySelector('.sidebarIconArrow').classList.replace('sidebarIconToggleRight','sidebarIconToggleDown');
            else
                navLink.querySelector('.sidebarIconArrow').classList.replace('sidebarIconToggleDown','sidebarIconToggleRight');
        });
    });
});