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
                    fromParse(list.slice(cont+2,list.length).join(" "));
                }
                break;
        }
        cont++;
    }
}

function fromParse(text){
    console.log(text);
    var list = text.split(' ');
    if(tablesNames.indexOf(list[0] != -1))
    tableAndVariable(list[0])
    else
    console.log(list[0]+" nao foi aceito")

}

function tableAndVariable(text){
    switch(text){
        case "Categoria":
            console.log("entrou na categoria")
            selectVariables.forEach(v=>{
                if(tableFrom[0].atributos.indexOf(v)== -1)
                boolAccept = false;
            });

        break;

        case "Contas":
            console.log("entrou nas contas")
            selectVariables.forEach(v=>{
                if(tableFrom[1].atributos.indexOf(v)== -1)
                boolAccept = false;
            });
        break;

        case "Movimentacao":
            console.log("entrou na movimentacao")
            selectVariables.forEach(v=>{
                if(tableFrom[2].atributos.indexOf(v)== -1)
                boolAccept = false;
            });
        break;

        case "TipoMovimento":
            console.log("entrou no TipoMovimento")
            selectVariables.forEach(v=>{
                if(tableFrom[3].atributos.indexOf(v)== -1)
                boolAccept = false;
            });
        break;

        case "TipoConta":
            console.log("entrou no TipoConta")
            selectVariables.forEach(v=>{
                if(tableFrom[4].atributos.indexOf(v)== -1)
                boolAccept = false;
            });
        break;

        case "Usuario":
            console.log("entrou no Usuario")
            selectVariables.forEach(v=>{
                if(tableFrom[5].atributos.indexOf(v)== -1)
                boolAccept = false;
            });
        break;

        default:
            boolAccept = false;
        break;
    }


}

var a = new Categoria('a','b');
//console.log(a.DescCategoria);
parseSql("Select idCategoria,id,DescCategoria from Usuario where usuario==joao")
console.log(boolAccept);