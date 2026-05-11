const express = require('express'); //Importa o módulo Express
const app = express(); //Inicializa a aplicação
app.use(express.json()); //Recebe e transforma os dados brutos em um objeto JS


app.get('/tarefas', (req, res) => {
    res.json([
        { id:  1, tarefa: 'Estudar Node.js', concluida: false},
        { id: 2, tarefa: 'Configurar  um projeto', concluida: true}
    ]);
});

app.listen(3000, () => {    
    console.log('Acessar porta: http://localhost:3000');
    console.log('Servidor executando na porta 3000.')
});