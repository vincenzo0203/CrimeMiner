function loadPage(delay) {
    startLoading(delay)
}

/* function simulateLoading(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay); // Simula un caricamento lungo quanto il valore inserito al posto di delay
    });
} */

function startLoading(delay) {
    document.querySelector(".loadingContainer").style.display = 'flex';

    setTimeout(() => {
        document.querySelector(".loadingContainer").style.display = 'none';
    }, delay);
}