const Categoria = require("./Models/Categoria")
const Contas = require("./Models/Contas")
const Movimentacao = require("./Models/Movimentacao")
const TipoConta = require("./Models/TipoConta")
const TipoMovimento = require("./Models/TipoMovimento")
const Usuario = require("./Models/Usuario")
const fs = require('fs');

var selectVariables;
var tablesNames = ["Categoria", "Contas", "Movimentacao", "TipoMovimento", "TipoConta", "Usuario"]

var tableFrom = [
    //0
    { name: "Categoria", atributos: ["idcategoria", "desccategoria"] },
    //1
    { name: "Contas", atributos: ["idconta", "descricao", "tipoconta_idtipoconta", "usuario_idUsuario", "saldoinicial"] },
    //2
    { name: "Movimentacao", atributos: ["idmovimentacao", "datamovimentacao", "descricao", "tipomovimento_idmovimento", "categoria_idcategoria", "contas_idconta", "valor"] },
    //3
    { name: "TipoMovimento", atributos: ["idtipomovimento", "descmovimento"] },
    //4
    { name: "TipoConta", atributos: ["idtipoConta", "descricao"] },
    //5
    { name: "Usuario", atributos: ["idusuario", "nome", "logradouro", "numero", "bairro", "cep", "uf", "datanascimento"] }
];

var boolAccept = true;
var listaOperadores = ["=", ">", "<", "<=", ">=", "<>", "like"]
var listaOperadorAndOr = ["and", "or"]
//var listaOperadores = ["=", ">", "<", "<=", ">=", "<>", "And", "Or", "In", "Notin", "Like"] com "in" e "not in"
var listaComandos = ["select", "from", "join", "where", "order", "by"]
var listObj = [];
var result = { type: "projection", params: [], input: [] };
var selectionResult = { type: "selection", params: [], input: [] };
var joinResult = { type: "cartesian_product", input: [], params: [] };

var todasTabelasDoComando = [];



function parseSql(text) {
    text = text.toLowerCase();

    var list = text.split(' ');
    var verificationList = []
    list.forEach(word => {
        if (listaComandos.indexOf(word) != -1) {
            verificationList.push(word)
        }
    })
    verificarOrdem(verificationList, list)
}

function verificarOrdem(list, listTxt) {
    //select > from > join > where > order by 
    var selectIndice = list.indexOf("select") != -1 ? list.indexOf("select") : Infinity;
    var fromIndice = list.indexOf("from") != -1 ? list.indexOf("from") : Infinity;
    var joinIndice = list.indexOf("join") != -1 ? list.indexOf("join") : Infinity;
    var whereIndice = list.indexOf("where") != -1 ? list.indexOf("where") : Infinity;
    var orderIndice = list.indexOf("order") != -1 ? list.indexOf("order") : Infinity;
    var byIndice = list.indexOf("by") != -1 ? list.indexOf("by") : Infinity;

    if (selectIndice == 0 && fromIndice == 1 && (joinIndice < whereIndice || whereIndice != Infinity || joinIndice == Infinity) &&
        (joinIndice < orderIndice || orderIndice == Infinity || joinIndice == Infinity) &&
        (whereIndice < orderIndice || orderIndice == Infinity || whereIndice == Infinity) && (byIndice - orderIndice == 1 || byIndice == orderIndice)) {
        if (list[0] == "select")
            selectParse(listTxt.slice(1, listTxt.length))
        else
            boolAccept = false;

    } else {
        boolAccept = false;
    }

}

function selectParse(list) {
    console.log("Foi aceito no verification ordem")
    var cont = 0;
    var variableTxt = "";

    while (cont < list.length && boolAccept) {
        variableTxt += list[cont];

        switch (list[cont + 1].toLowerCase()) {
            case 'where':
            case 'join':
            case 'order by':
                boolAccept = false;

                break;

            case 'from':
                if (boolAccept) {
                    selectVariables = variableTxt.split(',')
                    if (selectVariables.indexOf("*") != -1 && selectVariables.length == 1) {
                        result.type = "projection";
                        boolAccept = true;
                        result.params = "*";
                        fromParse(list.slice(cont + 2, list.length));
                    } else {
                        boolAccept = false;
                        if (selectVariables.indexOf("*") != -1) {
                            boolAccept = false;
                        } else {
                            result.type = "projection";
                            result.params = selectVariables;
                            boolAccept = true;
                            fromParse(list.slice(cont + 2, list.length));
                        }
                    }

                    cont = list.length;
                }
                break;
        }
        cont++;
    }
}

function fromParse(list) {
    console.log("Foi aceito no select parse")
    if (tablesNames.indexOf(list[0] != -1)) {
        todasTabelasDoComando.push(list[0])
        tableAndVariable(list)
    } else {
        boolAccept = false;

    }

}

function tableAndVariable(list) {
    console.log("foi aceito no from parse")
    switch (list[0]) {
        case "categoria":
            selectVariables.forEach(v => {
                if (tableFrom[0].atributos.indexOf(v) == -1)
                    boolAccept = false;
            });

            break;

        case "contas":
            selectVariables.forEach(v => {
                if (tableFrom[1].atributos.indexOf(v) == -1)
                    boolAccept = false;
            });

            break;

        case "movimentacao":
            selectVariables.forEach(v => {
                if (tableFrom[2].atributos.indexOf(v) == -1)
                    boolAccept = false;
            });

            break;

        case "tipomovimento":
            selectVariables.forEach(v => {
                if (tableFrom[3].atributos.indexOf(v) == -1)
                    boolAccept = false;
            });

            break;

        case "tipoconta":
            selectVariables.forEach(v => {
                if (tableFrom[4].atributos.indexOf(v) == -1)
                    boolAccept = false;
            });

            break;

        case "usuario":
            selectVariables.forEach(v => {
                if (tableFrom[5].atributos.indexOf(v) == -1)
                    boolAccept = false;
            });
            break;

        default:
            boolAccept = false;
            break;
    }
    if (selectVariables.indexOf("*" != -1)) {
        boolAccept = selectVariables.length == 1 ? true : false;
    }
    if (boolAccept) {
        if (list.length > 1) {
            console.log("foi aceito no tableAndVariable")
            parseAfterFrom(list.splice(1, list.length))
        }
    }


}

function parseAfterFrom(list) {

    switch (list[0].toLowerCase()) {
        case "join":
            console.log("passou no parseafterfrom pro join")
            joinParseAcc(list)
            break;

        case "where":
            console.log("passou no parseafterfrom pro where")
            whereParseAcc(list.splice(1, list.length))
            break;

        case "order":
            break;

        default:
            boolAccept = false;
            break;
    }
}

function joinParseAcc(list) {
    var index = 0;
    var boolThanos = 0;
    list.forEach(word => {
        //console.log(word)
        if (boolAccept) {
            if (listaComandos.indexOf(word) != -1 && word.toLowerCase() != "join") {
                createCartesianAfterJoin(list.splice(index, list.length))
            } else if (word.toLowerCase() == "join") {
                boolThanos++;
            } else {
                if (tablesNames.indexOf(word != -1)) {
                    boolThanos--;
                    todasTabelasDoComando.push(word)
                } else {
                    boolAccept = false;
                }
            }
            index++;
        }

        if (boolThanos > 1 || boolThanos < 0)
            boolAccept = false
    })

    //if(boolAccept)

}

function createCartesianAfterJoin(list) {
    joinResult = {
        type: "cartesian_product",
        params: [],
        input: []
    };
    if (boolAccept) {
        var posiAux = 0;
        var objAux;
        var arrayReverse = todasTabelasDoComando.reverse();
        arrayReverse.forEach(tabela => {
            if (posiAux <= 1) {
                joinResult.input.push(tabela)
                objAux = joinResult;
                posiAux++;
            } else {
                joinResult = {
                    type: "cartesian_product",
                    params: [],
                    input: []
                };
                joinResult.input.push(tabela)
                joinResult.input.push(objAux)
                objAux = joinResult
                // console.log(objAux.input[0])
            }
        });
        selectionResult.input = joinResult
        result.input = selectionResult
    }
    parseAfterFrom(list)
}

function whereParseAcc(list) {
    console.log("entrou no where")
    console.log(list)
    var contador = 0;
    list.forEach(word => {
        if (listaOperadores.indexOf(word) != -1 || listaOperadorAndOr.indexOf(word) != -1) {
            if (listaOperadores.indexOf(word) != -1) {
                listObj.push({ value: word, tipo: "Operador" })
                if (contador > 0) {
                    if (listObj[contador].tipo == listObj[contador - 1].tipo)
                        boolAccept = false;

                }
            }

            if(listaOperadorAndOr.indexOf(word) != -1){
                listObj.push({ value: word, tipo: "OperadorAndOr" })
                if (contador > 0) {
                    if (listObj[contador].tipo == listObj[contador - 1].tipo)
                        boolAccept = false;
                }
            }

        } else {
            listObj.push({ value: word, tipo: "variavel" })
            selectionResult.params.push(word);
            if (contador > 0) {
                if (listObj[contador].tipo == listObj[contador - 1].tipo) {
                    console.log("NAAAO passou no where parse")
                    boolAccept = false;
                }
            }
        }

        /*listObj.forEach(obj=>{
                if(obj.tipo=="variavel")
                result.params.push(obj.value);
            })
            result.input.push(selectionResult)
            console.log("teste rapidin "+list.splice(contador,list.length))
            parseAfterFrom(list.splice(contador,list.length))*/

        contador++;
    })
}

parseSql("Select nome From Usuario Join Categoria Join Contas Join Movimentacao Where X = Nome AND y = t")
console.log(boolAccept ? "É uma expressao valida" : "Não é uma expressao valida");
//console.log(listObj)2

var json = JSON.stringify(result)
fs.writeFileSync('result.json', json, 'utf8')
