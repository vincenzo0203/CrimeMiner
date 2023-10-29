// Recupera lo stato dopo il reload e serve per far ricaricare il contenuto della pagina 
/*window.addEventListener("beforeunload", function (event) {
  let url = window.location.pathname.split("/CrimeMiner/").join("");
  document.cookie = "page="+ url;
  event.preventDefault();
  location.href = "/CrimeMiner/";
});*/
let cyIndividualWiretaps;

function individualWiretaps() {
  createGraphIndividualWiretaps();
}

function createGraphIndividualWiretaps(){  
  
  cyIndividualWiretaps = cytoscape({
        container: document.querySelector('.cyContent'),
        elements: [
          // Definizione dei nodi
          { data: { id: 'a' } },
          { data: { id: 'b' } },
          { data: { id: 'c' } },
          { data: { id: 'd' } },
          { data: { id: 'e' } },
          { data: { id: 'f' } },
          { data: { id: 'g' } },
          { data: { id: 'h' } },
          { data: { id: 'i' } },

          // Definizione degli archi orientati
          { data: { id: 'ab', source: 'a', target: 'b' } },
          { data: { id: 'bc', source: 'b', target: 'c' } },
          { data: { id: 'cd', source: 'c', target: 'd' } },
          { data: { id: 'de', source: 'd', target: 'e' } },
          { data: { id: 'ef', source: 'e', target: 'f' } },
          { data: { id: 'fg', source: 'f', target: 'g' } },
          { data: { id: 'gh', source: 'g', target: 'h' } },
          { data: { id: 'hi', source: 'h', target: 'i' } },
          { data: { id: 'ia', source: 'i', target: 'a' } }
        ],
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

function changeLayoutIndividualWiretaps(){

  // Salva la posizione corrente dei nodi nel grafo attuale
  let currentPositions = cyIndividualWiretaps.nodes().positions();

  // Cambia la disposizione (layout) del grafo al nuovo layout
  cyIndividualWiretaps.layout({ name: document.querySelector(".selectLayout").value }).run();

  // Salva la posizione desiderata dei nodi secondo il nuovo layout
  let newPositions = cyIndividualWiretaps.nodes().positions();

  cyIndividualWiretaps.nodes().animate({
    position: (node) => {
      let currentPos = currentPositions[node.id()];
      let newPos = newPositions[node.id()];
      return newPos; // Animazione sposta il nodo dalla posizione corrente a quella desiderata
    }
  }, {
    duration: 3000, // Durata dell'animazione in millisecondi
    complete: () => {
      // L'animazione è completa
    }
  }).play();
  
}