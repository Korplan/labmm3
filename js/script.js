//----------VOICE2TEXT----------
var voices = [];

//----------TEXT2VOICE----------
var volume = 1;
var speed = 1;
var pitch = 1;


//----------JOGO_MEMORIA----------
var memoCartas = [1, 1, 2, 2, 3, 3, 4, 4]; //array com pares de cartas

//----------GERAL----------


window.onload = function () {
    var temp = "";
    // verifica se o browser suporta v2t
    if (!('webkitSpeechRecognition' in window)) {
        console.log("O browser não é compatível com reconhecimento de voz");
        temp = document.getElementById("voz").getAttribute("class") + " inativo";
        document.getElementById("voz").setAttribute("class", temp);
    } else
        document.getElementById("voz").onclick = function () {
            document.getElementById("interacao1").style.display = "none";
            document.getElementById("interacao2").style.display = "block";
            loadVoiceRec();
        };
    // verifica se o browser suporta t2v
    // if (!('speechSynthesis' in window)) {
    //     console.log("O browser não suporta síntese de voz");
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
    }

};

function loadPointAndWait() {

}

function loadPointAndClick() {

}

function loadVarrimento() {

}

function loadVoiceRec() {
    var speechRecognition = new webkitSpeechRecognition();
    // var keyWords = "cima | baixo | direita | esquerda";
    // var grammar = new webkitSpeechGrammarList();
    // grammar.addFromString(keyWords, 1);

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

        console.log("result");
        var last = event.results.length - 1;
        var command = event.results[last][0].transcript;
        print(command);
        console.log("certeza: " + event.results[0][0].confidence);

    };
    speechRecognition.onspeechend = function () {
        speechRecognition.stop();
        console.log("ended")
    };
    speechRecognition.onerror = function (event) {
        console.log("ERROR: " + event.error);
    };
    speechRecognition.onnomatch = function (event) {
        console.log("Palavra inválida");
        console.log(event);
    };
    speechRecognition.onstart = function () {
        console.log("started");
        clear();
        document.getElementById("v2t").onclick = function () {
            speechRecognition.stop();
            console.log("stopped");
        }
    };
    speechRecognition.onend = function () {
        document.getElementById("v2t").onclick = function () {
            speechRecognition.start();
        }
    };

    document.getElementById("v2t").removeAttribute("disabled");
    document.getElementById("v2t").onclick = function () {
        speechRecognition.start();
    };
    console.log("v2t ready");
}

function loadContentReader() {
    loadVoices();
    // Chrome carrega as vozes assincronamente
    window.speechSynthesis.onvoiceschanged = function (e) {
        loadVoices();
    };
    document.getElementById("voice").removeAttribute("hidden");
    document.getElementById("output").removeAttribute("readonly");
    document.getElementById("t2v").removeAttribute("disabled");

    document.getElementById("t2v").onclick = function () {
        speak(document.getElementById("output").value);
    };
    console.log("t2v ready");
}

function loadVoices() {

    voices = speechSynthesis.getVoices();

    // para cada uma das vozes
    for (var i = 0; i < voices.length; i++) {
        // cria um novo elemento "option"
        var option = document.createElement('option');

        // define o "value" e o "innerHTML"
        option.value = voices[i].name;
        option.innerHTML = voices[i].name;
        option.lang = voices[i].lang;

        // adiciona à lista de vozes disponíveis
        document.getElementById('voice').appendChild(option);
    }

}

function speak(text) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;

    msg.volume = volume;
    msg.rate = speed;
    msg.pitch = pitch;

    var selOption = document.getElementById("voice").options[document.getElementById("voice").selectedIndex].value;
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].name === selOption) {
            msg.voice = voices[i];
        }
    }
    speechSynthesis.speak(msg);
}

function jogoMemoria() {

    //define posições aleatorias para os elementos do array
    memoCartas.sort(function (a, b) {
        return 0.5 - Math.random()
    });
    var numCartas = 0; //nenhuma carta colocada

    //criar linhas com id "linha1" até 2
    for (var id = 1; id < 3; id++) {
        document.getElementById("memoTab").innerHTML +=
            "<div class='row flip' id='linha" + id + "'><div/>";

        //criar x pares de elementos (cartas) com id "memoCarta#"
        for (var id2 = 0; id2 < 4; id2++) {
            document.getElementById("linha" + id).innerHTML +=
                "<div class='col s2 offset-s1 rounded carta valign-wrapper white clickable card' id='memoCarta" + memoCartas[numCartas] + "'>" +
                "<div class='center-block face front'><i class='material-icons large'>schedule</i></div>" +
                "<div class='face back'>numCartas</div>" +
                "</div>";
            numCartas++;
        }
    }
}