//funzione che permette il funzionamento delle frecce dell'accordion
document.addEventListener('DOMContentLoaded', function() {
    let accordionItems = document.querySelectorAll('.accordion-item-graph');
  
    accordionItems.forEach(function(accordionItem) {
      accordionItem.childNodes[1].addEventListener('click', function() {
          if(accordionItem.childNodes[3].childNodes[3].classList.contains('accordionIconToggleRight')){
            accordionItem.childNodes[3].childNodes[3].classList.replace('accordionIconToggleRight','accordionIconToggleDown');
            accordionItem.childNodes[3].childNodes[3].childNodes[1].classList.replace('accordionIconToggleRightSvg','accordionIconToggleDownSvg');
          }  
          else{
            accordionItem.childNodes[3].childNodes[3].classList.replace('accordionIconToggleDown','accordionIconToggleRight');
            accordionItem.childNodes[3].childNodes[3].childNodes[1].classList.replace('accordionIconToggleDownSvg','accordionIconToggleRightSvg');
          }
        });
    });
  });