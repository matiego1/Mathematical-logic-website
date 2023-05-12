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

    var result = checkIfExpressionIsTautology(e)

    if (result === true) {
        showResult("Twoje wyrażenie jest tautologią :)");
    } else if (result === false) {
        showResult("Twoje wyrażenie nie jest tautologią :(");
    } else {
        showResult("Ups! W twoim zdaniu logicznym jest błąd. (Błąd #" + result + ")");
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
    try {
        //TODO podstaw wartości pod zmienne
        return parseExpression(e);
    } catch (err) {
        return "" + err;
    }
}

function parseExpression(e) {
    e = e.replaceAll("<=>", "⇔").replaceAll("=>", "⇒").replaceAll(" ", "");

    while (e.length > 1) {
        poprzedni = e;

        e = replaceComplex(e);

        if (poprzedni == e) {
            throw 2;
        }
    }

    if (e === "0") {
        return false;
    }
    if (e === "1") {
        return true;
    }
    throw 3;
}

function replaceBasics(s) {
    var pop = s + "x";
    while (pop != s) {
        pop = s;
        s = s.replace("(0)", "(1)");
        s = s.replace("(1)", "(0)");
        s = s.replace("~0", "1");
        s = s.replace("~1", "0");
    }

    return s;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function replaceComplex(e) {
    var pop = e + "x";
    
    while (pop != e) {
        pop = e;
    
        e = replaceBasics(e);

        for (var i = 1; i < e.length - 1; i++) {
            var akt = e[i - 1] + e[i] + e[i + 1];
            if (!/(0|1)(\^|v|\+|⇒|⇔)(0|1)/.test(akt)) continue;

            e = e.replaceAt(i - 1, " ").replaceAt(i + 1, " ");

            //alternatywa
            if (akt == "0v0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "0v1") {
                e = e.replaceAt(i, "1");
            } else if (akt == "1v0") {
                e = e.replaceAt(i, "1");
            } else if (akt == "1v1") {
                e = e.replaceAt(i, "1");
            //koniunkcja
            } else if (akt == "0^0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "0^1") {
                e = e.replaceAt(i, "0");
            } else if (akt == "1^0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "1^1") {
                e = e.replaceAt(i, "1");
            //xor
            } else if (akt == "0+0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "0+1") {
                e = e.replaceAt(i, "1");
            } else if (akt == "1+0") {
                e = e.replaceAt(i, "1");
            } else if (akt == "1+1") {
                e = e.replaceAt(i, "0");
            //implikacja
            } else if (akt == "0⇒0") {
                e = e.replaceAt(i, "1");
            } else if (akt == "0⇒1") {
                e = e.replaceAt(i, "1");
            } else if (akt == "1⇒0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "1⇒1") {
                e = e.replaceAt(i, "1");
            //rownowaznosc
            } else if (akt == "0⇔0") {
                e = e.replaceAt(i, "1");
            } else if (akt == "0⇔1") {
                e = e.replaceAt(i, "0");
            } else if (akt == "1⇔0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "1⇔1") {
                e = e.replaceAt(i, "1");
            } else {
                throw 1;
            }
            break;
        }

        e = e.replaceAll(" ", "");
    }

    return e;
}