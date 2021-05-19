const fs = require('fs')


var tableFrom = {
    "Categoria": ["idcategoria", "desccategoria"],
    "Contas": ["idconta", "ESSN", "tipoconta_idtipoconta", "usuario_idUsuario", "saldoinicial"] ,
    "Movimentacao": ["idmovimentacao", "SSN", "descricao", "tipomovimento_idmovimento", "categoria_idcategoria", "contas_idconta", "y", "valor"],
    "TipoMovimento": ["idtipomovimento", "descmovimento", "P.NAME"],
    "TipoConta": ["idtipoConta", "PNO", "x"],
    "Usuario": ["idusuario", "nome", "logradouro", "BDATE", "bairro", "cep", "uf", "datanascimento"]
};

class binaryTree{
    constructor(){
        this.values = {};
        this.index = 0;
        this.root = 0;
        this.selections = 0;
    }
    addValues(value){
        this.index++;
        this.values[this.index] = value;
        return this.index;
    }
    getValue (index) { return this.values[index] }
    setRoot() { this.root = this.index }
    getRoot () { return this.root }
    getIndex() {return this.index}
    mountTree(){ return this.mountNode(this.index) }
    mountNode(index){
        let node = this.getValue(index)
        if(!node) {return index}
        if(node.left) {node.left = this.mountNode(node.left)}
        if(node.right) {node.right = this.mountNode(node.right)}
        return node;
    }
    findNodeNextForTable(node){
        let table = []
        node.params.forEach((param) => {
            Object.keys(tableFrom).forEach((key) => {
                if (tableFrom[key].includes(param)){
                    table.push(key)
                }
            })
        })
        return table
    }
    findParent(node, start = this.root){
        let index = []
        let aux = start
        while(aux || index.length > 0){
            if(this.values[aux]){
                index.push(aux)
                aux = this.values[aux].left
            }
            else{
                aux = index.pop()
                if(this.values[aux].left == node || this.values[aux].right == node){
                    return aux
                }
                aux = this.values[aux].right
            }
        }
    }
    nodeHeight(){
        let heights = {}
        let iterador = 0
        heights[iterador] = [this.root]
        heights[iterador+1] = []
        if(this.values[this.root].left){
            heights[iterador+1].push(this.values[this.root].left)
        }
        if(this.values[this.root].right){
            heights[iterador+1].push(this.values[this.root].right)
        }
        while(heights[iterador+1].length > 0 || iterador < 3){
            iterador += 1
            heights[iterador+1] = []
            heights[iterador].forEach(entry => {
                if(this.values[entry]){
                    if(this.values[entry].left){
                        if(!heights[iterador+1].includes(this.values[entry].left)){
                            heights[iterador+1].push(this.values[entry].left)
                        }
                    }
                    if(this.values[entry].right){
                        if(!heights[iterador+1].includes(this.values[entry].right)){
                            heights[iterador+1].push(this.values[entry].right)
                        }
                    }
                }
            })
        }
        return heights
    }
}
function generateBinaryTree(tokens){
    let binary_tree = new binaryTree;
    newHandleToken(tokens, binary_tree)
    binary_tree.setRoot()
    return binary_tree
}
function newHandleToken(token, tree){
    let left = token.input[0].type ? newHandleToken(token.input[0], tree) : token.input[0]
    let right = token.input[1] ? token.input[1].type ? newHandleToken(token.input[1], tree) : token.input[1] : undefined
    let params = undefined
    if(token.params[0]){
        if(token.params[0].type){
            params = token.params.map((param) => { return handleParams(param, tree) })
        }
        else{ params = token.params }
    }
    return tree.addValues({
        value: token.type,
        params,
        left, 
        right
    })
}
function handleParams(token, tree){
    let left = token.params[0].type ? handleParams(token.params[0], tree) : undefined
    let right = token.params[1] ? token.params[1].type ? handleParams(token.params[1], tree) : undefined : undefined
    let params = left ? undefined : token.params
    return tree.addValues({
        value: token.type,
        params,
        left, 
        right
    })
}

let select1 = {
    type: 'projection',
    input: [
        { 
            type: 'junction',
            input: [{ 
                type: 'rename',
                input: ['Contas'],
                params: ['C']
            },
            { 
                type: 'rename',
                input: ['Usuarios'],
                params: ['U']
            }],
            params: ['U.idusuario', 'C.usuario_idusuario']
        },
    ],
    params: ['Nome', "Datanascimento", "idConta", "Descricao"]
}
let select2 = {
    type: 'projection',
    input: [
        { 
            type: 'junction',
            input: [
                "Totmov",
                { 
                    type: 'junction',
                    input: [
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
    input: [
        {type: 'junction',
        input: [
            { 
                type: 'projection',
                input: [
                    {
                        type: 'junction',
                        input: [
                            {
                                type: 'projection',
                                input: [
                                    {
                                        type: 'selection',
                                        input: ["Project"],
                                        params: ["PNAME", "Aquarius"]
                                    }
                                ],
                                params: ["PNUMBER"]
                            },
                            {
                                type: 'projection',
                                input: ["Works_On"],
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
                input: [
                    {
                        type: 'selection',
                        input: ["Employee"],
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
    input: [
        {
            type: "selection",
            input:[{
                type: "cartesian_product",
                input:[
                    "Project",
                    {
                        type: "cartesian_product",
                        input:["Works_On", "Employee"],
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
let select_putaquepariu = {
    "type": "projection",
    "params": [
        "nome", "x", "y", "z"
    ],
    "input": [
        {
            "type": "selection",
            "params": [
                {
                    "type": "or",
                    "params": [
                        {
                            "type": "and",
                            "params": [
                                {
                                    "type": "and",
                                    "params": [
                                        {
                                            "type": "=",
                                            "params": [
                                                "x",
                                                "nome"
                                            ],
                                            "input": []
                                        },
                                        {
                                            "type": "=",
                                            "params": [
                                                "y",
                                                "t"
                                            ],
                                            "input": []
                                        }
                                    ],
                                    "input": []
                                },
                                {
                                    "type": "=",
                                    "params": [
                                        "y",
                                        "z"
                                    ],
                                    "input": []
                                }
                            ],
                            "input": []
                        },
                        {
                            "type": "and",
                            "params": [
                                {
                                    "type": "like",
                                    "params": [
                                        "x",
                                        "b"
                                    ],
                                    "input": []
                                },
                                {
                                    "type": "or",
                                    "params": [
                                        {
                                            "type": "=",
                                            "params": [
                                                "b",
                                                "3"
                                            ],
                                            "input": []
                                        },
                                        {
                                            "type": "=",
                                            "params": [
                                                "c",
                                                "5"
                                            ],
                                            "input": []
                                        }
                                    ],
                                    "input": []
                                }
                            ],
                            "input": []
                        }
                    ]
                }
            ],
            "input": [
                {
                    "type": "cartesian_product",
                    "params": [],
                    "input": [
                        "usuario",
                        {
                            "type": "cartesian_product",
                            "params": [],
                            "input": [
                                "categoria",
                                {
                                    "type": "cartesian_product",
                                    "params": [],
                                    "input": [
                                        "movimentacao",
                                        "contas"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
let select_putaquepariuagrvai = {
    "type": "projection",
    "params": [
        "idcategoria", "SSN", 'x'
    ],
    "input": [
        {
            "type": "selection",
            "params": [
                {
                    "type": "or",
                    "params": [
                        {
                            "type": "and",
                            "params": [
                                {
                                    "type": "and",
                                    "params": [
                                        {
                                            "type": "=",
                                            "params": [
                                                "descricao",
                                                "xsxs"
                                            ],
                                            "input": []
                                        },
                                        {
                                            "type": "=",
                                            "params": [
                                                "categoria_idcategoria",
                                                "idcategoria"
                                            ],
                                            "input": []
                                        }
                                    ],
                                    "input": []
                                },
                                {
                                    "type": "=",
                                    "params": [
                                        "usuario_idusuario",
                                        "idusuario"
                                    ],
                                    "input": []
                                }
                            ],
                            "input": []
                        },
                        {
                            "type": "and",
                            "params": [
                                {
                                    "type": "like",
                                    "params": [
                                        "descricao",
                                        "asss"
                                    ],
                                    "input": []
                                },
                                {
                                    "type": "or",
                                    "params": [
                                        {
                                            "type": "=",
                                            "params": [
                                                "idtipoConta",
                                                "3"
                                            ],
                                            "input": []
                                        },
                                        {
                                            "type": "=",
                                            "params": [
                                                "descmovimento",
                                                "5"
                                            ],
                                            "input": []
                                        }
                                    ],
                                    "input": []
                                }
                            ],
                            "input": []
                        }
                    ],
                    "input": []
                }
            ],
            "input": [
                {
                    "type": "cartesian_product",
                    "params": [],
                    "input": [
                        "Usuario",
                        {
                            "type": "cartesian_product",
                            "params": [],
                            "input": [
                                "Categoria",
                                {
                                    "type": "cartesian_product",
                                    "params": [],
                                    "input": [
                                        "Movimentacao",
                                        "TipoConta"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

function heuristicA(treeObj, root){
    let tree = treeObj.values
    let sel_n_proj = []
    let index = []
    let aux = root
    while(aux || index.length > 0){
        if(tree[aux]){
            index.push(aux)
            aux = tree[aux].left
        }
        else{
            aux = index.pop()
            if(tree[aux].value == "selection" || tree[aux].value == "projection"){
                sel_n_proj.push(aux)
            }
            aux = tree[aux].right
        }
    }
    sel_n_proj.forEach((variable) => {
        if(treeObj.values[variable].value == "selection"){
            identifyLeaves(variable, treeObj)
        }
        else{
            //testingX(variable, treeObj)
        }
    })
}

function identifyLeaves(variable, treeObj){
    let leaves = []
    let index = []
    let aux = treeObj.values[variable].params[0]
    while(aux || index.length > 0){
        if(treeObj.values[aux]){
            index.push(aux)
            aux = treeObj.values[aux].left
        }
        else{
            aux = index.pop()
            if(!treeObj.values[aux].left && !treeObj.values[aux].right){
                leaves.push(aux)
            }
            aux = treeObj.values[aux].right
        }
    }
    identifyTablesUsedInLeaves(leaves, treeObj, variable)
}

function identifyTablesUsedInLeaves(leaves, treeObj, selection_original){
    let tablesUsed = []
    leaves.forEach(leaf => {
        let result = []
        treeObj.values[leaf].params.forEach(param => {
            Object.keys(tableFrom).forEach((key) => {
                if(tableFrom[key].includes(param)){
                    result.push(key)
                }
            })
        })
        tablesUsed.push({node: leaf, tables: result})
    })
    createNewSelectionsAndPutItInPlace(tablesUsed, treeObj, selection_original)
}

function createNewSelectionsAndPutItInPlace(tablesUsed, treeObj, selection_original){
    let tablesUsedInEveryNode = []
    for(let x = 1; x <= treeObj.getRoot(); x++){
        tablesUsedInEveryNode.push(whichTablesAreUsedInThisNode(x, treeObj))
    }
    let positions = []
    tablesUsed.forEach(entry => {
        let position
        tablesUsedInEveryNode.forEach((z, index) => {
            if(entry.tables.every(x => { return z.includes(x) })){
                if(!position){
                    position = {node: entry.node, go_to_above_of: index+1, length: z.length}
                }
                else if(position.length > z.length){
                    position = {node: entry.node, go_to_above_of: index+1, length: z.length}
                }
            }
        })
        if(position)
            positions.push(position)
    })
    positions.forEach(position => {
        let parent = treeObj.values[treeObj.findParent(position.go_to_above_of)]
        let new_selection = {
            value: "selection",
            params: [position.node],
            left: parent.left
        }
        parent.left = treeObj.addValues(new_selection)
    })
    let above_original = treeObj.values[treeObj.findParent(selection_original)]
    above_original.left = treeObj.values[selection_original].left
    treeObj.values[selection_original] = {}
    mergeSelectsInCascade(treeObj)
}

function mergeSelectsInCascade(treeObj){
    let index = []
    let aux = treeObj.getRoot()
    while(aux || index.length > 0){
        if(treeObj.values[aux]){
            index.push(aux)
            aux = treeObj.values[aux].left
        }
        else{
            aux = index.pop()
            if(treeObj.values[aux].value == "selection"){
                let child = treeObj.values[aux].left
                if(treeObj.values[child]){
                    if(treeObj.values[child].value == "selection"){
                        treeObj.values[aux].params = treeObj.values[aux].params.concat(treeObj.values[child].params)
                        treeObj.values[aux].left = treeObj.values[child].left
                        treeObj.values[child] = {}
                    }
                }
            }
            aux = treeObj.values[aux].right
        }
    }
    transformCartesianProductsInJunctionsWhenPossible(treeObj)
}

function transformCartesianProductsInJunctionsWhenPossible(treeObj){
    let index = []
    let aux = treeObj.getRoot()
    while(aux || index.length > 0){
        if(treeObj.values[aux]){
            index.push(aux)
            aux = treeObj.values[aux].left
        }
        else{
            aux = index.pop()
            if(treeObj.values[aux].value == "cartesian_product"){
                let parent = treeObj.findParent(aux)
                if(treeObj.values[parent].value == "selection"){
                    treeObj.values[aux].value = "junction"
                    treeObj.values[aux].params = treeObj.values[parent].params
                    let grand_parent = treeObj.findParent(parent)
                    if(treeObj.values[grand_parent].left == parent){
                        treeObj.values[grand_parent].left = aux
                    }
                    else{
                        treeObj.values[grand_parent].right = aux
                    }
                    treeObj.values[parent] = {}
                }
            }
            aux = treeObj.values[aux].right
        }
    }
    //testing6(treeObj)
}
///////////////////////INCOMPLETO - ERA PARA CALCULAR OS PROJECTIONS DE CADA NÍVEL DA ÁRVORE////////////////////////////////
/*function testing6(treeObj){
    let tablesUsedInEveryNode = []
    for(let x = 1; x <= treeObj.getIndex(); x++){
        tablesUsedInEveryNode.push(whichTablesAreUsedInThisNode(x, treeObj))
    }
    let variables_used = {}
    let index = []
    let aux = treeObj.getRoot()
    while(aux || index.length > 0){
        let variables = []
        if(treeObj.values[aux]){
            if(treeObj.values[aux].params){
                treeObj.values[aux].params.forEach(param => {
                    if(treeObj.values[param]){
                        treeObj.values[param].params.forEach(entry => {
                            variables.push(entry)
                        })
                    }
                    else{
                        variables.push(param)
                    }
                })
                variables_used[aux] = variables
            }
            index.push(aux)
            aux = treeObj.values[aux].left
        }
        else{
            aux = index.pop()
            aux = treeObj.values[aux].right
        }
    }
    let heights = treeObj.nodeHeight()
    let variables_per_height = {}
    let auxx = []
    Object.keys(heights).forEach(key =>{
        heights[key].forEach(entry => {
            if(variables_used[entry]){
                auxx = auxx.concat(variables_used[entry])
            }
        })
        variables_per_height[key] = auxx
    })
    Object.keys(heights).forEach(key =>{
        heights[key].forEach(entry => {
            if(variables_used[entry] && entry != treeObj.getRoot()){
                let parent = treeObj.findParent(entry)

                let usable_variables = []
                whichTablesAreUsedInThisNode(entry, treeObj).forEach((table) => {
                    variables_per_height[key].forEach((variable) => {
                        if(tableFrom[table].includes(variable)){
                            usable_variables.push(variable)
                        }
                    })
                })

                let will_use_variables = []
                usable_variables.forEach(variable => {
                    treeObj.values[entry].params.forEach(param => {
                        if(!treeObj.values[param].params.includes(variable)){
                            if(!will_use_variables.includes(variable)){
                                will_use_variables.push(variable)
                            }
                        }
                    })
                })
                //console.log(will_use_variables)



                let new_projection = treeObj.addValues({
                    value: "projection",
                    params: variables_per_height[key],
                    left: treeObj.values[entry]
                })
                /*if (treeObj.values[entry] == treeObj.values[parent].left){
                    treeObj.values[parent].left = new_projection
                }
                else{
                    treeObj.values[parent].right = new_projection
                }

            }
        })
    })
    
}*/


function whichTablesAreUsedInThisNode(variable, treeObj){
    let result = []
    let left = treeObj.values[variable].left
    let right = treeObj.values[variable].right
    if(left){
        if(!treeObj.values[left]){
           result.push(left)
        }
        else{
            result = result.concat(whichTablesAreUsedInThisNode(left, treeObj))
        }
    }
    if(right){
        if(!treeObj.values[right]){
            result.push(right)
        }
        else{
            result = result.concat(whichTablesAreUsedInThisNode(right, treeObj))
        }
    }
    return result
}


let response = generateBinaryTree(select_putaquepariuagrvai)
heuristicA(response, response.getRoot())
fs.writeFile("out_tree.json", JSON.stringify(response), 'utf8', (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Arquivo escrito com sucesso")
    }
})