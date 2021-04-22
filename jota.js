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
var listaComandos = ["Select", "From", "Where", "Join", "Order by"]


function parseSql(text){
    var list = text.split(' ');
    if(list[0].toLowerCase() == "select"){
        selectParse(list.slice(0,list.length).join(" "))
    }

}

function selectParse(text){
    var variableTxt = "";
    var list = text.split(' ');
    var cont = 1;
    while(cont<list.length&&list[cont].toLowerCase!="from"&&boolAccept){
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
    list.forEach(word =>{
        if(listaOperadores.indexOf(word)!= -1)
        listObj.push({value: word, tipo:"Operador"})
        else
        listObj.push({value: word, tipo:"variavel"})
    })
    console.log(listObj)
}


parseSql("Select Nome,idUsuario,Logradouro from Usuario Where Nome = joao")
console.log(boolAccept)
console.log(boolAccept? "É uma expressao valida" : "Não é uma expressao valida");