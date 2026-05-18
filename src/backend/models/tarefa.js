class Tarefa {
    constructor(id, descricao) {
        this.id = id;
        this.descricao = descricao;
        this.concluida = false;
        this.dataCriacao = new Date();
    }
}

module.exports = Tarefa;