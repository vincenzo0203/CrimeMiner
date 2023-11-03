let cyIndividualWiretaps;

function individualWiretaps() {
  requestAllNodesIndividualWiretaps();
}

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
    console.log(data)
    createGraphIndividualWiretaps(data);
    fillSourceAndTargetModalNewCallIndividualWiretaps(data.nodes)
  })
  .catch(error => {
    console.error(error);
  });
}

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

function createGraphIndividualWiretaps(data) {

  cyIndividualWiretaps = cytoscape({
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
  cyIndividualWiretaps.ready(function () {

    //questo per il nodo
    cyIndividualWiretaps.on('tap', 'node', function(evt) {
      requestDetailsOfNodeIndividualWiretaps(evt.target.id())
    });

    //questo per l'arco
    cyIndividualWiretaps.on('tap', 'edge', function(evt) {
      requestDetailsOfEdgeIndividualWiretaps(evt.target.id())
    });
  });
}

function changeLayoutIndividualWiretaps() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    cyIndividualWiretaps.layout({
      name: 'circle',
      animate: true,
      animationDuration: 2000
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
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
    cyIndividualWiretaps.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true,
      animationDuration: 2000
    }).run();
  }

}

function changeMetricIndividualWiretaps(){
  
}

function checkedNodesAndEdgesIndividualWiretaps(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualWiretaps.style()
    .resetToDefault()
    .selector('node')
      .style({
        'background-color': '#66CCFF',
        'label': 'data(id)'
      })
    .update();
  }
  else{
    cyIndividualWiretaps.style()
    .resetToDefault()
    .selector('node')
      .style({
        'background-color': '#66CCFF'
      })
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyIndividualWiretaps.style()
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
    cyIndividualWiretaps.style()
    .selector('edge')
        .style({
          'width': 2,
          'line-color': '#333',
          "curve-style": "bezier"
        })
    .update();
  }
}

function showDetailsOfNodeIndividualWiretaps(data){
  document.querySelector(".infoIndividualWiretapsEdge").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNot").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNode").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualWiretapsNodeIdContent").innerHTML = data.nodeId;
  /*document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = data.cognome;
  document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = data.nome;*/
  document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = data.dataNascita;
  document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = data.nazioneResidenza;
  document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = data.provinciaResidenza;
  document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = data.cittaResidenza;
  document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = data.indirizzoResidenza;
}

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

  //if(data.contenuto.substring(0,400) == data.contenuto)
    document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML = data.contenuto;
  /*else
    document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML = data.contenuto.substring(0,300) + " ..."; */
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

function sendNewCallToBackendIndividualWiretaps(){
  let json;

  if(document.querySelector(".modalIndividualWiretapsSource").value == document.querySelector(".modalIndividualWiretapsTarget").value)
    json = `{
                sourceId: ${document.querySelector(".modalIndividualWiretapsSource").value},
                targetiD: ${document.querySelector(".modalIndividualWiretapsTarget").value},
                date: ${document.querySelector(".modalIndividualWiretapsDate").value},
                duration: ${document.querySelector(".modalIndividualWiretapsDuration").value},
                time: ${document.querySelector(".modalIndividualWiretapsTime").value},
                content: ${document.querySelector(".modalIndividualWiretapsTextarea").value},
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