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
    div.innerHTML = "<h4>Wynik:</h4><span class=\"example\">" + text + "</span>";
    div.style.display = "block";
} 

addButtonClickListener("check", function() {
    var e = getTextArea().value;
    if (!isExpressionCorrect(e)) {
        showResult("Ups! W twoim zdaniu logicznym jest błąd.");
        return;
    }

    if (checkIfExpressionIsTautology(e)) {
        showResult("Twoje wyrażenie jest tautologią :) znaczy narazie każde wyrażenie jest tautologią, bo nie napisałem sprawdzarki :)");
    } else {
        showResult("Twoje wyrażenie nie jest tautologią :(");
    }
});

addButtonClickListener("reset", function() {
    getTextArea().value = "";
    hideResult();
});

function isExpressionCorrect(e) {
    return true; //TODO
}

function checkIfExpressionIsTautology(e) {
    return true; //TODO
}