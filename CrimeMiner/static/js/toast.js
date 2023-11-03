function viewToastMessage(title, content, tipology){
    document.querySelector(".toast-header-content").innerHTML = title;
    document.querySelector(".toast-body").innerHTML = content;

    if(tipology == "success"){
        document.querySelector(".toast-header").style.backgroundColor = "#45A95D";
        document.querySelector(".toast-header-content").style.color = "#115D33";
        document.querySelector(".toast-body").style.backgroundColor = "#8dd06C66";
        document.querySelector(".toast-body").style.color = "#115D33";
    }

    if(tipology == "alert"){
        document.querySelector(".toast-header").style.backgroundColor = "#DBAB09";
        document.querySelector(".toast-header-content").style.color = "#e8e337";
        document.querySelector(".toast-body").style.backgroundColor = "#FDE74C66";
        document.querySelector(".toast-body").style.color = "#f3a006";
    }

    if(tipology == "error"){
        document.querySelector(".toast-header").style.backgroundColor = "#ba0001";
        document.querySelector(".toast-header-content").style.color = "#f87c7c";
        document.querySelector(".toast-body").style.backgroundColor = "#f46d7566";
        document.querySelector(".toast-body").style.color = "#f83e3e";
    }

    new bootstrap.Toast(document.querySelector('.toast')).show();
}