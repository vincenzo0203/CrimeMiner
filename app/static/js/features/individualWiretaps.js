let cyIndividualWiretaps;
let cyNodeTouchedIndividualWiretaps  = "";
let cyEdgeTouchedIndividualWiretaps  = "";

//funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Intercettazione delle chiamate tra gli Individui";
  loadPage(2500);
  requestAllNodesIndividualWiretaps();
  document.querySelector("#item-properties").click();
};

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

  //si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualWiretaps.ready(function () {

    //questo per il nodo
    cyIndividualWiretaps.on('tap', 'node', function(evt) {
      requestDetailsOfNodeIndividualWiretaps(evt.target.id())
      if(cyEdgeTouchedIndividualWiretaps != "")
        cyIndividualWiretaps.edges("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');

      if(cyNodeTouchedIndividualWiretaps != "" || evt.target.classes() == undefined)
        cyIndividualWiretaps.nodes("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');
      cyNodeTouchedIndividualWiretaps = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //questo per l'arco
    cyIndividualWiretaps.on('tap', 'edge', function(evt) {
      requestDetailsOfEdgeIndividualWiretaps(evt.target.id())
  
      if(cyNodeTouchedIndividualWiretaps != "")
        cyIndividualWiretaps.nodes("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');
      
      if(cyEdgeTouchedIndividualWiretaps != "" || evt.target.classes()[0] == "Individuo")
        cyIndividualWiretaps.edges("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');
      cyEdgeTouchedIndividualWiretaps = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    cyIndividualWiretaps.on('tap', function(evt) {
      if(evt.target._private.container != undefined){
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

    cyIndividualWiretaps.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualWiretaps)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    cyIndividualWiretaps.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualWiretaps)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

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

function changeMetricIndividualWiretaps(){
  requestSizeNodesIndividualWiretaps();
}

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

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
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
  document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML = data.contenuto;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

function fillPropertyAccordionIndividualWiretaps(data){
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
