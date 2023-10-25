window.onload = function(){
    createGraph();
}

function createGraph(){
    let cy = cytoscape({
        container: document.querySelector('.cyContent'),
        elements: [
          { data: { id: 'a' } },
          { data: { id: 'b' } },
          { data: { id: 'ab', source: 'a', target: 'b' } }
        ]
    });
      console.log("AA")
}