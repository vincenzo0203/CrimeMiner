//funzione che crea un caricamento fittizio
function loadPage(delay) {
    startLoading(delay)
}

//funzione che fa comparire la schermata di caricamento
function startLoading(delay) {
    document.querySelector(".loadingContainer").style.display = 'flex';

    setTimeout(() => {
        document.querySelector(".loadingContainer").style.display = 'none';
    }, delay);
}