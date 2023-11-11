//Variabile che conterrà il grafo che andremo a realizzare
let cyIndividualWiretaps;

//Variabili che ci consentono di tener traccia del nodo o dell'arco da far tornare come prima
let cyNodeTouchedIndividualWiretaps  = "";
let cyEdgeTouchedIndividualWiretaps  = "";

//Variabile che ci consente di tener traccia dell'id dell'utente quando si anonimizza
let cyNodeIdDataIndividualWiretaps  = "";

//Funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Intercettazione delle chiamate tra gli Individui";

  //Funzione che fa partire il caricamento
  loadPage(2500);
  requestAllNodesIndividualWiretaps();
  checkedSourceAndTargetModalIndividualWiretaps();

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
function requestAllNodesIndividualWiretaps() {

  fetch("/CrimeMiner/individuoIntercettazione/findallnodes/", {
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
    createGraphIndividualWiretaps(data);
    fillPropertyAccordionIndividualWiretaps(data);
    fillSourceAndTargetModalNewCallIndividualWiretaps(data.nodes)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per le metriche
function requestSizeNodesIndividualWiretaps(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "findallnodes";
  else
    metric = document.querySelector(".selectMetrics").value;

  fetch("/CrimeMiner/individuoIntercettazione/"+ metric +"/", {
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
    changeSizeNodesIndividualWiretaps(data);
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo nodo
function requestDetailsOfNodeIndividualWiretaps(id){
  fetch("/CrimeMiner/individuo/getinfobynodeid/" + id, {
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
    showDetailsOfNodeIndividualWiretaps(data.result[0].n)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo arco
function requestDetailsOfEdgeIndividualWiretaps(id){
  fetch("/CrimeMiner/individuoIntercettazione/getinfobyedgeid/" + id, {
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
    showDetailsOfEdgeIndividualWiretaps(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che crea il grafo con le sue opportune proprietà
function createGraphIndividualWiretaps(data) {

  //Creazione del grafico con assegnazione alla variabile
  cyIndividualWiretaps = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
    style: [ // Stile dei nodi e degli archi
      {
        selector: 'node',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#03a74f',
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
      }
    ],
    layout: {
      name: 'circle', //dagre  //fcose
    },
    minZoom: 0.18,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire un evento
  cyIndividualWiretaps.ready(function () {

    //Funzione di click per il nodo
    cyIndividualWiretaps.on('tap', 'node', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeIndividualWiretaps(evt.target.id())

      //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualWiretaps != "")
        cyIndividualWiretaps.edges("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');

      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualWiretaps != "" || evt.target.classes() == undefined)
        cyIndividualWiretaps.nodes("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedIndividualWiretaps = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click per l'arco
    cyIndividualWiretaps.on('tap', 'edge', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo arco
      requestDetailsOfEdgeIndividualWiretaps(evt.target.id())
  
      //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualWiretaps != "")
        cyIndividualWiretaps.nodes("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');
      
      //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualWiretaps != "" || evt.target.classes()[0] == "Individuo")
        cyIndividualWiretaps.edges("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');

      //Inserisco l'arco corrente nella variabile e gli cambio il colore
      cyEdgeTouchedIndividualWiretaps = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyIndividualWiretaps.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined){

        //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
        if(cyEdgeTouchedIndividualWiretaps != ""){
          cyIndividualWiretaps.$("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');
          cyEdgeTouchedIndividualWiretaps = "";
        }
        if(cyNodeTouchedIndividualWiretaps != ""){
          cyIndividualWiretaps.$("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');
          cyNodeTouchedIndividualWiretaps = "";
        }
      }
    });

    //Con questa funzione, quando passo sull'arco, cambia colore
    cyIndividualWiretaps.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualWiretaps)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
    cyIndividualWiretaps.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualWiretaps)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

//Con questa funzione in base alla metrica decido di quanto moltiplicare il valore dei nodi per renderla visibile sul grafo
function changeSizeNodesIndividualWiretaps(data){
  let selectMetrics = document.querySelector(".selectMetrics").value;

  if(selectMetrics == "Default"){
    data = data.nodes;
    for(let i = 0; i < data.length; i++)
      cyIndividualWiretaps.$('#'+ data[i].data.id).data("size",data[i].data.size);
  }
  else{
    data = data.result;
    if(selectMetrics == "PageRank" || selectMetrics == "WeightedPageRank"|| selectMetrics == "Closeness")
    for(let i = 0; i < data.length; i++){
      cyIndividualWiretaps.$('#'+ data[i].id).data("size",data[i].size*200);
    }

    if(selectMetrics == "Betweenness")
    for(let i = 0; i < data.length; i++){
      cyIndividualWiretaps.$('#'+ data[i].id).data("size",data[i].size/10);
    }

    if(selectMetrics == "Degree" || selectMetrics == "InDegree" || selectMetrics == "OutDegree")
    for(let i = 0; i < data.length; i++){
      cyIndividualWiretaps.$('#'+ data[i].id).data("size",data[i].size*3);
    }
  }
}

//Con questa funzione cambio la visualizzazione del Layout del grafo tra circle, dagre e fcose
function changeLayoutIndividualWiretaps() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    loadPage(2500);
    
    cyIndividualWiretaps.layout({
      name: 'circle',
      animate: true,
      animationDuration: 2000
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    loadPage(7500);
    
    cyIndividualWiretaps.layout({
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

    cyIndividualWiretaps.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true,
      animationDuration: 2000
    }).run();
  }

}

//Funzione che richiama la request delle metriche
function changeMetricIndividualWiretaps(){
  requestSizeNodesIndividualWiretaps();
}

//Funzione che anonimizza i dati dell'Individuo
function anonymizationNodeDetailsIndividualWiretaps(flag){

  if(flag == "yes"){

    cyNodeIdDataIndividualWiretaps = document.querySelector('.infoIndividualWiretapsNodeIdContent').innerHTML;

    document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = "*********";
  }
  else{
    if(cyNodeIdDataIndividualWiretaps != "")
      requestDetailsOfNodeIndividualWiretaps(cyNodeIdDataIndividualWiretaps)
  }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdgesIndividualWiretaps(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualWiretaps.style()
    .resetToDefault()
    .selector('node')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f',
        'label': 'data(id)'
      })
    .update();
  }
  else{
    cyIndividualWiretaps.style()
    .resetToDefault()
    .selector('node')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f'
      })
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyIndividualWiretaps.style()
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
    cyIndividualWiretaps.style()
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
function checkedAnonymizationIndividualWiretaps(){
  if(document.querySelector("#CheckAnonymization").checked == true){

    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=yes";
    else
      setCookie("anonymization","yes");
    
      anonymizationNodeDetailsIndividualWiretaps("yes");
  }
  else{
    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      setCookie("anonymization","no");
    
      anonymizationNodeDetailsIndividualWiretaps("no");
  }
}

function checkedSourceAndTargetModalIndividualWiretaps(){

  if(document.querySelector("#CheckSourceExisting").checked){
    document.querySelector(".accordionSource").style.display = "none";
    document.querySelector(".modalIndividualWiretapsSource").disabled = false;
  }
  else{
    document.querySelector(".accordionSource").style.display = "block";
    document.querySelector(".modalIndividualWiretapsSource").disabled = true;
  }

  if(document.querySelector("#CheckTargetExisting").checked){
    document.querySelector(".accordionTarget").style.display = "none";
    document.querySelector(".modalIndividualWiretapsTarget").disabled = false;
  }
  else{
    document.querySelector(".accordionTarget").style.display = "block";
    document.querySelector(".modalIndividualWiretapsTarget").disabled = true;
  }

}

//Funzione che mostra i dettagli dei nodi
function showDetailsOfNodeIndividualWiretaps(data){
  document.querySelector(".infoIndividualWiretapsEdge").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNot").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNode").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualWiretapsNodeIdContent").innerHTML = data.nodeId;

  if(getCookie("anonymization") == "yes"){
    cyNodeIdDataIndividualWiretaps = data.nodeId;

    document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = "*********";
  }
  else{
    document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = data.cognome;
    document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = data.nome;
    document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = data.dataNascita;
    document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = data.nazioneResidenza;
    document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = data.provinciaResidenza;
    document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = data.cittaResidenza;
    document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = data.indirizzoResidenza;
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli degli archi
function showDetailsOfEdgeIndividualWiretaps(data){
  document.querySelector(".infoIndividualWiretapsNode").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNot").style.display = "none";
  document.querySelector(".infoIndividualWiretapsEdge").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Chiamata";

  document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML = data.edgeId;
  document.querySelector(".infoIndividualWiretapsEdgeDateContent").innerHTML = data.data;
  document.querySelector(".infoIndividualWiretapsEdgeDurationContent").innerHTML = data.durata;
  document.querySelector(".infoIndividualWiretapsEdgeTimeContent").innerHTML = data.ora;
  document.querySelector(".infoIndividualWiretapsEdgeSourceContent").innerHTML = data.sourceNodeId;
  document.querySelector(".infoIndividualWiretapsEdgeTargetContent").innerHTML = data.targetNodeId;
  document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML = data.contenuto;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra il numero di nodi e archi presenti nel grafo
function fillPropertyAccordionIndividualWiretaps(data){
  document.querySelector(".accordionNumberNodesEdgesIndividualContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesCallContent").innerHTML = data.edges.length;

  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}

function fillSourceAndTargetModalNewCallIndividualWiretaps(nodes){
  let selectSource = document.querySelector(".modalIndividualWiretapsSource");
  let selectTarget = document.querySelector(".modalIndividualWiretapsTarget");
  for (let j = 0; j < nodes.length; j++) {
    let opt = nodes[j].data.id;
    let el1 = new Option(opt, opt);
    let el2 = new Option(opt, opt);
    selectSource.appendChild(el1);
    selectTarget.appendChild(el2);
  }
}

function fillAddModalIndividualWiretaps(){
  
  //Checkbox
  document.querySelector("#CheckSourceExisting").checked = false;
  document.querySelector("#CheckTargetExisting").checked = false;

  //Mittente
  document.querySelector(".accordionSource").style.display = "block";
  document.querySelector(".modalIndividualWiretapsSourceSurname").value = "";
  document.querySelector(".modalIndividualWiretapsSourceName").value = "";
  document.querySelector(".modalIndividualWiretapsSourceDate").value = "";
  document.querySelector(".modalIndividualWiretapsSourceNation").value = "";
  document.querySelector(".modalIndividualWiretapsSourceProvince").value = "";
  document.querySelector(".modalIndividualWiretapsSourceCity").value = "";
  document.querySelector(".modalIndividualWiretapsSourceAddress").value = "";

  if(document.querySelector(".accordionSource").childNodes[1].childNodes[3].classList.contains("show")){
    document.querySelector(".accordionSource").childNodes[1].childNodes[3].classList.remove("show");
    document.querySelector(".accordionSource").childNodes[1].childNodes[1].childNodes[1].classList.add("collapsed");
  }
    
  //Destinatario
  document.querySelector(".accordionTarget").style.display = "block";
  document.querySelector(".modalIndividualWiretapsTargetSurname").value = "";
  document.querySelector(".modalIndividualWiretapsTargetName").value = "";
  document.querySelector(".modalIndividualWiretapsTargetDate").value = "";
  document.querySelector(".modalIndividualWiretapsTargetNation").value = "";
  document.querySelector(".modalIndividualWiretapsTargetProvince").value = "";
  document.querySelector(".modalIndividualWiretapsTargetCity").value = "";
  document.querySelector(".modalIndividualWiretapsTargetAddress").value = "";

  if(document.querySelector(".accordionTarget").childNodes[1].childNodes[3].classList.contains("show")){
    document.querySelector(".accordionTarget").childNodes[1].childNodes[3].classList.remove("show");
    document.querySelector(".accordionTarget").childNodes[1].childNodes[1].childNodes[1].classList.add("collapsed");
  }


  //Chiamata
  document.querySelector(".modalIndividualWiretapsSource").selectedIndex = 0;
  document.querySelector(".modalIndividualWiretapsTarget").selectedIndex = 0;
  document.querySelector(".modalIndividualWiretapsSource").disabled = true;
  document.querySelector(".modalIndividualWiretapsTarget").disabled = true;
  document.querySelector(".modalIndividualWiretapsDate").value = "";
  document.querySelector(".modalIndividualWiretapsDuration").value = "";
  document.querySelector(".modalIndividualWiretapsTime").value = "";
  document.querySelector(".modalIndividualWiretapsTextarea").value = "";

}

function fillUpdateModalCallIndividualWiretaps(){

  let [day, month, year] = document.querySelector(".infoIndividualWiretapsEdgeDateContent").innerHTML.split('/');
  
  //Checkbox
  document.querySelector("#CheckSourceExisting").checked = true;
  document.querySelector("#CheckTargetExisting").checked = true;

  //Mittente
  document.querySelector(".accordionSource").style.display = "none";
    
  //Destinatario
  document.querySelector(".accordionTarget").style.display = "none";


  //Chiamata
  document.querySelector(".modalIndividualWiretapsSource").value = document.querySelector(".infoIndividualWiretapsEdgeSourceContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTarget").value = document.querySelector(".infoIndividualWiretapsEdgeTargetContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsSource").disabled = false;
  document.querySelector(".modalIndividualWiretapsTarget").disabled = false;
  document.querySelector(".modalIndividualWiretapsDate").value = `${year}-${month}-${day}`;
  document.querySelector(".modalIndividualWiretapsDuration").value = document.querySelector(".infoIndividualWiretapsEdgeDurationContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTime").value = document.querySelector(".infoIndividualWiretapsEdgeTimeContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTextarea").value = document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML;

}

function fillUpdateModalIndividualIndividualWiretaps(){
  let [day, month, year] = document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML.split('/');

  //Individuo
  document.querySelector(".modalIndividualWiretapsIndividualSurname").value = document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsIndividualName").value = document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsIndividualDate").value = `${year}-${month}-${day}`;
  document.querySelector(".modalIndividualWiretapsIndividualNation").value = document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsIndividualProvince").value = document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsIndividualCity").value = document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsIndividualAddress").value = document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML;

}

function openModalAddNewCallIndividualWiretaps(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "flex";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";
  document.querySelector("#modalIndividualWiretapsLabel").innerHTML = "Inserimento nuova intercettazione telefonica";

  fillAddModalIndividualWiretaps();
}

function openModalUpdateCallIndividualWiretaps(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "flex";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";
  document.querySelector("#modalIndividualWiretapsLabel").innerHTML = "Modifica intercettazione telefonica";

  fillUpdateModalCallIndividualWiretaps();
}

function openModalDeleteCallIndividualWiretaps(){
  document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML = "Cancellazione intercettazione telefonica";
  document.querySelector(".modalDeleteIndividualWiretapsBody").innerHTML = "Sei sicuro di voler cancellare questa chiamata? Verranno cancellati solamente i dati dell'intercettazione lasciando invariati i dati degli individui";
}

function openModalUpdateIndividualIndividualWiretaps(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "none";
  document.querySelector(".modalFormUpdateIndividual").style.display = "flex";
  document.querySelector("#modalIndividualWiretapsLabel").innerHTML = "Modifica individuo";

  fillUpdateModalIndividualIndividualWiretaps();
}

function openModalDeleteIndividualIndividualWiretaps(){
  document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML = "Cancellazione individuo";
  document.querySelector(".modalDeleteIndividualWiretapsBody").innerHTML = "Sei sicuro di voler cancellare questo individuo?";
}

function sendNewCallToBackendIndividualWiretaps(){
  let json;

  if(document.querySelector(".modalIndividualWiretapsSource").value != document.querySelector(".modalIndividualWiretapsTarget").value)
    json = `{
                "edgeId": "${document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML}",
                "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
                "targetiD": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
                "date": "${document.querySelector(".modalIndividualWiretapsDate").value}",
                "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
                "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
                "content": "${document.querySelector(".modalIndividualWiretapsTextarea").value}",
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

  viewToastMessage("Registrazione Chiamata", "Registrazione avvenuta con successo.", "success");  
}

function sendUpdateCallToBackendIndividualWiretaps(){
  let json;

  if(document.querySelector(".modalIndividualWiretapsSource").value != document.querySelector(".modalIndividualWiretapsTarget").value)
    json = `{
                "edgeId": "${document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML}",
                "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
                "targetiD": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
                "date": "${document.querySelector(".modalIndividualWiretapsDate").value}",
                "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
                "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
                "content": "${document.querySelector(".modalIndividualWiretapsTextarea").value}",
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
      viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");
      return response.text();
    } else {
      viewToastMessage("Modifica Chiamata", "Errore nella modifica della chiamata.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });*/

  viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");  
}

function sendUpdateIndividualToBackendIndividualWiretaps(){
  let json;

  json = `{
            "nodeId": "${document.querySelector(".infoIndividualWiretapsNodeIdContent").innerHTML}",
            "surname": "${document.querySelector(".modalIndividualWiretapsIndividualSurname").value}",
            "name": "${document.querySelector(".modalIndividualWiretapsIndividualName").value}",
            "date": "${document.querySelector(".modalIndividualWiretapsIndividualDate").value}",
            "nation": "${document.querySelector(".modalIndividualWiretapsIndividualNation").value}",
            "province": "${document.querySelector(".modalIndividualWiretapsIndividualProvince").value}",
            "city": "${document.querySelector(".modalIndividualWiretapsIndividualCity").value}",
            "address": "${document.querySelector(".modalIndividualWiretapsIndividualAddress").value}",
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
      viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");
      return response.text();
    } else {
      viewToastMessage("Modifica Chiamata", "Errore nella modifica della chiamata.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });*/

  viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");  
}

function sendIdToDeleteIndividualWiretaps(){
  let id;
  let url;

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Cancellazione intercettazione telefonica"){
    id = document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML;
    url = "";
  }
    

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Cancellazione individuo"){
    id = document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML;
    url = ""
  }
    

  /*fetch(url, { //FUNZIONE PER INSERIRE I DATI
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

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Cancellazione intercettazione telefonica")
    viewToastMessage("Cancellazione Chiamata", "Cancellazione avvenuta con successo.", "success");  

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Cancellazione individuo")
    viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");  
}

function deleteNodeIndividualWiretaps(){
  let id = document.querySelector(".infoIndividualWiretapsNodeIdContent").innerHTML;

  /*fetch("", { //FUNZIONE PER INSERIRE I DATI
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");
      return response.text();
    } else {
      viewToastMessage("Modifica Chiamata", "Errore nella modifica della chiamata.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });*/

  viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");
}

function deleteEdgeIndividualWiretaps(){
  let id = document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML;

  /*fetch("", { //FUNZIONE PER INSERIRE I DATI
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");
      return response.text();
    } else {
      viewToastMessage("Modifica Chiamata", "Errore nella modifica della chiamata.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });*/

  viewToastMessage("Cancellazione Chiamata", "Cancellazione avvenuta con successo.", "success");
}

function selectFunctionToRegisterDateIndividualWiretaps(){
  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Inserimento nuova intercettazione telefonica")
    sendNewCallToBackendIndividualWiretaps();

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Modifica intercettazione telefonica")
    sendUpdateCallToBackendIndividualWiretaps();

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Modifica individuo")
    sendUpdateIndividualToBackendIndividualWiretaps();
}

function selectFunctionToDeleteDateIndividualWiretaps(){
  if(document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML == "Cancellazione individuo")
    deleteNodeIndividualWiretaps();

  if(document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML == "Cancellazione intercettazione telefonica")
    deleteEdgeIndividualWiretaps();
}
