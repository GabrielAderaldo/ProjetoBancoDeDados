const fs = require('fs')

function generateBinaryTree(tokens){
    return handleToken(tokens)
}
function handleToken(token){
    if(!token.inputs[0].type){ //Checagem se há uma operação após ao veriguar se no input há um objeto ou uma string
        console.log("here")
        return {
            value: token.type,
            params: token.params,
            left: token.inputs[0], 
            right: token.inputs[1]
        }
    }
    let left = handleToken(token.inputs[0])
    let right = token.inputs[1] ? handleToken(token.inputs[1]) : undefined
    return {
        value: token.type,
        params: token.params,
        left, 
        right
    }
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
                                params: ["ESSN, PNO"]
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
    params: ["ESSN", "SSN"]
}

let response = generateBinaryTree(select1)
response = generateBinaryTree(select2)
response = generateBinaryTree(select3)

fs.writeFile("out.json", JSON.stringify(response), 'utf8', (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Arquivo escrito com sucesso")
    }
})
//console.log(response)