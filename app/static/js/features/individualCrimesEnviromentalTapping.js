let cyIndividualCrimesEnviromentalTapping;
let cyNodeTouchedIndividualCrimesEnviromentalTapping = "";
let cyEdgeTouchedIndividualCrimesEnviromentalTapping = "";

//funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Intercettazione Ambientale e Reati commessi dagli Individui";
  requestAllNodesIndividualCrimesEnviromentalTapping();   
};

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

function createGraphIndividualCrimesEnviromentalTapping(data) {

  cyIndividualCrimesEnviromentalTapping = cytoscape({
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
    minZoom: 0.09,
    maxZoom: 2.0
  });

  //si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualCrimesEnviromentalTapping.ready(function () {

    //questo per il nodo
    cyIndividualCrimesEnviromentalTapping.on('tap', 'node', function(evt) {
      requestDetailsOfNodeIndividualCrimesEnviromentalTapping(evt.target.id())

      if(cyEdgeTouchedIndividualCrimesEnviromentalTapping != "")
        cyIndividualCrimesEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualCrimesEnviromentalTapping).style('line-color', '#dfdfdf');

      if(cyNodeTouchedIndividualCrimesEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualCrimesEnviromentalTapping[0] == "R")
            cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#c70c35');
          else if(cyNodeTouchedIndividualCrimesEnviromentalTapping[1] == "A")
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#03a74f');
      }
      cyNodeTouchedIndividualCrimesEnviromentalTapping = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //questo per l'arco
    cyIndividualCrimesEnviromentalTapping.on('tap', 'edge', function(evt) {
      requestDetailsOfEdgeIndividualCrimesEnviromentalTapping(evt.target.id())

      if(cyNodeTouchedIndividualCrimesEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualCrimesEnviromentalTapping[0] == "R")
            cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#c70c35');
          else if(cyNodeTouchedIndividualCrimesEnviromentalTapping[1] == "A")
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualCrimesEnviromentalTapping.$("#"+ cyNodeTouchedIndividualCrimesEnviromentalTapping).style('background-color', '#03a74f');
      }

      if(cyEdgeTouchedIndividualCrimesEnviromentalTapping != "" || evt.target.classes()[0] == "Individuo" || evt.target.classes()[0] == "Reato" || evt.target.classes()[0] == "IntercettazioneAmb")
        cyIndividualCrimesEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualCrimesEnviromentalTapping).style('line-color', '#dfdfdf');
      cyEdgeTouchedIndividualCrimesEnviromentalTapping = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    cyIndividualCrimesEnviromentalTapping.on('tap', function(evt) {
      if(evt.target._private.container != undefined ){
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

    cyIndividualCrimesEnviromentalTapping.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimesEnviromentalTapping)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    cyIndividualCrimesEnviromentalTapping.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimesEnviromentalTapping)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

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

function changeLayoutIndividualCrimesEnviromentalTapping() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    cyIndividualCrimesEnviromentalTapping.layout({
      name: 'circle',
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    cyIndividualCrimesEnviromentalTapping.layout({
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
    cyIndividualCrimesEnviromentalTapping.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true
    }).run();
  }

}

function changeMetricIndividualCrimesEnviromentalTapping(){
  requestSizeNodesIndividualCrimesEnviromentalTapping();
}

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
  //document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualSurnameContent").innerHTML = data.cognome;
  //document.querySelector(".infoNodeNameContent").innerHTML = data.nome;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualBirthContent").innerHTML = data.dataNascita;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualNationContent").innerHTML = data.nazioneResidenza;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualProvinceContent").innerHTML = data.provinciaResidenza;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualResidenceContent").innerHTML = data.cittaResidenza;
  document.querySelector(".infoIndividualCrimesEnviromentalTappingNodeIndividualAddressContent").innerHTML = data.indirizzoResidenza;

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

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

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

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

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

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

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

function fillPropertyAccordionIndividualCrimesEnviromentalTapping(data){
  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}

/*function fillSourceAndTargetModalNewCallIndividualCrimesEnviromentalTapping(nodes){
  let selectSource = document.querySelector(".modalIndividualCrimesEnviromentalTappingSource");
  let selectTarget = document.querySelector(".modalIndividualCrimesEnviromentalTappingTarget");
  for (let j = 0; j < nodes.length; j++) {
    let opt = nodes[j].data.id;
    let el = new Option(opt, opt);

    if(nodes[j].data.id[0] == 'I')
      selectSource.appendChild(el);

    if(nodes[j].data.id[0] == 'R')
      selectTarget.appendChild(el);
  }
}

function sendNewCallToBackendIndividualCrimesEnviromentalTapping(){
  let json;

  json = `{
                sourceId: ${document.querySelector(".modalIndividualCrimesEnviromentalTappingSource").value},
                targetiD: ${document.querySelector(".modalIndividualCrimesEnviromentalTappingTarget").value},
                date: ${document.querySelector(".modalIndividualCrimesEnviromentalTappingDate").value},
                duration: ${document.querySelector(".modalIndividualCrimesEnviromentalTappingDuration").value},
                time: ${document.querySelector(".modalIndividualCrimesEnviromentalTappingTime").value},
                content: ${document.querySelector(".modalIndividualCrimesEnviromentalTappingTextarea").value},
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