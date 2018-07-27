const db = global.db;

module.exports = {
    inserir,
    selecionar,
    selecionarPorId,
    atualizar,
    remover,
    preLogin,
    login,
    refazerLogin
};

async function inserir(params) {
    const data = await db.json('Seguranca.InserirUsuario', [
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
    return await db.func('Seguranca.SelecionarUsuario', [
        params.filtro,
        params.linhas,
        params.pagina
    ]);
}

async function selecionarPorId(params) {
    const data = await db.func('Seguranca.SelecionarUsuarioPorId', [
        params.id
    ]);

    data[0].endereco = data[0].endereco[0];

    return data;
}

async function atualizar(params) {
    const data = await db.json('Seguranca.AtualizarUsuario', [
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
    const data = await db.json('Seguranca.RemoverUsuario', [
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


async function preLogin(params) {
    let data = await db.func('Seguranca.LoginUsuario', [
        params.login,
        params.senha
    ]);

    data = data[0];

    if (!data) {
        return {
            executionCode: 1,
            message: 'Usuário não encontrado'
        }
    } else if (!data.ativo) {
        return {
            executionCode: 2,
            message: 'Usuário bloqueado ou inativo'
        }
    }

    return data;
}

async function login(params) {
    let data = await db.func('Seguranca.LoginUsuario', [
        params.login,
        params.senha
    ]);

    data = data[0];

    if (!data) {
        return {
            executionCode: 1,
            message: 'Usuário não encontrado'
        }
    } else if (!data.senhaCorreta) {
        return {
            executionCode: 2,
            message: 'Senha incorreta'
        }
    } else if (!data.ativo) {
        return {
            executionCode: 3,
            message: 'Usuário bloqueado ou inativo'
        }
    }

    delete data.ativo;
    delete data.senhaCorreta;

    return data;
}

async function refazerLogin(params) {
    let data = await db.func('Seguranca.RefazLogin', [
        params.id
    ]);

    data = data[0];

    if (!data) {
        return {
            executionCode: 1,
            message: 'Usuário não encontrado'
        }
    }

    return data;
}