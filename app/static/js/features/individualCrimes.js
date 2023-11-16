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
  checkedIndividualModalIndividualCrimes()

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
    requestAllNodesModalIndividualCrimes();
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per caricare i nomi del'individuo e del crimine nella modale
function requestAllNodesModalIndividualCrimes() {

  fetch("/CrimeMiner/individuoReato/findAllIndividualCrime/", {
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
    fillIndividualModalNewSentenceImputationIndividualCrimes(data.result);
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

//Funzione che controlla dalle checkbox della modale se l'individuo è già registrato
function checkedIndividualModalIndividualCrimes(){

  if(document.querySelector("#CheckIndividualExisting").checked){
    document.querySelector(".accordionIndividual").style.display = "none";
    document.querySelector(".modalIndividualCrimesIndividual").disabled = false;
  }
  else{
    document.querySelector(".accordionIndividual").style.display = "block";
    document.querySelector(".modalIndividualCrimesIndividual").disabled = true;
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

//Funzione che inserisce nelle select della modale gli individui da scegliere se già registrati e i reati
function fillIndividualModalNewSentenceImputationIndividualCrimes(nodes){
  let selectIndividual = document.querySelector(".modalIndividualCrimesIndividual");
  let selectCrime = document.querySelector(".modalIndividualCrimesCrime");

  for (let i = 1; i < selectIndividual.length; i++){
    selectIndividual.remove(i);
  }

  for (let i = 1; i < selectCrime.length; i++){
    selectCrime.remove(i);
  }

  for (let j = 0; j < nodes.length; j++) {
    let opt = nodes[j].nodeId;
    let text;
    let el1;

    if(opt[0] == "I"){

      text = nodes[j].cognome + " " + nodes[j].nome;

      if(text == "null null"){
        el1 = new Option(opt, opt);
      }
      else{
        el1 = new Option(opt+" "+text, opt);
      }

      selectIndividual.appendChild(el1);
    }

    if(opt[0] == "R"){
      text = nodes[j].nome;

      if(text == "null"){
        el1 = new Option(opt, opt);
      }
      else{
        el1 = new Option(opt+" "+text, opt);
      }

      selectCrime.appendChild(el1);
    }
  }
}

//Funzione che cancella i valori degli input nella modale
function fillAddModalIndividualCrimes(){
  
  //Checkbox
  document.querySelector("#CheckIndividualExisting").checked = false;

  //Mittente
  document.querySelector(".accordionIndividual").style.display = "block";
  document.querySelector(".modalIndividualCrimesIndividualAddSurname").value = "";
  document.querySelector(".modalIndividualCrimesIndividualAddName").value = "";
  document.querySelector(".modalIndividualCrimesIndividualAddDate").value = "";
  document.querySelector(".modalIndividualCrimesIndividualAddNation").value = "";
  document.querySelector(".modalIndividualCrimesIndividualAddProvince").value = "";
  document.querySelector(".modalIndividualCrimesIndividualAddCity").value = "";
  document.querySelector(".modalIndividualCrimesIndividualAddCap").value = "";
  document.querySelector(".modalIndividualCrimesIndividualAddAddress").value = "";

  if(document.querySelector(".accordionIndividual").childNodes[1].childNodes[3].classList.contains("show")){
    document.querySelector(".accordionIndividual").childNodes[1].childNodes[3].classList.remove("show");
    document.querySelector(".accordionIndividual").childNodes[1].childNodes[1].childNodes[1].classList.add("collapsed");
  }


  //Chiamata
  document.querySelector(".modalIndividualCrimesIndividual").selectedIndex = 0;
  document.querySelector(".modalIndividualCrimesCrime").selectedIndex = 0;
  document.querySelector(".modalIndividualCrimesTipology").selectedIndex = 0;
  document.querySelector(".modalIndividualCrimesIndividual").disabled = true;
  /*document.querySelector(".modalIndividualWiretapsDate").value = "";
  document.querySelector(".modalIndividualWiretapsDuration").value = "";
  document.querySelector(".modalIndividualWiretapsTime").value = "";
  document.querySelector(".modalIndividualWiretapsTextarea").value = "";*/

}

//Funzione che inserisce i campi della chiamata nella modale
function fillUpdateModalSentenceImputationIndividualWiretaps(){

  //let [day, month, year] = document.querySelector(".infoIndividualWiretapsEdgeDateContent").innerHTML.split('/');
  
  //Checkbox
  document.querySelector("#CheckIndividualExisting").checked = true;

  //Individuo
  document.querySelector(".accordionIndividual").style.display = "none";

  //Imputazione o Condanna
  document.querySelector(".modalIndividualCrimesIndividual").value = document.querySelector(".infoIndividualCrimesEdgeIndividualContent").innerHTML;
  document.querySelector(".modalIndividualCrimesCrime").value = document.querySelector(".infoIndividualCrimesEdgeCrimeContent").innerHTML;
  document.querySelector(".modalIndividualCrimesIndividual").disabled = false;
  document.querySelector(".modalIndividualCrimesTipology").disabled = false;

  if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica imputazione")
    document.querySelector(".modalIndividualCrimesTipology").value = "ImputatoDi";

  if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica condanna")
    document.querySelector(".modalIndividualCrimesTipology").value = "Condannato";
  /*document.querySelector(".modalIndividualWiretapsDate").value = `${year}-${month}-${day}`;
  document.querySelector(".modalIndividualWiretapsDuration").value = document.querySelector(".infoIndividualWiretapsEdgeDurationContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTime").value = document.querySelector(".infoIndividualWiretapsEdgeTimeContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTextarea").value = document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML;*/

}

//Funzione che inserisce i campi dell'individuo nella modale
function fillUpdateModalIndividualIndividualCrimes(){
  let [day, month, year] = cyNodeDataIndividualCrimes.date.split('/');
  
  //Individuo
  document.querySelector(".modalIndividualCrimesIndividualSurname").value = cyNodeDataIndividualCrimes.surname;
  document.querySelector(".modalIndividualCrimesIndividualName").value = cyNodeDataIndividualCrimes.name;
  document.querySelector(".modalIndividualCrimesIndividualDate").value = `${year}-${month}-${day}`;
  document.querySelector(".modalIndividualCrimesIndividualNation").value = cyNodeDataIndividualCrimes.nation;
  document.querySelector(".modalIndividualCrimesIndividualProvince").value = cyNodeDataIndividualCrimes.province;
  document.querySelector(".modalIndividualCrimesIndividualCity").value = cyNodeDataIndividualCrimes.city;
  document.querySelector(".modalIndividualCrimesIndividualCap").value = cyNodeDataIndividualCrimes.cap;
  document.querySelector(".modalIndividualCrimesIndividualAddress").value = cyNodeDataIndividualCrimes.address;
}

//Funzione che all'apertura della modale di aggiunta cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalAddNewSentenceImputationIndividualCrimes(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "flex";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";
  document.querySelector("#modalIndividualCrimesLabel").innerHTML = "Inserimento nuova condanna o imputazione";

  fillAddModalIndividualCrimes();
}

//Funzione che all'apertura della modale di modifica cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalUpdateSentenceImputationIndividualCrimes(){

  if(document.querySelector(".accordionButtonTwo").innerHTML == "Dettagli Imputazione")
    document.querySelector("#modalIndividualCrimesLabel").innerHTML = "Modifica imputazione";
  else
    document.querySelector("#modalIndividualCrimesLabel").innerHTML = "Modifica condanna";

  document.querySelector(".modalFormAddUpdateCall").style.display = "flex";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";

  fillUpdateModalSentenceImputationIndividualWiretaps();
}

//Funzione che all'apertura della modale di conferma eliminazione cambia i campi per la chiamata
function openModalDeleteSentenceImputationIndividualCrimes(){
  if(document.querySelector(".accordionButtonTwo").innerHTML == "Dettagli Condannato"){
    document.querySelector("#modalDeleteIndividualCrimesLabel").innerHTML = "Cancellazione condanna";
    document.querySelector(".modalDeleteIndividualCrimesBody").innerHTML = "Sei sicuro di voler cancellare questa condanna? Verranno cancellati i dati relativi alla condanna e i mesi condanna dell'individuo";
  }

  if(document.querySelector(".accordionButtonTwo").innerHTML == "Dettagli Imputazione"){
    document.querySelector("#modalDeleteIndividualCrimesLabel").innerHTML = "Cancellazione imputazione";
    document.querySelector(".modalDeleteIndividualCrimesBody").innerHTML = "Sei sicuro di voler cancellare questa imputazione? Verranno cancellati i dati relativi all'imputazione e i mesi imputati dell'individuo";
  }
}

//Funzione che all'apertura della modale di conferma eliminazione cambia i campi per l'individuo
function openModalDeleteIndividualIndividualCrimes(){
  document.querySelector("#modalDeleteIndividualCrimesLabel").innerHTML = "Cancellazione individuo";
  document.querySelector(".modalDeleteIndividualCrimesBody").innerHTML = "Sei sicuro di voler cancellare questo individuo?";
}

//Funzione che all'apertura della modale di modifica cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalUpdateIndividualIndividualCrimes(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "none";
  document.querySelector(".modalFormUpdateIndividual").style.display = "flex";
  document.querySelector("#modalIndividualCrimesLabel").innerHTML = "Modifica individuo";

  fillUpdateModalIndividualIndividualCrimes();
}

                          //Funzione che manda al backend una nuova chiamata da inserire (e enventualmente i nuovi individui)
function sendNewImputationSentenceToBackendIndividualCrimes(){

  let [year, month, day] = "";

  let json = `{`;

  if(!document.querySelector("#CheckIndividualExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualCrimesIndividualAddDate").value.split('-');

    json += ` "individual" : {
                            "cognome": "${document.querySelector(".modalIndividualCrimesIndividualAddSurname").value}",
                            "nome": "${document.querySelector(".modalIndividualCrimesIndividualAddName").value}",
                            "dataNascita": "${day}/${month}/${year}",
                            "nazioneResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddNation").value}",
                            "provinciaResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddProvince").value}",
                            "cittaResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddCity").value}",
                            "indirizzoResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddAddress").value}",
                            "capResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddCap").value}"
                          },
            `;
  }
  else{
    json += ` "individual" : {
        "nodeId": "${document.querySelector(".modalIndividualCrimesIndividual").value}"
      },
    `;
  }

  json += ` "crime" : {
      "nodeId": "${document.querySelector(".modalIndividualCrimesCrime").value}"
    },
  `;

  json += ` "edge" : {`;

  if(document.querySelector("#CheckIndividualExisting").checked)
    json += `"individualId": "${document.querySelector(".modalIndividualCrimesIndividual").value}",`;
  
  json += ` 
            "crimeId": "${document.querySelector(".modalIndividualCrimesCrime").value}",
            "tipologyEdge": "${document.querySelector(".modalIndividualCrimesTipology").value}"
          `;

  json += `}`;

  /*[year, month, day] = document.querySelector(".modalIndividualWiretapsDate").value.split('-');
  
  if(document.querySelector("#CheckSourceExisting").checked && document.querySelector("#CheckTargetExisting").checked){
    if(document.querySelector(".modalIndividualWiretapsSource").value != document.querySelector(".modalIndividualWiretapsTarget").value){
      
      json += `  "call" : {
                            "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
                            "targetiD": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
                            "date": "${day}/${month}/${year}",
                            "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
                            "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
                            "content": "${document.querySelector(".modalIndividualWiretapsTextarea").value}"
                          }
      `;
    }
  }
  else{
    json += `  "call" : {`;

    if(document.querySelector("#CheckSourceExisting").checked) 
    json += `
              "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
            `;
    
    if(document.querySelector("#CheckTargetExisting").checked)
    json += `
              "targetId": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
            `;
  
    json += `
              "date": "${day}/${month}/${year}",
              "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
              "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
              "content": "${document.querySelector(".modalIndividualWiretapsTextarea").value}"
            }
    `;
  }*/

  json += `}`;

  console.log(json);
  
  fetch("/CrimeMiner/individuoReato/creaIndReato/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {

      if(document.querySelector(".modalIndividualCrimesTipology").value == "ImputatoDi")
        viewToastMessage("Registrazione Imputazione", "Registrazione avvenuta con successo.", "success");

      if(document.querySelector(".modalIndividualCrimesTipology").value == "Condannato")
        viewToastMessage("Registrazione Condanna", "Registrazione avvenuta con successo.", "success");

      returnToCreationPageIndividualCrimes();
    } else {
      if(document.querySelector(".modalIndividualCrimesTipology").value == "ImputatoDi")
        viewToastMessage("Registrazione Imputazione", "Errore nella registrazione dell'imputazione.", "error");

      if(document.querySelector(".modalIndividualCrimesTipology").value == "Condannato")
        viewToastMessage("Registrazione Condanna", "Errore nella registrazione della condanna.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

}

//Funzione che manda al backend i dati da aggiornare dell'imputazione o della condanna
function sendUpdateImputationSentenceToBackendIndividualCrimes(){
  let [year, month, day] = "";

  let json = `{`;

  if(!document.querySelector("#CheckIndividualExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualCrimesIndividualAddDate").value.split('-');

    json += ` "individual" : {
                            "cognome": "${document.querySelector(".modalIndividualCrimesIndividualAddSurname").value}",
                            "nome": "${document.querySelector(".modalIndividualCrimesIndividualAddName").value}",
                            "dataNascita": "${day}/${month}/${year}",
                            "nazioneResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddNation").value}",
                            "provinciaResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddProvince").value}",
                            "cittaResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddCity").value}",
                            "indirizzoResidenza": "${document.querySelector(".modalIndividualCrimesIndividualAddAddress").value}"
                            "capResidenza": "${document.querySelector(".modalIndividualCrimesIndividualCap").value}"
                          },
            `;
  }
  else{
    json += ` "individual" : {
        "nodeId": "${document.querySelector(".modalIndividualCrimesIndividual").value}"
      },
    `;
  }

  json += ` "crime" : {
      "nodeId": "${document.querySelector(".modalIndividualCrimesCrime").value}"
    },
  `;

  if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica condanna")
    json += ` "sentence" : {`;
  
  if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica imputazione")
    json += ` "imputation" : {`;

  json += `
            "edgeId": "${document.querySelector(".infoIndividualCrimesEdgeIdContent").innerHTML}",
            "individualId": "${document.querySelector(".modalIndividualCrimesIndividual").value}",
            "crimeId": "${document.querySelector(".modalIndividualCrimesCrime").value}",
            "tipology": "${document.querySelector(".modalIndividualCrimesTipology").value}"}`;
   /*         "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
            "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
            "content": "${document.querySelector(".modalIndividualWiretapsTextarea").value}",
          }`;*/
    
  json += `}`;

  console.log(json);
  
  fetch("/CrimeMiner/individuoReato/modificaIndReato/", { //FUNZIONE PER INSERIRE I DATI
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica condanna")
        viewToastMessage("Modifica Condanna", "Modifica avvenuta con successo.", "success");

      if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica imputazione")
        viewToastMessage("Modifica Imputazione", "Modifica avvenuta con successo.", "success");
      
      returnToCreationPageIndividualCrimes()
    } else {
      if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica condanna")
        viewToastMessage("Modifica Condanna", "Errore nella modifica della condanna.", "error");

      if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica imputazione")
        viewToastMessage("Modifica Imputazione", "Errore nella modifica dell'imputazione.", "error");
    }
  })

  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");  
}

//Funzione che manda al backend i dati da aggiornare dell'individuo
function sendUpdateIndividualToBackendIndividualCrimes(){
  let json;

  json = `{
            "nodeId": "${document.querySelector(".infoIndividualCrimesNodeIndividualIdContent").innerHTML}",
            "surname": "${document.querySelector(".modalIndividualCrimesIndividualSurname").value}",
            "name": "${document.querySelector(".modalIndividualCrimesIndividualName").value}",
            "date": "${document.querySelector(".modalIndividualCrimesIndividualDate").value}",
            "nation": "${document.querySelector(".modalIndividualCrimesIndividualNation").value}",
            "province": "${document.querySelector(".modalIndividualCrimesIndividualProvince").value}",
            "city": "${document.querySelector(".modalIndividualCrimesIndividualCity").value}",
            "address": "${document.querySelector(".modalIndividualCrimesIndividualAddress").value}",
            "cap": "${document.querySelector(".modalIndividualCrimesIndividualCap").value}"
          }`;

  console.log(json);
  
  fetch("/CrimeMiner/individuo/modificaIndividuo/", { //FUNZIONE PER MODIFICARE IL PORCO DIO DI INDIVIDUO
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Modifica Individuo", "Modifica avvenuta con successo.", "success");
      returnToCreationPageIndividualCrimes()
    } else {
      viewToastMessage("Modifica Individuo", "Errore nella modifica dell'individuo.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Modifica Individuo", "Modifica avvenuta con successo.", "success");  
}

//Funzione che invia al backend l'individuo da cancellare
function deleteNodeIndividualCrimes(){
  let json = `{
    "nodeId": "${document.querySelector(".infoIndividualCrimesNodeIndividualIdContent").innerHTML}"
  }`;

  fetch("/CrimeMiner/individuo/eliminaIndividuo/", { //FUNZIONE PER INSERIRE I DATI
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualCrimes();
    } else {
      viewToastMessage("Cancellazione Individuo", "Errore nella cancellazione dell'individuo'.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");
}

//Funzione che invia al backend l'imputazione da cancellare
function deleteEdgeImputationIndividualCrimes(){
  let id = document.querySelector(".infoIndividualCrimesEdgeIdContent").innerHTML;

  /*fetch("", { //FUNZIONE PER INSERIRE I DATI
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Imputazione", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualCrimes();
    } else {
      viewToastMessage("Cancellazione Imputazione", "Errore nella cancellazione dell'imputazione.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });*/

  viewToastMessage("Cancellazione Imputazione", "Cancellazione avvenuta con successo.", "success");
}

//Funzione che invia al backend la condanna da cancellare
function deleteEdgeSentenceIndividualCrimes(){
  let id = document.querySelector(".infoIndividualCrimesEdgeIdContent").innerHTML;

  /*fetch("", { //FUNZIONE PER INSERIRE I DATI
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Condanna", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualCrimes();
    } else {
      viewToastMessage("Cancellazione Condanna", "Errore nella cancellazione della condanna.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });*/

  viewToastMessage("Cancellazione Condanna", "Cancellazione avvenuta con successo.", "success");
}

//Funzione che decide se devo richiamare la funzione di aggiunta di una chiamata (compresa di due nuovi individui se inseriti) o di modifica di un individuo o modifica di una chiamata
function selectFunctionToRegisterDateIndividualCrimes(){
  if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Inserimento nuova condanna o imputazione")
    sendNewImputationSentenceToBackendIndividualCrimes();

  if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica condanna" || document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica imputazione")
    sendUpdateImputationSentenceToBackendIndividualCrimes();

  if(document.querySelector("#modalIndividualCrimesLabel").innerHTML == "Modifica individuo")
    sendUpdateIndividualToBackendIndividualCrimes();
}

//Funzione che decide se devo richiamare la funzione di cancellazione di un individuo, di un'imputazione o di una condanna
function selectFunctionToDeleteDateIndividualCrimes(){
  if(document.querySelector("#modalDeleteIndividualCrimesLabel").innerHTML == "Cancellazione individuo")
    deleteNodeIndividualCrimes();

  if(document.querySelector("#modalDeleteIndividualCrimesLabel").innerHTML == "Cancellazione imputazione")
    deleteEdgeImputationIndividualCrimes();

  if(document.querySelector("#modalDeleteIndividualCrimesLabel").innerHTML == "Cancellazione condanna")
    deleteEdgeSentenceIndividualCrimes();
}

//Funzione di ricaricamento della pagina quando creo, modifico o cancello dati nel grafo
function returnToCreationPageIndividualCrimes(){

  document.querySelector(".btnCloseModalAddUpdate").click();
  document.querySelector(".btnCloseModalDelete").click();

  //Funzione che fa partire il caricamento
  loadPage(1500);
  requestAllNodesIndividualCrimes();
  checkedIndividualModalIndividualCrimes();

  //Comando che fa aprire all'avvio della pagina l'accordion delle proprietà
  if(document.querySelector("#item-properties").checked == false)
    document.querySelector("#item-properties").click();

  if(document.querySelector("#item-details").checked == true){
    document.querySelector(".infoIndividualWiretapsEdge").style.display = "none";
    document.querySelector(".infoIndividualWiretapsNode").style.display = "none";
    document.querySelector(".infoIndividualWiretapsNot").style.display = "flex";

    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli";
    document.querySelector("#item-details").click();
  } 

  if(document.querySelector("#item-settings").checked == true)
    document.querySelector("#item-settings").click();

  //Controllo se devo anonimizzare i dati
  if(getCookie("anonymization") == "yes")
    document.querySelector("#CheckAnonymization").checked = true;
}