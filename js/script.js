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
var numMax = 5;

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

    //document.getElementById("btn-back").onclick=retroceder;                             //Botão de retroceder para o menu principal

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
    document.getElementById("item" + id).onclick = null;                //Desativa o clique na carta
    document.getElementById("item" + id).onmouseover = null;            //Desativa o onmouseover da carta

    // if (jogo_memoria) {                 //Se jogo_memoria=true
    setTimeout(function () {        //Ocorre 1 vez passado 1segundo
        if (!par)                   //Se for virada a primeira carta ainda não há um par
            ultimo = id;            //logo ultimo (var que guarda  aultima carta virada) = ao # da carta recebido

        else if (document.getElementById("item" + ultimo).getElementsByTagName("div")[1].innerHTML != document.getElementById("item" + id).getElementsByTagName("div")[1].innerHTML) {      //Senão, se par==true, ou seja, foram viradas duas cartas, verifica-se se uma é igual à outra. Então, o conteúdo (innerHTML) da div 1 (elemento de índice 1 do array "getElementsByTagName("div")") do elemento "itemultimo" (última carta virada) é igual ao conteudo (innerHTML) da div 1 (elemento de índice 1 do array "getElementsByTagName("div")") do elemento "itemid" (primeira carta virada)
            document.getElementById("item" + ultimo).classList.remove("flipped");                       //Verifica a lista de classes do elemento "item ultimo" e remove a classe "flipped"
            document.getElementById("item" + id).classList.remove("flipped");                           //Verifica a lista de classes do elemento "item id" e remove a classe "flipped"
            document.getElementById("item" + ultimo).setAttribute("onclick", "flip(" + ultimo + ")");   //Adiciona a função (anteriormente retirada) "flip(ultimo)"
            document.getElementById("item" + id).setAttribute("onclick", "flip(" + id + ")");           //Adiciona a função (anteriormente retirada) "flip(id)"
            ultimo = "";
        } else {
            certas += 2;
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

    document.getElementById("settings").style.color = "#363636";
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
    document.getElementById("certo").onclick = function () {                                                //Ao clicar no elemento "certo" (sílaba certa)
        document.getElementById("silaba-falta").innerHTML = document.getElementById("certo").innerHTML;     //Substituir o espaço a completar pela sílaba certa
        document.getElementById("certo").style.animation = "shake 0.8s";                                //Animar o elemento "certo" durante 0.8segundos através da animação "bounceOut" (ver .css)

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
}

//----------JOGO CORES----------//
function loadJogoCores() {
    document.body.style.backgroundImage = "url('img/Frutas!-19.png')";
    document.body.style.backgroundImage = "cover";


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
        loadJogoCores();
    }
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

//----------JOGO NÚMEROS----------//
function loadJogoNumeros() {
    document.body.style.backgroundImage = "url('img/Frutas!-24.png')";
    document.body.style.backgroundImage = "cover";


    document.getElementById('settings').style.color = "#363636";
    // var frutas = ["maca", "pera", "cenoura", "laranja"];                //array com as frutas
    var f1, f2, fErrada1, fErrada2;                                     //variaveis que guardam fruta1, fruta2, frutaErrada1 e frutaErrada2
    // do {
        f1 = numParaFruta(Math.floor(Math.random() * palavras.length));
        f2 = numParaFruta(Math.floor(Math.random() * palavras.length));
    // } while (f1 == f2);                                                 //escolhe duas frutas diferentes, aleatoriamente

    var sumo = document.getElementById("sumo");

    document.getElementById("fruta1").innerHTML = "<img src='img/frutas/" + f1 + ".png'>";                      //coloca a imagem respetiva a fruta1 escolhida
    document.getElementById("fruta2").innerHTML = "<img src='img/frutas/" + f2 + ".png'>";                      //coloca a imagem respetiva a fruta2 escolhida
    var num1 = document.getElementById("num1").innerHTML = Math.floor(Math.random() * (numMax - 1)) + 1;        //gera um número aleatorio entre 1 e o num Máximo, coloca-o no HTML e guarda na variavel
    var num2 = document.getElementById("num2").innerHTML = numMax - num1;                                       //calcula as frutas que faltam até ao numero maximo
    document.getElementById("num2").classList.add('jogo-num-bola');                                             //calcula as frutas que faltam até ao numero maximo

    switch (f1 + "_" + f2) {                                                            //verifica as frutas sorteadas e coloca no HTML a respetiva imagem
        case 'ameixa_ananas':
        case 'ananas_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo1.png'>";
            break;
        case 'ameixa_cenoura':
        case 'cenoura_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo2.png'>";
            break;
        case 'ameixa_cereja':
        case 'cereja_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo3.png'>";
            break;
        case 'ameixa_laranja':
        case 'laranja_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo4.png'>";
            break;
        case 'ameixa_maca':
        case 'maca_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo5.png'>";
            break;
        case 'ameixa_mirtilo':
        case 'mirtilo_ameixa':
            sumo.innerHTML = "<img src='img/jogoNumeros/sumo6.png'>";
            break;
        default:
            print("ERRO: não existe a combinação de frutas " + f1 + "_" + f2);
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