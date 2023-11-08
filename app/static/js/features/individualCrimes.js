let cyIndividualCrimes;
let cyEdgeTouchedIndividualCrimes  = "";

//funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Reati commessi dagli Individui";
  requestAllNodesIndividualCrimes();  
};

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

function createGraphIndividualCrimes(data) {

  cyIndividualCrimes = cytoscape({
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
    }
  });

  //si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualCrimes.ready(function () {

    //questo per il nodo
    cyIndividualCrimes.on('tap', 'node', function(evt) {
      requestDetailsOfNodeIndividualCrimes(evt.target.id())
    });

    //questo per l'arco
    cyIndividualCrimes.on('tap', 'edge', function(evt) {
      requestDetailsOfEdgeIndividualCrimes(evt.target.id())
      if(cyEdgeTouchedIndividualCrimes != "")
        cyIndividualCrimes.edges("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');
      cyEdgeTouchedIndividualCrimes = evt.target.id();
      evt.target.style('line-color', '#FF0000');
    });

    cyIndividualCrimes.on('tap', function(evt) {
      if(evt.target._private.container != undefined){
        cyIndividualCrimes.$("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');
        cyEdgeTouchedIndividualCrimes = "";
      }
    });

    cyIndividualCrimes.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimes)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    cyIndividualCrimes.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualCrimes)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

function changeSizeNodesIndividualCrimes(data){
  console.log(data);
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

function changeLayoutIndividualCrimes() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    cyIndividualCrimes.layout({
      name: 'circle',
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
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
    cyIndividualCrimes.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true
    }).run();
  }

}

function changeMetricIndividualCrimes(){
  requestSizeNodesIndividualCrimes();
}

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

function showDetailsOfNodeIndividualIndividualCrimes(data){
  document.querySelector(".infoIndividualCrimesEdge").style.display = "none";
  document.querySelector(".infoIndividualCrimesNot").style.display = "none";
  document.querySelector(".infoIndividualCrimesNodeCrime").style.display = "none";
  document.querySelector(".infoIndividualCrimesNodeIndividual").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualCrimesNodeIndividualIdContent").innerHTML = data.nodeId;
  //document.querySelector(".infoIndividualCrimesNodeIndividualSurnameContent").innerHTML = data.cognome;
  //document.querySelector(".infoNodeNameContent").innerHTML = data.nome;
  document.querySelector(".infoIndividualCrimesNodeIndividualBirthContent").innerHTML = data.dataNascita;
  document.querySelector(".infoIndividualCrimesNodeIndividualNationContent").innerHTML = data.nazioneResidenza;
  document.querySelector(".infoIndividualCrimesNodeIndividualProvinceContent").innerHTML = data.provinciaResidenza;
  document.querySelector(".infoIndividualCrimesNodeIndividualResidenceContent").innerHTML = data.cittaResidenza;
  document.querySelector(".infoIndividualCrimesNodeIndividualAddressContent").innerHTML = data.indirizzoResidenza;

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

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

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

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
    document.querySelector(".infoIndividualCrimesEdgeAggTitle").style.display = "flex";
    
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
    }
  }
  else{
    document.querySelector(".infoIndividualCrimesEdgeAggTitle").style.display = "none";
  }

  if(document.querySelector(".accordionButtonTwo").classList.contains("collapsed"))
    document.querySelector(".accordionButtonTwo").click();
}

function fillPropertyAccordionIndividualCrimes(data){
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