// Recupera lo stato dopo il reload e serve per far ricaricare il contenuto della pagina 
window.addEventListener("load", function () {
  let url = window.location.pathname.split("/CrimeMiner/").join("");
  document.cookie = "page="+ url;
  window.location.href = "/CrimeMiner/";
});

window.onload = function () {
  createGraph();
}

function createGraph() {
  let cy = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: [
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      { data: { id: 'ab', source: 'a', target: 'b' } }
    ]
  });
}