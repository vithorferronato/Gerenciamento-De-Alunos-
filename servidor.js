// Imports
import express from "express";
import { listarTodos, salvarTodos } from "./MANIPULADOR/manipulador_Aluno.js";
import { gerarNovoId } from "./FUNCOES/funcoes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Rota inicial / Boas-vindas
app.get("/", (req, res) => {
    res.send("Bem-vindo a API do nosso gerenciador de alunos");
});

// GET /alunos - Listar todos os alunos
app.get("/alunos", async (req, res) => {
    try {
        const cadastros = await listarTodos();
        return res.status(200).json(cadastros);
    } catch (error) {
        console.log("Erro ao listar alunos", error);
        return res.status(500).json({ error: "Não foi possível ler os cadastros" });
    }
});

// GET /alunos - Listar só um aluno
app.get("/alunos/:id", async (req, res) => {
    try {
        const listar = await listarTodos();
        const id = Number(req.params.id)
        const aluno = listar.find((alunoSelecionado) => (alunoSelecionado.id === id))
        return res.status(200).json(aluno);
    }
    catch (error) {
        console.log(`Erro ao listar os alunos: ${error}`);
        res.status(404).json({ error: "Não foi possível encontrar esse aluno." })
    }
})

// DELETE /alunos/:id - Excluir um aluno por ID
app.delete("/alunos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const dados = await listarTodos();
        const dadosAtualizados = dados.filter((aluno) => aluno.id !== id);

        if (dadosAtualizados.length === dados.length) {
            return res.status(404).json({ erro: "Aluno não encontrado" });
        }

        await salvarTodos(dadosAtualizados);
        return res.status(200).json({ mensagem: "Aluno excluído com sucesso" });
    } catch (error) {
        console.log("Erro ao deletar aluno", error);
        return res.status(500).json({ error: "Não foi possível deletar o cadastro" });
    }
});

// POST /alunosPost - Cadastrar um novo aluno
app.post("/alunosPost", async (req, res) => {
    try {
        const {  nome, matricula, turma, data, presente, motivoSaida, minutosFora } = req.body;

        
        if ( !matricula || !nome || !turma || !data|| !presente || !motivoSaida || !minutosFora) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        //gerando um novo ID único
        const id = await gerarNovoId();
        
        const novoCadastro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora)
        };

        const cadastros = await listarTodos();
        cadastros.push(novoCadastro);
        
        await salvarTodos(cadastros);
        return res.status(201).json({ mensagem: "Cadastro realizado com sucesso" });
    } catch (error) {
        console.log("Erro ao salvar cadastro", error);
        return res.status(500).json({ error: "Não foi possível salvar o cadastro" });
    }
});

// PUT /alunos/:id - Atualizar um aluno existente
app.put("/alunos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const dados = await listarTodos();

        const alunoExistente = dados.find((aluno) => aluno.id === id);

        // CORREÇÃO: Entra no erro 404 apenas se o aluno NÃO for encontrado
        if (!alunoExistente) {
            return res.status(404).json({ erro: "Aluno não encontrado" });
        }

        const {  nome, matricula, turma, data, presente, motivoSaida, minutosFora } = req.body;

        // Validação de campos obrigatórios (considerando valores numéricos como válidos mesmo se forem 0)
        if ( !matricula || !nome || !turma || !data|| !presente || !motivoSaida || !minutosFora) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }

        const alunoAtualizado = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora)
        };

        // Substitui o aluno antigo pelo novo dentro da lista
        const dadosAtualizados = dados.map((aluno) => 
            aluno.id === id ? alunoAtualizado : aluno
        );

        await salvarTodos(dadosAtualizados);
        return res.status(200).json({ mensagem: "Aluno atualizado com sucesso" });
    } catch (error) {
        console.log("Erro ao alterar cadastro", error);
        return res.status(500).json({ error: "Não foi possível alterar o cadastro" });
    }
});

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});

app.listen(PORT, () => {
    console.log("Está rodando na porta: ", PORT);
});
