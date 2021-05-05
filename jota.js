const Categoria = require("./Models/Categoria")
const Contas = require("./Models/Contas")
const Movimentacao = require("./Models/Movimentacao")
const TipoConta = require("./Models/TipoConta")
const TipoMovimento = require("./Models/TipoMovimento")
const Usuario = require("./Models/Usuario")

var selectVariables;
var tablesNames = ["Categoria","Contas","Movimentacao","TipoMovimento","TipoConta","Usuario"]

var tableFrom = [
    //0
    {name:"Categoria", atributos: ["idCategoria","DescCategoria"]},
    //1
    {name:"Contas",atributos: ["idConta","Descricao","TipoConta_idTipoConta","Usuario_idUsuario","SaldoInicial"]},
    //2
    {name:"Movimentacao",atributos:["idMovimentacao","DataMovimentacao","Descricao","TipoMovimento_idMovimento","Categoria_idCategoria","Contas_idConta","valor"]},
    //3
    {name:"TipoMovimento",atributos:["idTipoMovimento","DescMovimento"]},
    //4
    {name:"TipoConta",atributos:["idTipoConta","Descricao"]},
    //5
    {name:"Usuario",atributos:["idUsuario","Nome","Logradouro","Numero","Bairro","CEP","UF","DataNascimento"]}
];

var boolAccept = true;
var listaOperadores = ["=", ">", "<", "<=", ">=", "<>", "Like", "And", "Or"]
//var listaOperadores = ["=", ">", "<", "<=", ">=", "<>", "And", "Or", "In", "Notin", "Like"] com "in" e "not in"
var listaComandos = ["Select", "From", "Join","Where", "Order", "By"]
var listObj = [];
var result = {type:"projection",
              params:[],
              input:[]};

var selectionResult = {type:"selection",
                params:[],
                input:[]};

var joinResult = {type:"cartesian_product",
                input:[],
                params:[]};

var todasTabelasDoComando = [];

function parseSql(text){
    var list = text.split(' ');
    var verificationList = []
    list.forEach(word =>{
        if(listaComandos.indexOf(word)!=-1){
            verificationList.push(word)
        }
    })
    verificarOrdem(verificationList,list)
}

function verificarOrdem(list,listTxt){
    //select > from > join > where > order by 
    var selectIndice = list.indexOf("Select")!= -1 ? list.indexOf("Select") : Infinity;
    var fromIndice = list.indexOf("From")!= -1 ? list.indexOf("From") : Infinity;
    var joinIndice = list.indexOf("Join")!= -1 ? list.indexOf("Join") : Infinity;
    var whereIndice = list.indexOf("Where")!= -1 ? list.indexOf("Where") : Infinity;
    var orderIndice = list.indexOf("Order")!= -1 ? list.indexOf("Order") : Infinity;
    var byIndice = list.indexOf("By")!= -1 ? list.indexOf("By") : Infinity;

    if(selectIndice == 0 && fromIndice== 1 && (joinIndice<whereIndice || whereIndice!=Infinity || joinIndice==Infinity) && 
    (joinIndice<orderIndice || orderIndice==Infinity || joinIndice==Infinity) && 
    (whereIndice<orderIndice || orderIndice==Infinity || whereIndice==Infinity) && (byIndice-orderIndice==1||byIndice == orderIndice))
    {
        if(list[0] == "Select")
        selectParse(listTxt.slice(1,listTxt.length))
        else
        boolAccept = false;
    }else{
        console.log("erro")
    }

}

function selectParse(list){
    var cont = 0;
    var variableTxt = "";

    while(cont<list.length&&boolAccept){
        variableTxt += list[cont];

        switch(list[cont+1].toLowerCase()){
            case 'where':
                boolAccept = false;
                break;

            case 'join':
                boolAccept = false;
                break;

            case 'order by':
                boolAccept = false;
                break;

            case 'from':
                if(boolAccept){
                    selectVariables = variableTxt.split(',')
                    if(selectVariables.indexOf("*")!=-1 && selectVariables.length==1){
                        result.type = "projection";
                        boolAccept = true;
                        fromParse(list.slice(cont+2,list.length));
                    }else{
                        if(selectVariables.indexOf("*")!=-1){
                            boolAccept = false;
                        }else{
                            result.type = "projection";
                            boolAccept = true;
                            fromParse(list.slice(cont+2,list.length));
                        }
                    }
                    
                    cont = list.length;
                }
                break;
        }
        cont++;
    }
}

function fromParse(list){
    if(tablesNames.indexOf(list[0] != -1)){
        todasTabelasDoComando.push(list[0])
        tableAndVariable(list)
    }else{
        boolAccept = false;
    }

}

function tableAndVariable(list){
    switch(list[0]){
        case "Categoria":
            selectVariables.forEach(v=>{
                if(tableFrom[0].atributos.indexOf(v)== -1)
                boolAccept = false;
            });
             
        break;

        case "Contas":
            selectVariables.forEach(v=>{
                if(tableFrom[1].atributos.indexOf(v)== -1)
                boolAccept = false;
            });

        break;

        case "Movimentacao":
            selectVariables.forEach(v=>{
                if(tableFrom[2].atributos.indexOf(v)== -1)
                boolAccept = false;
            });

        break;

        case "TipoMovimento":
            selectVariables.forEach(v=>{
                if(tableFrom[3].atributos.indexOf(v)== -1)
                boolAccept = false;
            });

        break;

        case "TipoConta":
            selectVariables.forEach(v=>{
                if(tableFrom[4].atributos.indexOf(v)== -1)
                boolAccept = false;
            });

        break;

        case "Usuario":
            selectVariables.forEach(v=>{
                if(tableFrom[5].atributos.indexOf(v)== -1)
                boolAccept = false;
            });

        break;

        default:
            boolAccept = false;
        break;
    }
    if(selectVariables.indexOf("*"!=-1)){
        boolAccept = selectVariables.length == 1 ? true:false;
    }
    if(boolAccept){
        if(list.length>1)
        parseAfterFrom(list.splice(1,list.length))
    }


}

function parseAfterFrom(list){
    //console.log(list)
    switch(list[0].toLowerCase()){

        case "join":
            joinParseAcc(list)
        break;

        case "where":
        whereParseAcc(list.splice(1,list.length))
        break;

        case "order":
        break;

        default:
        boolAccept = false;
        break;
    }
}

function joinParseAcc(list){
    var index = 0;
    var boolThanos = 0;
    list.forEach(word=>{
        console.log(word)
        if(boolAccept){
            if(listaComandos.indexOf(word)!=-1 && word.toLowerCase()!="join"){
                createCartesianAfterJoin(list.splice(index,list.length))
            }else if(word.toLowerCase()=="join"){
                boolThanos++;
            }else{
                if(tablesNames.indexOf(word != -1)){
                    boolThanos--;
                    todasTabelasDoComando.push(word)
                }else{
                    boolAccept = false;
                }
            }
            index++;
        }

        if(boolThanos>1||boolThanos<0)
        boolAccept=false
    })

    //if(boolAccept)

}

function createCartesianAfterJoin(list){
     joinResult = {
        type:"cartesian_product",
        params:[],
        input:[] 
        };
    if(boolAccept){
       var posiAux = 0;
       var objAux;
       var arrayReverse = todasTabelasDoComando.reverse();
       arrayReverse.forEach(tabela => {
           if(posiAux<=1){
                joinResult.input.push(tabela)
               objAux = joinResult;
               posiAux++;
           }else{
            joinResult = {
                type:"cartesian_product",
                params:[],
                input:[] 
                };
                joinResult.input.push(tabela)
                joinResult.input.push(objAux)
                objAux = joinResult
                console.log(objAux.input[0])
           }
       });
       selectionResult.input = joinResult
       result.input = selectionResult
    }
    parseAfterFrom(list)
}

function whereParseAcc(list){
    //console.log(list)
    var contador = 0;
    list.forEach(word =>{
        
        if(listaComandos.indexOf(word)!=-1){
            listObj.forEach(obj=>{
                if(obj.tipo=="variavel")
                result.params.push(obj.value);
            })
            result.input.push(selectionResult)
            parseAfterFrom(list.splice(contador,list.length))
        }else{
            if(listaOperadores.indexOf(word)!= -1){
                listObj.push({value: word, tipo:"Operador"})
                if(contador>0){
                    if(listObj[contador].tipo == listObj[contador-1].tipo)
                    boolAccept =  false;
                }
            }else{
                listObj.push({value: word, tipo:"variavel"})
                selectionResult.params.push(word);
                if(contador>0){
                    if(listObj[contador].tipo == listObj[contador-1].tipo)
                    boolAccept =  false;
                }
            }
        }
        contador++;
    })
}


parseSql("Select nome From Usuario Join Categoria Join Contas Join Movimentacao Where")
console.log(boolAccept? "É uma expressao valida" : "Não é uma expressao valida");
//console.log(listObj)
//console.log(result)
console.log("TABELAS : NOME CATEGORIA CONTAS MOVIMENTACAO")
console.log(joinResult)
console.log("/////////INPUT DO JOIN RESULT////////")
console.log(joinResult.input)
console.log("///////////INPUT DO INPUT/////////////")
console.log(joinResult.input[1].input)
console.log("////////////////////////////")
console.log(result)
//logicaDoWhere("((())())")
/*function logicaDoWhere(texto){
    var posicoesAbertas = []
    var posicoesFechadas = []
    var indexContador = 0
    var contAbrir = 0;
    var contFechar = 0;
    var contDiferenca = 0;
    texto.split("").forEach(word => {

        if(word=="("){
            contAbrir++
            contDiferenca++
            posicoesAbertas.push({posicao: indexContador, value:contDiferenca})
        }
        
        if(word==")"){
            contFechar++
            posicoesFechadas.push({posicao: indexContador, value:contDiferenca})
            contDiferenca--
        }
        indexContador++;
    });
    if(contDiferenca!=0)
    console.log("ta errado")

    console.log(posicoesAbertas)
    console.log(posicoesFechadas)
}*/