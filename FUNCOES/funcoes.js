//trazer a lista 

import { listarTodos } from "../MANIPULADOR/manipulador_Aluno.js";

//saber qual é o ultimo id cadastrado

//somar +1 para ser o proximo id 

//return 

export async function gerarNovoId() {
    const registrosAlunos = await listarTodos();
    
    //pegar todos os IDs existentes 
    const ids = registrosAlunos.map((aluno) => aluno.id);

    //retorna o maior ID encontrado + 1, garantindo que seja único
    const novoID = Math.max(...ids) + 1;
    return novoID;
}

