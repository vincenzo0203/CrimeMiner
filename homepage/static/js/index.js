function showFormers() {
    if (document.getElementById('showF').style.display == "none") {


        document.getElementById('showF').style.display = "block";
        //console.log(document.getElementById('op_cl').className)
        document.getElementById('op_cl').classList.remove('fa-chevron-up');
        document.getElementById('op_cl').classList.add('fa-chevron-down');
    }
    else {
        document.getElementById('showF').style.display = "none";
        //console.log(document.getElementById('op_cl').className)
        document.getElementById('op_cl').classList.remove('fa-chevron-down');
        document.getElementById('op_cl').classList.add('fa-chevron-up');

    }
}
