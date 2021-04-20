const Categoria = require("./Models/Categoria")

function parseSql(text){
    var list = text.split(' ');
    if(list[0].toLowerCase() == "select"){
        var cont = 1;
        while(list[i].toLowerCase()=="from"&&cont<list.length){
            switch(list[i].toLowerCase()){
                case 'where': 
                    return false;

                case 'join':
                    return false;

                case 'order by':
                    return false;
            }


        }
    }
}

var a = new Categoria('a','b');
console.log(a.DescCategoria);
