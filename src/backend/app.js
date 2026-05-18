const express = require('express'); //Importa o módulo Express
const fs = require('fs').promises; // Importa a versão do FS que trabalha com Promises (async/await)
const path = require('path'); // Módulo nativo para gerenciar caminhos de arquivos
const Tarefa = require('./models/Tarefa');
const caminhoArquivo = path.join(__dirname, '..', '..', 'data', 'tarefas.json'); //Para evitar erros de arquivo não encontrado no futuro
const app = express(); //Inicializa a aplicação
app.use(express.json()); //Recebe e transforma os dados brutos em um objeto JS
app.use(express.static(path.join(__dirname, '..', 'frontend')));


app.get('/tarefas', async(req, res) => {
    try {
        // 1. Lê o arquivo JSON como texto bruto (string)
        const dadosBrutos = await fs.readFile(caminhoArquivo, 'utf-8');

        // 2. Converte o texto bruto de volta para um Array/Objeto JavaScript
        const tarefas = JSON.parse(dadosBrutos);''

        // 3. Devolve as tarefas para o navegador
        res.json(tarefas);
    } catch(erro) {
        console.error('Erro ao ler o arquivo:', erro);
        res.status(500).json({ mensagem: 'Erro interno ao carregar as tarefas.' });
    }
});

app.post('/tarefas', async (req, res) => {
    try {
        // 1. Pega a descrição enviada no corpo (body) da requisição
        const { descricao } = req.body;

        // Validação básica para não salvar tarefas vazias
        if (!descricao) {
            return res.status(400).json({ mensagem: 'A descrição é obrigatória.' });
        }

        // 2. Lê o arquivo JSON existente para não apagar o que já está salvo
        const dadosBrutos = await fs.readFile(caminhoArquivo, 'utf-8');
        const tarefas = JSON.parse(dadosBrutos);

        // 3. Cria um ID único baseado no que já existe e gera a nova tarefa com a sua Classe
        const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1;
        const novaTarefa = new Tarefa(novoId, descricao);

        // 4. Adiciona a nova tarefa ao Array
        tarefas.push(novaTarefa);

        // 5. Salva o array atualizado de volta no arquivo JSON
        // O JSON.stringfy com os parâmetros null e 2 serve para deixar o arquivo .json legível e formatado
        await fs.writeFile(caminhoArquivo, JSON.stringify(tarefas, null, 2));

        //6. Devolve a tarefa criada com o status 201 (Created)
        res.status(201).json(novaTarefa);


    } catch (erro) {
        console.error('Erro ao salvar a tarefa', erro);
        res.status(500).json({ mensagem: 'Erro interno ao salvar a tarefa.' });
    }
});

app.delete('/tarefas/:id', async(req, res) => {
    try {
        // 1. Pega o ID enviado na URL e converte para número
        const idDeletar = parseInt(req.params.id);

        // 2. Lê o arquivo JSON atual
        const dadosBrutos = await fs.readFile(caminhoArquivo, 'utf-8');
        let tarefas = JSON.parse(dadosBrutos);

        // 3. Filtra o array, gerando um novo array sem a tarefa do ID selecionado
        const tarefasFiltradas = tarefas.filter(tarefa => tarefa.id !== idDeletar);

        // Se o tamanho do array não mudou, significa que o ID não existia
        if (tarefas.length === tarefasFiltradas.length) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        // 4. Salva o array atualizado de volta no arquvi JSON
        await fs.writeFile(caminhoArquivo, JSON.stringify(tarefasFiltradas, null, 2));

        // 5. Retorna uma mensagem de sucesso
        res.json({ mensagem: 'Tarefa deletada!' });

    } catch (erro) {
        console.error('Erro ao deletar a tarefa: ', erro);
        res.status(500).json({ mensagem: 'Erro interno ao deletar a tarefa' });
    }
});


app.put('/tarefas/:id', async (req, res) => {
    try {
        const idAtualizar = parseInt(req.params.id);
        const { concluida } = req.body; // Pega o novo status enviado pelo frontend

        // 1. Lê o arquivo JSON
        const dadosBrutos = await fs.readFile(caminhoArquivo, 'utf-8');
        let tarefas = JSON.parse(dadosBrutos);

        // 2. Encontra a tarefa correspondente no  array
        const tarefa = tarefas.find(t => t.id === idAtualizar);

        if (!tarefa) {
            return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        }

        // 3. Atualiza apenas a propriedade 'concluida'
        tarefa.concluida = concluida;

        // 4. Salva o array modificado de volta no arquivo JSON
        await fs.writeFile(caminhoArquivo, JSON.stringify(tarefas, null, 2));

        // 5. Retorna a tarefa atualizada
        res.json(tarefa);
    } catch (erro) {
        console.error('Erro ao atualizar a tarefa:', erro);
        res.status(500).json({ mensagem: 'Erro interno ao atualizar a tarefa.' });
    }
});


app.listen(3000, () => {    
    console.log('Acessar porta: http://localhost:3000');
    console.log('Servidor executando na porta 3000.')
});