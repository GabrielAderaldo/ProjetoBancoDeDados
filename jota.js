const Categoria = require("./Models/Categoria")
const Contas = require("./Models/Contas")
const Movimentacao = require("./Models/Movimentacao")
const TipoConta = require("./Models/TipoConta")
const TipoMovimento = require("./Models/TipoMovimento")
const Usuario = require("./Models/Usuario")
const fs = require('fs');

var selectVariables;
var tablesNames = ["Categoria", "Contas", "Movimentacao", "TipoMovimento", "TipoConta", "Usuario"]
var arr1 = [];
var posiFinal = [];

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
        selectionResult.input.push(joinResult);
        result.input.push(selectionResult);
    }
    parseAfterFrom(list)
}

function whereParseAcc(list) {
    console.log("entrou no where")
    var stringList = list.join(" ");
    preWhereResult(stringList)
}

var whereResult;


function preWhereResult(str){
    console.log(str)
    var listP = str.split(" ");
    var deleteCount = 0;
    
    for(var i = 0; i<listP.length; i++){
        console.log(i)
        console.log(listP[i])
        switch(listP[i]){
            case "(":
            case ")":
            case "and":
            case "or":
            break;

            default:
                var obj = {type:listP[i+1],params:[listP[i],listP[i+2]],input:[]}
                listP[i] = obj;
                listP[i+1] = "DELETE";
                listP[i+2] = "DELETE";
                i += 2;
                deleteCount += 2;
        }
    }
    while(deleteCount != 0){
        listP.splice(listP.indexOf("DELETE"),1)
        deleteCount--;
    }
    whereResultCreate(listP)

}

//WHERE RESULT
function whereResultCreate(str){
    
    var aux = [];
    var posi = [];
    var boolTemPar = false;
    for(var i = 0; i<str.length; i++){
        switch(str[i]){
            case " ":
            case "":
                break;
            case "(":
                aux = [];
                posi = [];
                posi.push(i);
                boolTemPar = true;
                break;

            case ")":
                if(aux!=null&&aux.length>0){
                arr1.push(aux);
                posi.push(i);

                if(posi.length>1)
                posiFinal.push(posi)
                
                aux = []
                posi = []
                }
                break;

            default:
                aux.push(str[i]);
        }
    }
    console.log("VOU CHORAR")
    console.log(arr1.length)
    for(var i = 0; i<arr1.length; i++){
        while(arr1[i].length>1){
            var currentArr = arr1[i];
            var obj = {type:currentArr[1],params:[],input:[]}

            if(!currentArr[0][0])
            obj.params.push(currentArr[0])
            else
            obj.params.push(currentArr[0][0])
            
            
            if(!currentArr[2][0])
            obj.params.push(currentArr[2])
            else
            obj.params.push(currentArr[2][0])

            console.log("vai tomar no cu")
            console.log(obj.params)


            arr1[i].shift();
            arr1[i].shift();
            arr1[i][0]=obj;
        } 
    }
    console.log("fooooreach")
    arr1.forEach(x=>{console.log(x)})

    var deleteCount = 0;
    console.log(posiFinal)
    while(posiFinal.length>0){

        var posicao = posiFinal[0][0]+1;
        var final = posiFinal[0][1];
        posiFinal.shift();

        str[posicao-1] = arr1[0];
        arr1.shift();

        for(var i= posicao; i<=final;i++){
            str[i] = "DELETE";
            deleteCount++;
        }
    }

    while(deleteCount != 0){
        str.splice(str.indexOf("DELETE"),1)
        deleteCount--;
    }
    
    if(boolTemPar){
        whereResultCreate(str)
    }else{
        var vaitomarnocu = str.length;
        for(var i = 0; i<vaitomarnocu;i+=3){
            var currentArr = str;
            var obj = {type:currentArr[1],params:[],input:[]}

            if(!currentArr[0][0])
            obj.params.push(currentArr[0])
            else
            obj.params.push(currentArr[0][0])
            
            
            if(!currentArr[2][0])
            obj.params.push(currentArr[2])
            else
            obj.params.push(currentArr[2][0])

            str.shift();
            str.shift();
            str[0]=obj;
        }
        whereresult = str;
        selectionResult.params = str[0].params;
    }

}

parseSql("Select nome From Usuario Join Categoria Join Contas Join Movimentacao Where X = Nome AND y = t AND y = z OR ( ( X LIKE B AND ( B = 3 OR C = 5 ) ) )")
console.log(boolAccept ? "É uma expressao valida" : "Não é uma expressao valida");

var json = JSON.stringify(result)
fs.writeFileSync('result.json', json, 'utf8')