const db = global.db;

module.exports = {
    inserir
};

async function inserir(params) {
    const data = await db.json('Seguranca.inserirUsuario', [
        params.nome,
        params.sobrenome,
        params.email,
        params.cpf,
        params.dataNascimento,
        params.idTipoSanguineo,
        params.senha,
        params.logon,
        params.endereco,
        params.telefones
    ]);

    let error;

    switch (data.executionCode) {
        case 1:
        case 2:
        case 3:
            error = data;
            error.httpCode = 409;
    }

    if (error) {
        throw error;
    }

    return data.content;
}