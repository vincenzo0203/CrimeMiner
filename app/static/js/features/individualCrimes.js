//Variabile che conterrà il grafo che andremo a realizzare
let cyIndividualCrimes;

//Variabili che ci consentono di tener traccia del nodo o dell'arco da far tornare come prima
let cyNodeTouchedIndividualCrimes = "";
let cyEdgeTouchedIndividualCrimes = "";

//Variabile che ci consente di tener traccia dell'id dell'utente quando si anonimizza
let cyNodeDataIndividualCrimes  = "";

//Funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Reati commessi dagli Individui";

  //Funzione che fa partire il caricamento
  loadPage(1500);
  requestAllNodesIndividualCrimes();

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
function requestAllNodesIndividualCrimes() {
  fetch("/CrimeMiner/individuoReato/findallgraph/", {
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
    createGraphIndividualCrimes(data);
    fillPropertyAccordionIndividualCrimes(data);
    //fillSourceAndTargetModalNewCallIndividualCrimes(data.nodes)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per le metriche
function requestSizeNodesIndividualCrimes(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "findallgraph";
  else
    metric = document.querySelector(".selectMetrics").value;

  fetch("/CrimeMiner/individuoReato/"+ metric +"/", {
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
    //this['create'+  document.querySelector(".selectMetrics").value +'IndividualWiretaps'](data);
    changeSizeNodesIndividualCrimes(data);
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo nodo
function requestDetailsOfNodeIndividualCrimes(id){
  fetch("/CrimeMiner/individuoReato/getReatoIndividuoInfoById/" + id, {
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
      showDetailsOfNodeIndividualIndividualCrimes(data.result[0].n)
    if(data.result[0].r != undefined)
      showDetailsOfNodeCrimeIndividualCrimes(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo arco
function requestDetailsOfEdgeIndividualCrimes(id){
  fetch("/CrimeMiner/individuoReato/getinfobyedgeid/" + id, {
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
    showDetailsOfEdgeIndividualCrimes(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che crea il grafo con le sue opportune proprietà
function createGraphIndividualCrimes(data) {

  //Creazione del grafico con assegnazione alla variabile
  cyIndividualCrimes = cytoscape({
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
    minZoom: 0.6,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualCrimes.ready(function () {

    //Funzione di click per il nodo
    cyIndividualCrimes.on('tap', 'node', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeIndividualCrimes(evt.target.id())

      //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualCrimes != "")
        cyIndividualCrimes.edges("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');

      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualCrimes != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualCrimes[0] == "I")
            cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#03a74f');
          else
            cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#c70c35');
      }

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedIndividualCrimes = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click per l'arco
    cyIndividualCrimes.on('tap', 'edge', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo arco
      requestDetailsOfEdgeIndividualCrimes(evt.target.id())

      //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualCrimes != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualCrimes[0] == "I")
            cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#03a74f');
          else
            cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#c70c35');
      }

      //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualCrimes != "" || evt.target.classes()[0] == "Individuo" || evt.target.classes()[0] == "Reato")
        cyIndividualCrimes.edges("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');

      //Inserisco l'arco corrente nella variabile e gli cambio il colore
      cyEdgeTouchedIndividualCrimes = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyIndividualCrimes.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined){

        //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
        if(cyEdgeTouchedIndividualCrimes != ""){
          cyIndividualCrimes.$("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');
          cyEdgeTouchedIndividualCrimes = "";
        }
        if(cyNodeTouchedIndividualCrimes != ""){
          if(cyNodeTouchedIndividualCrimes[0] == "I")
            cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#03a74f');
          else
            cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#c70c35');
          cyNodeTouchedIndividualCrimes = "";
        }
      }
    });

    //Con questa funzione, quando passo sull'arco, cambia colore
    cyIndividualCrimes.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimes)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
    cyIndividualCrimes.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimes)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

//Con questa funzione in base alla metrica decido di quanto moltiplicare il valore dei nodi per renderla visibile sul grafo
function changeSizeNodesIndividualCrimes(data){
  let selectMetrics = document.querySelector(".selectMetrics").value;

  if(selectMetrics == "Default"){
    data = data.nodes;
    for(let i = 0; i < data.length; i++)
      cyIndividualCrimes.$('#'+ data[i].data.id).data("size",data[i].data.size);
  }
  else{
    data = data.result;
    if(selectMetrics == "PageRank" || selectMetrics == "WeightedPageRank"|| selectMetrics == "Closeness")
    for(let i = 0; i < data.length; i++){
      cyIndividualCrimes.$('#'+ data[i].id).data("size",data[i].size*200);
    }

    if(selectMetrics == "Betweenness")
    for(let i = 0; i < data.length; i++){
      cyIndividualCrimes.$('#'+ data[i].id).data("size",data[i].size/10);
    }

    if(selectMetrics == "Degree" || selectMetrics == "InDegree" || selectMetrics == "OutDegree")
    for(let i = 0; i < data.length; i++){
      cyIndividualCrimes.$('#'+ data[i].id).data("size",data[i].size*3);
    }
  }
}

//Con questa funzione cambio la visualizzazione del Layout del grafo tra circle, dagre e fcose
function changeLayoutIndividualCrimes() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    loadPage(1500);

    cyIndividualCrimes.layout({
      name: 'circle',
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    loadPage(1500);
    
    cyIndividualCrimes.layout({
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
    loadPage(1500);
    
    cyIndividualCrimes.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true
    }).run();
  }

}

//Funzione che richiama la request delle metriche
function changeMetricIndividualCrimes(){
  requestSizeNodesIndividualCrimes();
}

//Funzione che anonimizza i dati dell'Individuo
function anonymizationNodeDetailsIndividualCrimes(flag){

  if(flag == "yes"){

    document.querySelector(".infoIndividualCrimesNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    if(cyNodeDataIndividualCrimes != ""){
      document.querySelector(".infoIndividualCrimesNodeIndividualSurnameContent").innerHTML = cyNodeDataIndividualCrimes.surname;
      document.querySelector(".infoIndividualCrimesNodeIndividualNameContent").innerHTML = cyNodeDataIndividualCrimes.name;
      document.querySelector(".infoIndividualCrimesNodeIndividualBirthContent").innerHTML = cyNodeDataIndividualCrimes.date;
      document.querySelector(".infoIndividualCrimesNodeIndividualNationContent").innerHTML = cyNodeDataIndividualCrimes.nation;
      document.querySelector(".infoIndividualCrimesNodeIndividualProvinceContent").innerHTML = cyNodeDataIndividualCrimes.province;
      document.querySelector(".infoIndividualCrimesNodeIndividualResidenceContent").innerHTML = cyNodeDataIndividualCrimes.city;
      document.querySelector(".infoIndividualCrimesNodeIndividualCapContent").innerHTML = cyNodeDataIndividualCrimes.cap;
      document.querySelector(".infoIndividualCrimesNodeIndividualAddressContent").innerHTML = cyNodeDataIndividualCrimes.address;
    }
  }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdgesIndividualCrimes(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualCrimes.style()
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
    .update();
  }
  else{
    cyIndividualCrimes.style()
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
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyIndividualCrimes.style()
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
    cyIndividualCrimes.style()
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
function checkedAnonymizationIndividualCrimes(){
  if(document.querySelector("#CheckAnonymization").checked == true){

    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=yes";
    else
      setCookie("anonymization","yes");
    
      anonymizationNodeDetailsIndividualCrimes("yes");
  }
  else{
    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      setCookie("anonymization","no");
    
      anonymizationNodeDetailsIndividualCrimes("no");
  }
}

//Funzione che mostra i dettagli dei nodi della tipologia Individuo
function showDetailsOfNodeIndividualIndividualCrimes(data){
  document.querySelector(".infoIndividualCrimesEdge").style.display = "none";
  document.querySelector(".infoIndividualCrimesNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesNodeCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesNodeIndividual").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualCrimesNodeIndividualIdContent").innerHTML = data.nodeId;
  
  cyNodeDataIndividualCrimes = JSON.parse(`{
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

    document.querySelector(".infoIndividualCrimesNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualCrimesNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    document.querySelector(".infoIndividualCrimesNodeIndividualSurnameContent").innerHTML = data.cognome;
    document.querySelector(".infoIndividualCrimesNodeIndividualNameContent").innerHTML = data.nome;
    document.querySelector(".infoIndividualCrimesNodeIndividualBirthContent").innerHTML = data.dataNascita;
    document.querySelector(".infoIndividualCrimesNodeIndividualNationContent").innerHTML = data.nazioneResidenza;
    document.querySelector(".infoIndividualCrimesNodeIndividualProvinceContent").innerHTML = data.provinciaResidenza;
    document.querySelector(".infoIndividualCrimesNodeIndividualResidenceContent").innerHTML = data.cittaResidenza;
    document.querySelector(".infoIndividualCrimesNodeIndividualCapContent").innerHTML = data.capResidenza;
    document.querySelector(".infoIndividualCrimesNodeIndividualAddressContent").innerHTML = data.indirizzoResidenza;
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli dei nodi della tipologia Reato
function showDetailsOfNodeCrimeIndividualCrimes(data){
  document.querySelector(".infoIndividualCrimesEdge").style.display = "none";
  document.querySelector(".infoIndividualCrimesNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesNodeCrime").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Reato";

  document.querySelector(".infoIndividualCrimesNodeCrimeIdContent").innerHTML = data.nodeId;
  document.querySelector(".infoIndividualCrimesNodeCrimeNameContent").innerHTML = data.name;
  document.querySelector(".infoIndividualCrimesNodeCrimeNormsContent").innerHTML = data.normeDiRiferimento;
  document.querySelector(".infoIndividualCrimesNodeCrimeMinMonthsContent").innerHTML = data.minMonths;
  document.querySelector(".infoIndividualCrimesNodeCrimeMaxMonthsContent").innerHTML = data.maxMonths;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli degli archi
function showDetailsOfEdgeIndividualCrimes(data){
  document.querySelector(".infoIndividualCrimesNodeCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualCrimesEdge").style.display = "flex";

  if(data.entityType == "ImputatoDi")
    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Imputazione";

  if(data.entityType == "Condannato")
    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Condannato";

  document.querySelector(".infoIndividualCrimesEdgeIdContent").innerHTML = data.edgeId;
  document.querySelector(".infoIndividualCrimesEdgeIndividualContent").innerHTML = data.sourceNodeId;
  document.querySelector(".infoIndividualCrimesEdgeCrimeContent").innerHTML = data.targetNodeId;

  document.querySelector(".infoIndividualCrimesEdgeAggContainer").innerHTML = "";

  if(data.agg_id != undefined){
    //document.querySelector(".infoIndividualCrimesEdgeHr").style.display = "block";
    document.querySelector(".infoIndividualCrimesEdgeAggParent").style.display = "block";
    
    for(let i=0; i<data.agg_id.length; i++){
      document.querySelector(".infoIndividualCrimesEdgeAggContainer").innerHTML += `
                                                                                      <div class="infoIndividualCrimesEdgeAgg d-flex">
                                                                                        <div class="infoIndividualCrimesEdgeAggId d-flex">
                                                                                          ${data.agg_id[i]}
                                                                                        </div>
                                                                                        <div class="infoIndividualCrimesEdgeAggDescription d-flex">
                                                                                          ${data.agg_desc[i]}
                                                                                        </div>
                                                                                        <div class="infoIndividualCrimesEdgeAggNorms d-flex">
                                                                                          ${data.agg_norm[i]}
                                                                                        </div>
                                                                                      </div>
                                                                                  `;

      if(i != data.agg_id.length - 1)
        document.querySelector(".infoIndividualCrimesEdgeAggContainer").innerHTML += `<hr></hr>`;
    }
  }
  else{
    //document.querySelector(".infoIndividualCrimesEdgeHr").style.display = "none";
    document.querySelector(".infoIndividualCrimesEdgeAggParent").style.display = "none";
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra il numero di nodi e archi presenti nel grafo
function fillPropertyAccordionIndividualCrimes(data){
  let counterIndividual = 0;
  let counterCrime = 0;

  let counterSentence = 0;
  let counterImputation = 0;
  for(let i = 0; i < data.nodes.length; i++){
    if(data.nodes[i].classes == "Individuo")
      counterIndividual++;

    if(data.nodes[i].classes == "Reato")
      counterCrime++;
  }

  for(let i = 0; i < data.edges.length; i++){
    if(data.edges[i].data.classes == "Condannato")
      counterSentence++;

    if(data.edges[i].data.classes == "ImputatoDi")
      counterImputation++;
  }

  document.querySelector(".accordionNumberNodesEdgesIndividualContent").innerHTML = counterIndividual;
  document.querySelector(".accordionNumberNodesEdgesCrimesContent").innerHTML = counterCrime;
  document.querySelector(".accordionNumberNodesEdgesSentenceContent").innerHTML = counterSentence;
  document.querySelector(".accordionNumberNodesEdgesImputationContent").innerHTML = counterImputation;

  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}

/*function fillSourceAndTargetModalNewCallIndividualCrimes(nodes){
  let selectSource = document.querySelector(".modalIndividualCrimesSource");
  let selectTarget = document.querySelector(".modalIndividualCrimesTarget");
  for (let j = 0; j < nodes.length; j++) {
    let opt = nodes[j].data.id;
    let el = new Option(opt, opt);

    if(nodes[j].data.id[0] == 'I')
      selectSource.appendChild(el);

    if(nodes[j].data.id[0] == 'R')
      selectTarget.appendChild(el);
  }
}

function sendNewCallToBackendIndividualCrimes(){
  let json;

  json = `{
                sourceId: ${document.querySelector(".modalIndividualCrimesSource").value},
                targetiD: ${document.querySelector(".modalIndividualCrimesTarget").value},
                date: ${document.querySelector(".modalIndividualCrimesDate").value},
                duration: ${document.querySelector(".modalIndividualCrimesDuration").value},
                time: ${document.querySelector(".modalIndividualCrimesTime").value},
                content: ${document.querySelector(".modalIndividualCrimesTextarea").value},
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