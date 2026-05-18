
const form = document.getElementById('form-tarefa');
const inputDescricao = document.getElementById('input-descricao');
const listaTarefas = document.getElementById('lista-tarefas');

// 1. Função para buscar as tarefas do backend e exibir na tela
async function carregarTarefas() {
    const resposta = await fetch('/tarefas');
    const tarefas = await resposta.json();

    listaTarefas.innerHTML = ''; // Limpa a tela antes de renderizar

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');

        // Cria o checkbox
         const checkbox = document.createElement('input');
         checkbox.type = 'checkbox';
         checkbox.checked = tarefa.concluida;

         // Evento que dispara ao marcar/desmarcar a caixinha
        checkbox.addEventListener('change', () => alternarConclusao(tarefa.id, checkbox.checked));
        li.appendChild(checkbox);
         
        // Cria um span para o texto de tarefa
        const span = document.createElement('span');
        span.textContent = tarefa.descricao;
        span.classname = 'tarefa-texto';

        // Se a tarefa já estiver concluida no JSON, aplica a classe de riscado
        if (tarefa.concluida) {
            span.classList.add('concluida');
        }
        li.appendChild(span);

        // Cria o botão de excluir
        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.className = 'btn-excluir';
        botaoExcluir.addEventListener('click', () => deletarTarefa(tarefa.id));         // Atribui a função de deletar ao clique do botão, passando o ID da tarefa

        li.appendChild(botaoExcluir);
        listaTarefas.appendChild(li);
    });
}

// 2. Função para enviar uma nova tarefa para o backend
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    const descricao = inputDescricao.value;

    await fetch('/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao })
    });

    inputDescricao.value = ''; // Limpa o campo de digitação
    carregarTarefas(); // Atualiza a lista na tela

});

// 3. Atualizar o status da tarefa (PUT)
async function alternarConclusao(id, novoStatus) {
    await fetch(`/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ concluida: novoStatus }),
    });

    carregarTarefas();
}

// 4. Função para deletar uma tarefa no backend
async function deletarTarefa(id) {
    // Dispara a requisição para a URL com o ID da tarefa
    await fetch(`/tarefas/${id}`, {
        method: 'DELETE'
    });

    // Atualiza a lista na tela após deletar
    carregarTarefas();
}

// Executa ao abrir a página
carregarTarefas();