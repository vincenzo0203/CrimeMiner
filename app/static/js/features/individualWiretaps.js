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
    createGraphIndividualWiretaps(data);
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
          'line-color': '#333'
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
      var edge = evt.target;
      console.log("tap", edge.id());
    });
  });
}

function changeLayoutIndividualWiretaps() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    cyIndividualWiretaps.layout({
      name: 'circle',
      animate: true
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
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'fcose'){
    cyIndividualWiretaps.layout({
      name: 'fcose',
      animate: true
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
        })
    .update();
  }
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

function showDetailsOfNodeIndividualWiretaps(data){
  console.log(data);
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
    showDetailsOfEdgeIndividualWiretaps(data)
  })
  .catch(error => {
    console.error(error);
  });
}

function showDetailsOfEdgeIndividualWiretaps(data){
  console.log(data);
}