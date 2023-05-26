// kopiowanie klas "example"

function copyElement(element) {
    navigator.clipboard.writeText(element.value);

    element.getElementById("copy-info").innerHTML = "Skopiowano: " + copyText.value;
  }
  
  function outFunc(element) {
    element.innerHTML = "Copy to clipboard";
  }

// obsługa linków

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// obsługa klas "collabsible"

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

// obsługa sprawdzarki

function addButtonClickListener(id, f) {
    document.getElementById(id).addEventListener("click", f);
}

addButtonClickListener("check", function() {
    var e = getTextArea().value.replaceAll(new RegExp("\\s","g"), "").replaceAll("<=>", "⇔").replaceAll("=>", "⇒").replaceAll("^", "∧").replaceAll("+", "⊕");

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

function showResult(text) {
    var div = getResultDiv();
    div.innerHTML = "<h4>Wynik:</h4><span class='example'>" + text + "</span><br><span class='note'>Jeśli uważasz, że ten wynik nie jest prawidłowy, proszę o <a href='mailto:matifilip@staszic.waw.pl'>wysłanie</a> zrzutu ekranu. Z góry dziękuję :)</span>";
    div.style.display = "block";
    div.scrollIntoView({behavior: "smooth"});
} 

function hideResult() {
    getResultDiv().style.display = "none";
}

function getResultDiv() {
    return document.getElementById("result");
}

function getTextArea() {
    return document.getElementById("input");
}

// sprawdzanie, czy wyrażenie jest tautologią

function checkIfExpressionIsTautology(e) {
    try {
        return substituteZerosAndOnes(e, "pqrs");
    } catch (err) {
        return "" + err;
    }
}

function substituteZerosAndOnes(e, chars) {
    if (chars.length == 0) {
        return parseExpression(e);
    }
    if (e.indexOf(chars[0]) == -1) {
        return substituteZerosAndOnes(e, chars.substring(1));
    }
    return substituteZerosAndOnes(e.replaceAll(chars[0], "0"), chars.substring(1)) && substituteZerosAndOnes(e.replaceAll(chars[0], "1"), chars.substring(1));
}

function parseExpression(e) {
    while (e.length > 1) {
        var poprzedni = e;

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
            if (!/(0|1)(∧|v|⊕|⇒|⇔)(0|1)/.test(akt)) continue;

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
            } else if (akt == "0∧0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "0∧1") {
                e = e.replaceAt(i, "0");
            } else if (akt == "1∧0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "1∧1") {
                e = e.replaceAt(i, "1");
            //xor
            } else if (akt == "0⊕0") {
                e = e.replaceAt(i, "0");
            } else if (akt == "0⊕1") {
                e = e.replaceAt(i, "1");
            } else if (akt == "1⊕0") {
                e = e.replaceAt(i, "1");
            } else if (akt == "1⊕1") {
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

function replaceBasics(e) {
    var pop = e + "x";

    while (pop != e) {
        pop = e;
        e = e.replace("(0)", "0");
        e = e.replace("(1)", "1");
        e = e.replace("~0", "1");
        e = e.replace("~1", "0");
    }

    return e;
}