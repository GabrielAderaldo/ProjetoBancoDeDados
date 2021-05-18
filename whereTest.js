const fs = require('fs')

function preResult(str){
    var listP = str.split(" ");
    var deleteCount = 0;
    
    for(var i = 0; i<listP.length; i++){
        console.log(i)
        console.log(listP[i])
        switch(listP[i]){
            case "(":
            case ")":
            case "AND":
            case "OR":
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


    console.log(listP)
    a(listP)

}

function a(str){
    
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
    //console.log(arr1)
    for(var i = 0; i<arr1.length; i++){
        while(arr1[i].length>1){
            var currentArr = arr1[i];
            var obj = {type:currentArr[1],params:[currentArr[0],currentArr[2]],input:[]}
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
        a(str)
    }else{
        var vaitomarnocu = str.length/2;
        for(var i = 0; i<vaitomarnocu;i++){
            var currentArr = str;
            var obj = {type:currentArr[1],params:[currentArr[0],currentArr[2]],input:[]}
            str.shift();
            str.shift();
            str[0]=obj;
        }
        result = str;
        resultType();
    }

}

var arr1 = [];
var posiFinal = [];
var result;
preResult("X = 2 AND B = 3 OR ( X = 1 AND Y = 2 )")



function resultType(){
    var json = JSON.stringify(result);
    fs.writeFileSync('whereResult.json', json, 'utf8')
}
