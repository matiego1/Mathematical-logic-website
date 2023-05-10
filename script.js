// obsługa "collabsible"

function addCollClickListener(coll, activeClassName) {
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            if (activeClassName) {
                this.classList.toggle(activeClassName);
            }
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}

addCollClickListener(document.getElementsByClassName("collapsible"), "coll-active");
addCollClickListener(document.getElementsByClassName("collapsible-no-underline"), null);

// obsługa sprawdzarki

function getTextArea() {
    return document.getElementById("input");
}

function getResultDiv() {
    return document.getElementById("result");
}

function addButtonClickListener(id, f) {
    document.getElementById(id).addEventListener("click", f);
}

function hideResult() {
    getResultDiv().style.display = "none";
}

function showResult(text) {
    var div = getResultDiv();
    div.innerHTML = text;
    div.style.display = "block";
} 

addButtonClickListener("check", function() {
    //TODO: sprawdź wynik
    showResult("Tutaj się pojawi wynik, jak napiszę program do sprawdzania :)")
});

addButtonClickListener("reset", function() {
    getTextArea().value = "";
    hideResult();
});