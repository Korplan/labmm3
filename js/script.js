//vars
var id;
var id2;
var sortCarta;
var memoCartas = new Array();
memoCartas = [1,1,2,2,3,3,4,4]; //array com pares de cartas

window.onload = function () {
    jogoMemoria();
};

function jogoMemoria() {

    //define posições aleatorias para os elementos do array
    memoCartas.sort(function (a, b) {
        return 0.5 - Math.random()
    });
    numCartas=0; //nenhuma carta colocada

    //criar linhas com id "linha1" até 2
    for (id = 1; id < 3; id++) {
        document.getElementById("memoTab").innerHTML +=
            "<div class='row' id='linha" + id + "'><div/>";

        //criar x pares de elementos (cartas) com id "memoCarta#"
        for (id2 = 0; id2 < 4; id2++) {
            document.getElementById("linha" + id).innerHTML +=
                "<div class='col s2 offset-s1 rounded carta valign-wrapper white clickable' id='memoCarta" + memoCartas[numCartas] + "'>" +
                "<div class='center-block'><i class='material-icons large'>schedule</i></div>" +
                "</div>";
            numCartas++;
        }
    }
}