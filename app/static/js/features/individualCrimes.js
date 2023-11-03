let cyIndividualCrimes;

function individualCrimes() {
  requestAllNodesIndividualCrimes();
}

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
    console.log(data);
    createGraphIndividualCrimes(data);
  })
  .catch(error => {
    console.error(error);
  });
}

function requestDetailsOfNodeIndividualCrimes(id){
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
    showDetailsOfNodeIndividualCrimes(data.result[0].n)
  })
  .catch(error => {
    console.error(error);
  });
}

function requestDetailsOfEdgeIndividualCrimes(id){
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
        selector: 'node',
        style: {
          'background-color': '#66CCFF',
          'label': 'data(id)'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#333',
          "curve-style": "bezier"
        }
      }
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
    });
  });
}

function changeLayoutIndividualCrimes() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    cyIndividualCrimes.layout({
      name: 'circle',
      animate: true,
      animationDuration: 2000
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
      animate: true,
      animationDuration: 7000
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'fcose'){
    cyIndividualCrimes.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true,
      animationDuration: 2000
    }).run();
  }

}

function changeMetricIndividualCrimes(){
  
}

function checkedNodesAndEdgesIndividualCrimes(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualCrimes.style()
    .resetToDefault()
    .selector('node')
      .style({
        'background-color': '#66CCFF',
        'label': 'data(id)'
      })
    .update();
  }
  else{
    cyIndividualCrimes.style()
    .resetToDefault()
    .selector('node')
      .style({
        'background-color': '#66CCFF'
      })
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyIndividualCrimes.style()
    .selector('edge')
        .style({
          'width': 2,
          'line-color': '#333',
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
          'line-color': '#333',
          "curve-style": "bezier"
        })
    .update();
  }
}

function showDetailsOfNodeIndividualCrimes(data){
  document.querySelector(".infoEdge").style.display = "none";
  document.querySelector(".infoNot").style.display = "none";
  document.querySelector(".infoNode").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoNodeIdContent").innerHTML = data.nodeId;
  /*document.querySelector(".infoNodeSurnameContent").innerHTML = data.cognome;
  document.querySelector(".infoNodeNameContent").innerHTML = data.nome;*/
  document.querySelector(".infoNodeBirthContent").innerHTML = data.dataNascita;
  document.querySelector(".infoNodeNationContent").innerHTML = data.nazioneResidenza;
  document.querySelector(".infoNodeProvinceContent").innerHTML = data.provinciaResidenza;
  document.querySelector(".infoNodeResidenceContent").innerHTML = data.cittaResidenza;
  document.querySelector(".infoNodeAddressContent").innerHTML = data.indirizzoResidenza;
}

function showDetailsOfEdgeIndividualCrimes(data){
  document.querySelector(".infoNode").style.display = "none";
  document.querySelector(".infoNot").style.display = "none";
  document.querySelector(".infoEdge").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Chiamata";

  document.querySelector(".infoEdgeIdContent").innerHTML = data.edgeId;
  document.querySelector(".infoEdgeDateContent").innerHTML = data.data;
  document.querySelector(".infoEdgeDurationContent").innerHTML = data.durata;
  document.querySelector(".infoEdgeTimeContent").innerHTML = data.ora;
  document.querySelector(".infoEdgeSourceContent").innerHTML = data.sourceNodeId;
  document.querySelector(".infoEdgeTargetContent").innerHTML = data.targetNodeId;

  //if(data.contenuto.substring(0,400) == data.contenuto)
    document.querySelector(".infoEdgeContentContent").innerHTML = data.contenuto;
  /*else
    document.querySelector(".infoEdgeContentContent").innerHTML = data.contenuto.substring(0,300) + " ..."; */
}