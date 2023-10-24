//sono due funzioni che parlano da sole, setCookie modifica un cookie già creato in precedenza, non bisogna per forza usare
//tutti e 3 i paramentri ma anche solo i primi 2 vanno bene (per poter settare un cookie bisogna scrivere document.cookie =  "name=value")
function setCookie(name, value, options = {}) {

    options = {
        //path: '/',
        // aggiungi altri percorsi di default se necessario
        //...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

//getCookie, dato un cookie restituisce il suo valore
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}