const fs = require('fs')


class binaryTree{
    constructor(){
        this.values = {};
        this.index = 0;
    }
    addValues(value){
        this.index++;
        this.values[this.index] = value;
        return this.index;
    }
    getValue (index) { return this.values[index] }
    getRoot () { return this.index }
    mountTree(){ return this.mountNode(this.index) }
    mountNode(index){
        let node = this.getValue(index)
        if(!node) {return index}
        if(node.left) {node.left = this.mountNode(node.left)}
        if(node.right) {node.right = this.mountNode(node.right)}
        return node;
    }
}
function generateBinaryTree(tokens){
    let binary_tree = new binaryTree;
    newHandleToken(tokens, binary_tree)
    return binary_tree
}
function oldHandleToken(token, tree){
    if(!token.inputs[0].type){
        return tree.addValues({
            value: token.type,
            params: token.params,
            left: token.inputs[0], 
            right: token.inputs[1]
        })
    }
    let left = newHandleToken(token.inputs[0], tree)
    let right = token.inputs[1] ? newHandleToken(token.inputs[1], tree) : undefined
    return tree.addValues({
        value: token.type,
        params: token.params,
        left, 
        right
    })
}
function newHandleToken(token, tree){
    let left = token.inputs[0].type ? newHandleToken(token.inputs[0], tree) : token.inputs[0]
    let right = token.inputs[1] ? token.inputs[1].type ? newHandleToken(token.inputs[1], tree) : token.inputs[1] : undefined
    return tree.addValues({
        value: token.type,
        params: token.params,
        left, 
        right
    })
}

let select1 = {
    type: 'projection',
    inputs: [
        { 
            type: 'junction',
            inputs: [{ 
                type: 'rename',
                inputs: ['Contas'],
                params: ['C']
            },
            { 
                type: 'rename',
                inputs: ['Usuarios'],
                params: ['U']
            }],
            params: ['U.idusuario', 'C.usuario_idusuario']
        },
    ],
    params: ['Nome', "Datanascimento", "idConta", "Descricao"]
}
let select2 = {
    type: 'projection',
    inputs: [
        { 
            type: 'junction',
            inputs: [
                "Totmov",
                { 
                    type: 'junction',
                    inputs: [
                        "Usuario",
                        "contas"
                    ],
                    params: ["Usuario.idusuario", "contas.usuario_idusuario"]
                }],
            params: ["totMov.cod", "contas.idconta"]
        },
    ],
    params: ["usuario.idUsuario", "usuario.Nome", "contas.idConta", "contas.Descricao", "contas.usuario_idUsuario", "totmov.valor"]
}
let select3 = {
    type: 'projection',
    inputs: [
        {type: 'junction',
        inputs: [
            { 
                type: 'projection',
                inputs: [
                    {
                        type: 'junction',
                        inputs: [
                            {
                                type: 'projection',
                                inputs: [
                                    {
                                        type: 'selection',
                                        inputs: ["Project"],
                                        params: ["PNAME", "Aquarius"]
                                    }
                                ],
                                params: ["PNUMBER"]
                            },
                            {
                                type: 'projection',
                                inputs: ["Works_On"],
                                params: ["ESSN", "PNO"]
                            }
                        ],
                        params: ["PNUMBER", "PNO"]
                    }
                ],
                params: ["ESSN"]
            },
            { 
                type: 'projection',
                inputs: [
                    {
                        type: 'selection',
                        inputs: ["Employee"],
                        params: ["BDATE", "1957-12-31"]
                    }
                ],
                params: ["SSN", "LNAME"]
            }],
        params: ["ESSN", "SSN"] }
    ],
    params: ["LNAME"]
}
let select3_2 = {
    type: "projection",
    inputs: [
        {
            type: "selection",
            inputs:[{
                type: "cartesian_product",
                inputs:[
                    "Project",
                    {
                        type: "cartesian_product",
                        inputs:["Works_On", "Employee"],
                        params: []
                    }
                ],
                params: []
            }],
            params:[
                {
                    type: "AND",
                    params: [
                        {
                            type: "EQUAL",
                            params: ["P.NAME", "Aquarius"]
                        },
                        {
                            type: "EQUAL",
                            params: ["P.NUMBER", "PNO"]
                        },
                        {
                            type: "EQUAL",
                            params: ["ESSN", "SSN"]
                        },
                        {
                            type: "GREATER_THAN",
                            params: ["BDATE", "1957-12-31"]
                        },
                    ]
                },
            ]
        }
    ],
    params: ["LNAME"]
}

let x = generateBinaryTree(select3_2)
console.log(x)
let nodes_to_trade = []
let iterator = []
let index = x.getRoot()
while(x.getValue(index) != null || iterator.length > 0){
    if(x.getValue(index) != null){
        if(x.getValue(index).value == 'projection'/* || x.getValue(index).value == 'selection'*/){
            nodes_to_trade.push({father: iterator[iterator.length-1], node: index})
        }
        else if(x.getValue(index).value == 'selection'){
            x.getValue(index).params.forEach((sel_param) => {
                nodes_to_trade.forEach((entry) => {
                    x.getValue(entry.node).params.forEach((proj_param) => {
                        console.log(`${sel_param} versus ${proj_param}`)
                        if(sel_param == proj_param){
                            console.log("Here")
                        }
                    })
                })
            })
        }
        iterator.push(index)
        index = x.getValue(index)?.left
    }
    else{
        index = iterator.pop()
        index = x.getValue(index)?.right
    }
}
console.log("Nodes pra trocar:")
console.log(nodes_to_trade)



//console.log(response2)

/*fs.writeFile("out1.json", JSON.stringify(response), 'utf8', (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Arquivo escrito com sucesso")
    }
})
response = generateBinaryTree(select2)
fs.writeFile("out2.json", JSON.stringify(response), 'utf8', (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Arquivo escrito com sucesso")
    }
})*/

let response = generateBinaryTree(select3_2)
fs.writeFile("out3_2_tree.json", JSON.stringify(response), 'utf8', (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Arquivo escrito com sucesso")
    }
})
response = response.mountTree()
fs.writeFile("out3_2_mounted_tree.json", JSON.stringify(response), 'utf8', (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Arquivo escrito com sucesso")
    }
})