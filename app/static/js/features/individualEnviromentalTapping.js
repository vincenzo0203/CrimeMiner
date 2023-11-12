//Variabile che conterrà il grafo che andremo a realizzare
let cyIndividualEnviromentalTapping;

//Variabili che ci consentono di tener traccia del nodo o dell'arco da far tornare come prima
let cyNodeTouchedIndividualEnviromentalTapping = ""
let cyEdgeTouchedIndividualEnviromentalTapping  = "";

//Variabile che ci consente di tener traccia dell'id dell'utente quando si anonimizza
let cyNodeDataIndividualEnviromentalTapping  = "";

//Funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Intercettazione Ambientale tra gli Individui";

  //Funzione che fa partire il caricamento
  loadPage(2500);
  requestAllNodesIndividualEnviromentalTapping();

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
function requestAllNodesIndividualEnviromentalTapping() {
  fetch("/CrimeMiner/individuoIntercettazioneAmb/graphall/", {
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
    createGraphIndividualEnviromentalTapping(data.result);
    fillPropertyAccordionIndividualEnviromentalTapping(data.result);
    //fillSourceAndTargetModalNewCallIndividualEnviromentalTapping(data.nodes)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per le metriche
function requestSizeNodesIndividualEnviromentalTapping(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "graphall";
  else
    metric = document.querySelector(".selectMetrics").value;

  fetch("/CrimeMiner/individuoIntercettazioneAmb/"+ metric +"/", {
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
    console.log(data);
    //this['create'+  document.querySelector(".selectMetrics").value +'IndividualWiretaps'](data);
    if(metric != "graphall")
      changeSizeNodesIndividualEnviromentalTapping(data);
    else
      changeSizeNodesIndividualEnviromentalTapping(data.result);
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo nodo
function requestDetailsOfNodeIndividualEnviromentalTapping(id){
  fetch("/CrimeMiner/individuoIntercettazioneAmb/getIntercettazioneAmbIndividuoInfoById/" + id, {
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
      showDetailsOfNodeIndividualIndividualEnviromentalTapping(data.result[0].n)
    if(data.result[0].i != undefined)
      showDetailsOfNodeEnviromentalTappingIndividualEnviromentalTapping(data.result[0].i)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo arco
function requestDetailsOfEdgeIndividualEnviromentalTapping(id){
  fetch("/CrimeMiner/individuoIntercettazioneAmb/getinfobyedgeid/" + id, {
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
    showDetailsOfEdgeIndividualEnviromentalTapping(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che crea il grafo con le sue opportune proprietà
function createGraphIndividualEnviromentalTapping(data) {

  //Creazione del grafico con assegnazione alla variabile
  cyIndividualEnviromentalTapping = cytoscape({
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
    minZoom: 0.14,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualEnviromentalTapping.ready(function () {

    //Funzione di click per il nodo
    cyIndividualEnviromentalTapping.on('tap', 'node', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeIndividualEnviromentalTapping(evt.target.id())

      //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualEnviromentalTapping != "")
        cyIndividualEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');

      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
          else
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
      }

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedIndividualEnviromentalTapping = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click per l'arco
    cyIndividualEnviromentalTapping.on('tap', 'edge', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo arco
      requestDetailsOfEdgeIndividualEnviromentalTapping(evt.target.id());

      //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
          else
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
      }
      
      //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualEnviromentalTapping != "" || evt.target.classes()[0] == "Individuo" || evt.target.classes()[0] == "IntercettazioneAmb")
        cyIndividualEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');

      //Inserisco l'arco corrente nella variabile e gli cambio il colore
      cyEdgeTouchedIndividualEnviromentalTapping = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyIndividualEnviromentalTapping.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined){

        //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
        if(cyEdgeTouchedIndividualEnviromentalTapping != ""){
          cyIndividualEnviromentalTapping.$("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');
          cyEdgeTouchedIndividualEnviromentalTapping = "";
        }
        if(cyNodeTouchedIndividualEnviromentalTapping != ""){
          if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
          else
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
          cyNodeTouchedIndividualEnviromentalTapping = "";
        }
      }
    });

    //Con questa funzione, quando passo sull'arco, cambia colore
    cyIndividualEnviromentalTapping.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
    cyIndividualEnviromentalTapping.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

//Con questa funzione in base alla metrica decido di quanto moltiplicare il valore dei nodi per renderla visibile sul grafo
function changeSizeNodesIndividualEnviromentalTapping(data){
  let selectMetrics = document.querySelector(".selectMetrics").value;

  if(selectMetrics == "Default"){
    data = data.nodes;
    for(let i = 0; i < data.length; i++)
      cyIndividualEnviromentalTapping.$('#'+ data[i].data.id).data("size",data[i].data.size);
  }
  else{
    data = data.result;
    if(selectMetrics == "PageRank" || selectMetrics == "WeightedPageRank"|| selectMetrics == "Closeness")
    for(let i = 0; i < data.length; i++){
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*200);
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*200);
    }

    if(selectMetrics == "Betweenness")
    for(let i = 0; i < data.length; i++){
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size/10);
    }

    if(selectMetrics == "Degree" || selectMetrics == "InDegree" || selectMetrics == "OutDegree")
    for(let i = 0; i < data.length; i++){
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*3);
    }
  }
}

//Con questa funzione cambio la visualizzazione del Layout del grafo tra circle, dagre e fcose
function changeLayoutIndividualEnviromentalTapping() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    loadPage(2500);

    cyIndividualEnviromentalTapping.layout({
      name: 'circle',
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    loadPage(2500);

    cyIndividualEnviromentalTapping.layout({
      name: 'dagre',
      rankDir: 'TB',
      ranker: 'longest-path',
      spacingFactor: 0.2,
      nodeSep: 120,
      edgeSep: 2,
      rankSep: 550,
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'fcose'){
    loadPage(2500);

    cyIndividualEnviromentalTapping.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true
    }).run();
  }

}

//Funzione che richiama la request delle metriche
function changeMetricIndividualEnviromentalTapping(){
  requestSizeNodesIndividualEnviromentalTapping();
}

//Funzione che anonimizza i dati dell'Individuo
function anonymizationNodeDetailsIndividualEnviromentalTapping(flag){

  if(flag == "yes"){
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    if(cyNodeDataIndividualEnviromentalTapping != ""){
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.surname;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.name;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.date;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.nation;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.province;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.city;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.address;
    }
  }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdgesIndividualEnviromentalTapping(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualEnviromentalTapping.style()
    .resetToDefault()
    .selector('.Individuo')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f',
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
    cyIndividualEnviromentalTapping.style()
    .resetToDefault()
    .selector('.Individuo')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f'
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
    cyIndividualEnviromentalTapping.style()
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
    cyIndividualEnviromentalTapping.style()
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
function checkedAnonymizationIndividualEnviromentalTapping(){
  if(document.querySelector("#CheckAnonymization").checked == true){

    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=yes";
    else
      setCookie("anonymization","yes");
    
      anonymizationNodeDetailsIndividualEnviromentalTapping("yes");
  }
  else{
    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      setCookie("anonymization","no");
    
      anonymizationNodeDetailsIndividualEnviromentalTapping("no");
  }
}

//Funzione che mostra i dettagli dei nodi della tipologia Individuo
function showDetailsOfNodeIndividualIndividualEnviromentalTapping(data){
  document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualIdContent").innerHTML = data.nodeId;

  cyNodeDataIndividualEnviromentalTapping = JSON.parse(`{
                                                "nodeId": "${data.nodeId}",
                                                "surname": "${data.cognome}",
                                                "name": "${data.nome}",
                                                "date": "${data.dataNascita}",
                                                "nation": "${data.nazioneResidenza}",
                                                "province": "${data.provinciaResidenza}",
                                                "city": "${data.cittaResidenza}",
                                                "address": "${data.indirizzoResidenza}"
                                              }`);

  if(getCookie("anonymization") == "yes"){

    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = data.cognome;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = data.nome;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = data.dataNascita;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = data.nazioneResidenza;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = data.provinciaResidenza;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = data.cittaResidenza;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = data.indirizzoResidenza;
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli dei nodi della tipologia Intercettazione Ambientale
function showDetailsOfNodeEnviromentalTappingIndividualEnviromentalTapping(data){
  document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Intercettazione Ambientale";

  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingIdContent").innerHTML = data.nodeId;
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingDateContent").innerHTML = data.data;
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingPlaceContent").innerHTML = data.luogo;
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingContentContent").innerHTML = data.contenuto;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli degli archi
function showDetailsOfEdgeIndividualEnviromentalTapping(data){
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Imputazione";

  document.querySelector(".infoIndividualEnviromentalTappingEdgeIdContent").innerHTML = data.edgeId;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeIndividualContent").innerHTML = data.sourceNodeId;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeEnviromentalTappingContent").innerHTML = data.targetNodeId;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeMonthsEnteredContent").innerHTML = data.mesiImputati;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeMonthsSentenceContent").innerHTML = data.mesiCondanna;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeMonthsTotalContent").innerHTML = data.mesiTotali;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra il numero di nodi e archi presenti nel grafo
function fillPropertyAccordionIndividualEnviromentalTapping(data){

  let counterIndividual = 0;
  let counterEnviromentalTapping = 0;

  for(let i = 0; i < data.nodes.length; i++){
    if(data.nodes[i].classes == "Individuo")
      counterIndividual++;

    if(data.nodes[i].classes == "IntercettazioneAmb")
      counterEnviromentalTapping++;
  }

  document.querySelector(".accordionNumberNodesEdgesIndividualContent").innerHTML = counterIndividual;
  document.querySelector(".accordionNumberNodesEdgesEnviromentalTappingContent").innerHTML = counterEnviromentalTapping;
  document.querySelector(".accordionNumberNodesEdgesPresentContent").innerHTML = data.edges.length;

  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}

/*function fillSourceAndTargetModalNewCallIndividualEnviromentalTapping(nodes){
  let selectSource = document.querySelector(".modalIndividualEnviromentalTappingSource");
  let selectTarget = document.querySelector(".modalIndividualEnviromentalTappingTarget");
  for (let j = 0; j < nodes.length; j++) {
    let opt = nodes[j].data.id;
    let el = new Option(opt, opt);

    if(nodes[j].data.id[0] == 'I')
      selectSource.appendChild(el);

    if(nodes[j].data.id[0] == 'R')
      selectTarget.appendChild(el);
  }
}

function sendNewCallToBackendIndividualEnviromentalTapping(){
  let json;

  json = `{
                sourceId: ${document.querySelector(".modalIndividualEnviromentalTappingSource").value},
                targetiD: ${document.querySelector(".modalIndividualEnviromentalTappingTarget").value},
                date: ${document.querySelector(".modalIndividualEnviromentalTappingDate").value},
                duration: ${document.querySelector(".modalIndividualEnviromentalTappingDuration").value},
                time: ${document.querySelector(".modalIndividualEnviromentalTappingTime").value},
                content: ${document.querySelector(".modalIndividualEnviromentalTappingTextarea").value},
              }`;

  console.log(json);
  
  /*fetch("", { //FUNZIONE PER INSERIRE I DATI
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Registrazione Chiamata", "Registrazione avvenuta con successo.", "success");
      return response.text();
    } else {
      viewToastMessage("Registrazione Chiamata", "Errore nella registrazione della chiamata.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });*/
/*
  viewToastMessage("Registrazione Codannato/ImputatoDi", "Registrazione avvenuta con successo.", "success");  
}*/