let cyIndividualEnviromentalTapping;
let cyEdgeTouchedIndividualEnviromentalTapping  = "";

//funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Intercettazione Ambientale tra gli Individui";
  requestAllNodesIndividualEnviromentalTapping();   
};

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

function requestSizeNodesIndividualEnviromentalTapping(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "findallgraph";
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
    changeSizeNodesIndividualEnviromentalTapping(data);
  })
  .catch(error => {
    console.error(error);
  });
}

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

function createGraphIndividualEnviromentalTapping(data) {

  cyIndividualEnviromentalTapping = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: data,
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
    minZoom: 0.16,
    maxZoom: 2.0
  });

  //si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualEnviromentalTapping.ready(function () {

    //questo per il nodo
    cyIndividualEnviromentalTapping.on('tap', 'node', function(evt) {
      requestDetailsOfNodeIndividualEnviromentalTapping(evt.target.id())
    });

    //questo per l'arco
    cyIndividualEnviromentalTapping.on('tap', 'edge', function(evt) {
      requestDetailsOfEdgeIndividualEnviromentalTapping(evt.target.id())
      if(cyEdgeTouchedIndividualEnviromentalTapping != "")
        cyIndividualEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');
      cyEdgeTouchedIndividualEnviromentalTapping = evt.target.id();
      evt.target.style('line-color', '#FF0000');
    });

    cyIndividualEnviromentalTapping.on('tap', function(evt) {
      if(evt.target._private.container != undefined){
        cyIndividualEnviromentalTapping.$("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');
        cyEdgeTouchedIndividualEnviromentalTapping = "";
      }
    });

    cyIndividualEnviromentalTapping.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    cyIndividualEnviromentalTapping.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

function changeSizeNodesIndividualEnviromentalTapping(data){
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

function changeLayoutIndividualEnviromentalTapping() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    cyIndividualEnviromentalTapping.layout({
      name: 'circle',
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
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
    cyIndividualEnviromentalTapping.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true
    }).run();
  }

}

function changeMetricIndividualEnviromentalTapping(){
  requestSizeNodesIndividualEnviromentalTapping();
}

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

function showDetailsOfNodeIndividualIndividualEnviromentalTapping(data){
  document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualIdContent").innerHTML = data.nodeId;
  //document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = data.cognome;
  //document.querySelector(".infoNodeNameContent").innerHTML = data.nome;
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = data.dataNascita;
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = data.nazioneResidenza;
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = data.provinciaResidenza;
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = data.cittaResidenza;
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = data.indirizzoResidenza;

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

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

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

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

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

function fillPropertyAccordionIndividualEnviromentalTapping(data){
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