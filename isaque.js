const fs = require('fs')


var tableFrom = {
    "Categoria": ["idcategoria", "desccategoria"],
    "Contas": ["idconta", "ESSN", "tipoconta_idtipoconta", "usuario_idUsuario", "saldoinicial"] ,
    "Movimentacao": ["idmovimentacao", "SSN", "descricao", "tipomovimento_idmovimento", "categoria_idcategoria", "contas_idconta", "valor"],
    "TipoMovimento": ["idtipomovimento", "descmovimento", "P.NAME"],
    "TipoConta": ["idtipoConta", "PNO"],
    "Usuario": ["idusuario", "nome", "logradouro", "BDATE", "bairro", "cep", "uf", "datanascimento"]
};

class binaryTree{
    constructor(){
        this.values = {};
        this.index = 0;
        this.root = 0;
    }
    addValues(value){
        this.index++;
        this.values[this.index] = value;
        return this.index;
    }
    getValue (index) { return this.values[index] }
    getRoot () { return this.root }
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
}
function generateBinaryTree(tokens){
    let binary_tree = new binaryTree;
    newHandleToken(tokens, binary_tree)
    this.root = this.index
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
        "nome", "P.NAME"
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
                    ],
                    "input": []
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

let x = generateBinaryTree(select_putaquepariuagrvai)
heuristicA(x, x.getRoot())

function heuristicA(treeObj, root){
    let tree = treeObj.values
    let sel_n_proj = []
    let index = []
    let nodes = []
    let aux = root
    while(aux || index.length > 0){
        if(tree[aux]){
            index.push(aux)
            aux = tree[aux].left
        }
        else{
            aux = index.pop()
            if(tree[aux].value == "selection" || tree[aux].value == "projection"){
                sel_n_proj.push(tree[aux])
            }
            aux = tree[aux].right
        }
    }
    console.log(sel_n_proj)
    sel_n_proj.forEach((variable) => {
        if(variable.value == "selection"){
            findTablesSelection(variable, treeObj)
        }
        else{
            console.log(findTablesProjection(variable, treeObj))
        }
    })
}

function findTablesSelection(variable, treeObj){
    console.log(splitSelections(variable))
}

function splitSelections(variable){
    let result = Object.keys(tableFrom).forEach((key) => {
        if (tableFrom[key].includes(variable.params[0])){
            result.push(key)
        }
    })
    if(result.length <= 0){
        
    }
}

function findTablesProjection(variable){
    let result = []
    variable.params.forEach((param) => {
        Object.keys(tableFrom).forEach((key) => {
            if (tableFrom[key].includes(param)){
                result.push(key)
            }
        })
    })
    return result
}

let response = generateBinaryTree(select_putaquepariuagrvai)
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