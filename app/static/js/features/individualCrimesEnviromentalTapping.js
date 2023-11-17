//Variabile che conterrà il grafo che andremo a realizzare
let cyIndividualCrimesEnviromentalTapping;

//Variabili che ci consentono di tener traccia del nodo o dell'arco da far tornare come prima
let cyNodeTouchedIndividualCrimesEnviromentalTapping = "";
let cyEdgeTouchedIndividualCrimesEnviromentalTapping = "";

//Variabile che ci consente di tener traccia dell'id dell'utente quando si anonimizza
let cyNodeDataIndividualCrimesEnviromentalTapping  = "";

//Funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Intercettazione Ambientale e Reati commessi dagli Individui";

  //Funzione che fa partire il caricamento
  loadPage(2500);
  requestAllNodesIndividualCrimesEnviromentalTapping();

  //Comando che fa aprire all'avvio della pagina l'accordione delle proprietà
  document.querySelector("#item-properties").click();

  //Controllo se devo anonimizzare i dati
  if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      if(getCookie("anonymization") == "yes")
        document.querySelector("#CheckAnonymization").checked = true;
};

//Funzione che effettua la richiesta al backend per caricare il grafo iniziale
function requestAllNodesIndividualCrimesEnviromentalTapping() {
  fetch("/CrimeMiner/individuoReatoIntercettazioneAmb/findallgraph/", {
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
    data = JSON.parse(data);
    createGraphIndividualCrimesEnviromentalTapping(data);
    fillPropertyAccordionIndividualCrimesEnviromentalTapping(data);
    //fillSourceAndTargetModalNewCallIndividualCrimesEnviromentalTapping(data.nodes)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per le metriche
function requestSizeNodesIndividualCrimesEnviromentalTapping(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "findallgraph";
  else
    metric = document.querySelector(".selectMetrics").value;

  fetch("/CrimeMiner/individuoReatoIntercettazioneAmb/"+ metric +"/", {
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
    data = JSON.parse(data);
    changeSizeNodesIndividualCrimesEnviromentalTapping(data);
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo nodo
function requestDetailsOfNodeIndividualCrimesEnviromentalTapping(id){
  fetch("/CrimeMiner/individuoReatoIntercettazioneAmb/getIntercettazioneAmbIndividuoReatoInfoById/" + id, {
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
    data = JSON.parse(data);
    if(data.result[0].n != undefined)
      showDetailsOfNodeIndividualIndividualCrimesEnviromentalTapping(data.result[0].n)
    if(data.result[0].i != undefined)
      showDetailsOfNodeEnviromentalTappingIndividualCrimesEnviromentalTapping(data.result[0].i)
    if(data.result[0].r != undefined)
      showDetailsOfNodeCrimeIndividualCrimesEnviromentalTapping(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo arco
function requestDetailsOfEdgeIndividualCrimesEnviromentalTapping(id){
  fetch("/CrimeMiner/individuoReatoIntercettazioneAmb/getinfobyedgeid/" + id, {
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
    data = JSON.parse(data);
    showDetailsOfEdgeIndividualCrimesEnviromentalTapping(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che crea il grafo con le sue opportune proprietà
function createGraphIndividualCrimesEnviromentalTapping(data) {

  //Creazione del grafico con assegnazione alla variabile
  cyIndividualCrimesEnviromentalTapping = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
    style: [ // Stile dei nodi e degli archi
      {
        selector: '.Individuo',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#03a74f',
          'label': 'data(id)'
        }
      },
      {
        selector: '.Reato',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#c70c35',
          'label': 'data(id)'
        }
      },
      {
        selector: '.IntercettazioneAmb',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#d7bd1e',
          'label': 'data(id)'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier"
        }
      },
    ],
    layout: {
      name: 'circle', //dagre  //fcose
    },
    minZoom: 0.08,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualCrimesEnviromentalTapping.ready(function () {

    //Funzione di click per il nodo
    cyIndividualCrimesEnviromentalTapping.on('tap', 'node', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeIndividualCrimesEnviromentalTapping(evt.target.id())

      //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualCrimesEnviromentalTapping != "")
        cyIndividualCrimesEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualCrimesEnviromentalTapping).style('line-color', '#dfdfdf');

      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualCrimesEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualCrimesEnviromentalTapping[0] == "R")
            cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#c70c35');
          else if(cyNodeTouchedIndividualCrimesEnviromentalTapping[1] == "A")
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#03a74f');
      }

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedIndividualCrimesEnviromentalTapping = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click per l'arco
    cyIndividualCrimesEnviromentalTapping.on('tap', 'edge', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo arco
      requestDetailsOfEdgeIndividualCrimesEnviromentalTapping(evt.target.id())

      //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualCrimesEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualCrimesEnviromentalTapping[0] == "R")
            cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#c70c35');
          else if(cyNodeTouchedIndividualCrimesEnviromentalTapping[1] == "A")
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#03a74f');
      }

      //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualCrimesEnviromentalTapping != "" || evt.target.classes()[0] == "Individuo" || evt.target.classes()[0] == "Reato" || evt.target.classes()[0] == "IntercettazioneAmb")
        cyIndividualCrimesEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualCrimesEnviromentalTapping).style('line-color', '#dfdfdf');
      
      //Inserisco l'arco corrente nella variabile e gli cambio il colore
      cyEdgeTouchedIndividualCrimesEnviromentalTapping = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyIndividualCrimesEnviromentalTapping.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined ){

        //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
        if(cyEdgeTouchedIndividualCrimesEnviromentalTapping != ""){
          cyIndividualCrimesEnviromentalTapping.$("#"+ cyEdgeTouchedIndividualCrimesEnviromentalTapping).style('line-color', '#dfdfdf');
          cyEdgeTouchedIndividualCrimesEnviromentalTapping = "";
        }
        if(cyNodeTouchedIndividualCrimesEnviromentalTapping != ""){
          if(cyNodeTouchedIndividualCrimesEnviromentalTapping[0] == "R")
            cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#c70c35');
          else if(cyNodeTouchedIndividualCrimesEnviromentalTapping[1] == "A")
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#03a74f');
          cyNodeTouchedIndividualCrimesEnviromentalTapping = "";
        }
      }
    });

    //Con questa funzione, quando passo sull'arco, cambia colore
    cyIndividualCrimesEnviromentalTapping.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimesEnviromentalTapping)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
    cyIndividualCrimesEnviromentalTapping.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimesEnviromentalTapping)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

//Con questa funzione in base alla metrica decido di quanto moltiplicare il valore dei nodi per renderla visibile sul grafo
function changeSizeNodesIndividualCrimesEnviromentalTapping(data){
  let selectMetrics = document.querySelector(".selectMetrics").value;

  if(selectMetrics == "Default"){
    data = data.nodes;
    for(let i = 0; i < data.length; i++)
      cyIndividualCrimesEnviromentalTapping.$('#'+ data[i].data.id).data("size",data[i].data.size);
  }
  else{
    data = data.result;
    if(selectMetrics == "PageRank" || selectMetrics == "WeightedPageRank"|| selectMetrics == "Closeness")
    for(let i = 0; i < data.length; i++){
      cyIndividualCrimesEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*200);
    }

    if(selectMetrics == "Betweenness")
    for(let i = 0; i < data.length; i++){
      cyIndividualCrimesEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size/10);
    }

    if(selectMetrics == "Degree" || selectMetrics == "InDegree" || selectMetrics == "OutDegree")
    for(let i = 0; i < data.length; i++){
      cyIndividualCrimesEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*3);
    }
  }
}

//Con questa funzione cambio la visualizzazione del Layout del grafo tra circle, dagre e fcose
function changeLayoutIndividualCrimesEnviromentalTapping() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    loadPage(3000);

    cyIndividualCrimesEnviromentalTapping.layout({
      name: 'circle',
      animate: true,
      animationDuration: 2000
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    loadPage(8000);

    cyIndividualCrimesEnviromentalTapping.layout({
      name: 'dagre',
      rankDir: 'TB',
      ranker: 'longest-path',
      spacingFactor: 0.2,
      nodeSep: 120,
      edgeSep: 2,
      rankSep: 550,
      animate: true,
      animationDuration: 7000
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'fcose'){
    loadPage(3000);

    cyIndividualCrimesEnviromentalTapping.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true,
      animationDuration: 2000
    }).run();
  }

}

//Funzione che richiama la request delle metriche
function changeMetricIndividualCrimesEnviromentalTapping(){
  requestSizeNodesIndividualCrimesEnviromentalTapping();
}

//Funzione che anonimizza i dati dell'Individuo
function anonymizationNodeDetailsIndividualCrimesEnviromentalTapping(flag){

  if(flag == "yes"){
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    if(cyNodeDataIndividualCrimesEnviromentalTapping != ""){
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualSurnameContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.surname;
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNameContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.name;
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualBirthContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.date;
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNationContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.nation;
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualProvinceContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.province;
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualResidenceContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.city;
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualCapContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.cap;
      document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualAddressContent").innerHTML = cyNodeDataIndividualCrimesEnviromentalTapping.address;
    }
  }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdgesIndividualCrimesEnviromentalTapping(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualCrimesEnviromentalTapping.style()
    .resetToDefault()
    .selector('.Individuo')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f',
        'label': 'data(id)'
      })
    .selector('.Reato')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#c70c35',
        'label': 'data(id)'
      })
    .selector('.IntercettazioneAmb')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#d7bd1e',
        'label': 'data(id)'
      })
    .update();
  }
  else{
    cyIndividualCrimesEnviromentalTapping.style()
    .resetToDefault()
    .selector('.Individuo')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f'
      })
    .selector('.Reato')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#c70c35'
      })
    .selector('.IntercettazioneAmb')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#d7bd1e'
      })
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyIndividualCrimesEnviromentalTapping.style()
    .selector('edge')
        .style({
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier",
          'label': 'data(id)'
        })
    .update();
  }
  else{
    cyIndividualCrimesEnviromentalTapping.style()
    .selector('edge')
        .style({
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier"
        })
    .update();
  }
}

//Funzione che inserisce nei cookie il valore dell'anonimizzazione e chiama un'altra funzione per la modifica nel layout
function checkedAnonymizationIndividualCrimesEnviromentalTapping(){
  if(document.querySelector("#CheckAnonymization").checked == true){

    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=yes";
    else
      setCookie("anonymization","yes");
    
      anonymizationNodeDetailsIndividualCrimesEnviromentalTapping("yes");
  }
  else{
    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      setCookie("anonymization","no");
    
      anonymizationNodeDetailsIndividualCrimesEnviromentalTapping("no");
  }
}

//Funzione che mostra i dettagli dei nodi della tipologia Individuo
function showDetailsOfNodeIndividualIndividualCrimesEnviromentalTapping(data){
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividual").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualIdContent").innerHTML = data.nodeId;

  cyNodeDataIndividualCrimesEnviromentalTapping = JSON.parse(`{
                                                                "nodeId": "${data.nodeId}",
                                                                "surname": "${data.cognome}",
                                                                "name": "${data.nome}",
                                                                "date": "${data.dataNascita}",
                                                                "nation": "${data.nazioneResidenza}",
                                                                "province": "${data.provinciaResidenza}",
                                                                "city": "${data.cittaResidenza}",
                                                                "cap": "${data.capResidenza}",
                                                                "address": "${data.indirizzoResidenza}"
                                                              }`);

  if(getCookie("anonymization") == "yes"){

    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualSurnameContent").innerHTML = data.cognome;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNameContent").innerHTML = data.nome;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualBirthContent").innerHTML = data.dataNascita;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNationContent").innerHTML = data.nazioneResidenza;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualProvinceContent").innerHTML = data.provinciaResidenza;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualResidenceContent").innerHTML = data.cittaResidenza;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualAddressContent").innerHTML = data.indirizzoResidenza;
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli dei nodi della tipologia Reato
function showDetailsOfNodeEnviromentalTappingIndividualCrimesEnviromentalTapping(data){
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTapping").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Intercettazione Ambientale";

  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTappingIdContent").innerHTML = data.nodeId;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTappingDateContent").innerHTML = data.data;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTappingPlaceContent").innerHTML = data.luogo;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTappingContentContent").innerHTML = data.contenuto;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli dei nodi della tipologia Intercettazione Ambientale
function showDetailsOfNodeCrimeIndividualCrimesEnviromentalTapping(data){
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrime").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Reato";

  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrimeIdContent").innerHTML = data.nodeId;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrimeNameContent").innerHTML = data.name;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrimeNormsContent").innerHTML = data.normeDiRiferimento;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrimeMinMonthsContent").innerHTML = data.minMonths;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrimeMaxMonthsContent").innerHTML = data.maxMonths;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli degli archi
function showDetailsOfEdgeIndividualCrimesEnviromentalTapping(data){
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeCrime").style.display = "none";

  if(data.entityType == "HaChiamato"){
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrime").style.display = "none";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTapping").style.display = "none";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividual").style.display = "flex";

    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Chiamata";

    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualIdContent").innerHTML = data.edgeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualDateContent").innerHTML = data.data;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualDurationContent").innerHTML = data.durata;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualTimeContent").innerHTML = data.ora;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualSourceContent").innerHTML = data.sourceNodeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualTargetContent").innerHTML = data.targetNodeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualContentContent").innerHTML = data.contenuto;
  }

  if(data.entityType == "Condannato" || data.entityType == "ImputatoDi"){
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividual").style.display = "none";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTapping").style.display = "none";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrime").style.display = "flex";

    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeIdContent").innerHTML = data.edgeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeIndividualContent").innerHTML = data.sourceNodeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeCrimeContent").innerHTML = data.targetNodeId;

    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAggContainer").innerHTML = "";

    if(data.agg_id != undefined){
      document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAggTitle").style.display = "flex";
      
      for(let i=0; i<data.agg_id.length; i++){
        document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAggContainer").innerHTML += `
                                                                                        <div class="infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAgg d-flex">
                                                                                          <div class="infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAggId d-flex">
                                                                                            ${data.agg_id[i]}
                                                                                          </div>
                                                                                          <div class="infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAggDescription d-flex">
                                                                                            ${data.agg_desc[i]}
                                                                                          </div>
                                                                                          <div class="infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAggNorms d-flex">
                                                                                            ${data.agg_norm[i]}
                                                                                          </div>
                                                                                        </div>
                                                                                    `;
      }
    }
    else{
      document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrimeAggTitle").style.display = "none";
    }

    if(data.entityType == "ImputatoDi"){}
    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Imputazione";

    if(data.entityType == "Condannato")
      document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Condannato";
  }

  if(data.entityType == "Presente"){
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualCrime").style.display = "none";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividual").style.display = "none";
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTapping").style.display = "flex";

    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Presenza";

    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTappingIdContent").innerHTML = data.edgeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTappingIndividualContent").innerHTML = data.sourceNodeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTappingEnviromentalTappingContent").innerHTML = data.targetNodeId;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTappingMonthsEnteredContent").innerHTML = data.mesiImputati;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTappingMonthsSentenceContent").innerHTML = data.mesiCondanna;
    document.querySelector(".infoIndividualCrimesEnviromentalTappingEdgeIndividualEnviromentalTappingMonthsTotalContent").innerHTML = data.mesiTotali;
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra il numero di nodi e archi presenti nel grafo
function fillPropertyAccordionIndividualCrimesEnviromentalTapping(data){

  let counterIndividual = 0;
  let counterCrime = 0;
  let counterEnviromentalTapping = 0;

  let counterCall = 0;
  let counterSentence = 0;
  let counterImputation = 0;
  let counterPresent = 0;
  for(let i = 0; i < data.nodes.length; i++){
    if(data.nodes[i].classes == "Individuo")
      counterIndividual++;

    if(data.nodes[i].classes == "Reato")
      counterCrime++;

    if(data.nodes[i].classes == "IntercettazioneAmb")
      counterEnviromentalTapping++;
  }

  for(let i = 0; i < data.edges.length; i++){
    if(data.edges[i].data.classes == "HaChiamato")
      counterCall++;

    if(data.edges[i].data.classes == "Condannato")
      counterSentence++;

    if(data.edges[i].data.classes == "ImputatoDi")
      counterImputation++;

    if(data.edges[i].data.classes == "Presente")
      counterPresent++;
  }


  document.querySelector(".accordionNumberNodesEdgesIndividualContent").innerHTML = counterIndividual;
  document.querySelector(".accordionNumberNodesEdgesCrimesContent").innerHTML = counterCrime;
  document.querySelector(".accordionNumberNodesEdgesEnviromentalTappingContent").innerHTML = counterEnviromentalTapping;
  document.querySelector(".accordionNumberNodesEdgesCallContent").innerHTML = counterCall;
  document.querySelector(".accordionNumberNodesEdgesSentenceContent").innerHTML = counterSentence;
  document.querySelector(".accordionNumberNodesEdgesImputationContent").innerHTML = counterImputation;
  document.querySelector(".accordionNumberNodesEdgesPresentContent").innerHTML = counterPresent;
  
  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}