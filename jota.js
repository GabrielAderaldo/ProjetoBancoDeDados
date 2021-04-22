const Categoria = require("./Models/Categoria")
const Contas = require("./Models/Contas")
const Movimentacao = require("./Models/Movimentacao")
const TipoConta = require("./Models/TipoConta")
const TipoMovimento = require("./Models/TipoMovimento")
const Usuario = require("./Models/Usuario")

var selectVariables;
var tablesNames = ["Categoria","Contas","Movimentacao","TipoMovimento","TipoConta","Usuario"]
//vai tomar no cu js, nao tem linq nessa porra
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
var listaOperadores = ["=", ">", "<", "<=", ">=", "<>", "And", "Or", "In", "Not" ,"In", "Like"]
var listaComandos = ["Select", "From", "Where", "Join", "Order", "By"]


function parseSql(text){
    var list = text.split(' ');
    var verificationList = []
    list.forEach(word =>{
        if(listaComandos.indexOf(word)!=-1){
            verificationList.push(word)
        }
    })
    verificarOrdem(verificationList)

    if(list[0] == "Select")
    selectParse(list.slice(0,list.length).join(" "))
    else
    boolAccept = false;

}

function verificarOrdem(list){
    //select > from > join > where > order by 
    var selectIndice = list.indexOf("Select")!= -1 ? list.indexOf("Select") : Infinity;
    var fromIndice = list.indexOf("From")!= -1 ? list.indexOf("From") : Infinity;
    var joinIndice = list.indexOf("Join")!= -1 ? list.indexOf("Join") : Infinity;
    var whereIndice = list.indexOf("Where")!= -1 ? list.indexOf("Where") : Infinity;
    var orderIndice = list.indexOf("Order")!= -1 ? list.indexOf("Order") : Infinity;
    var byIndice = list.indexOf("By")!= -1 ? list.indexOf("By") : Infinity;

    console.log(orderIndice)

    if(selectIndice == 0 && fromIndice== 1 && (joinIndice<whereIndice || whereIndice!=Infinity || joinIndice==Infinity) && 
    (joinIndice<orderIndice || orderIndice==Infinity || joinIndice==Infinity) && 
    (whereIndice<orderIndice || orderIndice==Infinity || whereIndice==Infinity) && (byIndice-orderIndice==1||byIndice == orderIndice))
    {
        console.log("tudo bem")
    }else{
        console.log("erro")
    }

}

function selectParse(text){
    var variableTxt = "";
    var list = text.split(' ');
    var cont = 1;
    while(cont<list.length&&list[cont]=="From"&&boolAccept){
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
                    boolAccept = true;
                    fromParse(list.slice(cont+2,list.length));
                    cont = list.length;
                }
                break;
        }
        cont++;
    }
}

function fromParse(list){
    if(tablesNames.indexOf(list[0] != -1))
    tableAndVariable(list)
    else
    console.log(list[0]+" nao foi aceito")

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
    if(boolAccept){
        if(list.length>1)
        parseAfterFrom(list.splice(1,list.length))
    }


}

function parseAfterFrom(list){
    switch(list[0]){
        case "Where":
        whereParseAcc(list.splice(1,list.length))
        break;

        case "join":
        break;

        default:
        boolAccept = false;
        break;
    }
}

function whereParseAcc(list){
    var listObj = [];
    var contador = 0;
    list.forEach(word =>{
        
        if(listaOperadores.indexOf(word)!= -1){
            listObj.push({value: word, tipo:"Operador"})
            if(contador>0){
                if(listObj[contador].tipo == listObj[contador-1].tipo)
                boolAccept =  false;
            }
        }else{
            listObj.push({value: word, tipo:"variavel"})
            if(contador>0){
                if(listObj[contador].tipo == listObj[contador-1].tipo)
                boolAccept =  false;
            }
        }
        contador++;


    })
}


parseSql("Select 11212312 From 12312 Where 1232123 Order By ")
console.log(boolAccept? "É uma expressao valida" : "Não é uma expressao valida");