class No{
    constructor(data,esquerda=null,direita=null){
        this.data = data
        this.esquerda = esquerda
        this.direita = direita
    }
}

class ArvoreBinaria{
    constructor(root = null){
        this.root = root
    }


    Inserir(data){
        let novoNo = new No(data)

        if(this.root === null){
            this.root = novoNo
        }else{
            this.InserirNo(this.root,novoNo)
        }
    }

    InserirNo(no,novoNo){
        if(novoNo.data < no.data){
            if(no.esquerda === null){no.esquerda = novoNo}else{this.InserirNo(no.esquerda,novoNo)}
        }else{
           if(no.direita === null){no.direita = novoNo}else{this.InserirNo(no.direita,novoNo)}
        }
    }

    Remover(data){
        this.root = this.RemoverNo(this.root,data)
    }


    RemoverNo(no,chave){
        if (no === null){
            return null;
        } else if (chave > no.data){
            no.direita = this.RemoverNo(no.direita, chave);
            return no;
        } else {
            if (no.esquerda === null && no.direita === null){
                no = null;
                return no;
            } 
            if(no.esquerda === null){
                no = no.direita;
                return no;
            } else if (no.direita === null){
                no = no.esquerda;
                return no;
            }
            let aux = this.EncontrarMenorNo(no.direita);
            no.data = aux.data;
            no.direita = this.RemoverNo(no.direita, aux.data);
            return no;
        }
    
    }


    EncontrarMenorNo(no){
        if(no.esquerda === null){
            return no
        }else{
            return this.EncontrarMenorNo(no.esquerda)
        }
    }
    EncontrarNoRaiz(){
        return this.root
    }
    EmOrdem(no){
        if(no !== null){
            this.EmOrdem(no.esquerda)
            console.log(no.data)
            this.EmOrdem(no.direita)
            
        }
    }
    PreOrdem(no){
        if(no !== null){
            console.log(no.data)
            this.PreOrdem(no.esquerda)
            this.PreOrdem(no.direita)
        }
    }
    PosOrdem(no){
        if(no !== null){
            this.PreOrdem(no.esquerda)
            this.PreOrdem(no.direita)
            console.log(no.data)
        }
    }
    Pesquisar(no,data){
        if(no === null){
            return null
        }else if(data < no.data){
            return this.Pesquisar(no.esquerda,data)
        }else if (data > no.data){
            return this.Pesquisar(no.direita,data)
        }else{
            return no
        }

        
    }


}






class ProcessadorDeConsultas{

    constructor(){}
    

    
}


let arvore = new ArvoreBinaria()


{
    "values": {
        "1": {
            "value": "cartesian_product",
            "params": [],
            "left": "Works_On",
            "right": "Employee"
        },
        "2": {
            "value": "cartesian_product",
            "params": [],
            "left": "Project",
            "right": 1
        },
        "3": {
            "value": "selection",
            "params": [
                {
                    "type": "AND",
                    "params": [
                        {
                            "type": "EQUAL",
                            "params": [
                                "P.NAME",
                                "Aquarius"
                            ]
                        },
                        {
                            "type": "EQUAL",
                            "params": [
                                "P.NUMBER",
                                "PNO"
                            ]
                        },
                        {
                            "type": "EQUAL",
                            "params": [
                                "ESSN",
                                "SSN"
                            ]
                        },
                        {
                            "type": "GREATER_THAN",
                            "params": [
                                "BDATE",
                                "1957-12-31"
                            ]
                        }
                    ]
                }
            ],
            "left": 2
        },
        "4": {
            "value": "projection",
            "params": [
                "LNAME"
            ],
            "left": 3
        }
    },
    "index": 4
}
