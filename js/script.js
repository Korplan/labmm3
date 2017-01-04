//----------VARIÁVEIS GLOBAIS----------//
var debug = true;                               //(mostrar ou não) Prints na consola

//----------AUDIO---------------
var musica = new Audio();                       // Música de fundo
musica.src = "sound/ukulele.mp3";
musica.volume = 0.8;                            // Volume da música
musica.loop = true;                             // Colocar música em loop

musicaOn = true;                                // Variável que controla se a música está ligada ou desligada

var somVirarCarta = new Audio();                // Som do virar de carta (jogo da memória)
somVirarCarta.src = "sound/whoosh.mp3";

var somSolucaoCorreta = new Audio();            // Som das soluções corretas
somSolucaoCorreta.src = "sound/bell.mp3";

efeitosSonorosOn = true;                        // Variável que controla se os efeitos sonoros estão ligados ou desligados.

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

//----------VARRIMENTO----------
var varrimento;
var local;

//----------JOGO MEMORIA----------
var memoCartas = [];                            //Array pares de cartas
var par = false;                                //Quando selecionas uma carta passa a true para usar como comparação
var ultimo = "";
var memMax = 4;                                 //numero maximo de cartas
var certas = 0;

//----------JOGO PALAVRAS----------
var feitas = [];        //Array que armazena os index do array "palavras" que já sairam
var palavra;            //guarda palavra sorteada (=palavra para completar no jogo)

//----------JOGO NUMEROS----------
var numMax = 5;         //Número máximo de elementos por opção

//----------JOGO CORES----------
var corMuda = '#fff';               //Variável que vai guardar as diferentes cores para pintar as frutas
var sorteiaDesenho;                 //Sorteio do elemento a desenhar (canvas)
var limpa=false;                    //Variável que diz se foi clicado o botão de limpar cores ou não

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

// var jogo_memoria = false;       //Esconde jogo memória
var atual = [];                 //Interação por Point and Wait
var over = false;               //Interação por Point and Wait

var palavras = [];      //Array com frutas disponíveis nos jogos
palavras[0] = ["a", "mei", "xa"];
palavras[1] = ["a", "na", "nás"];
palavras[2] = ["ce", "nou", "ra"];
palavras[3] = ["ce", "re", "ja"];
palavras[4] = ["ma", "çã"];
palavras[5] = ["mir", "ti", "lo"];
palavras[6] = ["mo", "ran", "go"];
palavras[7] = ["la", "ran", "ja"];
palavras[8] = ["pe", "ra"];
palavras[9] = ["ba", "na", "na"];

//----------DEBUG----------//
function print(s) {
    if (debug)                  //Se debug==true
        console.log(s);         //Faz print na consola dos parâmetros recebidos
}

//----------NO CARREGAMENTO----------//
window.onload = function () {
    var temp = "";                                                                      //Elimina classes acrescentadas ao elemento "voz"

    musica.play();                                                                      //Coloca a tocar a música de fundo

    document.getElementById("menu_musica").click();                                     //Simula clique no "menu-musica" do menu lateral

    document.getElementById("menu_musica").onclick = function () {
        if(musicaOn){                                                                   //Se a música estiver ligada, desliga música
            musicaOn = false;
            musica.pause();
        }
        else {                                                                          //Se a música estiver desligada, liga música
            musicaOn = true;
            musica.load();
            musica.play();
        }
    };

    document.getElementById("menu_sons").click();                                       //Simula clique no "menu-sons" do menu lateral

    document.getElementById("menu_sons").onclick = function () {
        if(efeitosSonorosOn){                                                           //Se os efeitos sonoros estiverem ligados, desliga efeitos sonoros
            efeitosSonorosOn = false
        }
        else {                                                                          //Se os efeitos sonoros estiverem desligados, liga efeitos sonoros
            efeitosSonorosOn = true;
        }
    };


    if (!('webkitSpeechRecognition' in window)) {                                       //Verifica se o browser suporta v2t (voz para texto)
        print("O browser não é compatível com reconhecimento de voz");                  //Escreve na consola (ver função "print")
        temp = document.getElementById("voz").getAttribute("class") + " inativo";       //Desativa a interação por voz na página de seleção de interação
        document.getElementById("voz").setAttribute("class", temp);                     //Acrescenta a class "inativo" ao elemento "voz"
        document.getElementById("menu_voz").style.display = "none";                     //Desativa a interação por voz no menu de seleção de interação

    } else
        document.getElementById("voz").onclick = function () {                          //Ao clicar no elemento "voz"
            document.getElementById("interacao1").style.display = "none";               //Esconde a div "interacao1" (div de seleção de interação)
            document.getElementById("interacao2").style.display = "block";              //Mostra a div "interacao2" (div de seleção de Jogos)
            interacao = 3;                                                              //3 = Interação por voz (ver vars globais)
            menu();
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
        menu();
    };

    document.getElementById("point_click").onclick = function () {                      //Ao clicar no elemento "point_click"
        document.getElementById("interacao1").style.display = "none";                   //Esconde a div "interacao1" (div de seleção de interação)
        document.getElementById("interacao2").style.display = "block";                  //Mostra a div "interacao2" (div de seleção de Jogos)
        interacao = 1;                                                                  //1 = Interação por Point and Click (ver vars globais)
        menu();
    };

    document.getElementById("varrimento").onclick = function () {                       //Ao clicar no elemento "varrimento"
        document.getElementById("interacao1").style.display = "none";                   //Esconde a div "interacao1" (div de seleção de interação)
        document.getElementById("interacao2").style.display = "block";                  //Mostra a div "interacao2" (div de seleção de Jogos)
        interacao = 2;                                                                  //2 = Interação por varrimento (ver vars globais)
        loadVarrimento();
        menu();
    };

    document.getElementById("btn_mem").onclick = function () {                          //Ao clicar no elemento "btn_mem"
        document.getElementById("interacao2").style.display = "none";                   //Esconde a div "interacao2" (div de seleção de Jogos)
        document.getElementById("jogoMemoria").style.display = "block";                 //Mostra a div "jogoMemoria"
        document.getElementById("voltar").style.display = "block";                      //Mostra o botão "voltar"
        document.getElementById("help").style.display = "block";                        //Mostra o botão "ajuda"
        jogo = 1;
        jogoMemoria();
        if (interacao == 3)
            for (var i = 0; i < document.getElementsByClassName("mostraNum")[i].length; i++)
                document.getElementsByClassName("mostraNum")[i].style.display = "block";
        switch (interacao) {
            case 0:
                loadPointAndWait();
                break;
            case 2:
                loadVarrimento();
                break;
        }
    };

    document.getElementById("btn_palavras").onclick = function () {                     //Ao clicar no elemento "btn_palavras"
        document.getElementById("interacao2").style.display = "none";                   //Esconde a div "interacao2" (div de seleção de Jogos)
        document.getElementById("jogoPalavras").style.display = "block";                //Mostra a div "jogoPalavras"
        document.getElementById("voltar").style.display = "block";                      //Mostra o botão "voltar"
        document.getElementById("help").style.display = "block";                        //Mostra o botão "ajuda"
        jogo = 3;
        loadJogoPalavras();
        switch (interacao) {
            case 0:
                loadPointAndWait();
                break;
            case 2:
                loadVarrimento();
                break;
        }
    };

    document.getElementById("btn_cores").onclick = function () {                        //Ao clicar no elemento "btn_cores"
        document.getElementById("interacao2").style.display = "none";                   //Esconde a div "interacao2" (div de seleção de Jogos)
        document.getElementById("jogoCores").style.display = "block";                   //Mostra a div "jogoCores"
        document.getElementById("voltar").style.display = "block";                      //Mostra o botão "voltar"
        document.getElementById("help").style.display = "block";                        //Mostra o botão "ajuda"
        jogo = 4;
        loadJogoCores();
        switch (interacao) {
            case 0:
                loadPointAndWait();
                break;
            case 2:
                loadVarrimento();
                break;
        }
    };

    document.getElementById("btn_num").onclick = function () {                        //Ao clicar no elemento "btn_cores"
        document.getElementById("interacao2").style.display = "none";                   //Esconde a div "interacao2" (div de seleção de Jogos)
        document.getElementById("jogoNumeros").style.display = "block";                 //Mostra a div "jogoCores"
        document.getElementById("voltar").style.display = "block";                      //Mostra o botão "voltar"
        document.getElementById("help").style.display = "block";                        //Mostra o botão "ajuda"
        jogo = 2;
        loadJogoNumeros();
        switch (interacao) {
            case 0:
                loadPointAndWait();
                break;
            case 2:
                loadVarrimento();
                break;
        }
    };

    document.getElementById("menu_paw").onclick = function () {                     //Ao clicar na opção de interação "apontar e esperar"
        if (interacao != 0) {                                                        //Se a opção não estiver ainda selecionada (se a interação for diferente da atual)
            interacao = 0;                                                          //Muda interação para "apontar e esperar"
            menu();
        }
    };

    document.getElementById("menu_cursor").onclick = function () {
        if (interacao != 1) {
            interacao = 1;
            menu();
        }
    };

    document.getElementById("menu_varrimento").onclick = function () {
        if (interacao != 2) {
            interacao = 2;
            menu();
        }
    };

    document.getElementById("menu_voz").onclick = function () {
        if (interacao != 3) {
            interacao = 3;
            menu();
        }
    };

    document.getElementById("voltar").onclick = function () {
        document.getElementById("jogoMemoria").style.display = "none";                      //Esconde a div "jogoMemoria"
        document.getElementById("jogoPalavras").style.display = "none";                     //Esconde a div "jogoPalavras"
        document.getElementById("jogoCores").style.display = "none";                        //Esconde a div "jogoCores"
        document.getElementById("jogoNumeros").style.display = "none";                      //Esconde a div "jogoNumeros"
        document.getElementById("interacao2").style.display = "block";                      //Mostra a div "interacao2"
        document.getElementById("voltar").style.display = "none";                           //Esconde o botão "voltar"
        document.getElementById("help").style.display = "none";                             //Esconde o botão "ajuda"
    }

};

//----------CONTROLOS----------//
function menu() {
    print(interacao);
    switch (interacao) {                                                                    //Se interação for
        case 0:                                                                             //0 = "apontar e esperar"
            if (!document.getElementById("menu_paw").classList.contains("active")) {        //Se a interação do tipo "apontar e esperar" tiver class "ativa"
                document.getElementById("menu_paw").click();                                //Simula o clique em "apontar e esperar" no menu lateral
                try {
                    speechRecognition.abort();                                                  //Pára o reconhecimento por voz
                    stop = true;
                    clearVarrimento(local);
                } catch (err) {
                }
                loadPointAndWait();
                if (jogo == 1)
                    for (var i = 0; i < document.getElementsByClassName("mostraNum")[i].length; i++)
                        document.getElementsByClassName("mostraNum")[i].style.display = "none";
            }
            break;
        case 1:
            if (!document.getElementById("menu_cursor").classList.contains("active")) {
                document.getElementById("menu_cursor").click();
                try {
                    speechRecognition.abort();                                                  //Pára o reconhecimento por voz
                    stop = true;
                    clearVarrimento(local);
                } catch (err) {
                }
                unloadPointAndWait();
                if (jogo == 1)
                    for (var i = 0; i < document.getElementsByClassName("mostraNum")[i].length; i++)
                        document.getElementsByClassName("mostraNum")[i].style.display = "none";
            }
            break;
        case 2:
            if (!document.getElementById("menu_varrimento").classList.contains("active")) {
                document.getElementById("menu_varrimento").click();
                try {
                    speechRecognition.abort();                                                  //Pára o reconhecimento por voz
                    stop = true;
                } catch (err) {
                }
                unloadPointAndWait();
                loadVarrimento();
                if (jogo == 1)
                    for (var i = 0; i < document.getElementsByClassName("mostraNum")[i].length; i++)
                        document.getElementsByClassName("mostraNum")[i].style.display = "none";
            }
            break;
        case 3:
            if (!document.getElementById("menu_voz").classList.contains("active")) {
                document.getElementById("menu_voz").click();
                loadVoiceRec();                                                                 //Inicia o reconhecimento por voz
                stop = false;
                unloadPointAndWait();
                try {
                    clearVarrimento(local);
                } catch (err) {
                }
                if (jogo == 1)
                    for (var i = 0; i < document.getElementsByClassName("mostraNum")[i].length; i++)
                        document.getElementsByClassName("mostraNum")[i].style.display = "block";
            }
            break;
    }
}

//----------POINTandWAIT----------//
function loadPointAndWait() {
    var elements = document.getElementsByClassName("clickable");

    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = function () {
            if (!over) {
                elem = this;
                atual[i] = this.innerHTML;
                over = true;
                this.innerHTML += "<div id='sel_cont'><img id='selecionada' src='img/PaW/0.png'></div>";
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
        // elem.click();
    }
}

function unloadPointAndWait() {
    var elements = document.getElementsByClassName("clickable");

    for (var i = 0; i < elements.length; i++) {
        elements[i].onmouseover = null;
        elements[i].onmouseout = null;
    }
}

//----------VARRIMENTO----------//
function loadVarrimento() {
    var i = -1;
    switch (jogo) {
        case 0:
            local = document.getElementById("interacao2");
            break;
        case 1:
            local = document.getElementById("jogoMemoria");
            break;
        case 2:
            local = document.getElementById("jogoNumeros");
            break;
        case 3:
            local = document.getElementById("jogoPalavras");
            break;
        case 4:
            local = document.getElementById("jogoCores");
            break;
    }
    clearVarrimento(local);

    // document.onclick = function(){
    //     local.getElementsByClassName("clickable")[i].click();
    // };
    window.onkeypress = function () {
        local.getElementsByClassName("clickable")[i].click();
    };


    varrimento = setInterval(function () {
        i++;
        if (i > local.getElementsByClassName("clickable").length - 1)
            i = 0;
        for (var j = 0; j < local.getElementsByClassName("clickable").length; j++)
            if (j != i) {
                local.getElementsByClassName("clickable")[j].classList.remove("z-depth-4");
                local.getElementsByClassName("clickable")[j].classList.add("z-depth-1");
            }
        local.getElementsByClassName("clickable")[i].classList.remove("z-depth-1");
        local.getElementsByClassName("clickable")[i].classList.add("z-depth-4");
        print(i + "_" + (local.getElementsByClassName("clickable").length - 1));
    }, 1000);
}

function clearVarrimento(loc) {
    clearInterval(varrimento);
    for (var j = 0; j < loc.getElementsByClassName("clickable").length; j++) {
        local.getElementsByClassName("clickable")[j].classList.remove("z-depth-4");
        local.getElementsByClassName("clickable")[j].classList.add("z-depth-1");
    }
    // loc.getElementsByClassName("clickable")[j].style.border = "";
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

    speechRecognition.start();                              //Inicia o reconhecimento por voz

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
            switch (jogo) {
                case 0:             //MENU
                    switch (command) {
                        case 'memória':
                            document.getElementById("btn_mem").click();
                            break;
                        case 'número':
                        case 'números':
                            document.getElementById("btn_num").click();
                            break;
                        case 'palavras':
                        case 'palavra':
                            document.getElementById("btn_palavras").click();
                            break;
                        case 'cores':
                        case 'cor':
                            document.getElementById("btn_cores").click();
                            break;
                        default:
                            break;
                    }
                    break;
                case 1:             //Memoria
                    document.getElementById("item" + command[command.length - 1]).click();
                    break;
                case 2:             //Numeros

                    break;
                case 3:             //Palavras
                    if (command == palavras[palavra].join("")) {
                        document.getElementById("certo").click();
                    }
                    break;
                case 4:             //Cores
                    switch (command) {
                        case 'magenta':
                            document.getElementById("cor1").click();
                            break;
                        case 'azul':
                            document.getElementById("cor2").click();
                            break;
                        case 'amarelo':
                            document.getElementById("cor3").click();
                            break;
                        case 'pinta':
                        case 'pintar':
                        case 'colorir':
                            document.getElementById("corFinal").click();
                            break;
                        case 'limpa':
                        case 'limpar':
                        case 'apaga':
                        case 'apagar':
                            document.getElementById("apagar").click();
                            break;
                    }
                    break;
            }
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
    document.getElementById("memoTab").innerHTML = "";
    certas = 0;
    var x = 1;
    for (var m = 0; m < memMax; m += 2) {
        memoCartas[m] = memoCartas[m + 1] = x;
        x++;
    }

    document.body.style.backgroundImage = "url('img/Frutas!-23.png')";
    document.body.style.backgroundImage = "cover";


    // jogo_memoria = true;                                                //Mostrar jogo
    memoCartas.sort(function () {                                       //Define posições aleatorias para os elementos do array
        return 0.5 - Math.random()
    });
    var numCartas = 0;                                                  //Numeros de cartas colocadas no tabuleiro

    // for (var id = 0; id < 2; id++) {                                    //Criar linhas com id "line#" até 2 (para ecrã M)
    //     document.getElementById("memoTab").innerHTML +=
    //         "<div class='flip' id='line" + id + "'></div>";

    for (var id2 = 0; id2 < memMax; id2++) {                             //Criar elementos (cartas) com id "item#"
        document.getElementById("memoTab").innerHTML +=
            "<div class='col s6 m4 l3'><div class='rounded carta valign-wrapper clickable card grey' style='height: 250px; width: 200px;' id='item" + (numCartas + 1) + "'>" +
            "<div class='center-block face front'><span class='mostraNum' style='display: none'>" + (numCartas + 1) + "</span></div>" +
            "<div class='face back'>" + memoCartas[numCartas] + "</div>" +
            "</div></div>";
        numCartas++;                                //Soma 1 carta às cartas colocadas
    }

    for (var j = 1; j <= memMax; j++) {
        document.getElementById("item" + j).setAttribute("onclick", "flip(" + j + ")"); //Cada carta é atribuido um evento onclick com a função "flip(#);"
    }
}

function flip(id) {                                                     //Função "flip()" que recebe como parâmetro o # da carta
    print(id);                                                          //Escreve na consola o # da carta
    document.getElementById("item" + id).classList.add("flipped");      //Procura o item com o # recebido e adiciona-lhe a classe "flipped"
    document.getElementById("item" + id).classList.remove("clickable"); //Procura o item com o # recebido e retira-lhe a classe "clickable"
    document.getElementById("item" + id).onclick = null;                //Desativa o clique na carta
    document.getElementById("item" + id).onmouseover = null;            //Desativa o onmouseover da carta

    if(efeitosSonorosOn){                                               //Se os efeitos sonoros estiverem ligados, toca o som de virar carta
        somVirarCarta.play();
    }


    // if (jogo_memoria) {                 //Se jogo_memoria=true
    setTimeout(function () {        //Ocorre 1 vez passado 1segundo
        if (!par)                   //Se for virada a primeira carta ainda não há um par
            ultimo = id;            //logo ultimo (var que guarda  aultima carta virada) = ao # da carta recebido

        else if (document.getElementById("item" + ultimo).getElementsByTagName("div")[1].innerHTML != document.getElementById("item" + id).getElementsByTagName("div")[1].innerHTML) {      //Senão, se par==true, ou seja, foram viradas duas cartas, verifica-se se uma é igual à outra. Então, o conteúdo (innerHTML) da div 1 (elemento de índice 1 do array "getElementsByTagName("div")") do elemento "itemultimo" (última carta virada) é igual ao conteudo (innerHTML) da div 1 (elemento de índice 1 do array "getElementsByTagName("div")") do elemento "itemid" (primeira carta virada)
            document.getElementById("item" + ultimo).classList.remove("flipped");                       //Verifica a lista de classes do elemento "item ultimo" e remove a classe "flipped"
            document.getElementById("item" + ultimo).classList.add("clickable");                       //Verifica a lista de classes do elemento "item ultimo" e remove a classe "flipped"
            document.getElementById("item" + id).classList.remove("flipped");                           //Verifica a lista de classes do elemento "item id" e remove a classe "flipped"
            document.getElementById("item" + id).classList.add("clickable");                           //Verifica a lista de classes do elemento "item id" e remove a classe "flipped"
            document.getElementById("item" + ultimo).setAttribute("onclick", "flip(" + ultimo + ")");   //Adiciona a função (anteriormente retirada) "flip(ultimo)"
            document.getElementById("item" + id).setAttribute("onclick", "flip(" + id + ")");           //Adiciona a função (anteriormente retirada) "flip(id)"
            ultimo = "";
        } else {
            certas += 2;
            if(efeitosSonorosOn){                                                                       //Se os efeitos sonoros estiverem ligados, toca o som de solução correta
                somSolucaoCorreta.play();
            }
        }
        par = !par; //se par==true passa a par=false e se par==false passa a par=true
        if (certas == memMax) {
            print("GANHASTE!!");
            if (memMax < 10)
                memMax += 2;
            setTimeout("jogoMemoria()", 5000);
        }
    }, 1000);
    print(ultimo);
    // }
}

//----------JOGO PALAVRAS----------//
function loadJogoPalavras() {
    document.body.style.backgroundImage = "url('img/Frutas!-21.png')";
    document.body.style.backgroundImage = "cover";

    var silabas = ["ba", "na", "mo", "ja", "a", "la", "tar", "pol", "sor", "cur", "ve", "ga", "ção", "tra", "du", "tor"];   //Array com sílabas "erradas"
    var hipoteses = [];                         //Array com sílabas de opção

    document.getElementById("palavraIncompleta").innerHTML = "";        //O innerHTML do elemento palavraIncompleta está vazio

    do {
        palavra = Math.floor(Math.random() * palavras.length);          //Palavra = sorteio de index entre 0 e 8 (=palavras.lenght)
        print("ciclo");
    } while (feitas.indexOf(palavra) != -1);                             //Enquanto forem sorteadas palavras que já tenham saído é sorteada nova palavra (se o elemento de index # existir no array feitas repete ciclo)

    document.getElementById("imgPal").innerHTML = "<img style='width: 100%' src='img/frutas/" + numParaFruta(palavra) + ".png'/>";

    var retira = Math.floor(Math.random() * palavras[palavra].length);  //Retira (retira sílaba de palavra) = Sorteio entre 0 e palavra.lenght do elemento sorteado acima

    for (var i = 0; i < palavras[palavra].length; i++) {                //Enquanto i for menor que o número de sílabas/indexs da(o) palavra/array "palavras[#]"
        if (retira != i)                                                //Se sílaba sorteada for diferente de i
            document.getElementById("palavraIncompleta").innerHTML += "<div class='silaba'>" + palavras[palavra][i] + "</div>"; //Escreve a sílaba para formar a palavra
        else {                                                                                //Senão
            document.getElementById("palavraIncompleta").innerHTML += "<div class='silaba' id='silaba-falta'></div>";
            for (var j = 0; j < palavras[palavra][retira].length; j++)                      //Escreve um "_" por cada letra da sílaba retirada
                document.getElementById("silaba-falta").innerHTML += "__ ";
        }
    }

    for (var k = 0; k < 3; k++) {                                               //Nº de opções = 3 no máximo
        var random = silabas[Math.floor(Math.random() * silabas.length)];       //Random = ao index sorteado do array "silabas" entre 0 e nº de index máximo
        if (random != palavras[palavra][retira]) {                              //Se a sílaba sorteada for diferente da sílaba retirada (que constitui a palavra a completar)
            hipoteses[k] = "<div class='silaba opcao clickable'>" + random + "</div>";  //É colocada num array "hipoteses" de index igual a K (=3)
            silabas.splice(silabas.indexOf(random), 1);                         //retira do array "silabas" o elemento que já saiu (evita repetiçoes de silabas erradas)
        }
        else {
            k--;                                                                //É decrementado um k para poder repetir o ciclo com o mesmo valor de k
        }
        print(random);
        print(palavras[palavra][retira]);
    }
    hipoteses[k] = "<div id='certo' class='silaba opcao clickable'>" + palavras[palavra][retira] + "</div>";    //Último index do array "hipoteses" é a sílaba certa para completar a palavra
    hipoteses.sort(function () {                                                                        //Dispõe em index aleatorios as sílabas do array (para que as opções )
        return 0.5 - Math.random()
    });
    document.getElementById("opcoes").innerHTML = hipoteses.join("");                                       //O innerHTML do elemento "opcoes" contém o array hipoteses com elemntos separados por espaço


    setTimeout(function () {
        document.getElementById("palavraIncompleta").style.animation = "fadeInLeft 0.8s";
    },2000);

/*
    for(i=0; i<document.getElementById("opcoes").getElementsByTagName("div").length; i++){
        document.getElementById("opcoes").getElementsByTagName("div")[i].style.animation = "zoomIn 0.8s";
    }
*/
    document.getElementById("certo").onclick = function () {                                                //Ao clicar no elemento "certo" (sílaba certa)
        document.getElementById("silaba-falta").innerHTML = document.getElementById("certo").innerHTML;     //Substituir o espaço a completar pela sílaba certa
        document.getElementById("certo").style.animation = "tada 0.8s";                                //Animar o elemento "certo" durante 0.8segundos através da animação "bounceOut" (ver .css)
        document.getElementById("silaba-falta").style.animation = "tada 0.8s";

        feitas.push(palavra);                                                   //Insere no fim do array "feitas" o index da palavra
        print(feitas.length + " / " + palavras.length);
        setTimeout(function () {
            if (palavras.length == feitas.length) {                                 //Se tiverem saído/ sido completadas todas as palavras
                alert("não ha mais");
                document.getElementById("certo").onclick = null;                    //Bloqueia o clique no elemento "certo"
            } else                                                                  //Senão
                loadJogoPalavras();                                                 //Repete o jogo
        }, 2000);
    };

    document.getElementById("opcoes").onclick = function () {                                                //Ao clicar no elemento "certo" (sílaba certa)
        document.getElementById("silaba-falta").innerHTML = document.getElementById("certo").innerHTML;     //Substituir o espaço a completar pela sílaba certa
        document.getElementById("silaba-falta").style.animation = "tada 0.8s";
        document.getElementById("certo").style.animation = "tada 0.8s";                                //Animar o elemento "certo" durante 0.8segundos através da animação "bounceOut" (ver .css)
        }
}

//----------JOGO CORES----------//
function loadJogoCores() {
    document.body.style.backgroundImage = "url('img/Frutas!-19.png')";
    document.body.style.backgroundImage = "cover";

    if(!limpa){
        corMuda = '#fff';
        sorteiaDesenho = parseInt(Math.random() * (palavras.length));              //Sorteia uma fruta a desenhar
        desenha();
    }
    limpa=false;

    var final;
    var numCores = 0;
    document.getElementById('cores-lig-1').style.backgroundColor = "#fff";
    document.getElementById('cores-lig-2').style.backgroundColor = "#fff";
    document.getElementById('cores-lig-3').style.backgroundColor = "#fff";
    document.getElementById("cor1").classList.add('clickable');
    document.getElementById("cor2").classList.add('clickable');
    document.getElementById("cor3").classList.add('clickable');
    document.getElementById("corFinal").classList.remove('clickable');

    document.getElementById("cor1").onclick = function () {     //Ao clicar no elemtno "cor1" (=mangenta)
        numCores++;
        document.getElementById("corFinal").classList.add('clickable');
        document.getElementById("cor1").onclick = null;
        document.getElementById("cor1").classList.remove('clickable');
        if (numCores == 2) {
            document.getElementById("cor2").onclick = null;
            document.getElementById("cor2").classList.remove('clickable');
            document.getElementById("cor3").onclick = null;
            document.getElementById("cor3").classList.remove('clickable');
        }
        document.getElementById('cores-lig-1').style.backgroundColor = "#c2185b";
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
        numCores++;
        document.getElementById("corFinal").classList.add('clickable');
        document.getElementById("cor2").onclick = null;
        document.getElementById("cor2").classList.remove('clickable');
        if (numCores == 2) {
            document.getElementById("cor1").onclick = null;
            document.getElementById("cor1").classList.remove('clickable');
            document.getElementById("cor3").onclick = null;
            document.getElementById("cor3").classList.remove('clickable');
        }
        document.getElementById('cores-lig-2').style.backgroundColor = "#00b0ff";
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
        numCores++;
        document.getElementById("corFinal").classList.add('clickable');
        document.getElementById("cor3").onclick = null;
        document.getElementById("cor3").classList.remove('clickable');
        if (numCores == 2) {
            document.getElementById("cor2").onclick = null;
            document.getElementById("cor2").classList.remove('clickable');
            document.getElementById("cor1").onclick = null;
            document.getElementById("cor1").classList.remove('clickable');
        }
        document.getElementById('cores-lig-3').style.backgroundColor = "#f4b400";
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
        limpa=true;
        loadJogoCores();
    };
    document.getElementById("corFinal").onclick = function () {     //Ao clicar no elemtno "cor Final"
        corMuda = document.getElementById("corFinal").style.backgroundColor;
        desenha();
    };
}

//Função que transforma o código das cores de RGB para Hex
function rgbToHex(col) {
    if (col.charAt(0) == 'r') {
        col = col.replace('rgb(', '').replace(')', '').split(',');
        var r = parseInt(col[0], 10).toString(16);
        var g = parseInt(col[1], 10).toString(16);
        var b = parseInt(col[2], 10).toString(16);
        r = r.length == 1 ? '0' + r : r;
        g = g.length == 1 ? '0' + g : g;
        b = b.length == 1 ? '0' + b : b;
        var colHex = '#' + r + g + b;
        return colHex;
    }
}

function desenha () {
    var canvas = document.getElementById("canvas");         //Desenha em canvas a fruta
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);       //Desenha em canvas a fruta
    var ctx = canvas.getContext("2d");                                       //Desenha em canvas a fruta
    switch (sorteiaDesenho) {                                                   //Desenha em canvas a fruta sorteada
        case 0:
            desenhaAmeixa(ctx);
            break;
        case 1:
            desenhaAnanas(ctx);
            break;
        case 2:
            desenhaCenoura(ctx);
            break;
        case 3:
            desenhaCereja(ctx);
            break;
        case 4:
            desenhaMaca(ctx);
            break;
        case 5:
            desenhaMirtilo(ctx);
            break;
        case 6:
            desenhaMorango(ctx);
            break;
        case 7:
            desenhaLaranja(ctx);
            break;
        case 8:
            desenhaPera(ctx);
            break;
        case 9:
            desenhaBanana(ctx);
            break;
    }
}


//----------JOGO NÚMEROS----------//
function loadJogoNumeros() {
    document.body.style.backgroundImage = "url('img/Frutas!-24.png')";
    document.body.style.backgroundImage = "cover";

    var f1, f2, fErrada1, fErrada2;                                     //variaveis que guardam fruta1, fruta2, frutaErrada1 e frutaErrada2
    do {
        f1 = numParaFruta(Math.floor(Math.random() * palavras.length));
        f2 = numParaFruta(Math.floor(Math.random() * palavras.length));
    } while (f1 == f2);                                                 //escolhe duas frutas diferentes, aleatoriamente

    var sumo = document.getElementById("sumo");

    document.getElementById("fruta1").innerHTML = "<img src='img/frutas/" + f1 + ".png'>";                      //coloca a imagem respetiva a fruta1 escolhida
    document.getElementById("fruta2").innerHTML = "<img src='img/frutas/" + f2 + ".png'>";                      //coloca a imagem respetiva a fruta2 escolhida
    var num1 = document.getElementById("num1").innerHTML = Math.floor(Math.random() * (numMax - 1)) + 1;        //gera um número aleatorio entre 1 e o num Máximo, coloca-o no HTML e guarda na variavel
    var num2 = document.getElementById("num2").innerHTML = numMax - num1;                                       //calcula as frutas que faltam até ao numero maximo
    document.getElementById("num2").classList.add('jogo-num-bola');                                             //calcula as frutas que faltam até ao numero maximo

    switch (f1 + "_" + f2) {                                                            //verifica as frutas sorteadas e coloca no HTML a respetiva imagem
        case 'ameixa_ananas':
        case 'ananas_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo2.png'>";
            break;
        case 'ameixa_cenoura':
        case 'cenoura_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo2.png'>";
            break;
        case 'ameixa_cereja':
        case 'cereja_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo7.png'>";
            break;
        case 'ameixa_laranja':
        case 'laranja_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo2.png'>";
            break;
        case 'ameixa_maca':
        case 'maca_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo2.png'>";
            break;
        case 'ameixa_mirtilo':
        case 'mirtilo_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo4.png'>";
            break;
        case 'ananas_cenoura':
        case 'cenoura_ananas':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'ananas_cereja':
        case 'cereja_ananas':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'ananas_laranja':
        case 'laranja_ananas':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'ananas_maca':
        case 'maca_ananas':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'ananas_mirtilo':
        case 'mirtilo_ananas':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'ananas_morango':
        case 'morango_ananas':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'ananas_pera':
        case 'pera_ananas':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'cenoura_cereja':
        case 'pera_a':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cenoura_laranja':
        case 'laranja_cenoura':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cenoura_maca':
        case 'maca_cenoura':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo2.png'>";
            break;
        case 'cenoura_mirtilo':
        case 'mirtilo_cenoura':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cenoura_morango':
        case 'morango_cenoura':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cenoura_pera':
        case 'pera_cenoura':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo2.png'>";
            break;
        case 'cereja_laranja':
        case 'laranja_cereja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cereja_maca':
        case 'maca_cereja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cereja_mirtilo':
        case 'mirtilo_cereja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cereja_morango':
        case 'morango_cereja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'cereja_pera':
        case 'pera_cereja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'laranja_maca':
        case 'maca_laranja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo1.png'>";
            break;
        case 'laranja_mirtilo':
        case 'mirtilo_laranja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'laranja_morango':
        case 'morango_laranja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        case 'laranja_pera':
        case 'pera_laranja':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo1.png'>";
            break;
        case 'maca_mirtilo':
        case 'mirtilo_maca':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo4.png'>";
            break;
        case 'maca_morango':
        case 'morango_maca':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo1.png'>";
            break;
        case 'maca_pera':
        case 'pera_maca':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo1.png'>";
            break;
        case 'mirtilo_morango':
        case 'morango_mirtilo':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo4.png'>";
            break;
        case 'mirtilo_pera':
        case 'pera_mirtilo':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo4.png'>";
            break;
        case 'morango_pera':
        case 'pera_morango':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo7.png'>";
            break;
        default:
            print("ERRO: não existe a combinação de frutas " + f1 + "_" + f2 + "nem" + f2 + "_" + f1 );
            break;
    }


    document.getElementById("op1").innerHTML = "";              //limpa o innerHTML do elemento
    document.getElementById("op2").innerHTML = "";              //limpa o innerHTML do elemento
    document.getElementById("op3").innerHTML = "";              //limpa o innerHTML do elemento

    var opCerta = Math.floor(Math.random() * 3 + 1);                //escolhe a posição onde vai colocar a hipotese certa

    for (var i = 0; i < num1; i++) {                    //coloca as imagens das frutas na posição da resposta correta
        document.getElementById("op" + opCerta).innerHTML += "<img src='img/frutas/" + f1 + ".png'>";
    }
    for (var j = 0; j < num2; j++) {
        document.getElementById("op" + opCerta).innerHTML += "<img src='img/frutas/" + f2 + ".png'>";
    }

    for (var l = 1; l <= 3; l++) {                      //coloca as imagens das frutas em cada uma das posiçoes com respostas erradas
        if (l != opCerta) {                             //as erradas sao colocadas num sitio diferente da opção certa
            do {
                fErrada1 = Math.floor(Math.random() * (numMax - 1) + 1);
            } while (fErrada1 == num1);                   //sorteia um número diferente do correto

            fErrada2 = numMax - fErrada1;               //calcula o numero de 2as frutas

            for (var k = 0; k < fErrada1; k++) {        //coloca as imagens das frutas na posição respetiva
                document.getElementById("op" + l).innerHTML += "<img src='img/frutas/" + f1 + ".png'>";
            }
            for (var n = 0; n < fErrada2; n++) {
                document.getElementById("op" + l).innerHTML += "<img src='img/frutas/" + f2 + ".png'>";
            }
        }
    }
}

function numParaFruta(num) {
    switch (num) {
        case 0:
            return "ameixa";
        case 1:
            return "ananas";
        case 2:
            return "cenoura";
        case 3:
            return "cereja";
        case 4:
            return "maca";
        case 5:
            return "mirtilo";
        case 6:
            return "morango";
        case 7:
            return "laranja";
        case 8:
            return "pera";
        case 9:
            return "banana";
        default:
            print("ERRO: numParaFruta");
            break;
    }
}


//----------CANVAS----------//

function desenhaAmeixa(ctx) {

    // ameixa/Group
    ctx.save();

    // ameixa/Group/folha
    ctx.save();

    // ameixa/Group/folha/folha
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(173.7, 6.8);
    ctx.bezierCurveTo(166.0, -9.9, 134.0, 8.4, 124.3, 17.3);
    ctx.bezierCurveTo(111.8, 28.5, 105.5, 43.2, 98.7, 58.7);
    ctx.lineTo(109.1, 66.6);
    ctx.bezierCurveTo(123.8, 62.8, 137.4, 60.5, 151.3, 48.2);
    ctx.bezierCurveTo(158.7, 41.6, 179.3, 18.8, 173.7, 6.8);
    ctx.lineTo(173.7, 6.8);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // ameixa/Group/folha/risco
    ctx.beginPath();
    ctx.moveTo(103.9, 62.6);
    ctx.bezierCurveTo(103.9, 62.6, 124.6, 26.8, 167.1, 7.8);
    ctx.strokeStyle = "rgb(59, 91, 42)";
    ctx.stroke();

    // ameixa/Group/caule
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(152.5, 112.6);
    ctx.bezierCurveTo(148.8, 110.3, 145.3, 107.7, 142.0, 105.0);
    ctx.bezierCurveTo(127.2, 82.0, 107.7, 66.9, 89.6, 47.0);
    ctx.bezierCurveTo(80.8, 37.3, 81.2, 23.3, 67.9, 24.2);
    ctx.bezierCurveTo(57.4, 25.0, 42.1, 47.8, 42.7, 57.2);
    ctx.bezierCurveTo(43.8, 73.4, 64.5, 70.2, 76.0, 75.8);
    ctx.bezierCurveTo(97.1, 86.1, 117.1, 108.6, 131.7, 126.4);
    ctx.bezierCurveTo(134.2, 129.5, 138.3, 129.4, 141.0, 127.5);
    ctx.bezierCurveTo(144.7, 130.3, 149.5, 127.7, 150.8, 123.5);
    ctx.bezierCurveTo(155.1, 121.7, 157.5, 115.7, 152.5, 112.6);
    ctx.lineTo(152.5, 112.6);
    ctx.closePath();
    ctx.fillStyle = "rgb(114, 82, 46)";
    ctx.fill();

    // ameixa/Group/corpo
    ctx.beginPath();
    ctx.moveTo(156.0, 455.7);
    ctx.bezierCurveTo(112.3, 448.1, 70.9, 430.0, 40.8, 398.2);
    ctx.bezierCurveTo(-13.4, 340.9, -12.6, 253.8, 37.4, 194.4);
    ctx.bezierCurveTo(100.0, 120.1, 222.2, 69.0, 311.9, 120.3);
    ctx.bezierCurveTo(394.7, 167.7, 433.0, 283.0, 379.3, 365.7);
    ctx.bezierCurveTo(357.4, 399.3, 303.4, 447.3, 262.5, 454.9);
    ctx.bezierCurveTo(228.8, 461.1, 191.7, 462.0, 156.0, 455.7);
    ctx.lineTo(156.0, 455.7);
    ctx.closePath();
    ctx.fillStyle = corMuda;  //"rgb(190, 30, 45)"
    ctx.fill();

    // ameixa/Group/olhos

    // ameixa/Group/olhos/olho2
    ctx.save();

    // ameixa/Group/olhos/olho2/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(170.3, 302.3);
    ctx.bezierCurveTo(170.3, 324.7, 157.1, 342.9, 140.8, 342.9);
    ctx.bezierCurveTo(124.4, 342.9, 111.2, 324.7, 111.2, 302.3);
    ctx.bezierCurveTo(111.2, 279.8, 124.4, 261.6, 140.8, 261.6);
    ctx.bezierCurveTo(157.1, 261.6, 170.3, 279.8, 170.3, 302.3);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // ameixa/Group/olhos/olho2/Clip Group

    // ameixa/Group/olhos/olho2/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(170.3, 302.3);
    ctx.bezierCurveTo(170.3, 324.7, 157.1, 342.9, 140.8, 342.9);
    ctx.bezierCurveTo(124.4, 342.9, 111.2, 324.7, 111.2, 302.3);
    ctx.bezierCurveTo(111.2, 279.8, 124.4, 261.6, 140.8, 261.6);
    ctx.bezierCurveTo(157.1, 261.6, 170.3, 279.8, 170.3, 302.3);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();


    // ameixa/Group/olhos/olho2/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(172.8, 326.0);
    ctx.bezierCurveTo(172.8, 344.5, 163.4, 359.5, 151.9, 359.5);
    ctx.bezierCurveTo(140.3, 359.5, 130.9, 344.5, 130.9, 326.0);
    ctx.bezierCurveTo(130.9, 307.5, 140.3, 292.5, 151.9, 292.5);
    ctx.bezierCurveTo(163.4, 292.5, 172.8, 307.5, 172.8, 326.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();


    // ameixa/Group/olhos/olho1
    ctx.restore();
    ctx.restore();

    // ameixa/Group/olhos/olho1/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(300.0, 300.2);
    ctx.bezierCurveTo(300.0, 322.7, 286.8, 340.9, 270.4, 340.9);
    ctx.bezierCurveTo(254.1, 340.9, 240.9, 322.7, 240.9, 300.2);
    ctx.bezierCurveTo(240.9, 277.7, 254.1, 259.5, 270.4, 259.5);
    ctx.bezierCurveTo(286.8, 259.5, 300.0, 277.7, 300.0, 300.2);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // ameixa/Group/olhos/olho1/Clip Group

    // ameixa/Group/olhos/olho1/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(300.0, 300.2);
    ctx.bezierCurveTo(300.0, 322.7, 286.8, 340.9, 270.4, 340.9);
    ctx.bezierCurveTo(254.1, 340.9, 240.9, 322.7, 240.9, 300.2);
    ctx.bezierCurveTo(240.9, 277.7, 254.1, 259.5, 270.4, 259.5);
    ctx.bezierCurveTo(286.8, 259.5, 300.0, 277.7, 300.0, 300.2);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // ameixa/Group/olhos/olho1/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(302.5, 323.9);
    ctx.bezierCurveTo(302.5, 342.4, 293.1, 357.4, 281.5, 357.4);
    ctx.bezierCurveTo(270.0, 357.4, 260.6, 342.4, 260.6, 323.9);
    ctx.bezierCurveTo(260.6, 305.4, 270.0, 290.4, 281.5, 290.4);
    ctx.bezierCurveTo(293.1, 290.4, 302.5, 305.4, 302.5, 323.9);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // ameixa/Group/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(179.9, 380.5);
    ctx.bezierCurveTo(194.0, 394.4, 216.7, 394.2, 230.5, 380.1);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgb(112, 21, 40)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

function desenhaAnanas(ctx) {

    // ananas/ananas
    ctx.save();

    // ananas/ananas/folhas
    ctx.save();

    // ananas/ananas/folhas/folhas2
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(174.8, 114.8);
    ctx.bezierCurveTo(167.8, 93.6, 217.2, 40.6, 217.2, 40.6);
    ctx.bezierCurveTo(211.9, 28.3, 146.9, 64.4, 141.3, 81.2);
    ctx.bezierCurveTo(139.5, 86.5, 153.6, 19.4, 127.1, 15.0);
    ctx.bezierCurveTo(127.1, 15.0, 109.5, 39.7, 104.2, 94.5);
    ctx.bezierCurveTo(101.9, 118.4, 107.7, 12.4, 53.0, 0.0);
    ctx.lineTo(60.0, 92.7);
    ctx.bezierCurveTo(19.4, 60.9, 0.0, 64.5, 0.0, 64.5);
    ctx.bezierCurveTo(0.0, 64.5, 40.6, 109.5, 56.5, 146.6);
    ctx.lineTo(174.8, 114.8);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // ananas/ananas/folhas/folhas1
    ctx.beginPath();
    ctx.moveTo(72.4, 189.8);
    ctx.lineTo(7.1, 126.3);
    ctx.bezierCurveTo(12.4, 113.9, 70.3, 127.1, 75.9, 143.9);
    ctx.bezierCurveTo(77.7, 149.2, 58.3, 68.0, 83.0, 45.0);
    ctx.bezierCurveTo(83.0, 45.0, 100.7, 69.8, 105.9, 124.5);
    ctx.bezierCurveTo(108.3, 148.4, 118.3, 68.0, 173.1, 55.6);
    ctx.lineTo(150.1, 122.7);
    ctx.bezierCurveTo(190.7, 90.9, 210.1, 94.5, 210.1, 94.5);
    ctx.bezierCurveTo(210.1, 94.5, 173.1, 135.1, 157.2, 172.2);
    ctx.lineTo(72.4, 189.8);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // ananas/ananas/corpo
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(215.4, 385.0);
    ctx.bezierCurveTo(215.4, 424.5, 202.0, 458.2, 162.5, 458.2);
    ctx.lineTo(79.5, 460.0);
    ctx.bezierCurveTo(40.0, 460.0, 14.1, 424.5, 14.1, 385.0);
    ctx.lineTo(8.8, 258.7);
    ctx.bezierCurveTo(8.8, 219.2, 43.5, 168.6, 83.0, 168.6);
    ctx.lineTo(139.5, 163.3);
    ctx.bezierCurveTo(179.0, 163.3, 211.9, 213.9, 211.9, 253.4);
    ctx.lineTo(215.4, 385.0);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(248, 179, 24)";
    ctx.fill();

    // ananas/ananas/corpo2

    // ananas/ananas/corpo2/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(49.9, 257.7);
    ctx.lineTo(38.0, 239.9);
    ctx.lineTo(59.4, 238.5);
    ctx.lineTo(49.9, 257.7);
    ctx.closePath();
    ctx.fillStyle = "rgb(243, 136, 31)";
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(67.6, 216.2);
    ctx.lineTo(55.6, 198.4);
    ctx.lineTo(77.0, 197.0);
    ctx.lineTo(67.6, 216.2);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(102.4, 267.5);
    ctx.lineTo(90.5, 249.7);
    ctx.lineTo(111.9, 248.3);
    ctx.lineTo(102.4, 267.5);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(109.1, 236.6);
    ctx.lineTo(97.1, 218.7);
    ctx.lineTo(118.5, 217.3);
    ctx.lineTo(109.1, 236.6);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(144.4, 269.2);
    ctx.lineTo(132.5, 251.4);
    ctx.lineTo(153.9, 250.0);
    ctx.lineTo(144.4, 269.2);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(186.8, 245.4);
    ctx.lineTo(174.8, 227.6);
    ctx.lineTo(196.2, 226.1);
    ctx.lineTo(186.8, 245.4);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(110.0, 202.1);
    ctx.lineTo(98.0, 184.3);
    ctx.lineTo(119.4, 182.9);
    ctx.lineTo(110.0, 202.1);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(148.8, 207.4);
    ctx.lineTo(136.9, 189.6);
    ctx.lineTo(158.3, 188.2);
    ctx.lineTo(148.8, 207.4);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(56.1, 430.8);
    ctx.lineTo(44.2, 413.0);
    ctx.lineTo(65.6, 411.5);
    ctx.lineTo(56.1, 430.8);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(119.7, 306.3);
    ctx.lineTo(107.7, 288.5);
    ctx.lineTo(129.1, 287.0);
    ctx.lineTo(119.7, 306.3);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(104.7, 437.0);
    ctx.lineTo(92.7, 419.1);
    ctx.lineTo(114.1, 417.7);
    ctx.lineTo(104.7, 437.0);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(150.6, 442.3);
    ctx.lineTo(138.6, 424.4);
    ctx.lineTo(160.0, 423.0);
    ctx.lineTo(150.6, 442.3);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(180.6, 407.8);
    ctx.lineTo(168.7, 390.0);
    ctx.lineTo(190.1, 388.6);
    ctx.lineTo(180.6, 407.8);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(45.5, 399.9);
    ctx.lineTo(33.6, 382.1);
    ctx.lineTo(55.0, 380.6);
    ctx.lineTo(45.5, 399.9);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(155.0, 380.5);
    ctx.lineTo(143.0, 362.6);
    ctx.lineTo(164.5, 361.2);
    ctx.lineTo(155.0, 380.5);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(37.5, 303.0);
    ctx.lineTo(25.6, 285.2);
    ctx.lineTo(47.0, 283.8);
    ctx.lineTo(37.5, 303.0);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(186.8, 348.0);
    ctx.lineTo(174.8, 330.2);
    ctx.lineTo(196.2, 328.8);
    ctx.lineTo(186.8, 348.0);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(94.9, 382.5);
    ctx.lineTo(83.0, 364.6);
    ctx.lineTo(104.4, 363.2);
    ctx.lineTo(94.9, 382.5);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(170.9, 292.4);
    ctx.lineTo(158.9, 274.6);
    ctx.lineTo(180.3, 273.2);
    ctx.lineTo(170.9, 292.4);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(44.6, 355.1);
    ctx.lineTo(32.7, 337.3);
    ctx.lineTo(54.1, 335.8);
    ctx.lineTo(44.6, 355.1);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/corpo2/Path
    ctx.beginPath();
    ctx.moveTo(145.3, 265.0);
    ctx.lineTo(133.3, 247.2);
    ctx.lineTo(154.7, 245.8);
    ctx.lineTo(145.3, 265.0);
    ctx.closePath();
    ctx.fill();

    // ananas/ananas/olhos
    ctx.restore();

    // ananas/ananas/olhos/Group
    ctx.save();

    // ananas/ananas/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(98.2, 317.9);
    ctx.bezierCurveTo(98.2, 335.5, 87.9, 349.7, 75.1, 349.7);
    ctx.bezierCurveTo(62.3, 349.7, 52.0, 335.5, 52.0, 317.9);
    ctx.bezierCurveTo(52.0, 300.3, 62.3, 286.1, 75.1, 286.1);
    ctx.bezierCurveTo(87.9, 286.1, 98.2, 300.3, 98.2, 317.9);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // ananas/ananas/olhos/Group/Clip Group

    // ananas/ananas/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(98.2, 317.9);
    ctx.bezierCurveTo(98.2, 335.5, 87.9, 349.7, 75.1, 349.7);
    ctx.bezierCurveTo(62.3, 349.7, 52.0, 335.5, 52.0, 317.9);
    ctx.bezierCurveTo(52.0, 300.3, 62.3, 286.1, 75.1, 286.1);
    ctx.bezierCurveTo(87.9, 286.1, 98.2, 300.3, 98.2, 317.9);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();


    // ananas/ananas/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(94.8, 329.8);
    ctx.bezierCurveTo(94.8, 344.2, 87.5, 355.9, 78.4, 355.9);
    ctx.bezierCurveTo(69.4, 355.9, 62.0, 344.2, 62.0, 329.8);
    ctx.bezierCurveTo(62.0, 315.3, 69.4, 303.6, 78.4, 303.6);
    ctx.bezierCurveTo(87.5, 303.6, 94.8, 315.3, 94.8, 329.8);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // ananas/ananas/olhos/Group
    ctx.restore();
    ctx.restore();

    // ananas/ananas/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(184.9, 317.2);
    ctx.bezierCurveTo(184.9, 334.7, 174.6, 349.0, 161.8, 349.0);
    ctx.bezierCurveTo(149.0, 349.0, 138.6, 334.7, 138.6, 317.2);
    ctx.bezierCurveTo(138.6, 299.6, 149.0, 285.3, 161.8, 285.3);
    ctx.bezierCurveTo(174.6, 285.3, 184.9, 299.6, 184.9, 317.2);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // ananas/ananas/olhos/Group/Clip Group

    // ananas/ananas/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(184.9, 317.2);
    ctx.bezierCurveTo(184.9, 334.7, 174.6, 349.0, 161.8, 349.0);
    ctx.bezierCurveTo(149.0, 349.0, 138.6, 334.7, 138.6, 317.2);
    ctx.bezierCurveTo(138.6, 299.6, 149.0, 285.3, 161.8, 285.3);
    ctx.bezierCurveTo(174.6, 285.3, 184.9, 299.6, 184.9, 317.2);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // ananas/ananas/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(173.1, 326.5);
    ctx.bezierCurveTo(173.1, 341.0, 165.8, 352.7, 156.7, 352.7);
    ctx.bezierCurveTo(147.7, 352.7, 140.3, 341.0, 140.3, 326.5);
    ctx.bezierCurveTo(140.3, 312.1, 147.7, 300.4, 156.7, 300.4);
    ctx.bezierCurveTo(165.8, 300.4, 173.1, 312.1, 173.1, 326.5);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // ananas/ananas/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(102.4, 397.3);
    ctx.bezierCurveTo(112.9, 407.5, 129.7, 407.4, 140.0, 396.9);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgb(116, 76, 40)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

function desenhaCenoura(ctx) {

    // cenoura/Group
    ctx.save();

    // cenoura/Group/folhas
    ctx.save();

    // cenoura/Group/folhas/folha2c
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(150.6, 122.6);
    ctx.bezierCurveTo(158.6, 135.9, 142.9, 151.0, 134.1, 163.0);
    ctx.bezierCurveTo(136.6, 163.9, 139.1, 164.9, 141.5, 166.1);
    ctx.bezierCurveTo(160.0, 144.7, 195.1, 116.9, 186.0, 99.9);
    ctx.bezierCurveTo(177.6, 84.2, 158.6, 97.9, 143.5, 116.8);
    ctx.bezierCurveTo(146.1, 117.3, 148.5, 119.1, 150.6, 122.6);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // cenoura/Group/folhas/folha2b
    ctx.beginPath();
    ctx.moveTo(115.4, 147.6);
    ctx.bezierCurveTo(119.6, 135.5, 130.6, 118.3, 140.5, 116.8);
    ctx.bezierCurveTo(158.5, 80.2, 179.8, 30.6, 152.4, 13.8);
    ctx.bezierCurveTo(127.4, -1.5, 113.7, 11.3, 105.9, 34.9);
    ctx.bezierCurveTo(128.3, 52.0, 120.7, 119.6, 115.4, 147.6);
    ctx.closePath();
    ctx.fill();

    // cenoura/Group/folhas/folha2a
    ctx.beginPath();
    ctx.moveTo(88.0, 128.4);
    ctx.bezierCurveTo(82.6, 107.5, 74.7, 82.1, 73.3, 62.5);
    ctx.bezierCurveTo(70.3, 53.2, 66.2, 44.1, 59.5, 35.2);
    ctx.bezierCurveTo(51.1, 24.1, 32.8, 2.2, 17.4, 0.3);
    ctx.bezierCurveTo(-22.2, -4.7, 17.2, 56.7, 24.5, 68.5);
    ctx.bezierCurveTo(40.9, 95.0, 80.5, 128.7, 78.4, 163.1);
    ctx.bezierCurveTo(82.7, 161.7, 87.2, 160.6, 91.8, 159.8);
    ctx.bezierCurveTo(91.5, 149.2, 90.0, 138.8, 88.0, 128.4);
    ctx.closePath();
    ctx.fill();

    // cenoura/Group/folhas/folha1
    ctx.beginPath();

    // cenoura/Group/folhas/folha1/Path
    ctx.moveTo(150.6, 122.6);
    ctx.bezierCurveTo(148.5, 119.1, 146.1, 117.3, 143.5, 116.8);
    ctx.bezierCurveTo(142.5, 116.6, 141.5, 116.6, 140.5, 116.8);
    ctx.bezierCurveTo(130.6, 118.3, 119.6, 135.5, 115.4, 147.6);
    ctx.bezierCurveTo(120.7, 119.6, 128.3, 52.0, 105.9, 34.9);
    ctx.bezierCurveTo(102.5, 32.3, 98.5, 30.9, 93.6, 30.9);
    ctx.bezierCurveTo(76.3, 30.9, 71.9, 44.2, 73.3, 62.5);
    ctx.bezierCurveTo(74.7, 82.1, 82.6, 107.5, 88.0, 128.4);
    ctx.bezierCurveTo(91.4, 141.3, 93.7, 152.5, 93.0, 159.6);
    ctx.bezierCurveTo(93.0, 159.6, 93.1, 159.6, 93.1, 159.6);
    ctx.bezierCurveTo(106.9, 157.6, 121.5, 158.6, 134.1, 163.0);
    ctx.bezierCurveTo(142.9, 151.0, 158.6, 135.9, 150.6, 122.6);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // cenoura/Group/corpo
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(99.9, 148.0);
    ctx.bezierCurveTo(95.2, 148.8, 90.7, 149.9, 86.4, 151.3);
    ctx.bezierCurveTo(74.7, 155.2, 64.6, 161.5, 57.9, 170.2);
    ctx.bezierCurveTo(16.3, 224.3, 43.6, 319.9, 60.7, 378.1);
    ctx.bezierCurveTo(68.4, 404.1, 89.1, 460.6, 127.4, 460.0);
    ctx.bezierCurveTo(152.2, 459.6, 186.1, 214.4, 174.3, 180.8);
    ctx.bezierCurveTo(170.0, 168.6, 160.9, 159.8, 149.5, 154.3);
    ctx.bezierCurveTo(147.1, 153.1, 144.7, 152.1, 142.1, 151.2);
    ctx.bezierCurveTo(129.5, 146.8, 114.9, 145.8, 101.1, 147.8);
    ctx.fillStyle = corMuda; //"rgb(244, 125, 42)";
    ctx.fill();

    // cenoura/Group/olhos

    // cenoura/Group/olhos/olho2
    ctx.save();

    // cenoura/Group/olhos/olho2/olho2a
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(83.1, 239.2);
    ctx.bezierCurveTo(83.1, 254.5, 74.0, 267.0, 62.9, 267.0);
    ctx.bezierCurveTo(51.7, 267.0, 42.7, 254.5, 42.7, 239.2);
    ctx.bezierCurveTo(42.7, 223.9, 51.7, 211.4, 62.9, 211.4);
    ctx.bezierCurveTo(74.0, 211.4, 83.1, 223.9, 83.1, 239.2);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // cenoura/Group/olhos/olho2/olho2b

    // cenoura/Group/olhos/olho2/olho2b/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(83.1, 239.2);
    ctx.bezierCurveTo(83.1, 254.5, 74.0, 267.0, 62.9, 267.0);
    ctx.bezierCurveTo(51.7, 267.0, 42.7, 254.5, 42.7, 239.2);
    ctx.bezierCurveTo(42.7, 223.9, 51.7, 211.4, 62.9, 211.4);
    ctx.bezierCurveTo(74.0, 211.4, 83.1, 223.9, 83.1, 239.2);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // cenoura/Group/olhos/olho2/olho2b/Path
    ctx.beginPath();
    ctx.moveTo(84.7, 255.4);
    ctx.bezierCurveTo(84.7, 268.0, 78.3, 278.2, 70.4, 278.2);
    ctx.bezierCurveTo(62.5, 278.2, 56.1, 268.0, 56.1, 255.4);
    ctx.bezierCurveTo(56.1, 242.8, 62.5, 232.5, 70.4, 232.5);
    ctx.bezierCurveTo(78.3, 232.5, 84.7, 242.8, 84.7, 255.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // cenoura/Group/olhos/olho
    ctx.restore();
    ctx.restore();

    // cenoura/Group/olhos/olho/olhoa
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(171.6, 238.8);
    ctx.bezierCurveTo(171.6, 254.2, 162.5, 266.6, 151.4, 266.6);
    ctx.bezierCurveTo(140.2, 266.6, 131.2, 254.2, 131.2, 238.8);
    ctx.bezierCurveTo(131.2, 223.5, 140.2, 211.1, 151.4, 211.1);
    ctx.bezierCurveTo(162.5, 211.1, 171.6, 223.5, 171.6, 238.8);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // cenoura/Group/olhos/olho/olhob

    // cenoura/Group/olhos/olho/olhob/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(171.6, 238.8);
    ctx.bezierCurveTo(171.6, 254.2, 162.5, 266.6, 151.4, 266.6);
    ctx.bezierCurveTo(140.2, 266.6, 131.2, 254.2, 131.2, 238.8);
    ctx.bezierCurveTo(131.2, 223.5, 140.2, 211.1, 151.4, 211.1);
    ctx.bezierCurveTo(162.5, 211.1, 171.6, 223.5, 171.6, 238.8);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // cenoura/Group/olhos/olho/olhob/Path
    ctx.beginPath();
    ctx.moveTo(173.2, 255.0);
    ctx.bezierCurveTo(173.2, 267.6, 166.8, 277.9, 158.9, 277.9);
    ctx.bezierCurveTo(151.0, 277.9, 144.6, 267.6, 144.6, 255.0);
    ctx.bezierCurveTo(144.6, 242.4, 151.0, 232.2, 158.9, 232.2);
    ctx.bezierCurveTo(166.8, 232.2, 173.2, 242.4, 173.2, 255.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // cenoura/Group/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(89.2, 296.8);
    ctx.bezierCurveTo(98.7, 306.1, 113.9, 306.0, 123.2, 296.5);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgb(121, 76, 57)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // cenoura/Group/oculos

    // cenoura/Group/oculos/lenteb
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(102.2, 238.1);
    ctx.bezierCurveTo(102.2, 258.4, 83.5, 275.0, 60.4, 275.0);
    ctx.bezierCurveTo(37.3, 275.0, 18.6, 262.3, 18.6, 242.0);
    ctx.bezierCurveTo(18.6, 221.6, 37.3, 201.1, 60.4, 201.1);
    ctx.bezierCurveTo(83.5, 201.1, 102.2, 217.7, 102.2, 238.1);
    ctx.closePath();
    ctx.lineWidth = 5.7;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10.0;
    ctx.stroke();

    // cenoura/Group/oculos/lentea
    ctx.beginPath();
    ctx.moveTo(199.1, 237.3);
    ctx.bezierCurveTo(199.1, 257.7, 181.0, 277.0, 157.9, 277.0);
    ctx.bezierCurveTo(134.8, 277.0, 116.1, 260.5, 116.1, 240.1);
    ctx.bezierCurveTo(116.1, 219.7, 134.8, 203.2, 157.9, 203.2);
    ctx.bezierCurveTo(181.0, 203.2, 199.1, 216.9, 199.1, 237.3);
    ctx.closePath();
    ctx.stroke();

    // cenoura/Group/oculos/uniao
    ctx.beginPath();
    ctx.moveTo(102.2, 238.1);
    ctx.bezierCurveTo(109.0, 231.3, 113.9, 236.0, 116.1, 240.1);
    ctx.stroke();

    // cenoura/Group/riscas
    ctx.restore();

    // cenoura/Group/riscas/risco4
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(66.0, 394.1);
    ctx.bezierCurveTo(66.0, 394.1, 77.2, 397.4, 92.0, 396.2);
    ctx.lineWidth = 0.9;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10.0;
    ctx.stroke();

    // cenoura/Group/riscas/risco3
    ctx.beginPath();
    ctx.moveTo(144.1, 431.2);
    ctx.bezierCurveTo(144.1, 431.2, 123.6, 431.5, 116.5, 428.3);
    ctx.stroke();

    // cenoura/Group/riscas/risco2
    ctx.beginPath();
    ctx.moveTo(47.7, 331.5);
    ctx.bezierCurveTo(47.7, 331.5, 59.8, 334.1, 74.0, 329.5);
    ctx.stroke();

    // cenoura/Group/riscas/risco1
    ctx.beginPath();
    ctx.moveTo(161.8, 351.3);
    ctx.bezierCurveTo(161.8, 351.3, 141.5, 355.9, 134.1, 351.3);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.restore();
}

function desenhaCereja(ctx) {

    // cereja/cereja
    ctx.save();

    // cereja/cereja/caule
    ctx.save();

    // cereja/cereja/caule/caule
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(140.4, 82.4);
    ctx.bezierCurveTo(139.8, 79.6, 139.3, 76.8, 139.0, 74.0);
    ctx.bezierCurveTo(142.7, 56.4, 140.5, 40.4, 141.2, 22.7);
    ctx.bezierCurveTo(141.6, 14.1, 148.2, 7.7, 141.6, 2.0);
    ctx.bezierCurveTo(136.4, -2.4, 118.7, 1.2, 114.6, 5.9);
    ctx.bezierCurveTo(107.6, 13.9, 118.8, 22.0, 121.6, 29.9);
    ctx.bezierCurveTo(126.7, 44.4, 125.7, 64.2, 124.3, 79.2);
    ctx.bezierCurveTo(124.1, 81.9, 126.1, 83.7, 128.2, 84.0);
    ctx.bezierCurveTo(128.6, 87.1, 132.1, 88.1, 134.6, 86.7);
    ctx.bezierCurveTo(137.5, 87.8, 141.3, 86.2, 140.4, 82.4);
    ctx.lineTo(140.4, 82.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(114, 82, 46)";
    ctx.fill();

    // cereja/cereja/caule/caule
    ctx.beginPath();
    ctx.moveTo(275.0, 259.0);
    ctx.bezierCurveTo(244.9, 237.1, 216.9, 207.5, 189.4, 168.4);
    ctx.bezierCurveTo(160.6, 127.7, 143.0, 90.5, 135.6, 54.9);
    ctx.bezierCurveTo(134.7, 50.7, 131.2, 49.3, 128.3, 49.9);
    ctx.bezierCurveTo(125.4, 50.5, 122.5, 53.3, 122.8, 57.3);
    ctx.bezierCurveTo(126.9, 110.8, 115.2, 163.9, 103.9, 215.3);
    ctx.bezierCurveTo(95.9, 251.7, 87.6, 289.5, 85.0, 327.2);
    ctx.bezierCurveTo(84.8, 329.2, 85.5, 331.1, 87.0, 332.3);
    ctx.bezierCurveTo(88.5, 333.7, 90.8, 334.3, 92.9, 333.8);
    ctx.bezierCurveTo(95.8, 333.2, 97.7, 331.0, 98.0, 328.1);
    ctx.bezierCurveTo(100.6, 290.3, 108.8, 252.4, 116.8, 215.9);
    ctx.bezierCurveTo(125.0, 177.9, 133.5, 138.8, 135.9, 99.5);
    ctx.bezierCurveTo(145.4, 122.8, 159.0, 147.3, 177.4, 174.0);
    ctx.bezierCurveTo(205.1, 214.1, 235.4, 246.3, 267.7, 269.8);
    ctx.bezierCurveTo(269.2, 270.8, 270.8, 271.2, 272.5, 270.9);
    ctx.bezierCurveTo(274.9, 270.4, 277.0, 268.3, 277.6, 265.6);
    ctx.bezierCurveTo(278.1, 263.0, 277.2, 260.6, 275.0, 259.0);
    ctx.lineTo(275.0, 259.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // cereja/cereja/folha
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(181.1, 91.6);
    ctx.bezierCurveTo(194.0, 106.3, 238.2, 143.5, 201.3, 155.8);
    ctx.bezierCurveTo(159.8, 169.5, 125.5, 124.0, 123.0, 86.3);
    ctx.bezierCurveTo(122.3, 75.3, 124.6, 53.0, 139.0, 51.1);
    ctx.bezierCurveTo(156.0, 48.8, 171.8, 81.1, 181.1, 91.6);
    ctx.lineTo(181.1, 91.6);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // cereja/cereja/cereja2

    // cereja/cereja/cereja2/corpo
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(249.6, 420.1);
    ctx.bezierCurveTo(198.2, 400.7, 184.3, 341.8, 200.6, 293.3);
    ctx.bezierCurveTo(208.7, 268.9, 228.1, 252.3, 251.7, 245.4);
    ctx.bezierCurveTo(299.9, 231.4, 370.1, 257.0, 377.9, 316.0);
    ctx.bezierCurveTo(388.1, 393.7, 328.3, 442.4, 257.5, 422.7);
    ctx.bezierCurveTo(254.8, 422.0, 252.2, 421.1, 249.6, 420.1);
    ctx.lineTo(249.6, 420.1);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(190, 30, 45)";
    ctx.fill();

    // cereja/cereja/cereja2/olhos

    // cereja/cereja/cereja2/olhos/Group
    ctx.save();

    // cereja/cereja/cereja2/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(308.5, 300.0);
    ctx.bezierCurveTo(308.5, 318.1, 297.9, 332.7, 284.7, 332.7);
    ctx.bezierCurveTo(271.6, 332.7, 260.9, 318.1, 260.9, 300.0);
    ctx.bezierCurveTo(260.9, 281.9, 271.6, 267.3, 284.7, 267.3);
    ctx.bezierCurveTo(297.9, 267.3, 308.5, 281.9, 308.5, 300.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // cereja/cereja/cereja2/olhos/Group/Clip Group

    // cereja/cereja/cereja2/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(308.5, 300.0);
    ctx.bezierCurveTo(308.5, 318.1, 297.9, 332.7, 284.7, 332.7);
    ctx.bezierCurveTo(271.6, 332.7, 260.9, 318.1, 260.9, 300.0);
    ctx.bezierCurveTo(260.9, 281.9, 271.6, 267.3, 284.7, 267.3);
    ctx.bezierCurveTo(297.9, 267.3, 308.5, 281.9, 308.5, 300.0);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // cereja/cereja/cereja2/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(291.1, 310.2);
    ctx.bezierCurveTo(291.1, 325.1, 283.5, 337.1, 274.2, 337.1);
    ctx.bezierCurveTo(264.9, 337.1, 257.4, 325.1, 257.4, 310.2);
    ctx.bezierCurveTo(257.4, 295.3, 264.9, 283.3, 274.2, 283.3);
    ctx.bezierCurveTo(283.5, 283.3, 291.1, 295.3, 291.1, 310.2);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // cereja/cereja/cereja2/olhos/Group
    ctx.restore();
    ctx.restore();

    // cereja/cereja/cereja2/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(243.7, 301.2);
    ctx.bezierCurveTo(243.7, 319.2, 233.1, 333.9, 219.9, 333.9);
    ctx.bezierCurveTo(206.8, 333.9, 196.1, 319.2, 196.1, 301.2);
    ctx.bezierCurveTo(196.1, 283.1, 206.8, 268.4, 219.9, 268.4);
    ctx.bezierCurveTo(233.1, 268.4, 243.7, 283.1, 243.7, 301.2);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // cereja/cereja/cereja2/olhos/Group/Clip Group

    // cereja/cereja/cereja2/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(243.7, 301.2);
    ctx.bezierCurveTo(243.7, 319.2, 233.1, 333.9, 219.9, 333.9);
    ctx.bezierCurveTo(206.8, 333.9, 196.1, 319.2, 196.1, 301.2);
    ctx.bezierCurveTo(196.1, 283.1, 206.8, 268.4, 219.9, 268.4);
    ctx.bezierCurveTo(233.1, 268.4, 243.7, 283.1, 243.7, 301.2);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // cereja/cereja/cereja2/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(226.3, 311.3);
    ctx.bezierCurveTo(226.3, 326.2, 218.8, 338.3, 209.5, 338.3);
    ctx.bezierCurveTo(200.1, 338.3, 192.6, 326.2, 192.6, 311.3);
    ctx.bezierCurveTo(192.6, 296.5, 200.1, 284.4, 209.5, 284.4);
    ctx.bezierCurveTo(218.8, 284.4, 226.3, 296.5, 226.3, 311.3);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // cereja/cereja/cereja2/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(220.2, 361.3);
    ctx.bezierCurveTo(232.8, 373.7, 253.0, 373.5, 265.4, 360.9);
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(132, 22, 36)";
    ctx.stroke();

    // cereja/cereja/cereja1
    ctx.restore();

    // cereja/cereja/cereja1/corpo
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(146.6, 449.1);
    ctx.bezierCurveTo(183.0, 429.1, 200.6, 384.6, 178.5, 342.6);
    ctx.bezierCurveTo(157.4, 302.7, 102.4, 272.5, 56.5, 288.6);
    ctx.bezierCurveTo(11.6, 304.3, -10.6, 353.1, 4.9, 396.3);
    ctx.bezierCurveTo(21.3, 442.0, 74.7, 466.7, 120.1, 458.4);
    ctx.bezierCurveTo(129.7, 456.7, 138.6, 453.4, 146.6, 449.1);
    ctx.lineTo(146.6, 449.1);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(190, 30, 45)";
    ctx.fill();

    // cereja/cereja/cereja1/boca
    ctx.beginPath();
    ctx.moveTo(101.7, 407.6);
    ctx.bezierCurveTo(114.3, 420.0, 134.5, 419.8, 146.9, 407.2);
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(132, 22, 36)";
    ctx.stroke();

    // cereja/cereja/cereja1/olhos

    // cereja/cereja/cereja1/olhos/Group
    ctx.save();

    // cereja/cereja/cereja1/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(177.0, 345.5);
    ctx.bezierCurveTo(177.0, 327.5, 166.4, 312.8, 153.2, 312.8);
    ctx.bezierCurveTo(140.1, 312.8, 129.4, 327.5, 129.4, 345.5);
    ctx.bezierCurveTo(129.4, 363.6, 140.1, 378.2, 153.2, 378.2);
    ctx.bezierCurveTo(166.4, 378.2, 177.0, 363.6, 177.0, 345.5);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // cereja/cereja/cereja1/olhos/Group/Clip Group

    // cereja/cereja/cereja1/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(177.0, 345.5);
    ctx.bezierCurveTo(177.0, 327.5, 166.4, 312.8, 153.2, 312.8);
    ctx.bezierCurveTo(140.1, 312.8, 129.4, 327.5, 129.4, 345.5);
    ctx.bezierCurveTo(129.4, 363.6, 140.1, 378.2, 153.2, 378.2);
    ctx.bezierCurveTo(166.4, 378.2, 177.0, 363.6, 177.0, 345.5);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // cereja/cereja/cereja1/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(180.1, 339.0);
    ctx.bezierCurveTo(180.1, 324.2, 172.6, 312.1, 163.3, 312.1);
    ctx.bezierCurveTo(154.0, 312.1, 146.4, 324.2, 146.4, 339.0);
    ctx.bezierCurveTo(146.4, 353.9, 154.0, 366.0, 163.3, 366.0);
    ctx.bezierCurveTo(172.6, 366.0, 180.1, 353.9, 180.1, 339.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // cereja/cereja/cereja1/olhos/Group
    ctx.restore();
    ctx.restore();

    // cereja/cereja/cereja1/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(113.0, 344.1);
    ctx.bezierCurveTo(113.0, 326.0, 102.3, 311.4, 89.2, 311.4);
    ctx.bezierCurveTo(76.0, 311.4, 65.4, 326.0, 65.4, 344.1);
    ctx.bezierCurveTo(65.4, 362.1, 76.0, 376.8, 89.2, 376.8);
    ctx.bezierCurveTo(102.3, 376.8, 113.0, 362.1, 113.0, 344.1);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // cereja/cereja/cereja1/olhos/Group/Clip Group

    // cereja/cereja/cereja1/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(113.0, 344.1);
    ctx.bezierCurveTo(113.0, 326.0, 102.3, 311.4, 89.2, 311.4);
    ctx.bezierCurveTo(76.0, 311.4, 65.4, 326.0, 65.4, 344.1);
    ctx.bezierCurveTo(65.4, 362.1, 76.0, 376.8, 89.2, 376.8);
    ctx.bezierCurveTo(102.3, 376.8, 113.0, 362.1, 113.0, 344.1);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // cereja/cereja/cereja1/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(116.1, 337.6);
    ctx.bezierCurveTo(116.1, 322.7, 108.6, 310.7, 99.3, 310.7);
    ctx.bezierCurveTo(90.0, 310.7, 82.4, 322.7, 82.4, 337.6);
    ctx.bezierCurveTo(82.4, 352.5, 90.0, 364.5, 99.3, 364.5);
    ctx.bezierCurveTo(108.6, 364.5, 116.1, 352.5, 116.1, 337.6);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.restore();
}

function desenhaLaranja(ctx) {

    // laranja/laranja
    ctx.save();

    // laranja/laranja/folhas
    ctx.save();

    // laranja/laranja/folhas/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(157.5, 96.6);
    ctx.bezierCurveTo(157.5, 96.6, 145.6, 38.4, 102.6, 10.6);
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(31, 161, 72)";
    ctx.stroke();

    // laranja/laranja/folhas/Path
    ctx.beginPath();
    ctx.moveTo(206.4, 95.1);
    ctx.bezierCurveTo(206.4, 95.1, 212.4, 52.1, 248.0, 37.3);
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = "rgb(56, 180, 73)";
    ctx.stroke();

    // laranja/laranja/folhas/Path
    ctx.beginPath();
    ctx.moveTo(115.4, 0.7);
    ctx.bezierCurveTo(78.9, 7.2, 77.2, 38.4, 88.1, 64.4);
    ctx.bezierCurveTo(108.4, 112.6, 185.8, 116.0, 185.8, 116.0);
    ctx.bezierCurveTo(190.9, 97.1, 172.0, -9.5, 115.4, 0.7);
    ctx.lineTo(115.4, 0.7);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // laranja/laranja/folhas/Path
    ctx.beginPath();
    ctx.moveTo(240.6, 22.4);
    ctx.bezierCurveTo(269.6, 27.6, 270.9, 52.4, 262.2, 73.0);
    ctx.bezierCurveTo(246.1, 111.3, 184.6, 114.1, 184.6, 114.1);
    ctx.bezierCurveTo(180.5, 99.0, 195.5, 14.3, 240.6, 22.4);
    ctx.lineTo(240.6, 22.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // laranja/laranja/corpo
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(0.2, 293.5);
    ctx.bezierCurveTo(-5.0, 177.3, 112.5, 65.5, 232.8, 102.8);
    ctx.bezierCurveTo(318.2, 129.4, 372.7, 215.5, 357.2, 303.8);
    ctx.bezierCurveTo(319.3, 520.4, 9.7, 506.8, 0.2, 293.5);
    ctx.lineTo(0.2, 293.5);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(244, 125, 42)";
    ctx.fill();

    // laranja/laranja/olhos

    // laranja/laranja/olhos/Group
    ctx.save();

    // laranja/laranja/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(160.0, 247.4);
    ctx.bezierCurveTo(160.0, 272.5, 145.3, 292.8, 127.0, 292.8);
    ctx.bezierCurveTo(108.8, 292.8, 94.0, 272.5, 94.0, 247.4);
    ctx.bezierCurveTo(94.0, 222.3, 108.8, 202.0, 127.0, 202.0);
    ctx.bezierCurveTo(145.3, 202.0, 160.0, 222.3, 160.0, 247.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // laranja/laranja/olhos/Group/Clip Group

    // laranja/laranja/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(160.0, 247.4);
    ctx.bezierCurveTo(160.0, 272.5, 145.3, 292.8, 127.0, 292.8);
    ctx.bezierCurveTo(108.8, 292.8, 94.0, 272.5, 94.0, 247.4);
    ctx.bezierCurveTo(94.0, 222.3, 108.8, 202.0, 127.0, 202.0);
    ctx.bezierCurveTo(145.3, 202.0, 160.0, 222.3, 160.0, 247.4);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // laranja/laranja/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(155.2, 264.3);
    ctx.bezierCurveTo(155.2, 284.9, 144.7, 301.7, 131.8, 301.7);
    ctx.bezierCurveTo(118.9, 301.7, 108.4, 284.9, 108.4, 264.3);
    ctx.bezierCurveTo(108.4, 243.7, 118.9, 227.0, 131.8, 227.0);
    ctx.bezierCurveTo(144.7, 227.0, 155.2, 243.7, 155.2, 264.3);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // laranja/laranja/olhos/Group
    ctx.restore();
    ctx.restore();

    // laranja/laranja/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(275.3, 247.4);
    ctx.bezierCurveTo(275.3, 272.5, 260.5, 292.8, 242.3, 292.8);
    ctx.bezierCurveTo(224.1, 292.8, 209.3, 272.5, 209.3, 247.4);
    ctx.bezierCurveTo(209.3, 222.3, 224.1, 202.0, 242.3, 202.0);
    ctx.bezierCurveTo(260.5, 202.0, 275.3, 222.3, 275.3, 247.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // laranja/laranja/olhos/Group/Clip Group

    // laranja/laranja/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(275.3, 247.4);
    ctx.bezierCurveTo(275.3, 272.5, 260.5, 292.8, 242.3, 292.8);
    ctx.bezierCurveTo(224.1, 292.8, 209.3, 272.5, 209.3, 247.4);
    ctx.bezierCurveTo(209.3, 222.3, 224.1, 202.0, 242.3, 202.0);
    ctx.bezierCurveTo(260.5, 202.0, 275.3, 222.3, 275.3, 247.4);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // laranja/laranja/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(258.4, 260.8);
    ctx.bezierCurveTo(258.4, 281.4, 248.0, 298.1, 235.1, 298.1);
    ctx.bezierCurveTo(222.1, 298.1, 211.7, 281.4, 211.7, 260.8);
    ctx.bezierCurveTo(211.7, 240.2, 222.1, 223.4, 235.1, 223.4);
    ctx.bezierCurveTo(248.0, 223.4, 258.4, 240.2, 258.4, 260.8);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // laranja/laranja/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(154.8, 354.3);
    ctx.bezierCurveTo(169.1, 368.4, 192.1, 368.2, 206.2, 353.9);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgb(145, 71, 32)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // laranja/laranja/pintas

    // laranja/laranja/pintas/Group
    ctx.save();

    // laranja/laranja/pintas/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(106.1, 349.3);
    ctx.bezierCurveTo(106.1, 350.9, 104.8, 352.2, 103.1, 352.2);
    ctx.bezierCurveTo(101.5, 352.2, 100.2, 350.9, 100.2, 349.3);
    ctx.bezierCurveTo(100.2, 347.7, 101.5, 346.4, 103.1, 346.4);
    ctx.bezierCurveTo(104.8, 346.4, 106.1, 347.7, 106.1, 349.3);
    ctx.closePath();
    ctx.fillStyle = "rgb(145, 71, 32)";
    ctx.fill();

    // laranja/laranja/pintas/Group/Path
    ctx.beginPath();
    ctx.moveTo(81.3, 340.5);
    ctx.bezierCurveTo(81.3, 342.4, 79.7, 344.0, 77.8, 344.0);
    ctx.bezierCurveTo(75.9, 344.0, 74.3, 342.4, 74.3, 340.5);
    ctx.bezierCurveTo(74.3, 338.6, 75.9, 337.0, 77.8, 337.0);
    ctx.bezierCurveTo(79.7, 337.0, 81.3, 338.6, 81.3, 340.5);
    ctx.closePath();
    ctx.fill();

    // laranja/laranja/pintas/Group/Path
    ctx.beginPath();
    ctx.moveTo(94.6, 328.4);
    ctx.bezierCurveTo(94.6, 330.0, 93.2, 331.4, 91.5, 331.4);
    ctx.bezierCurveTo(89.9, 331.4, 88.5, 330.0, 88.5, 328.4);
    ctx.bezierCurveTo(88.5, 326.7, 89.9, 325.3, 91.5, 325.3);
    ctx.bezierCurveTo(93.2, 325.3, 94.6, 326.7, 94.6, 328.4);
    ctx.closePath();
    ctx.fill();

    // laranja/laranja/pintas/Group
    ctx.restore();

    // laranja/laranja/pintas/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(278.4, 349.7);
    ctx.bezierCurveTo(278.7, 351.6, 277.5, 353.5, 275.6, 353.8);
    ctx.bezierCurveTo(273.7, 354.2, 271.9, 353.0, 271.5, 351.1);
    ctx.bezierCurveTo(271.1, 349.2, 272.4, 347.3, 274.3, 346.9);
    ctx.bezierCurveTo(276.2, 346.6, 278.0, 347.8, 278.4, 349.7);
    ctx.closePath();
    ctx.fillStyle = "rgb(145, 71, 32)";
    ctx.fill();

    // laranja/laranja/pintas/Group/Path
    ctx.beginPath();
    ctx.moveTo(255.2, 347.2);
    ctx.bezierCurveTo(255.5, 348.7, 254.5, 350.2, 253.0, 350.5);
    ctx.bezierCurveTo(251.5, 350.7, 250.1, 349.8, 249.8, 348.3);
    ctx.bezierCurveTo(249.5, 346.8, 250.5, 345.3, 252.0, 345.0);
    ctx.bezierCurveTo(253.5, 344.7, 254.9, 345.7, 255.2, 347.2);
    ctx.closePath();
    ctx.fill();

    // laranja/laranja/pintas/Group/Path
    ctx.beginPath();
    ctx.moveTo(266.6, 327.5);
    ctx.bezierCurveTo(266.9, 329.1, 265.8, 330.7, 264.2, 331.0);
    ctx.bezierCurveTo(262.6, 331.3, 261.1, 330.3, 260.8, 328.7);
    ctx.bezierCurveTo(260.5, 327.1, 261.5, 325.5, 263.1, 325.2);
    ctx.bezierCurveTo(264.7, 324.9, 266.3, 326.0, 266.6, 327.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.restore();
}

function desenhaMaca(ctx) {

    // ma/ma
    ctx.save();

    // ma/ma/caule
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(177.6, 91.3);
    ctx.bezierCurveTo(178.3, 88.2, 178.7, 85.1, 179.0, 82.0);
    ctx.bezierCurveTo(174.6, 62.6, 176.7, 44.9, 175.6, 25.3);
    ctx.bezierCurveTo(175.1, 15.8, 167.6, 8.9, 174.8, 2.4);
    ctx.bezierCurveTo(180.5, -2.6, 200.2, 1.0, 204.8, 6.1);
    ctx.bezierCurveTo(212.6, 15.0, 200.4, 24.0, 197.5, 32.9);
    ctx.bezierCurveTo(192.1, 49.1, 193.6, 71.0, 195.4, 87.6);
    ctx.bezierCurveTo(195.7, 90.5, 193.5, 92.5, 191.2, 93.0);
    ctx.bezierCurveTo(190.8, 96.3, 186.9, 97.5, 184.2, 96.0);
    ctx.bezierCurveTo(181.0, 97.3, 176.7, 95.6, 177.6, 91.3);
    ctx.lineTo(177.6, 91.3);
    ctx.closePath();
    ctx.fillStyle = "rgb(114, 82, 46)";
    ctx.fill();

    // ma/ma/folha2

    // ma/ma/folha2/folha2
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(178.3, 40.2);
    ctx.bezierCurveTo(178.3, 40.2, 175.7, 71.7, 145.5, 76.8);
    ctx.bezierCurveTo(115.2, 81.8, 87.4, 73.0, 87.4, 73.0);
    ctx.bezierCurveTo(87.4, 73.0, 115.2, 42.7, 130.3, 41.4);
    ctx.bezierCurveTo(145.5, 40.2, 178.3, 40.2, 178.3, 40.2);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // ma/ma/folha2/folha2risco
    ctx.beginPath();
    ctx.moveTo(170.8, 47.8);
    ctx.bezierCurveTo(170.8, 47.8, 145.2, 59.8, 92.8, 72.5);
    ctx.strokeStyle = "rgb(0, 103, 56)";
    ctx.stroke();

    // ma/ma/folha1
    ctx.restore();

    // ma/ma/folha1/folha1
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(192.6, 42.0);
    ctx.bezierCurveTo(192.6, 42.0, 213.2, 66.0, 240.7, 52.2);
    ctx.bezierCurveTo(268.1, 38.4, 285.3, 14.9, 285.3, 14.9);
    ctx.bezierCurveTo(285.3, 14.9, 245.0, 6.8, 232.0, 14.7);
    ctx.bezierCurveTo(219.1, 22.6, 192.6, 42.0, 192.6, 42.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // ma/ma/folha1/folha1risco
    ctx.beginPath();
    ctx.moveTo(192.6, 42.0);
    ctx.bezierCurveTo(192.6, 42.0, 233.7, 44.2, 280.3, 16.8);
    ctx.strokeStyle = "rgb(0, 103, 56)";
    ctx.stroke();

    // ma/ma/corpo
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(155.1, 455.5);
    ctx.bezierCurveTo(108.7, 447.4, 64.7, 428.1, 32.7, 394.4);
    ctx.bezierCurveTo(-24.9, 333.5, 0.8, 212.3, 53.9, 149.2);
    ctx.bezierCurveTo(120.5, 70.4, 219.9, 69.1, 315.0, 123.6);
    ctx.bezierCurveTo(403.0, 173.9, 418.6, 285.5, 371.7, 364.3);
    ctx.bezierCurveTo(349.9, 400.9, 311.6, 446.5, 268.1, 454.6);
    ctx.bezierCurveTo(232.4, 461.2, 193.0, 462.1, 155.1, 455.5);
    ctx.lineTo(155.1, 455.5);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(140, 198, 62)";
    ctx.fill();

    // ma/ma/olhos

    // ma/ma/olhos/olho2
    ctx.save();

    // ma/ma/olhos/olho2/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(170.3, 292.5);
    ctx.bezierCurveTo(170.3, 316.3, 156.2, 335.7, 138.9, 335.7);
    ctx.bezierCurveTo(121.5, 335.7, 107.4, 316.3, 107.4, 292.5);
    ctx.bezierCurveTo(107.4, 268.6, 121.5, 249.3, 138.9, 249.3);
    ctx.bezierCurveTo(156.2, 249.3, 170.3, 268.6, 170.3, 292.5);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // ma/ma/olhos/olho2/Clip Group

    // ma/ma/olhos/olho2/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(170.3, 292.5);
    ctx.bezierCurveTo(170.3, 316.3, 156.2, 335.7, 138.9, 335.7);
    ctx.bezierCurveTo(121.5, 335.7, 107.4, 316.3, 107.4, 292.5);
    ctx.bezierCurveTo(107.4, 268.6, 121.5, 249.3, 138.9, 249.3);
    ctx.bezierCurveTo(156.2, 249.3, 170.3, 268.6, 170.3, 292.5);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // ma/ma/olhos/olho2/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(162.3, 317.7);
    ctx.bezierCurveTo(162.3, 337.3, 152.3, 353.2, 140.0, 353.2);
    ctx.bezierCurveTo(127.7, 353.2, 117.8, 337.3, 117.8, 317.7);
    ctx.bezierCurveTo(117.8, 298.1, 127.7, 282.1, 140.0, 282.1);
    ctx.bezierCurveTo(152.3, 282.1, 162.3, 298.1, 162.3, 317.7);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // ma/ma/olhos/olho1
    ctx.restore();
    ctx.restore();

    // ma/ma/olhos/olho1/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(308.0, 290.3);
    ctx.bezierCurveTo(308.0, 314.1, 293.9, 333.5, 276.6, 333.5);
    ctx.bezierCurveTo(259.2, 333.5, 245.2, 314.1, 245.2, 290.3);
    ctx.bezierCurveTo(245.2, 266.4, 259.2, 247.1, 276.6, 247.1);
    ctx.bezierCurveTo(293.9, 247.1, 308.0, 266.4, 308.0, 290.3);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // ma/ma/olhos/olho1/Clip Group

    // ma/ma/olhos/olho1/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(308.0, 290.3);
    ctx.bezierCurveTo(308.0, 314.1, 293.9, 333.5, 276.6, 333.5);
    ctx.bezierCurveTo(259.2, 333.5, 245.2, 314.1, 245.2, 290.3);
    ctx.bezierCurveTo(245.2, 266.4, 259.2, 247.1, 276.6, 247.1);
    ctx.bezierCurveTo(293.9, 247.1, 308.0, 266.4, 308.0, 290.3);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // ma/ma/olhos/olho1/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(300.0, 315.5);
    ctx.bezierCurveTo(300.0, 335.1, 290.0, 351.0, 277.8, 351.0);
    ctx.bezierCurveTo(265.5, 351.0, 255.5, 335.1, 255.5, 315.5);
    ctx.bezierCurveTo(255.5, 295.8, 265.5, 279.9, 277.8, 279.9);
    ctx.bezierCurveTo(290.0, 279.9, 300.0, 295.8, 300.0, 315.5);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // ma/ma/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(180.5, 375.6);
    ctx.bezierCurveTo(195.4, 390.3, 219.5, 390.1, 234.2, 375.2);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgb(0, 147, 68)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

function desenhaMirtilo(ctx) {

    // mirtilo/mirtilo
    ctx.save();

    // mirtilo/mirtilo/folhas
    ctx.save();

    // mirtilo/mirtilo/folhas/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(106.6, 12.1);
    ctx.bezierCurveTo(93.1, 14.6, 92.5, 26.1, 96.5, 35.7);
    ctx.bezierCurveTo(104.0, 53.6, 132.7, 54.8, 132.7, 54.8);
    ctx.bezierCurveTo(134.6, 47.8, 127.6, 8.4, 106.6, 12.1);
    ctx.lineTo(106.6, 12.1);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // mirtilo/mirtilo/folhas/Path
    ctx.beginPath();
    ctx.moveTo(163.9, 0.3);
    ctx.bezierCurveTo(180.8, 3.3, 181.5, 17.7, 176.5, 29.7);
    ctx.bezierCurveTo(167.1, 51.9, 131.5, 53.5, 131.5, 53.5);
    ctx.bezierCurveTo(129.1, 44.7, 137.8, -4.4, 163.9, 0.3);
    ctx.lineTo(163.9, 0.3);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // mirtilo/mirtilo/corpo
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(0.1, 181.3);
    ctx.bezierCurveTo(-3.6, 98.5, 80.1, 18.8, 165.9, 45.5);
    ctx.bezierCurveTo(226.8, 64.4, 265.6, 125.7, 254.6, 188.7);
    ctx.bezierCurveTo(227.5, 343.0, 6.9, 333.4, 0.1, 181.3);
    ctx.lineTo(0.1, 181.3);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(42, 56, 143)";
    ctx.fill();

    // mirtilo/mirtilo/olhos

    // mirtilo/mirtilo/olhos/Group
    ctx.save();

    // mirtilo/mirtilo/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(106.3, 139.1);
    ctx.bezierCurveTo(106.3, 156.9, 95.7, 171.4, 82.8, 171.4);
    ctx.bezierCurveTo(69.8, 171.4, 59.2, 156.9, 59.2, 139.1);
    ctx.bezierCurveTo(59.2, 121.2, 69.8, 106.7, 82.8, 106.7);
    ctx.bezierCurveTo(95.7, 106.7, 106.3, 121.2, 106.3, 139.1);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // mirtilo/mirtilo/olhos/Group/Clip Group

    // mirtilo/mirtilo/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(106.3, 139.1);
    ctx.bezierCurveTo(106.3, 156.9, 95.7, 171.4, 82.8, 171.4);
    ctx.bezierCurveTo(69.8, 171.4, 59.2, 156.9, 59.2, 139.1);
    ctx.bezierCurveTo(59.2, 121.2, 69.8, 106.7, 82.8, 106.7);
    ctx.bezierCurveTo(95.7, 106.7, 106.3, 121.2, 106.3, 139.1);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // mirtilo/mirtilo/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(102.8, 151.1);
    ctx.bezierCurveTo(102.8, 165.8, 95.3, 177.8, 86.1, 177.8);
    ctx.bezierCurveTo(76.9, 177.8, 69.5, 165.8, 69.5, 151.1);
    ctx.bezierCurveTo(69.5, 136.4, 76.9, 124.5, 86.1, 124.5);
    ctx.bezierCurveTo(95.3, 124.5, 102.8, 136.4, 102.8, 151.1);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // mirtilo/mirtilo/olhos/Group
    ctx.restore();
    ctx.restore();

    // mirtilo/mirtilo/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(188.4, 139.1);
    ctx.bezierCurveTo(188.4, 156.9, 177.9, 171.4, 164.9, 171.4);
    ctx.bezierCurveTo(151.9, 171.4, 141.4, 156.9, 141.4, 139.1);
    ctx.bezierCurveTo(141.4, 121.2, 151.9, 106.7, 164.9, 106.7);
    ctx.bezierCurveTo(177.9, 106.7, 188.4, 121.2, 188.4, 139.1);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // mirtilo/mirtilo/olhos/Group/Clip Group

    // mirtilo/mirtilo/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(188.4, 139.1);
    ctx.bezierCurveTo(188.4, 156.9, 177.9, 171.4, 164.9, 171.4);
    ctx.bezierCurveTo(151.9, 171.4, 141.4, 156.9, 141.4, 139.1);
    ctx.bezierCurveTo(141.4, 121.2, 151.9, 106.7, 164.9, 106.7);
    ctx.bezierCurveTo(177.9, 106.7, 188.4, 121.2, 188.4, 139.1);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // mirtilo/mirtilo/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(176.4, 148.6);
    ctx.bezierCurveTo(176.4, 163.3, 168.9, 175.2, 159.7, 175.2);
    ctx.bezierCurveTo(150.5, 175.2, 143.1, 163.3, 143.1, 148.6);
    ctx.bezierCurveTo(143.1, 133.9, 150.5, 122.0, 159.7, 122.0);
    ctx.bezierCurveTo(168.9, 122.0, 176.4, 133.9, 176.4, 148.6);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // mirtilo/mirtilo/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(105.5, 208.3);
    ctx.bezierCurveTo(115.7, 218.4, 132.1, 218.2, 142.1, 208.0);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgb(28, 29, 70)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
    ctx.restore();
}

function desenhaMorango(ctx) {

    // morango/morango
    ctx.save();

    // morango/morango/folhas
    ctx.save();

    // morango/morango/folhas/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(153.9, 178.9);
    ctx.bezierCurveTo(153.9, 178.9, 141.2, -14.8, 76.9, 0.9);
    ctx.bezierCurveTo(39.7, 10.0, 85.7, 54.4, 85.7, 54.4);
    ctx.bezierCurveTo(85.7, 54.4, 59.6, 25.8, 52.9, 43.7);
    ctx.bezierCurveTo(46.3, 61.7, 88.8, 82.8, 88.8, 82.8);
    ctx.bezierCurveTo(88.8, 82.8, 30.4, 73.0, 49.1, 87.2);
    ctx.bezierCurveTo(108.6, 132.3, 153.9, 178.9, 153.9, 178.9);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // morango/morango/folhas/Path
    ctx.beginPath();
    ctx.moveTo(156.1, 172.2);
    ctx.bezierCurveTo(156.1, 172.2, 146.3, 14.5, 195.3, 23.5);
    ctx.bezierCurveTo(223.6, 28.6, 199.8, 55.6, 199.8, 55.6);
    ctx.bezierCurveTo(199.8, 55.6, 213.9, 47.0, 219.9, 62.5);
    ctx.bezierCurveTo(225.9, 78.0, 199.1, 81.2, 199.1, 81.2);
    ctx.bezierCurveTo(199.1, 81.2, 232.3, 78.2, 223.1, 106.1);
    ctx.bezierCurveTo(213.8, 134.0, 156.1, 172.2, 156.1, 172.2);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // morango/morango/corpo
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(151.7, 165.5);
    ctx.bezierCurveTo(151.7, 165.5, -81.1, 104.7, 30.1, 367.9);
    ctx.bezierCurveTo(37.4, 385.1, 91.5, 457.1, 154.2, 459.9);
    ctx.bezierCurveTo(249.9, 464.0, 294.6, 378.3, 316.8, 303.7);
    ctx.bezierCurveTo(376.7, 102.6, 151.7, 165.5, 151.7, 165.5);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(190, 30, 45)";
    ctx.fill();

    // morango/morango/sementes

    // morango/morango/sementes/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(88.4, 187.9);
    ctx.bezierCurveTo(86.4, 193.8, 83.1, 198.0, 81.2, 197.3);
    ctx.bezierCurveTo(79.2, 196.6, 79.3, 191.3, 81.3, 185.4);
    ctx.bezierCurveTo(83.4, 179.5, 86.6, 175.3, 88.6, 176.0);
    ctx.bezierCurveTo(90.5, 176.7, 90.5, 182.0, 88.4, 187.9);
    ctx.closePath();
    ctx.fillStyle = "rgb(252, 185, 95)";
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(26.8, 225.8);
    ctx.bezierCurveTo(25.7, 231.9, 23.2, 236.6, 21.2, 236.3);
    ctx.bezierCurveTo(19.1, 235.9, 18.3, 230.7, 19.4, 224.5);
    ctx.bezierCurveTo(20.5, 218.4, 23.0, 213.7, 25.1, 214.1);
    ctx.bezierCurveTo(27.1, 214.4, 27.9, 219.7, 26.8, 225.8);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(138.3, 238.2);
    ctx.bezierCurveTo(138.1, 244.4, 136.2, 249.4, 134.1, 249.3);
    ctx.bezierCurveTo(132.0, 249.2, 130.6, 244.1, 130.8, 237.9);
    ctx.bezierCurveTo(131.0, 231.7, 132.9, 226.7, 135.0, 226.8);
    ctx.bezierCurveTo(137.1, 226.8, 138.5, 231.9, 138.3, 238.2);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(298.7, 198.1);
    ctx.bezierCurveTo(298.4, 204.3, 296.6, 209.3, 294.5, 209.2);
    ctx.bezierCurveTo(292.4, 209.1, 290.9, 204.0, 291.2, 197.8);
    ctx.bezierCurveTo(291.4, 191.6, 293.3, 186.6, 295.3, 186.7);
    ctx.bezierCurveTo(297.4, 186.7, 298.9, 191.9, 298.7, 198.1);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(70.8, 250.2);
    ctx.bezierCurveTo(72.5, 256.2, 72.4, 261.5, 70.4, 262.1);
    ctx.bezierCurveTo(68.4, 262.7, 65.3, 258.3, 63.6, 252.3);
    ctx.bezierCurveTo(61.8, 246.4, 62.0, 241.0, 63.9, 240.5);
    ctx.bezierCurveTo(65.9, 239.9, 69.0, 244.2, 70.8, 250.2);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(41.1, 329.0);
    ctx.bezierCurveTo(40.8, 335.2, 39.0, 340.2, 36.9, 340.1);
    ctx.bezierCurveTo(34.8, 340.0, 33.3, 334.9, 33.6, 328.7);
    ctx.bezierCurveTo(33.8, 322.5, 35.7, 317.5, 37.7, 317.6);
    ctx.bezierCurveTo(39.8, 317.6, 41.3, 322.7, 41.1, 329.0);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(246.8, 215.6);
    ctx.bezierCurveTo(248.4, 221.6, 248.1, 226.9, 246.1, 227.4);
    ctx.bezierCurveTo(244.1, 228.0, 241.2, 223.5, 239.6, 217.5);
    ctx.bezierCurveTo(238.0, 211.5, 238.3, 206.2, 240.3, 205.6);
    ctx.bezierCurveTo(242.3, 205.1, 245.2, 209.5, 246.8, 215.6);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(297.5, 287.3);
    ctx.bezierCurveTo(297.3, 293.5, 295.4, 298.5, 293.3, 298.4);
    ctx.bezierCurveTo(291.2, 298.4, 289.7, 293.3, 290.0, 287.0);
    ctx.bezierCurveTo(290.2, 280.8, 292.1, 275.8, 294.2, 275.9);
    ctx.bezierCurveTo(296.3, 276.0, 297.7, 281.1, 297.5, 287.3);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(280.3, 256.7);
    ctx.bezierCurveTo(280.4, 263.0, 278.8, 268.0, 276.7, 268.1);
    ctx.bezierCurveTo(274.6, 268.1, 272.9, 263.0, 272.8, 256.8);
    ctx.bezierCurveTo(272.7, 250.6, 274.3, 245.5, 276.4, 245.5);
    ctx.bezierCurveTo(278.5, 245.5, 280.2, 250.5, 280.3, 256.7);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(112.3, 418.8);
    ctx.bezierCurveTo(110.9, 424.9, 108.0, 429.4, 106.0, 428.9);
    ctx.bezierCurveTo(104.0, 428.4, 103.5, 423.1, 105.0, 417.1);
    ctx.bezierCurveTo(106.4, 411.0, 109.3, 406.5, 111.3, 407.0);
    ctx.bezierCurveTo(113.3, 407.5, 113.8, 412.8, 112.3, 418.8);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(273.9, 369.6);
    ctx.bezierCurveTo(273.7, 375.8, 271.8, 380.8, 269.7, 380.7);
    ctx.bezierCurveTo(267.7, 380.6, 266.2, 375.5, 266.4, 369.3);
    ctx.bezierCurveTo(266.6, 363.1, 268.5, 358.1, 270.6, 358.2);
    ctx.bezierCurveTo(272.7, 358.2, 274.2, 363.3, 273.9, 369.6);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(286.8, 320.4);
    ctx.bezierCurveTo(286.5, 326.6, 284.6, 331.6, 282.6, 331.5);
    ctx.bezierCurveTo(280.5, 331.4, 279.0, 326.3, 279.2, 320.1);
    ctx.bezierCurveTo(279.5, 313.9, 281.4, 308.9, 283.4, 309.0);
    ctx.bezierCurveTo(285.5, 309.0, 287.0, 314.1, 286.8, 320.4);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(79.1, 376.9);
    ctx.bezierCurveTo(77.4, 382.9, 74.4, 387.3, 72.4, 386.7);
    ctx.bezierCurveTo(70.4, 386.1, 70.2, 380.8, 71.9, 374.8);
    ctx.bezierCurveTo(73.6, 368.9, 76.6, 364.5, 78.6, 365.0);
    ctx.bezierCurveTo(80.6, 365.6, 80.8, 370.9, 79.1, 376.9);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(231.2, 395.7);
    ctx.bezierCurveTo(230.0, 401.8, 227.4, 406.4, 225.3, 406.0);
    ctx.bezierCurveTo(223.3, 405.6, 222.6, 400.3, 223.8, 394.2);
    ctx.bezierCurveTo(225.1, 388.1, 227.7, 383.5, 229.7, 383.9);
    ctx.bezierCurveTo(231.8, 384.3, 232.4, 389.6, 231.2, 395.7);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(164.9, 297.3);
    ctx.bezierCurveTo(164.7, 303.5, 162.8, 308.5, 160.7, 308.4);
    ctx.bezierCurveTo(158.6, 308.3, 157.1, 303.2, 157.4, 297.0);
    ctx.bezierCurveTo(157.6, 290.7, 159.5, 285.8, 161.6, 285.8);
    ctx.bezierCurveTo(163.6, 285.9, 165.1, 291.0, 164.9, 297.3);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(183.1, 430.1);
    ctx.bezierCurveTo(182.9, 423.9, 184.4, 418.8, 186.5, 418.7);
    ctx.bezierCurveTo(188.5, 418.7, 190.4, 423.7, 190.6, 429.9);
    ctx.bezierCurveTo(190.8, 436.1, 189.2, 441.2, 187.2, 441.3);
    ctx.bezierCurveTo(185.1, 441.4, 183.2, 436.4, 183.1, 430.1);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(184.2, 188.1);
    ctx.bezierCurveTo(185.7, 194.2, 185.4, 199.5, 183.4, 200.0);
    ctx.bezierCurveTo(181.4, 200.5, 178.5, 196.1, 176.9, 190.1);
    ctx.bezierCurveTo(175.3, 184.0, 175.6, 178.7, 177.6, 178.2);
    ctx.bezierCurveTo(179.6, 177.7, 182.6, 182.1, 184.2, 188.1);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(160.6, 359.3);
    ctx.bezierCurveTo(162.1, 365.4, 161.6, 370.7, 159.6, 371.1);
    ctx.bezierCurveTo(157.6, 371.6, 154.7, 367.1, 153.3, 361.0);
    ctx.bezierCurveTo(151.9, 355.0, 152.3, 349.7, 154.4, 349.2);
    ctx.bezierCurveTo(156.4, 348.7, 159.2, 353.2, 160.6, 359.3);
    ctx.closePath();
    ctx.fill();

    // morango/morango/sementes/Path
    ctx.beginPath();
    ctx.moveTo(215.0, 248.3);
    ctx.bezierCurveTo(216.5, 254.3, 216.2, 259.6, 214.2, 260.1);
    ctx.bezierCurveTo(212.2, 260.7, 209.3, 256.2, 207.7, 250.2);
    ctx.bezierCurveTo(206.1, 244.2, 206.4, 238.9, 208.4, 238.3);
    ctx.bezierCurveTo(210.4, 237.8, 213.4, 242.2, 215.0, 248.3);
    ctx.closePath();
    ctx.fill();

    // morango/morango/olhos
    ctx.restore();

    // morango/morango/olhos/Group
    ctx.save();

    // morango/morango/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(138.3, 308.4);
    ctx.bezierCurveTo(138.3, 335.6, 122.3, 357.5, 102.6, 357.5);
    ctx.bezierCurveTo(82.9, 357.5, 66.9, 335.6, 66.9, 308.4);
    ctx.bezierCurveTo(66.9, 281.3, 82.9, 259.3, 102.6, 259.3);
    ctx.bezierCurveTo(122.3, 259.3, 138.3, 281.3, 138.3, 308.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // morango/morango/olhos/Group/Clip Group

    // morango/morango/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(138.3, 308.4);
    ctx.bezierCurveTo(138.3, 335.6, 122.3, 357.5, 102.6, 357.5);
    ctx.bezierCurveTo(82.9, 357.5, 66.9, 335.6, 66.9, 308.4);
    ctx.bezierCurveTo(66.9, 281.3, 82.9, 259.3, 102.6, 259.3);
    ctx.bezierCurveTo(122.3, 259.3, 138.3, 281.3, 138.3, 308.4);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // morango/morango/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(133.0, 326.7);
    ctx.bezierCurveTo(133.0, 349.1, 121.7, 367.1, 107.7, 367.1);
    ctx.bezierCurveTo(93.8, 367.1, 82.5, 349.1, 82.5, 326.7);
    ctx.bezierCurveTo(82.5, 304.4, 93.8, 286.3, 107.7, 286.3);
    ctx.bezierCurveTo(121.7, 286.3, 133.0, 304.4, 133.0, 326.7);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // morango/morango/olhos/Group
    ctx.restore();
    ctx.restore();

    // morango/morango/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(263.0, 308.4);
    ctx.bezierCurveTo(263.0, 335.6, 247.0, 357.5, 227.3, 357.5);
    ctx.bezierCurveTo(207.6, 357.5, 191.6, 335.6, 191.6, 308.4);
    ctx.bezierCurveTo(191.6, 281.3, 207.6, 259.3, 227.3, 259.3);
    ctx.bezierCurveTo(247.0, 259.3, 263.0, 281.3, 263.0, 308.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // morango/morango/olhos/Group/Clip Group

    // morango/morango/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(263.0, 308.4);
    ctx.bezierCurveTo(263.0, 335.6, 247.0, 357.5, 227.3, 357.5);
    ctx.bezierCurveTo(207.6, 357.5, 191.6, 335.6, 191.6, 308.4);
    ctx.bezierCurveTo(191.6, 281.3, 207.6, 259.3, 227.3, 259.3);
    ctx.bezierCurveTo(247.0, 259.3, 263.0, 281.3, 263.0, 308.4);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // morango/morango/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(244.7, 322.9);
    ctx.bezierCurveTo(244.7, 345.3, 233.4, 363.3, 219.5, 363.3);
    ctx.bezierCurveTo(205.5, 363.3, 194.2, 345.3, 194.2, 322.9);
    ctx.bezierCurveTo(194.2, 300.6, 205.5, 282.5, 219.5, 282.5);
    ctx.bezierCurveTo(233.4, 282.5, 244.7, 300.6, 244.7, 322.9);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // morango/morango/olhos/Path
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(139.9, 395.7);
    ctx.bezierCurveTo(149.7, 405.4, 165.4, 405.3, 174.9, 395.6);
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(137, 24, 38)";
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.restore();
}

function desenhaPera(ctx) {

    // pera/pera
    ctx.save();

    // pera/pera/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(134.1, 89.7);
    ctx.bezierCurveTo(133.1, 86.9, 132.3, 84.1, 131.6, 81.2);
    ctx.bezierCurveTo(133.1, 62.6, 128.8, 46.3, 127.2, 27.9);
    ctx.bezierCurveTo(126.4, 19.0, 132.4, 11.5, 124.8, 6.5);
    ctx.bezierCurveTo(118.8, 2.5, 101.0, 8.6, 97.4, 13.9);
    ctx.bezierCurveTo(91.2, 23.2, 103.9, 30.1, 107.8, 37.9);
    ctx.bezierCurveTo(115.0, 52.3, 116.5, 72.9, 117.0, 88.6);
    ctx.bezierCurveTo(117.1, 91.4, 119.4, 93.0, 121.7, 93.1);
    ctx.bezierCurveTo(122.5, 96.2, 126.3, 96.7, 128.6, 95.0);
    ctx.bezierCurveTo(131.8, 95.8, 135.6, 93.5, 134.1, 89.7);
    ctx.lineTo(134.1, 89.7);
    ctx.closePath();
    ctx.fillStyle = "rgb(114, 82, 46)";
    ctx.fill();

    // pera/pera/corpo
    ctx.beginPath();
    ctx.moveTo(0.0, 333.0);
    ctx.bezierCurveTo(-0.9, 375.5, 23.7, 417.4, 60.4, 438.5);
    ctx.bezierCurveTo(136.9, 482.6, 221.4, 457.4, 257.3, 377.1);
    ctx.bezierCurveTo(279.3, 327.7, 257.0, 281.6, 231.4, 238.8);
    ctx.bezierCurveTo(203.8, 192.6, 197.6, 82.4, 122.7, 89.3);
    ctx.bezierCurveTo(51.1, 95.9, 55.1, 193.2, 34.8, 232.1);
    ctx.bezierCurveTo(21.0, 258.4, 0.9, 290.9, 0.0, 333.0);
    ctx.closePath();
    ctx.fillStyle = corMuda; //"rgb(251, 175, 63)";
    ctx.fill();

    // pera/pera/olhos

    // pera/pera/olhos/Group
    ctx.save();

    // pera/pera/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(113.0, 303.9);
    ctx.bezierCurveTo(113.0, 323.9, 101.2, 340.1, 86.7, 340.1);
    ctx.bezierCurveTo(72.2, 340.1, 60.4, 323.9, 60.4, 303.9);
    ctx.bezierCurveTo(60.4, 283.9, 72.2, 267.7, 86.7, 267.7);
    ctx.bezierCurveTo(101.2, 267.7, 113.0, 283.9, 113.0, 303.9);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // pera/pera/olhos/Group/Clip Group

    // pera/pera/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(113.0, 303.9);
    ctx.bezierCurveTo(113.0, 323.9, 101.2, 340.1, 86.7, 340.1);
    ctx.bezierCurveTo(72.2, 340.1, 60.4, 323.9, 60.4, 303.9);
    ctx.bezierCurveTo(60.4, 283.9, 72.2, 267.7, 86.7, 267.7);
    ctx.bezierCurveTo(101.2, 267.7, 113.0, 283.9, 113.0, 303.9);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();


    // pera/pera/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(109.1, 317.4);
    ctx.bezierCurveTo(109.1, 333.9, 100.8, 347.2, 90.5, 347.2);
    ctx.bezierCurveTo(80.2, 347.2, 71.8, 333.9, 71.8, 317.4);
    ctx.bezierCurveTo(71.8, 301.0, 80.2, 287.6, 90.5, 287.6);
    ctx.bezierCurveTo(100.8, 287.6, 109.1, 301.0, 109.1, 317.4);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // pera/pera/olhos/Group
    ctx.restore();
    ctx.restore();

    // pera/pera/olhos/Group/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(211.6, 303.1);
    ctx.bezierCurveTo(211.6, 323.1, 199.9, 339.3, 185.3, 339.3);
    ctx.bezierCurveTo(170.8, 339.3, 159.0, 323.1, 159.0, 303.1);
    ctx.bezierCurveTo(159.0, 283.1, 170.8, 266.9, 185.3, 266.9);
    ctx.bezierCurveTo(199.9, 266.9, 211.6, 283.1, 211.6, 303.1);
    ctx.closePath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fill();

    // pera/pera/olhos/Group/Clip Group

    // pera/pera/olhos/Group/Clip Group/Clipping Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(211.6, 303.1);
    ctx.bezierCurveTo(211.6, 323.1, 199.9, 339.3, 185.3, 339.3);
    ctx.bezierCurveTo(170.8, 339.3, 159.0, 323.1, 159.0, 303.1);
    ctx.bezierCurveTo(159.0, 283.1, 170.8, 266.9, 185.3, 266.9);
    ctx.bezierCurveTo(199.9, 266.9, 211.6, 283.1, 211.6, 303.1);
    ctx.closePath();
    ctx.clip();
    ctx.lineWidth = 3.0;
    ctx.strokeStyle = "rgb(41, 43, 53)";
    ctx.stroke();

    // pera/pera/olhos/Group/Clip Group/Path
    ctx.beginPath();
    ctx.moveTo(198.2, 313.8);
    ctx.bezierCurveTo(198.2, 330.2, 189.8, 343.5, 179.5, 343.5);
    ctx.bezierCurveTo(169.2, 343.5, 160.9, 330.2, 160.9, 313.8);
    ctx.bezierCurveTo(160.9, 297.3, 169.2, 284.0, 179.5, 284.0);
    ctx.bezierCurveTo(189.8, 284.0, 198.2, 297.3, 198.2, 313.8);
    ctx.closePath();
    ctx.fillStyle = "rgb(41, 43, 53)";
    ctx.fill();

    // pera/pera/boca
    ctx.restore();
    ctx.restore();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(117.8, 394.2);
    ctx.bezierCurveTo(129.7, 405.9, 148.8, 405.8, 160.5, 393.8);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = "rgb(116, 76, 40)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // pera/pera/pintas

    // pera/pera/pintas/Path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(190.3, 184.0);
    ctx.bezierCurveTo(190.3, 187.0, 187.8, 189.5, 184.7, 189.5);
    ctx.bezierCurveTo(181.7, 189.5, 179.2, 187.0, 179.2, 184.0);
    ctx.bezierCurveTo(179.2, 180.9, 181.7, 178.4, 184.7, 178.4);
    ctx.bezierCurveTo(187.8, 178.4, 190.3, 180.9, 190.3, 184.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(247, 147, 29)";
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(190.3, 230.2);
    ctx.bezierCurveTo(190.3, 233.3, 187.8, 235.8, 184.7, 235.8);
    ctx.bezierCurveTo(181.7, 235.8, 179.2, 233.3, 179.2, 230.2);
    ctx.bezierCurveTo(179.2, 227.2, 181.7, 224.7, 184.7, 224.7);
    ctx.bezierCurveTo(187.8, 224.7, 190.3, 227.2, 190.3, 230.2);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(234.7, 272.8);
    ctx.bezierCurveTo(234.7, 275.9, 232.2, 278.4, 229.2, 278.4);
    ctx.bezierCurveTo(226.1, 278.4, 223.6, 275.9, 223.6, 272.8);
    ctx.bezierCurveTo(223.6, 269.8, 226.1, 267.3, 229.2, 267.3);
    ctx.bezierCurveTo(232.2, 267.3, 234.7, 269.8, 234.7, 272.8);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(155.1, 150.6);
    ctx.bezierCurveTo(155.1, 153.7, 152.6, 156.2, 149.6, 156.2);
    ctx.bezierCurveTo(146.5, 156.2, 144.0, 153.7, 144.0, 150.6);
    ctx.bezierCurveTo(144.0, 147.6, 146.5, 145.1, 149.6, 145.1);
    ctx.bezierCurveTo(152.6, 145.1, 155.1, 147.6, 155.1, 150.6);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(179.2, 141.4);
    ctx.bezierCurveTo(179.2, 144.4, 176.7, 146.9, 173.6, 146.9);
    ctx.bezierCurveTo(170.6, 146.9, 168.1, 144.4, 168.1, 141.4);
    ctx.bezierCurveTo(168.1, 138.3, 170.6, 135.8, 173.6, 135.8);
    ctx.bezierCurveTo(176.7, 135.8, 179.2, 138.3, 179.2, 141.4);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(155.1, 182.1);
    ctx.bezierCurveTo(155.1, 184.2, 153.4, 185.9, 151.3, 185.9);
    ctx.bezierCurveTo(149.2, 185.9, 147.5, 184.2, 147.5, 182.1);
    ctx.bezierCurveTo(147.5, 180.0, 149.2, 178.3, 151.3, 178.3);
    ctx.bezierCurveTo(153.4, 178.3, 155.1, 180.0, 155.1, 182.1);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(160.9, 124.7);
    ctx.bezierCurveTo(160.9, 126.8, 159.2, 128.5, 157.1, 128.5);
    ctx.bezierCurveTo(155.0, 128.5, 153.3, 126.8, 153.3, 124.7);
    ctx.bezierCurveTo(153.3, 122.6, 155.0, 120.9, 157.1, 120.9);
    ctx.bezierCurveTo(159.2, 120.9, 160.9, 122.6, 160.9, 124.7);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(201.5, 202.6);
    ctx.bezierCurveTo(201.5, 204.7, 199.8, 206.4, 197.7, 206.4);
    ctx.bezierCurveTo(195.6, 206.4, 193.9, 204.7, 193.9, 202.6);
    ctx.bezierCurveTo(193.9, 200.5, 195.6, 198.8, 197.7, 198.8);
    ctx.bezierCurveTo(199.8, 198.8, 201.5, 200.5, 201.5, 202.6);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(160.7, 202.5);
    ctx.bezierCurveTo(160.7, 204.6, 159.0, 206.3, 156.9, 206.3);
    ctx.bezierCurveTo(154.7, 206.3, 153.0, 204.6, 153.0, 202.5);
    ctx.bezierCurveTo(153.0, 200.4, 154.7, 198.6, 156.9, 198.6);
    ctx.bezierCurveTo(159.0, 198.6, 160.7, 200.4, 160.7, 202.5);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(212.5, 239.5);
    ctx.bezierCurveTo(212.5, 241.6, 210.8, 243.3, 208.7, 243.3);
    ctx.bezierCurveTo(206.6, 243.3, 204.9, 241.6, 204.9, 239.5);
    ctx.bezierCurveTo(204.9, 237.4, 206.6, 235.7, 208.7, 235.7);
    ctx.bezierCurveTo(210.8, 235.7, 212.5, 237.4, 212.5, 239.5);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(131.2, 119.0);
    ctx.bezierCurveTo(131.2, 121.1, 129.5, 122.9, 127.3, 122.9);
    ctx.bezierCurveTo(125.2, 122.9, 123.5, 121.1, 123.5, 119.0);
    ctx.bezierCurveTo(123.5, 116.9, 125.2, 115.2, 127.3, 115.2);
    ctx.bezierCurveTo(129.5, 115.2, 131.2, 116.9, 131.2, 119.0);
    ctx.closePath();
    ctx.fill();

    // pera/pera/pintas/Path
    ctx.beginPath();
    ctx.moveTo(231.1, 335.8);
    ctx.bezierCurveTo(231.1, 337.9, 229.4, 339.6, 227.3, 339.6);
    ctx.bezierCurveTo(225.2, 339.6, 223.5, 337.9, 223.5, 335.8);
    ctx.bezierCurveTo(223.5, 333.7, 225.2, 332.0, 227.3, 332.0);
    ctx.bezierCurveTo(229.4, 332.0, 231.1, 333.7, 231.1, 335.8);
    ctx.closePath();
    ctx.fill();

    // pera/pera/folha2
    ctx.restore();

    // pera/pera/folha2/folha2
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(124.9, 56.0);
    ctx.bezierCurveTo(124.9, 56.0, 128.6, 9.7, 173.0, 2.3);
    ctx.bezierCurveTo(217.5, -5.1, 258.2, 7.8, 258.2, 7.8);
    ctx.bezierCurveTo(258.2, 7.8, 217.5, 52.3, 195.3, 54.1);
    ctx.bezierCurveTo(173.0, 56.0, 124.9, 56.0, 124.9, 56.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(117, 191, 67)";
    ctx.fill();

    // pera/pera/folha2/folha2risco
    ctx.beginPath();
    ctx.moveTo(135.9, 44.7);
    ctx.bezierCurveTo(135.9, 44.7, 173.4, 27.2, 250.4, 8.6);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "rgb(0, 103, 56)";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10.0;
    ctx.stroke();

    // pera/pera/folha1
    ctx.restore();

    // pera/pera/folha1/folha1
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(123.7, 52.0);
    ctx.bezierCurveTo(123.7, 52.0, 154.0, 16.8, 194.2, 37.1);
    ctx.bezierCurveTo(234.5, 57.3, 259.7, 91.8, 259.7, 91.8);
    ctx.bezierCurveTo(259.7, 91.8, 200.6, 103.6, 181.6, 92.0);
    ctx.bezierCurveTo(162.6, 80.4, 123.7, 52.0, 123.7, 52.0);
    ctx.closePath();
    ctx.fillStyle = "rgb(31, 161, 72)";
    ctx.fill();

    // pera/pera/folha1/folha1risco
    ctx.beginPath();
    ctx.moveTo(123.7, 52.0);
    ctx.bezierCurveTo(123.7, 52.0, 184.1, 48.8, 252.4, 88.9);
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "rgb(0, 103, 56)";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10.0;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.restore();
}