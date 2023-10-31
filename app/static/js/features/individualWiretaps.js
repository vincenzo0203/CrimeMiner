// Recupera lo stato dopo il reload e serve per far ricaricare il contenuto della pagina 
/*window.addEventListener("beforeunload", function (event) {
  let url = window.location.pathname.split("/CrimeMiner/").join("");
  document.cookie = "page="+ url;
  event.preventDefault();
  location.href = "/CrimeMiner/";
});*/

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

  console.log(cyIndividualWiretaps.container());
}

function changeLayoutIndividualWiretaps() {

  cyIndividualWiretaps.layout({
    name: document.querySelector(".selectLayout").value,
    animate: true
  }).run();

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