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
    createGraphIndividualCrimes(data);
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
          'background-color': '#03a74f',
          'label': 'data(id)'
        }
      },
      {
        selector: '.Reato',
        style: {
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
    });

    cyIndividualCrimes.on('mouseover', 'edge', function (event) {
      event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    cyIndividualCrimes.on('mouseout', 'edge', function (event) {
      event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
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
  
}

function checkedNodesAndEdgesIndividualCrimes(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualCrimes.style()
    .resetToDefault()
    .selector('.Individuo')
      .style({
        'background-color': '#03a74f',
        'label': 'data(id)'
      })
    .selector('.Reato')
      .style({
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
        'background-color': '#03a74f'
      })
    .selector('.Reato')
      .style({
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
}

function showDetailsOfEdgeIndividualCrimes(data){
  console.log(data);
  /*document.querySelector(".infoNode").style.display = "none";
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
    document.querySelector(".infoEdgeContentContent").innerHTML = data.contenuto;*/
  /*else
    document.querySelector(".infoEdgeContentContent").innerHTML = data.contenuto.substring(0,300) + " ..."; */
}