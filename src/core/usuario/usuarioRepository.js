const db = global.db;

module.exports = {
    inserir,
    selecionar,
    selecionarPorId,
    atualizar,
    remover
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

async function selecionar(params) {
    return await db.func('Seguranca.selecionarUsuario', [
        params.filtro,
        params.linhas,
        params.pagina
    ]);
}

async function selecionarPorId(params) {
    const data = await db.func('Seguranca.selecionarUsuarioPorId', [
        params.id
    ]);

    data[0].endereco = data[0].endereco[0];

    return data;
}

async function atualizar(params) {
    const data = await db.json('Seguranca.atualizarUsuario', [
        params.id,
        params.nome,
        params.sobrenome,
        params.email,
        params.cpf,
        params.dataNascimento,
        params.idTipoSanguineo,
        params.ativo,
        params.senha,
        params.logon,
        params.endereco,
        params.telefones
    ]);

    let error;

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 404;
            break;
        case 2:
        case 3:
        case 4:
            error = data;
            error.httpCode = 409;
            break;
    }

    if (error) {
        throw error;
    }

    return data;
}

async function remover(params) {
    const data = await db.json('Seguranca.removerUsuario', [
        params.id
    ]);

    let error;

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 404;
    }

    if (error) {
        throw error;
    }

    return data;
}