//----------VARIÁVEIS GLOBAIS----------//
var debug = true;                               //(mostrar ou não) Prints na consola

//----------VOICE2TEXT----------
var speechRecognition;
var stop = false;

//----------TEXT2VOICE----------
var voices = [];
var volume = 1;
var speed = 1;
var pitch = 1;

//----------POINTandWAIT----------
var selecting;  //
var sprite = 0;
var anim = false;
var elem = "";

//----------JOGO MEMORIA----------
var memoCartas = [1, 1, 2, 2, 3, 3, 4, 4];      //Array pares de cartas
var par = false;                                //Quando selecionas uma carta passa a true para usar como comparação
var ultimo = "";

//----------JOGO PALAVRAS----------
var feitas = [];        //Array que armazena os index do array "palavras" que já sairam


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

var jogo_memoria = false;       //Esconde jogo memória
var voiceEnable = false;        //Interação por voz - falso
var pawEnable = false;          //Interação por Point and Wait - falso
var pacEnable = false;          //Interação por Point and Click - falso
var atual = [];                 //Interação por Point and Wait
var over = false;               //Interação por Point and Wait


//----------DEBUG----------//
function print(s) {
    if (debug)                  //Se debug==true
        console.log(s);         //Faz print na consola dos parâmetros recebidos
}


//----------NO CARREGAMENTO----------//
window.onload = function () {
    var temp = "";                                                                      //Elimina classes acrescentadas ao elemento "voz"

    if (!('webkitSpeechRecognition' in window)) {                                       //Verifica se o browser suporta v2t (voz para texto)
        print("O browser não é compatível com reconhecimento de voz");                  //Escreve na consola (ver função "print")
        temp = document.getElementById("voz").getAttribute("class") + " inativo";       //Desativa a interação por voz na página de seleção de interação
        document.getElementById("voz").setAttribute("class", temp);                     //Acrescenta a class "inativo" ao elemento "voz"
    } else
        document.getElementById("voz").onclick = function () {                          //Ao clicar no elemento "voz"
            document.getElementById("interacao1").style.display = "none";               //Esconde a div "interacao1" (div de seleção de interação)
            document.getElementById("interacao2").style.display = "block";              //Mostra a div "interacao2" (div de seleção de Jogos)
            interacao = 3;                                                              //3 = Interação por voz (ver vars globais)
            voiceEnable = true;                                                         //Permite captar voz
            loadVoiceRec();                                                             //Executa função de reconhecimento de voz
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

    document.getElementById("point_wait").onclick = function () {                       //Ao clicar no elemento "point_wait"
        document.getElementById("interacao1").style.display = "none";                   //Esconde a div "interacao1" (div de seleção de interação)
        document.getElementById("interacao2").style.display = "block";                  //Mostra a div "interacao2" (div de seleção de Jogos)
        loadPointAndWait();
        interacao = 0;                                                                  //0 = Interação por Point and Wait (ver vars globais)
        pawEnable = true;
    };

    document.getElementById("point_click").onclick = function () {                      //Ao clicar no elemento "point_click"
        document.getElementById("interacao1").style.display = "none";                   //Esconde a div "interacao1" (div de seleção de interação)
        document.getElementById("interacao2").style.display = "block";                  //Mostra a div "interacao2" (div de seleção de Jogos)
        interacao = 1;                                                                  //1 = Interação por Point and Click (ver vars globais)
        loadPointAndClick();
    };

    document.getElementById("varrimento").onclick = function () {                       //Ao clicar no elemento "varrimento"
        document.getElementById("interacao1").style.display = "none";                   //Esconde a div "interacao1" (div de seleção de interação)
        document.getElementById("interacao2").style.display = "block";                  //Mostra a div "interacao2" (div de seleção de Jogos)
        interacao = 2;                                                                  //2 = Interação por varrimento (ver vars globais)
        loadVarrimento();
    };

    document.getElementById("btn_mem").onclick = function () {                          //Ao clicar no elemento "btn_mem"
        document.getElementById("interacao2").style.display = "none";                   //Esconde a div "interacao2" (div de seleção de Jogos)
        document.getElementById("jogoMemoria").style.display = "block";                 //Mostra a div "jogoMemoria"
        jogoMemoria();
        if (voiceEnable)
            speechRecognition.start();
        if (pawEnable)
            loadPointAndWait();
    };

    document.getElementById("btn_palavras").onclick = function () {                     //Ao clicar no elemento "btn_palavras"
        document.getElementById("interacao2").style.display = "none";                   //Esconde a div "interacao2" (div de seleção de Jogos)
        document.getElementById("jogoPalavras").style.display = "block";                //Mostra a div "jogoPalavras"
        loadJogoPalavras();
    };

    document.getElementById("btn_cores").onclick = function () {                        //Ao clicar no elemento "btn_cores"
        document.getElementById("interacao2").style.display = "none";                   //Esconde a div "interacao2" (div de seleção de Jogos)
        document.getElementById("jogoCores").style.display = "block";                   //Mostra a div "jogoCores"
        loadJogoCores();
    }
};


//----------POINTandWAIT----------//
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


//----------VARRIMENTO----------//
function loadVarrimento() {

}

//----------VOZ----------//
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


//----------JOGO MEMÓRIA----------//
function jogoMemoria() {
    jogo_memoria = true;
    //define posições aleatorias para os elementos do array
    memoCartas.sort(function () {
        return 0.5 - Math.random()
    });
    var numCartas = 0;                                                  //Numeros de cartas colocadas no tabuleiro

    for (var id = 0; id < 2; id++) {                                    //Criar linhas com id "line#" até 2 (para ecrã M)
        document.getElementById("memoTab").innerHTML +=
            "</div><div class='flip' id='line" + id + "'></div>";

        for (var id2 = 0; id2 < 4; id2++) {                             //Criar elementos (cartas) com id "item#" por linha até 3 (para ecrã M)
            document.getElementById("line" + id).innerHTML +=
                "<div class='col s6 m4 l3'><div class='rounded carta valign-wrapper clickable card grey' style='height: 200px; width: 200px;' id='item" + (numCartas + 1) + "'>" +
                "<div class='center-block face front'>" + (numCartas + 1) + "</div>" +
                "<div class='face back'>" + memoCartas[numCartas] + "</div>" +
                "</div></div>";
            numCartas++;                                                //Soma 1 carta às cartas colocadas
        }
    }

    for (var j = 1; j < 9; j++) {
        document.getElementById("item" + j).setAttribute("onclick", "flip(" + j + ")"); //Cada carta é atribuido um evento onclick com a função "flip(#);"
    }
}

function flip(id) {                                                 //Função "flip()" que recebe como parâmetro o # da carta
    print(id);                                                      //Escreve na consola o # da carta
    document.getElementById("item" + id).classList.add("flipped");  //Procura o item com o # recebido e adiciona-lhe a classe "flipped"
    document.getElementById("item" + id).onclick = null;            //Desativa o clique na carta
    document.getElementById("item" + id).onmouseover = null;        //Desativa o onmouseover da carta

    if (jogo_memoria) {             //Se jogo_memoria=true
        setTimeout(function () {    //Ocorre 1 vez passado 1segundo
            if (!par)               //Se for virada a primeira carta ainda não há um par
                ultimo = id;        //logo ultimo (var que guarda  aultima carta virada) = ao # da carta recebido

            //Senão, se par==true, ou seja, foram viradas duas cartas, verifica-se se uma é igual à outra. Então, o conteúdo (innerHTML) da div 1 (elemento de índice 1 do array "getElementsByTagName("div")") do elemento "itemultimo" (última carta virada) é igual ao conteudo (innerHTML) da div 1 (elemento de índice 1 do array "getElementsByTagName("div")") do elemento "itemid" (primeira carta virada)
            else if (document.getElementById("item" + ultimo).getElementsByTagName("div")[1].innerHTML != document.getElementById("item" + id).getElementsByTagName("div")[1].innerHTML) {
                document.getElementById("item" + ultimo).classList.remove("flipped");                       //Verifica a lista de classes do elemento "item ultimo" e remove a classe "flipped"
                document.getElementById("item" + id).classList.remove("flipped");                           //Verifica a lista de classes do elemento "item id" e remove a classe "flipped"
                document.getElementById("item" + ultimo).setAttribute("onclick", "flip(" + ultimo + ")");   //Adiciona a função (anteriormente retirada) "flip(ultimo)"
                document.getElementById("item" + id).setAttribute("onclick", "flip(" + id + ")");           //Adiciona a função (anteriormente retirada) "flip(id)"
                ultimo = "";
            }
            par = !par; //se par==true passa a par=false e se par==false passa a par=true
        }, 1000);
        print(ultimo);
    }
}

//----------JOGO PALAVRAS----------//
function loadJogoPalavras() {
    var silabas = ["ba", "na", "mo", "ja", "a", "la", "tar", "pol", "sor", "cur", "ve", "ga", "ção", "tra", "du", "tor"];   //Array com sílabas "erradas"
    var hipoteses = [];
    var palavras = [];                          //Array com palavras do jogo
    palavras[0] = ["ba", "na", "na"];           //0 = Banana
    palavras[1] = ["la", "ran", "ja"];          //1 = Laranja
    palavras[2] = ["mo", "ran", "go"];          //2 = Morango
    palavras[3] = ["ce", "nou", "ra"];          //3 = Cenoura
    palavras[4] = ["ma", "ra", "cu", "já"];     //4 = Maracujá
    palavras[5] = ["pe", "ra"];                 //5 = Pera
    palavras[6] = ["ma", "çã"];                 //6 = Maçã
    palavras[7] = ["a", "na", "nás"];           //7 = Ananás
    palavras[8] = ["ce", "re", "ja"];           //8 = Cereja

    document.getElementById("palavraIncompleta").innerHTML = "";        //O innerHTML do elemento palavraIncompleta está vazio
    var palavra;                                                        //guarda palavra sorteada (=palavra para completar no jogo)

    do {
        palavra = Math.floor(Math.random() * palavras.length);          //Palavra = sorteio de index entre 0 e 8 (=palavras.lenght)
        print("ciclo");
    } while (feitas.indexOf(palavra)!= -1);                             //Enquanto forem sorteadas palavras que já tenham saído é sorteada nova palavra (se o elemento de index # existir no array feitas repete ciclo)

    document.getElementById("palavraIncompleta").innerHTML = "<img src='img/frutas/" + palavras[palavra].join("") + ".png'/>";

    var retira = Math.floor(Math.random() * palavras[palavra].length);  //Retira (retira sílaba de palavra) = Sorteio entre 0 e palavra.lenght do elemento sorteado acima

    for (var i = 0; i < palavras[palavra].length; i++) {                //Enquanto i for menor que o número de sílabas/indexs da(o) palavra/array "palavras[#]"
        if (retira != i)                                                //Se sílaba sorteada for diferente de i
            document.getElementById("palavraIncompleta").innerHTML += "<div class='silaba'>" + palavras[palavra][i] + "</div>"; //Escreve a sílaba para formar a palavra
        else{                                                                                //Senão
            document.getElementById("palavraIncompleta").innerHTML +="<div id='silaba-falta'></div>";
            for (var j = 0; j < palavras[palavra][retira].length; j++)                      //Escreve um "_" por cada letra da sílaba retirada
                document.getElementById("silaba-falta").innerHTML += "__ ";
        }
    }


    for (var k = 0; k < 3; k++) {                                               //Nº de opções = 3 no máximo
        var random = silabas[Math.floor(Math.random() * silabas.length)];       //Random = ao index sorteado do array "silabas" entre 0 e nº de index máximo
        if (random != palavras[palavra][retira]){                               //Se a sílaba sorteada for diferente da sílaba retirada (que constitui a palavra a completar)
            hipoteses[k] = "<div class='col m2 offset-m1 center'><div class='silaba-opcao clickable'>" + random + "</div></div>";  //É colocada num array "hipoteses" de index igual a K (=3)
        }
        else {
            k--;                                                                //É decrementado um k para poder repetir o ciclo com o mesmo valor de k
        }
        print(random);
        print(palavras[palavra][retira]);
    }
    hipoteses[k] = "<div class='col m2 offset-m1 center'><div id='certo' class='silaba-opcao clickable'>" + palavras[palavra][retira] + "</div></div>";    //Último index do array "hipoteses" é a sílaba certa para completar a palavra
    hipoteses.sort(function () {                                                                        //Dispõe em index aleatorios as sílabas do array (para que as opções )
        return 0.5 - Math.random()
    });

    document.getElementById("opcoes").innerHTML = hipoteses.join("");           //O innerHTML do elemento "opcoes" contém o array hipoteses com elemntos separados por espaço
    document.getElementById("certo").onclick = function () {                    //Ao clocar no elemento "certo" (sílaba certa)
        feitas.push(palavra);                                                   //Insere no fim do array "feitas" o index da palavra
        print(feitas.length + " / " + palavras.length);
        if (palavras.length == feitas.length) {                                 //Se tiverem saído/ sido completadas todas as palavras
            alert("não ha mais");
            document.getElementById("certo").onclick = null;                    //Bloqueia o clique no elemento "certo"
        } else                                                                  //Senão
            loadJogoPalavras();                                                 //Repete o jogo
    };
}

//----------JOGO CORES----------//
function loadJogoCores() {
    var final;

    document.getElementById("cor1").onclick = function () {     //Ao clicar no elemtno "cor1" (=mangenta)
        final = document.getElementById("corFinal");            //Var que guarda o elemento "cor final"
        document.getElementById("corFinal").style.cursor = "url('img/icons/brush.png'), pointer";   //O estilo do cursor quando está sobre a corFinal muda para a imagem de um pincel
        print(rgbToHex(final.style.backgroundColor));

        //Note que: As verificações são feitas em rgb mas as cores usadas estão em hex(ver função rgbToHex).
        switch (rgbToHex(final.style.backgroundColor)) {        //Verifica a cor do elemento "cor final"
            case '#ffffff':                                     //No caso de estar em branco (início)
                final.style.backgroundColor = "#c2185b";        //Cor final passa a magenta
                break;
            case '#00b0ff':                                     //No caso de estar em azul
                final.style.backgroundColor = "#7b1fa2";        //Cor final passa a roxo
                break;
            case '#f4b400':                                     //No caso de estar em amarelo
                final.style.backgroundColor = "#d84315";        //Cor final passa a laranja
                break;
            default:
                print("nada");
                break;
        }
    };
    document.getElementById("cor2").onclick = function () {
        final = document.getElementById("corFinal");
        document.getElementById("corFinal").style.cursor = "url('img/icons/brush.png'), pointer";
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
        document.getElementById("corFinal").style.cursor = "url('img/icons/brush.png'), pointer";
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
    document.getElementById("apagar").onclick = function () {                       //Ao clicar no elemento "apagar"
        document.getElementById("corFinal").style.backgroundColor = "#ffffff";      //Cor final passa a branco
        document.getElementById("corFinal").style.cursor = "default";               //ponteiro passa ao estilo default
    }
}

//Função que transforma o código das cores de RGB para Hex
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

//----------JOGO NÚMEROS----------//
