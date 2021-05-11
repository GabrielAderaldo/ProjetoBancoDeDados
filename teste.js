var arr = [];
var pivo = 0;
var result = {type:"junction",
                params:[],
                input:[]}
function a (list){
    list.forEach(word => {
        if(arr[pivo]==null)
        arr[pivo] = []

        switch(word){
            case "(":
                arr[pivo].push("NODE")
                pivo++;
                break;
    
            case ")":
                pivo --;
                break;
    
            default:
                arr[pivo].push(word)
        }
    });
}
var objC 
function c(){
    
    if(teste!=null){
        objC = {type:teste[3],params:[{type: teste[1], 
            params:[teste[0],teste[2]], input:[]},{type: teste[5], params:[teste[4],teste[3]], input:[]}], 
            input:[]}
        nodes.push(objC);
        if(teste.length <= 7){
            if(arr!=null){
                teste = arr.reverse()[0];
                arr.pop();
                d();
            }
        }else{
            //console.log("ANTES ^")
            teste.shift()
            teste.shift()
            teste.shift()
            teste.shift()
            teste.shift()
            teste.shift()
            teste.shift()
            //console.log(teste)
            //console.log("DEPOIS ^")
            objC = null;
            
            c();
        }
    }
}

function d(){
    var index = 0;
    arr[arr.length-1].forEach(word => {
        if(word=="NODE"){
            arr[arr.length-1][index] = nodes[0];
            nodes.shift();
        }
        index++;
    });
    e();
    //console.log(arr[arr.length-1])
}

function e(){
    var obj = {type: arr[arr.length-1][1], 
                params: [arr[arr.length-1][0],
                arr[arr.length-1][2]], input:[]}

    nodes.push(obj)
    arr[arr.length-1].shift()
    arr[arr.length-1].shift()
    arr[arr.length-1].shift() 

    if(arr[arr.length-1]!=0){
        e();
    }else{
        console.log(nodes)
    }

}


var strAux = "id = 123 AND ( ( nome = jose OR nome = maria ) AND ( idade > 20 AND idade < 70 ) OR ( X = 2 AND Y = 3 ) )"
// [0] id = 123 AND node*
// [1] node* AND node* OR node*
// [2] nome = jose OR nome = maria idade > 20 AND idade < 70 X = 2 AND Y = 3
a(strAux.split(" "))

//console.log(arr)
var nodes = []
var teste = arr.reverse()[0];
console.log(arr)
c();