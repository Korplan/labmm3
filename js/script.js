var debug = true;

//----------VOICE2TEXT----------
var speechRecognition;
var stop = false;

//----------TEXT2VOICE----------
var voices = [];
var volume = 1;
var speed = 1;
var pitch = 1;

//----------POINT_WAIT----------
var selecting;
var sprite = 0;
var fps;
var anim = false;
var elem = "";

//----------JOGO_MEMORIA----------
var memoCartas = [1, 1, 2, 2, 3, 3, 4, 4]; //array com pares de cartas
var par = false;
var ultimo = "";


//----------GERAL----------
var jogo_memoria = false;
var voiceEnable = false;
var atual = [];
var over = false;

window.onload = function () {
    var temp = "";
    // verifica se o browser suporta v2t
    if (!('webkitSpeechRecognition' in window)) {
        print("O browser não é compatível com reconhecimento de voz");
        temp = document.getElementById("voz").getAttribute("class") + " inativo";
        document.getElementById("voz").setAttribute("class", temp);
    } else
        document.getElementById("voz").onclick = function () {
            document.getElementById("interacao1").style.display = "none";
            document.getElementById("interacao2").style.display = "block";
            voiceEnable = true;
            loadVoiceRec();
        };
    // verifica se o browser suporta t2v
    // if (!('speechSynthesis' in window)) {
    //     print("O browser não suporta síntese de voz");
    //     temp = document.getElementById("leitor").getAttribute("class") + " inativo";
    //     document.getElementById("leitor").setAttribute("class", temp);
    // } else
    //     document.getElementById("leitor").onclick = function () {
    //         loadContentReader();
    //     };

    document.getElementById("point_wait").onclick = function () {
        document.getElementById("interacao1").style.display = "none";
        document.getElementById("interacao2").style.display = "block";
        loadPointAndWait();
        fps = setInterval("loadPointAndWait()", 10);
    };

    document.getElementById("point_click").onclick = function () {
        document.getElementById("interacao1").style.display = "none";
        document.getElementById("interacao2").style.display = "block";
        loadPointAndClick();
    };

    document.getElementById("varrimento").onclick = function () {
        document.getElementById("interacao1").style.display = "none";
        document.getElementById("interacao2").style.display = "block";
        loadVarrimento();
    };

    document.getElementById("btn_mem").onclick = function () {
        document.getElementById("interacao2").style.display = "none";
        document.getElementById("jogoMemoria").style.display = "block";
        jogoMemoria();
        if (voiceEnable)
            speechRecognition.start();
    }

};

function loadPointAndWait() {
    var elements = document.getElementsByClassName("clickable");

    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = function () {
            if (!over) {
                elem = this;
                atual[i] = this.innerHTML;
                over = true;
                this.innerHTML = "<div class='center-block'><img id='selecionada' src='img/PaW/0.png' style='height: 100px; width: 100px'></div>";
                if (!anim) {
                    sprite = 0;
                    selecting = setInterval("select(elem)", 500);
                    anim = true;
                }
            }
        };
        elements[i].onmouseout = function () {
            if (over) {
                over = false;
                this.innerHTML = atual[i];
                if (anim) {
                    clearInterval(selecting);
                    anim = false;
                }
            }
        }
    }
}


function select(elem) {
    sprite++;
    document.getElementById("selecionada").src = "img/PaW/" + sprite + ".png";
    if (sprite == 8) {
        print(elem);
        clearInterval(selecting);
        anim = false;
        elem.click();
    }
}


function loadPointAndClick() {

}

function loadVarrimento() {

}

function loadVoiceRec() {
    speechRecognition = new webkitSpeechRecognition();
    // var colors = [ '1' , '2' , '3', '4', '5', '6', '7', '8'];
    // var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';
    // var grammarList = new webkitSpeechGrammarList();
    // grammarList.addFromString(grammar, 1);
    // console.log(grammarList);
    //
    // speechRecognition.grammars = grammar;
    speechRecognition.lang = 'pt-PT';                       // default: html lang
    speechRecognition.continuous = false;                   // default: false
    speechRecognition.interimResults = false;               // resultados intermédios, com .final = false (default: false)
    speechRecognition.maxAlternatives = 1;                  // resultados máximos (default: 1)

    speechRecognition.onresult = function (event) {
        // propriedade "results" de SpeechRecognitionEvent faz return de um objeto SpeechRecognitionResultList
        // SpeechRecognitionResultList tem vários objetos SpeechRecognitionResult
        // Tem um "getter" que permite ser acedido como um array
        // [last] faz return do SpeechRecognitionResult na última posição
        // Cada SpeechRecognitionResult contém objetos SpeechRecognitionAlternative que contêm resultados individuais
        // Também tem "getters" para que possam ser acedidos como um array
        // [0] faz return do SpeechRecognitionAlternative na posição 0
        // Por fim fazemos return da propriedade "transcript" do objeto SpeechRecognitionAlternative

        print("result");
        var last = event.results.length - 1;
        var command = event.results[last][0].transcript;
        print("result: " + command);
        print("certeza: " + event.results[0][0].confidence);
        if ((command == "cancela" || command == "cancelar") && debug)
            stop = true;
        else
            selectItem(command[command.length - 1]);

    };
    speechRecognition.onspeechend = function () {
        speechRecognition.stop();
        print("ended")
    };
    speechRecognition.onerror = function (event) {
        print("ERROR: " + event.error);
    };
    speechRecognition.onnomatch = function (event) {
        print("Palavra inválida");
        print(event);
    };
    speechRecognition.onstart = function () {
        print("started");
    };
    speechRecognition.onend = function () {
        if (!stop)
            speechRecognition.start();
    };

    print("v2t ready");
}

// function loadContentReader() {
//     loadVoices();
//     // Chrome carrega as vozes assincronamente
//     window.speechSynthesis.onvoiceschanged = function (e) {
//         loadVoices();
//     };
//     document.getElementById("voice").removeAttribute("hidden");
//     document.getElementById("output").removeAttribute("readonly");
//     document.getElementById("t2v").removeAttribute("disabled");
//
//     document.getElementById("t2v").onclick = function () {
//         speak(document.getElementById("output").value);
//     };
//     print("t2v ready");
// }
//
// function loadVoices() {
//
//     voices = speechSynthesis.getVoices();
//
//     // para cada uma das vozes
//     for (var i = 0; i < voices.length; i++) {
//         // cria um novo elemento "option"
//         var option = document.createElement('option');
//
//         // define o "value" e o "innerHTML"
//         option.value = voices[i].name;
//         option.innerHTML = voices[i].name;
//         option.lang = voices[i].lang;
//
//         // adiciona à lista de vozes disponíveis
//         document.getElementById('voice').appendChild(option);
//     }
//
// }
//
// function speak(text) {
//     var msg = new SpeechSynthesisUtterance();
//     msg.text = text;
//
//     msg.volume = volume;
//     msg.rate = speed;
//     msg.pitch = pitch;
//
//     var selOption = document.getElementById("voice").options[document.getElementById("voice").selectedIndex].value;
//     for (var i = 0; i < voices.length; i++) {
//         if (voices[i].name === selOption) {
//             msg.voice = voices[i];
//         }
//     }
//     speechSynthesis.speak(msg);
// }

function jogoMemoria() {
    jogo_memoria = true;
    //define posições aleatorias para os elementos do array
    memoCartas.sort(function (a, b) {
        return 0.5 - Math.random()
    });
    var numCartas = 0; //nenhuma carta colocada

    //criar linhas com id "linha1" até 2
    for (var id = 0; id < 2; id++) {
        document.getElementById("memoTab").innerHTML +=
            "<div class='flip' id='line" + id + "'><div/>";

        //criar x pares de elementos (cartas) com id "memoCarta#"
        for (var id2 = 0; id2 < 4; id2++) {
            document.getElementById("line" + id).innerHTML +=
                "<div class='rounded carta valign-wrapper clickable card grey' style='top: " + (125 * (id + 1 + id)) + "px; left: " + (250 * (id2 + 1)) + "px; height: 200px; width: 200px;' id='item" + (numCartas + 1) + "'>" +
                "<div class='center-block face front'>" + (numCartas + 1) + "</div>" +
                "<div class='face back'>" + memoCartas[numCartas] + "</div>" +
                "</div>";
            numCartas++;
        }
    }

    for (var j = 1; j < 9; j++) {
        document.getElementById("item" + j).setAttribute("onclick", "flip(" + j + ")");
    }
}

function flip(id) {

    console.log(id);
    document.getElementById("item" + id).setAttribute("class", document.getElementById("item" + id).getAttribute("class") + " flipped");
}

function selectItem(itemId) {
    if (jogo_memoria) {
        document.getElementById("item" + itemId).click();
        setTimeout(function () {
            if (!par)
                ultimo = itemId;
            else if (document.getElementById("item" + ultimo).getElementsByTagName("div")[1].innerHTML != document.getElementById("item" + itemId).getElementsByTagName("div")[1].innerHTML) {
                document.getElementById("item" + ultimo).setAttribute("class", "rounded carta valign-wrapper clickable card grey");
                document.getElementById("item" + itemId).setAttribute("class", "rounded carta valign-wrapper clickable card grey");
                ultimo = "";
            }
            par = !par;
        }, 1000);
        console.log(ultimo);
    }
}

function print(s) {
    if (debug)
        console.log(s);
}