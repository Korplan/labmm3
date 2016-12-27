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

//----------JOGO_PALAVRAS----------
var feitas = [];


//----------GERAL----------
var interacao;                  // 0 - Point Wait
                                // 1 - Point Click
                                // 2 - Varrimento
                                // 3 - Voz

var jogo = 0;                   // 0 - Menu
                                // 1 - Jogo Memoria
                                // 2 - Jogo Numeros
                                // 3 - Jogo Palavras
                                // 4 - Jogo Cores

var jogo_memoria = false;
var voiceEnable = false;
var pawEnable = false;
var pacEnable = false;
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
            interacao = 3;
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
        interacao = 0;
        // fps = setInterval("loadPointAndWait()", 250);
        pawEnable = true;
    };

    document.getElementById("point_click").onclick = function () {
        document.getElementById("interacao1").style.display = "none";
        document.getElementById("interacao2").style.display = "block";
        interacao = 1;
        loadPointAndClick();
    };

    document.getElementById("varrimento").onclick = function () {
        document.getElementById("interacao1").style.display = "none";
        document.getElementById("interacao2").style.display = "block";
        interacao = 2;
        loadVarrimento();
    };

    document.getElementById("btn_mem").onclick = function () {
        document.getElementById("interacao2").style.display = "none";
        document.getElementById("jogoMemoria").style.display = "block";
        jogoMemoria();
        if (voiceEnable)
            speechRecognition.start();
        if (pawEnable)
            loadPointAndWait();
    };

    document.getElementById("btn_palavras").onclick = function () {
        document.getElementById("interacao2").style.display = "none";
        document.getElementById("jogoPalavras").style.display = "block";
        loadJogoPalavras();
    };

    document.getElementById("btn_cores").onclick = function () {
        document.getElementById("interacao2").style.display = "none";
        document.getElementById("jogoCores").style.display = "block";
        loadJogoCores();
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
        // selectItem();
            document.getElementById("item" + command[command.length - 1]).click();

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

        //criar x pares de elementos (cartas) com id "item#"
        for (var id2 = 0; id2 < 4; id2++) {
            document.getElementById("line" + id).innerHTML +=
                "<div class='rounded carta valign-wrapper clickable card grey' style='top: " + (125 * (id + id)) + "px; left: " + (250 * (id2 + 1)) + "px; height: 200px; width: 200px;' id='item" + (numCartas + 1) + "'>" +
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
    document.getElementById("item" + id).classList.add("flipped"); //setAttribute("class", document.getElementById("item" + id).getAttribute("class") + " flipped");
    document.getElementById("item" + id).onclick = null;
    document.getElementById("item" + id).onmouseover = null;

    if (jogo_memoria) {
        setTimeout(function () {
            if (!par)
                ultimo = id;
            else if (document.getElementById("item" + ultimo).getElementsByTagName("div")[1].innerHTML != document.getElementById("item" + id).getElementsByTagName("div")[1].innerHTML) {
                document.getElementById("item" + ultimo).classList.remove("flipped"); //setAttribute("class", "rounded carta valign-wrapper clickable card grey");
                document.getElementById("item" + id).classList.remove("flipped"); //setAttribute("class", "rounded carta valign-wrapper clickable card grey");
                document.getElementById("item" + id).setAttribute("onclick", "flip(" + id + ")");
                document.getElementById("item" + ultimo).setAttribute("onclick", "flip(" + ultimo + ")");
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

function loadJogoPalavras() {
    var silabas = ["ba", "na", "mo", "ja", "a", "la", "tar", "pol", "sor", "cur", "ve", "ga", "ção", "tra", "du", "tor"];
    var hipoteses = [];
    var palavras = [];
    palavras[0] = ["ba", "na", "na"];
    palavras[1] = ["la", "ran", "ja"];
    palavras[2] = ["mo", "ran", "go"];
    palavras[3] = ["ce", "nou", "ra"];
    palavras[4] = ["ma", "ra", "cu", "já"];
    palavras[5] = ["pe", "ra"];
    palavras[6] = ["ma", "çã"];
    palavras[7] = ["a", "na", "nás"];
    palavras[8] = ["ce", "re", "ja"];

    var palavra;
    do {
        palavra = Math.floor(Math.random() * palavras.length);
        console.log("ciclo");
    } while (feitas.indexOf(palavra) != -1);

    var retira = Math.floor(Math.random() * palavras[palavra].length);

    document.getElementById("palavraIncompleta").innerHTML = "";

    for (var i = 0; i < palavras[palavra].length; i++) {
        if (retira != i)
            document.getElementById("palavraIncompleta").innerHTML += palavras[palavra][i];
        else
            for (var j = 0; j < palavras[palavra][retira].length; j++)
                document.getElementById("palavraIncompleta").innerHTML += "_";
    }


    document.getElementById("letras").innerHTML = "";
    for (var k = 0; k < 3; k++) {
        var random = silabas[Math.floor(Math.random() * silabas.length)];
        if (random != palavras[palavra][retira])
            hipoteses[k] = "<div class='rounded col m3'>" + random + "</div>";
        console.log(random);
        console.log(palavras[palavra][retira]);
    }
    hipoteses[k] = "<div id='certo' class='rounded col m3'>" + palavras[palavra][retira] + "</div>";
    hipoteses.sort(function () {
        return 0.5 - Math.random()
    });
    document.getElementById("letras").innerHTML = hipoteses.join("");
    document.getElementById("certo").onclick = function () {
        feitas.push(palavra);
        console.log(feitas.length + " / " + palavras.length);
        if (palavras.length == feitas.length) {
            alert("não ha mais");
            document.getElementById("certo").onclick = null;
        } else
            loadJogoPalavras();
    }
}

function loadJogoCores() {
    var final;
    document.getElementById("cor1").onclick = function () {
        final = document.getElementById("corFinal");
        console.log(rgbToHex(final.style.backgroundColor));
        switch (rgbToHex(final.style.backgroundColor)) {
            case '#ffffff':
                final.style.backgroundColor = "#c2185b";
                break;
            case '#00b0ff':
                final.style.backgroundColor = "#7b1fa2";
                break;
            case '#f4b400':
                final.style.backgroundColor = "#d84315";
                break;
            default:
                console.log("nada");
                break;
        }
    };
    document.getElementById("cor2").onclick = function () {
        final = document.getElementById("corFinal");
        console.log(rgbToHex(final.style.backgroundColor));
        switch (rgbToHex(final.style.backgroundColor)) {
            case '#ffffff':
                final.style.backgroundColor = "#00b0ff";
                break;
            case '#c2185b':
                final.style.backgroundColor = "#7b1fa2";
                break;
            case '#f4b400':
                final.style.backgroundColor = "#43a047";
                break;
            default:
                console.log("nada");
                break;
        }
    };
    document.getElementById("cor3").onclick = function () {
        final = document.getElementById("corFinal");
        console.log(final.style.backgroundColor);
        switch (rgbToHex(final.style.backgroundColor)) {
            case '#ffffff':
                final.style.backgroundColor = "#f4b400";
                break;
            case '#00b0ff':
                final.style.backgroundColor = "#43a047";
                break;
            case '#c2185b':
                final.style.backgroundColor = "#d84315";
                break;
            default:
                console.log("nada");
                break;
        }
    };
    document.getElementById("apagar").onclick = function () {
        document.getElementById("corFinal").style.backgroundColor = "#ffffff";
    }
}

function rgbToHex(col)
{
    if(col.charAt(0)=='r')
    {
        col=col.replace('rgb(','').replace(')','').split(',');
        var r=parseInt(col[0], 10).toString(16);
        var g=parseInt(col[1], 10).toString(16);
        var b=parseInt(col[2], 10).toString(16);
        r=r.length==1?'0'+r:r; g=g.length==1?'0'+g:g; b=b.length==1?'0'+b:b;
        var colHex='#'+r+g+b;
        return colHex;
    }
}