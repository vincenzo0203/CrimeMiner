//Variabile che conterrà il grafo che andremo a realizzare
let cyIndividualEnviromentalTapping;

//Variabili che ci consentono di tener traccia del nodo o dell'arco da far tornare come prima
let cyNodeTouchedIndividualEnviromentalTapping = ""
let cyEdgeTouchedIndividualEnviromentalTapping  = "";

//Variabile che ci consente di tener traccia dell'id dell'utente quando si anonimizza
let cyNodeDataIndividualEnviromentalTapping  = "";

let editorModalAddTextAreaIndividualEnviromentalTapping = "";
let editorModalTextAreaIndividualEnviromentalTapping = "";

//Funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Intercettazione Ambientale tra gli Individui";

  //Funzione che fa partire il caricamento
  loadPage(2500);
  requestAllNodesIndividualEnviromentalTapping();
  checkedIndividualAndEnviromentalTappingModalIndividualEnviromentalTapping();

  //Comando che fa aprire all'avvio della pagina l'accordione delle proprietà
  document.querySelector("#item-properties").click();

  //Controllo se devo anonimizzare i dati
  if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      if(getCookie("anonymization") == "yes")
        document.querySelector("#CheckAnonymization").checked = true;

  //elemento che rimpiazza la Textarea con un text editor tipo word
  CKEDITOR.replace("textarea-add-content", {
    wordcount: {'showWordCount': false,
                'showParagraphs': false,
                'showCharCount': true
            },
            removeButtons: 'Source,PasteFromWord,Scayt,PasteText,RemoveFormat,Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript,Image,Link,Unlink,Table,HorizontalRule,SpecialChar,Maximize,About,Styles,Format,Font,FontSize,Blockquote,Indent,Outdent,NumberedList,BulletedList,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Smiley,Iframe',
            resize_enabled: false,
            on: {
              instanceReady: function (ev) {
                  editorModalAddTextAreaIndividualEnviromentalTapping = ev.editor;
                  ev.editor.container.$.getElementsByClassName('cke_bottom')[0].style.display = 'none';
              }
            }
  });

  //elemento che rimpiazza la Textarea con un text editor tipo word
  CKEDITOR.replace("textarea-content", {
    wordcount: {'showWordCount': false,
                'showParagraphs': false,
                'showCharCount': true
            },
            removeButtons: 'Source,PasteFromWord,Scayt,PasteText,RemoveFormat,Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript,Image,Link,Unlink,Table,HorizontalRule,SpecialChar,Maximize,About,Styles,Format,Font,FontSize,Blockquote,Indent,Outdent,NumberedList,BulletedList,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Smiley,Iframe',
            resize_enabled: false,
            on: {
              instanceReady: function (ev) {
                editorModalTextAreaIndividualEnviromentalTapping = ev.editor;
                ev.editor.container.$.getElementsByClassName('cke_bottom')[0].style.display = 'none';
              }
            }
  });

  CKEDITOR.on("instanceReady", function (event) {
    editorModalTextAreaIndividualWiretaps = event.editor;
  });
};

//Funzione che effettua la richiesta al backend per caricare il grafo iniziale
function requestAllNodesIndividualEnviromentalTapping() {
  fetch("/CrimeMiner/individuoIntercettazioneAmb/graphall/", {
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
    createGraphIndividualEnviromentalTapping(data.result);
    fillPropertyAccordionIndividualEnviromentalTapping(data.result);
    requestAllNodesModalIndividualEnviromentalTapping();
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per caricare i nomi del'individuo e del crimine nella modale
function requestAllNodesModalIndividualEnviromentalTapping() {

  fetch("/CrimeMiner/individuoIntercettazioneAmb/outputJson/", {
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
    fillIndividualAndEnviromentalTappingModalNewEnviromentalTappingIndividualEnviromentalTapping(data.result);
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per le metriche
function requestSizeNodesIndividualEnviromentalTapping(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "graphall";
  else
    metric = document.querySelector(".selectMetrics").value;

  fetch("/CrimeMiner/individuoIntercettazioneAmb/"+ metric +"/", {
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
    if(metric != "graphall")
      changeSizeNodesIndividualEnviromentalTapping(data);
    else
      changeSizeNodesIndividualEnviromentalTapping(data.result);
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo nodo
function requestDetailsOfNodeIndividualEnviromentalTapping(id){
  fetch("/CrimeMiner/individuoIntercettazioneAmb/getIntercettazioneAmbIndividuoInfoById/" + id, {
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
      showDetailsOfNodeIndividualIndividualEnviromentalTapping(data.result[0].n)
    if(data.result[0].i != undefined)
      showDetailsOfNodeEnviromentalTappingIndividualEnviromentalTapping(data.result[0].i)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo arco
function requestDetailsOfEdgeIndividualEnviromentalTapping(id){
  fetch("/CrimeMiner/individuoIntercettazioneAmb/getinfobyedgeid/" + id, {
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
    showDetailsOfEdgeIndividualEnviromentalTapping(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che crea il grafo con le sue opportune proprietà
function createGraphIndividualEnviromentalTapping(data) {

  //Creazione del grafico con assegnazione alla variabile
  cyIndividualEnviromentalTapping = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
    style: [ // Stile dei nodi e degli archi
      {
        selector: '.Individuo',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#03a74f',
          'label': 'data(id)'
        }
      },
      {
        selector: '.IntercettazioneAmb',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#d7bd1e',
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
    },
    minZoom: 0.14,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyIndividualEnviromentalTapping.ready(function () {

    //Funzione di click per il nodo
    cyIndividualEnviromentalTapping.on('tap', 'node', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeIndividualEnviromentalTapping(evt.target.id())

      //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualEnviromentalTapping != "")
        cyIndividualEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');

      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
          else
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
      }

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedIndividualEnviromentalTapping = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click per l'arco
    cyIndividualEnviromentalTapping.on('tap', 'edge', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo arco
      requestDetailsOfEdgeIndividualEnviromentalTapping(evt.target.id());

      //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualEnviromentalTapping != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
          else
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
      }
      
      //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualEnviromentalTapping != "" || evt.target.classes()[0] == "Individuo" || evt.target.classes()[0] == "IntercettazioneAmb")
        cyIndividualEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');

      //Inserisco l'arco corrente nella variabile e gli cambio il colore
      cyEdgeTouchedIndividualEnviromentalTapping = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyIndividualEnviromentalTapping.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined){

        //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
        if(cyEdgeTouchedIndividualEnviromentalTapping != ""){
          cyIndividualEnviromentalTapping.$("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');
          cyEdgeTouchedIndividualEnviromentalTapping = "";
        }
        if(cyNodeTouchedIndividualEnviromentalTapping != ""){
          if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
          else
            cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
          cyNodeTouchedIndividualEnviromentalTapping = "";
        }
      }
    });

    //Con questa funzione, quando passo sull'arco, cambia colore
    cyIndividualEnviromentalTapping.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
    cyIndividualEnviromentalTapping.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

//Con questa funzione in base alla metrica decido di quanto moltiplicare il valore dei nodi per renderla visibile sul grafo
function changeSizeNodesIndividualEnviromentalTapping(data){
  let selectMetrics = document.querySelector(".selectMetrics").value;

  if(selectMetrics == "Default"){
    data = data.nodes;
    for(let i = 0; i < data.length; i++)
      cyIndividualEnviromentalTapping.$('#'+ data[i].data.id).data("size",data[i].data.size);
  }
  else{
    data = data.result;
    if(selectMetrics == "PageRank" || selectMetrics == "WeightedPageRank"|| selectMetrics == "Closeness")
    for(let i = 0; i < data.length; i++){
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*200);
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*200);
    }

    if(selectMetrics == "Betweenness")
    for(let i = 0; i < data.length; i++){
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size/10);
    }

    if(selectMetrics == "Degree" || selectMetrics == "InDegree" || selectMetrics == "OutDegree")
    for(let i = 0; i < data.length; i++){
      cyIndividualEnviromentalTapping.$('#'+ data[i].id).data("size",data[i].size*3);
    }
  }
}

//Con questa funzione cambio la visualizzazione del Layout del grafo tra circle, dagre e fcose
function changeLayoutIndividualEnviromentalTapping() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    loadPage(2500);

    cyIndividualEnviromentalTapping.layout({
      name: 'circle',
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    loadPage(2500);

    cyIndividualEnviromentalTapping.layout({
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
    loadPage(2500);

    cyIndividualEnviromentalTapping.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true
    }).run();
  }

}

//Funzione che richiama la request delle metriche
function changeMetricIndividualEnviromentalTapping(){
  requestSizeNodesIndividualEnviromentalTapping();
}

//Funzione che anonimizza i dati dell'Individuo
function anonymizationNodeDetailsIndividualEnviromentalTapping(flag){

  if(flag == "yes"){
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    if(cyNodeDataIndividualEnviromentalTapping != ""){
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.surname;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.name;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.date;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.nation;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.province;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.city;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualCapContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.cap;
      document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = cyNodeDataIndividualEnviromentalTapping.address;
    }
  }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdgesIndividualEnviromentalTapping(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualEnviromentalTapping.style()
    .resetToDefault()
    .selector('.Individuo')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f',
        'label': 'data(id)'
      })
    .selector('.IntercettazioneAmb')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#d7bd1e',
        'label': 'data(id)'
      })
    .update();
  }
  else{
    cyIndividualEnviromentalTapping.style()
    .resetToDefault()
    .selector('.Individuo')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f'
      })
    .selector('.IntercettazioneAmb')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#d7bd1e'
      })
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyIndividualEnviromentalTapping.style()
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
    cyIndividualEnviromentalTapping.style()
    .selector('edge')
        .style({
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier"
        })
    .update();
  }
}

//Funzione che inserisce nei cookie il valore dell'anonimizzazione e chiama un'altra funzione per la modifica nel layout
function checkedAnonymizationIndividualEnviromentalTapping(){
  if(document.querySelector("#CheckAnonymization").checked == true){

    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=yes";
    else
      setCookie("anonymization","yes");
    
      anonymizationNodeDetailsIndividualEnviromentalTapping("yes");
  }
  else{
    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      setCookie("anonymization","no");
    
      anonymizationNodeDetailsIndividualEnviromentalTapping("no");
  }
}

//Funzione che controlla dalle checkbox della modale se il mittente o il destinatario sono già registrati
function checkedIndividualAndEnviromentalTappingModalIndividualEnviromentalTapping(){

  if(document.querySelector("#CheckIndividualExisting").checked){
    document.querySelector(".accordionIndividual").style.display = "none";
    document.querySelector(".modalIndividualEnviromentalTappingIndividual").disabled = false;
  }
  else{
    document.querySelector(".accordionIndividual").style.display = "block";
    document.querySelector(".modalIndividualEnviromentalTappingIndividual").disabled = true;
  }

  if(document.querySelector("#CheckEnviromentalTappingExisting").checked){
    document.querySelector(".accordionEnviromentalTapping").style.display = "none";
    document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").disabled = false;
  }
  else{
    document.querySelector(".accordionEnviromentalTapping").style.display = "block";
    document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").disabled = true;
  }

}

//Funzione che mostra i dettagli dei nodi della tipologia Individuo
function showDetailsOfNodeIndividualIndividualEnviromentalTapping(data){
  document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Individuo";

  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualIdContent").innerHTML = data.nodeId;

  cyNodeDataIndividualEnviromentalTapping = JSON.parse(`{
                                                "nodeId": "${data.nodeId}",
                                                "surname": "${data.cognome}",
                                                "name": "${data.nome}",
                                                "date": "${data.dataNascita}",
                                                "nation": "${data.nazioneResidenza}",
                                                "province": "${data.provinciaResidenza}",
                                                "city": "${data.cittaResidenza}",
                                                "cap": "${data.capResidenza}",
                                                "address": "${data.indirizzoResidenza}"
                                              }`);

  if(getCookie("anonymization") == "yes"){

    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = "*********";
  }
  else{
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualSurnameContent").innerHTML = data.cognome;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNameContent").innerHTML = data.nome;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualBirthContent").innerHTML = data.dataNascita;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualNationContent").innerHTML = data.nazioneResidenza;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualProvinceContent").innerHTML = data.provinciaResidenza;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualResidenceContent").innerHTML = data.cittaResidenza;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualCapContent").innerHTML = data.capResidenza;
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualAddressContent").innerHTML = data.indirizzoResidenza;
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli dei nodi della tipologia Intercettazione Ambientale
function showDetailsOfNodeEnviromentalTappingIndividualEnviromentalTapping(data){
  document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Intercettazione Ambientale";

  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingIdContent").innerHTML = data.nodeId;
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingDateContent").innerHTML = data.data;
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingPlaceContent").innerHTML = data.luogo;
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingContentContent").innerHTML = data.contenuto;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli degli archi
function showDetailsOfEdgeIndividualEnviromentalTapping(data){
  document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "none";
  document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Presenza";

  document.querySelector(".infoIndividualEnviromentalTappingEdgeIdContent").innerHTML = data.edgeId;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeIndividualContent").innerHTML = data.sourceNodeId;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeEnviromentalTappingContent").innerHTML = data.targetNodeId;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeMonthsEnteredContent").innerHTML = data.mesiImputati;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeMonthsSentenceContent").innerHTML = data.mesiCondanna;
  document.querySelector(".infoIndividualEnviromentalTappingEdgeMonthsTotalContent").innerHTML = data.mesiTotali;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra il numero di nodi e archi presenti nel grafo
function fillPropertyAccordionIndividualEnviromentalTapping(data){

  let counterIndividual = 0;
  let counterEnviromentalTapping = 0;

  for(let i = 0; i < data.nodes.length; i++){
    if(data.nodes[i].classes == "Individuo")
      counterIndividual++;

    if(data.nodes[i].classes == "IntercettazioneAmb")
      counterEnviromentalTapping++;
  }

  document.querySelector(".accordionNumberNodesEdgesIndividualContent").innerHTML = counterIndividual;
  document.querySelector(".accordionNumberNodesEdgesEnviromentalTappingContent").innerHTML = counterEnviromentalTapping;
  document.querySelector(".accordionNumberNodesEdgesPresentContent").innerHTML = data.edges.length;

  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}

//Funzione che inserisce nelle select della modale gli individui da scegliere se già registrati e le intercettazioni se già registrate
function fillIndividualAndEnviromentalTappingModalNewEnviromentalTappingIndividualEnviromentalTapping(data){
  let nodes = data.nodes;

  let selectIndividual = document.querySelector(".modalIndividualEnviromentalTappingIndividual");
  let selectEnviromentalTapping = document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping");

  for (let i = 1; i < selectIndividual.length; i++){
    selectIndividual.remove(i);
  }

  for (let i = 1; i < selectEnviromentalTapping.length; i++){
    selectEnviromentalTapping.remove(i);
  }

  for (let j = 0; j < nodes.length; j++) {
    let opt = nodes[j].nodeId;
    let text;
    let el1;

    if(opt[1] == "A"){
        
      el1 = new Option(opt, opt);

      selectEnviromentalTapping.appendChild(el1);
    }
    else{
      text = nodes[j].cognome + " " + nodes[j].nome;

      if(text == "null null"){
        el1 = new Option(opt, opt);
      }
      else{
        el1 = new Option(opt+" "+text, opt);
      }

      selectIndividual.appendChild(el1);
    }
  }

  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddId").innerHTML = data.newNodeId;
}

//Funzione che cancella i valori degli input nella modale
function fillAddModalIndividualEnviromentalTapping(){
  
  //Checkbox
  document.querySelector("#CheckIndividualExisting").checked = false;
  document.querySelector("#CheckEnviromentalTappingExisting").checked = false;

  //Individuo
  document.querySelector(".accordionIndividual").style.display = "block";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddSurname").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddName").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddDate").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddNation").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddProvince").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddCity").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddCap").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddAddress").value = "";

  if(document.querySelector(".accordionIndividual").childNodes[1].childNodes[3].classList.contains("show")){
    document.querySelector(".accordionIndividual").childNodes[1].childNodes[3].classList.remove("show");
    document.querySelector(".accordionIndividual").childNodes[1].childNodes[1].childNodes[1].classList.add("collapsed");
  }
    
  //Intercettazione Ambientale
  document.querySelector(".accordionEnviromentalTapping").style.display = "block";
  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddPlace").value = "";
  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddDate").value = "";
  editorModalAddTextAreaIndividualEnviromentalTapping.setData("");

  if(document.querySelector(".accordionEnviromentalTapping").childNodes[1].childNodes[3].classList.contains("show")){
    document.querySelector(".accordionEnviromentalTapping").childNodes[1].childNodes[3].classList.remove("show");
    document.querySelector(".accordionEnviromentalTapping").childNodes[1].childNodes[1].childNodes[1].classList.add("collapsed");
  }

  document.querySelector(".modalIndividualEnviromentalTappingIndividual").selectedIndex = 0;
  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").selectedIndex = 0;
  document.querySelector(".modalIndividualEnviromentalTappingIndividual").disabled = true;
  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").disabled = true;

}

//Funzione che inserisce i campi dell'intercettazione nella modale
function fillUpdateModalEnviromentalTappingIndividualEnviromentalTapping(){

  let [day, month, year] = document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingDateContent").innerHTML.split('/');
  
  //Intercettazione Ambientale
  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingId").innerHTML = document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingIdContent").innerHTML;
  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingPlace").value = document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingPlaceContent").innerHTML;
  document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingDate").value = `${year}-${month}-${day}`;
  //document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingTextarea").value = document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingContentContent").innerHTML;
  editorModalTextAreaIndividualEnviromentalTapping.setData(document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingContentContent").innerHTML);
}

//Funzione che inserisce i campi dell'individuo nella modale
function fillUpdateModalIndividualIndividualEnviromentalTapping(){
  let [day, month, year] = cyNodeDataIndividualEnviromentalTapping.date.split('/');

  //Individuo
  document.querySelector(".modalIndividualEnviromentalTappingIndividualSurname").value = cyNodeDataIndividualEnviromentalTapping.surname;
  document.querySelector(".modalIndividualEnviromentalTappingIndividualName").value = cyNodeDataIndividualEnviromentalTapping.name;
  document.querySelector(".modalIndividualEnviromentalTappingIndividualDate").value = `${year}-${month}-${day}`;
  document.querySelector(".modalIndividualEnviromentalTappingIndividualNation").value = cyNodeDataIndividualEnviromentalTapping.nation;
  document.querySelector(".modalIndividualEnviromentalTappingIndividualProvince").value = cyNodeDataIndividualEnviromentalTapping.province;
  document.querySelector(".modalIndividualEnviromentalTappingIndividualCity").value = cyNodeDataIndividualEnviromentalTapping.city;
  document.querySelector(".modalIndividualEnviromentalTappingIndividualCap").value = cyNodeDataIndividualEnviromentalTapping.cap;
  document.querySelector(".modalIndividualEnviromentalTappingIndividualAddress").value = cyNodeDataIndividualEnviromentalTapping.address;

}

//Funzione che all'apertura della modale di aggiunta cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalAddNewEnviromentalTappingIndividualEnviromentalTapping(){
  document.querySelector(".modalFormAddEnviromentalTapping").style.display = "flex";
  document.querySelector(".modalFormUpdateEnviromentalTapping").style.display = "none";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";
  document.querySelector("#modalIndividualEnviromentalTappingLabel").innerHTML = "Inserimento nuova presenza in intercettazione ambientale";

  fillAddModalIndividualEnviromentalTapping();

}

//Funzione che all'apertura della modale di modifica cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalUpdateEnviromentalTappingIndividualEnviromentalTapping(){
  document.querySelector(".modalFormAddEnviromentalTapping").style.display = "none";
  document.querySelector(".modalFormUpdateEnviromentalTapping").style.display = "flex";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";
  document.querySelector("#modalIndividualEnviromentalTappingLabel").innerHTML = "Modifica intercettazione ambientale";

  fillUpdateModalEnviromentalTappingIndividualEnviromentalTapping();
}

//Funzione che all'apertura della modale di conferma eliminazione cambia i campi per la chiamata
function openModalDeleteEnviromentalTappingIndividualEnviromentalTapping(){
  document.querySelector("#modalDeleteIndividualEnviromentalTappingLabel").innerHTML = "Cancellazione intercettazione ambientale";
  document.querySelector(".modalDeleteIndividualEnviromentalTappingBody").innerHTML = "Sei sicuro di voler cancellare questa intercettazione? Verranno cancellati i dati dell'intercettazione e le presenze degli individui a quell'intercettazione cancellando eventualmente anche mesi imputati o mesi condanna";
}

//Funzione che all'apertura della modale di modifica cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalUpdateIndividualIndividualEnviromentalTapping(){
  document.querySelector(".modalFormAddEnviromentalTapping").style.display = "none";
  document.querySelector(".modalFormUpdateIndividual").style.display = "flex";
  document.querySelector(".modalFormUpdateEnviromentalTapping").style.display = "none";
  document.querySelector("#modalIndividualEnviromentalTappingLabel").innerHTML = "Modifica individuo";

  fillUpdateModalIndividualIndividualEnviromentalTapping();
}

//Funzione che all'apertura della modale di conferma eliminazione cambia i campi per l'individuo
function openModalDeleteIndividualIndividualEnviromentalTapping(){
  document.querySelector("#modalDeleteIndividualEnviromentalTappingLabel").innerHTML = "Cancellazione individuo";
  document.querySelector(".modalDeleteIndividualEnviromentalTappingBody").innerHTML = "Sei sicuro di voler cancellare questo individuo?";
}

//Funzione che all'apertura della modale di conferma eliminazione cambia i campi per la presenza
function openModalDeleteEdgeIndividualEnviromentalTapping(){
  document.querySelector("#modalDeleteIndividualEnviromentalTappingLabel").innerHTML = "Cancellazione presenza";
  document.querySelector(".modalDeleteIndividualEnviromentalTappingBody").innerHTML = "Sei sicuro di voler cancellare questa presenza? Verranno rimossi i mesi imputati e i mesi condanna dall'individuo presente all'intercettazione";
}

//Funzione che manda al backend una nuova chiamata da inserire (e enventualmente i nuovi individui)
function sendNewPresentToBackendIndividualEnviromentalTapping(){

  let [year, month, day] = "";

  let json = `{`;

  if(!document.querySelector("#CheckIndividualExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualEnviromentalTappingIndividualAddDate").value.split('-');

    json += ` "individual" : {
                            "cognome": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddSurname").value}",
                            "nome": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddName").value}",
                            "dataNascita": "${day}/${month}/${year}",
                            "nazioneResidenza": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddNation").value}",
                            "provinciaResidenza": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddProvince").value}",
                            "cittaResidenza": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddCity").value}",
                            "indirizzoResidenza": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddAddress").value}",
                            "capResidenza": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddCap").value}"
                          },
            `;
  }
  else{
    json += ` "individual" : {
        "nodeId": "${document.querySelector(".modalIndividualEnviromentalTappingIndividual").value}"
      },
    `;
  }

  if(!document.querySelector("#CheckEnviromentalTappingExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddDate").value.split('-');
    
    json += ` "enviromentalTapping" : {
                            "place": "${document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddPlace").value}",
                            "date": "${day}/${month}/${year}",
                            "content": "${editorModalAddTextAreaIndividualEnviromentalTapping.getData().replace(/\n/g,"")}"
                          }
            `;
  }
  else{
    json += ` "enviromentalTapping" : {
        "nodeId": "${document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").value}"
      }
    `;
  }

  json += `}`;

  fetch("/CrimeMiner/individuoIntercettazioneAmb/creaIntercettazioneAmb/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Registrazione Presenza", "Registrazione avvenuta con successo.", "success");
      returnToCreationPageIndividualEnviromentalTapping();
    } else {
      viewToastMessage("Registrazione Presenza", "Errore nella registrazione della presenza.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

}

//Funzione che manda al backend i dati da aggiornare della chiamata
function sendUpdateEnviromentalTappingToBackendIndividualEnviromentalTapping(){

  let [year, month, day] = document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingDate").value.split('-');

  let json = `{`;

  json += ` "enviromentalTapping" : {
    "nodeId": "${document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingIdContent").innerHTML}",
    "place": "${document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingPlace").value}",
    "date": "${day}/${month}/${year}",
    "content": "${editorModalTextAreaIndividualEnviromentalTapping.getData().replace(/\n/g,"")}"
  }
`;
  
  json += `}`;
  
  fetch("/CrimeMiner/intercettazioneAmbientale/modificaNodoAmb/", { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Modifica Intercettazione", "Modifica avvenuta con successo.", "success");
      returnToCreationPageIndividualEnviromentalTapping()
    } else {
      viewToastMessage("Modifica Intercettazione", "Errore nella modifica dell'intercettazione.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");  
}

//Funzione che manda al backend i dati da aggiornare dell'individuo
function sendUpdateIndividualToBackendIndividualEnviromentalTapping(){
  let json;

  json = `{
            "nodeId": "${document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualIdContent").innerHTML}",
            "surname": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualSurname").value}",
            "name": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualName").value}",
            "date": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualDate").value}",
            "nation": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualNation").value}",
            "province": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualProvince").value}",
            "city": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualCity").value}",
            "address": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualAddress").value}",
            "cap": "${document.querySelector(".modalIndividualEnviromentalTappingIndividualCap").value}"
          }`;
  
  fetch("/CrimeMiner/individuo/modificaIndividuo/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Modifica Individuo", "Modifica avvenuta con successo.", "success");
      returnToCreationPageIndividualEnviromentalTapping()
    } else {
      viewToastMessage("Modifica Individuo", "Errore nella modifica dell'individuo'.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");  
}

//Funzione che invia al backend l'individuo da cancellare
function deleteNodeIndividualIndividualEnviromentalTapping(){

  let json = `{
      "nodeId": "${document.querySelector(".infoIndividualEnviromentalTappingNodeIndividualIdContent").innerHTML}"
  }`;

  fetch("/CrimeMiner/individuo/eliminaIndividuo/", { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualEnviromentalTapping()
    } else {
      viewToastMessage("Cancellazione Individuo", "Errore nella cancellazione dell'individuo'.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");
}

//Funzione che invia al backend l'intercettazione da cancellare
function deleteNodeEnviromentalTappingIndividualEnviromentalTapping(){

  let json = `{
      "nodeId": "${document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTappingIdContent").innerHTML}"
  }`;

  fetch("/CrimeMiner/intercettazioneAmbientale/eliminaNodoAmb/", { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Intercettazione", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualEnviromentalTapping()
    } else {
      viewToastMessage("Cancellazione Intercettazione", "Errore nella cancellazione dell'intercettazione'.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che invia al backend la presenza da cancellare
function deleteEdgeIndividualEnviromentalTapping(){

  let json = `{
      "edgeId": "${document.querySelector(".infoIndividualEnviromentalTappingEdgeIdContent").innerHTML}"
  }`;

  fetch("/CrimeMiner/individuoIntercettazioneAmb/eliminaIntIndAmb/", { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Presenza", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualEnviromentalTapping()
    } else {
      viewToastMessage("Cancellazione Presenza", "Errore nella cancellazione della presenza.", "error");
    }
  })
  //.then(data => {
  //  data = JSON.parse(data);
  //})
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Cancellazione Chiamata", "Cancellazione avvenuta con successo.", "success");
}

//Funzione che decide se devo richiamare la funzione di aggiunta di un'intercettazione (compresa di individuo se inserito) o di modifica di un individuo o modifica di un'intercettazione'
function selectFunctionToRegisterDateIndividualEnviromentalTapping(){
  if(document.querySelector("#modalIndividualEnviromentalTappingLabel").innerHTML == "Inserimento nuova presenza in intercettazione ambientale")
    if(inputControlIndividualEnviromentalTapping() === true) 
      sendNewPresentToBackendIndividualEnviromentalTapping();

  if(document.querySelector("#modalIndividualEnviromentalTappingLabel").innerHTML == "Modifica intercettazione ambientale")
    if(inputControlIndividualEnviromentalTappingUpdateEnvTap() === true)
      sendUpdateEnviromentalTappingToBackendIndividualEnviromentalTapping();

  if(document.querySelector("#modalIndividualEnviromentalTappingLabel").innerHTML == "Modifica individuo")
    if(inputControlIndividualEnviromentalTappingUpdateInd() === true)
      sendUpdateIndividualToBackendIndividualEnviromentalTapping();
}

//Funzione che decide se devo richiamare la funzione di cancellazione di un individuo o una chiamata
function selectFunctionToDeleteDateIndividualEnviromentalTapping(){
  if(document.querySelector("#modalDeleteIndividualEnviromentalTappingLabel").innerHTML == "Cancellazione individuo")
    deleteNodeIndividualIndividualEnviromentalTapping();

  if(document.querySelector("#modalDeleteIndividualEnviromentalTappingLabel").innerHTML == "Cancellazione intercettazione ambientale")
    deleteNodeEnviromentalTappingIndividualEnviromentalTapping();

  if(document.querySelector("#modalDeleteIndividualEnviromentalTappingLabel").innerHTML == "Cancellazione presenza")
    deleteEdgeIndividualEnviromentalTapping();
}

//Funzione di ricaricamento della pagina quando creo, modifico o cancello dati nel grafo
function returnToCreationPageIndividualEnviromentalTapping(){

  document.querySelector(".btnCloseModalAddUpdate").click();
  document.querySelector(".btnCloseModalDelete").click();

  //Funzione che fa partire il caricamento
  loadPage(2500);
  requestAllNodesIndividualEnviromentalTapping();
  checkedIndividualAndEnviromentalTappingModalIndividualEnviromentalTapping();

  //Comando che fa aprire all'avvio della pagina l'accordion delle proprietà
  if(document.querySelector("#item-properties").checked == false)
    document.querySelector("#item-properties").click();

  if(document.querySelector("#item-details").checked == true){
    document.querySelector(".infoIndividualEnviromentalTappingEdge").style.display = "none";
    document.querySelector(".infoIndividualEnviromentalTappingNodeIndividual").style.display = "none";
    document.querySelector(".infoIndividualEnviromentalTappingNodeEnviromentalTapping").style.display = "none";
    document.querySelector(".infoIndividualEnviromentalTappingNot").style.display = "flex";

    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli";
    document.querySelector("#item-details").click();
  } 

  if(document.querySelector("#item-settings").checked == true)
    document.querySelector("#item-settings").click();

  //Controllo se devo anonimizzare i dati
  if(getCookie("anonymization") == "yes")
    document.querySelector("#CheckAnonymization").checked = true;
}

//Funzione che controlla se gli input nei form di creazione sono vuoti
function inputControlIndividualEnviromentalTapping(){
  let value = true;

  if(!document.querySelector("#CheckIndividualExisting").checked){
    
    if(document.querySelector(".modalIndividualEnviromentalTappingIndividualAddSurname").value == ""){
      document.querySelector(".modalIndividualEnviromentalTappingIndividualAddSurname").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualEnviromentalTappingIndividualAddSurname").style.borderColor = 'green';

    if(document.querySelector(".modalIndividualEnviromentalTappingIndividualAddName").value == ""){
      document.querySelector(".modalIndividualEnviromentalTappingIndividualAddName").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualEnviromentalTappingIndividualAddName").style.borderColor = 'green';

  }else{
    if(document.querySelector(".modalIndividualEnviromentalTappingIndividual").value == ""){
      document.querySelector(".modalIndividualEnviromentalTappingIndividual").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualEnviromentalTappingIndividual").style.borderColor = 'green';
  }

  if(!document.querySelector("#CheckEnviromentalTappingExisting").checked){
  
    if(document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddPlace").value == ""){
      document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddPlace").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingAddPlace").style.borderColor = 'green';
  }else{
    if(document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").value == ""){
      document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTapping").style.borderColor = 'green';
  }

  return value;
}

//Funzione che controlla se gli input nei form di aggiornamento sono vuoti
function inputControlIndividualEnviromentalTappingUpdateInd(){
  let value = true;
  
  if(document.querySelector(".modalIndividualEnviromentalTappingIndividualSurname").value == ""){
    document.querySelector(".modalIndividualEnviromentalTappingIndividualSurname").style.borderColor = 'red';
    value = false;
  }
  else
    document.querySelector(".modalIndividualEnviromentalTappingIndividualSurname").style.borderColor = 'green';

  if(document.querySelector(".modalIndividualEnviromentalTappingIndividualName").value == ""){
    document.querySelector(".modalIndividualEnviromentalTappingIndividualName").style.borderColor = 'red';
    value = false;
  }
  else
    document.querySelector(".modalIndividualEnviromentalTappingIndividualName").style.borderColor = 'green';

  return value;
}

//Funzione che controlla se gli input nei form di aggiornamento sono vuoti
function inputControlIndividualEnviromentalTappingUpdateEnvTap(){
  let value = true;
  
  if(document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingPlace").value == ""){
    document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingPlace").style.borderColor = 'red';
    value = false;
  }
  else
    document.querySelector(".modalIndividualEnviromentalTappingEnviromentalTappingPlace").style.borderColor = 'green';

  return value;
}