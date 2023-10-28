// Recupera lo stato dopo il reload e serve per far ricaricare il contenuto della pagina 
/*window.addEventListener("beforeunload", function (event) {
  let url = window.location.pathname.split("/CrimeMiner/").join("");
  document.cookie = "page="+ url;
  event.preventDefault();
  location.href = "/CrimeMiner/";
});*/

function individualWiretaps() {
  createGraphIndividualWiretaps();
}

function createGraphIndividualWiretaps(){  
  
  let cy = cytoscape({
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
          name: 'dagre' //circle
        }
      });
      
    console.log(cy.container());
}