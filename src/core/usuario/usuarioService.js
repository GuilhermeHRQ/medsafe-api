const repository = require('./usuarioRepository');
const routes = require('../../api/routes/routes');

module.exports = {
    preLogin,
    login,
    refazerLogin
};

async function preLogin(params) {
    const data = await repository.preLogin(params);

    let error;

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 404;
            break;
        case 2:
            error = data;
            error.httpCode = 401;
    }

    if (error) {
        throw error;
    }
    delete data.senhaCorreta;

    return data;
}

async function login(params) {
    const data = await repository.login(params);

    let error;

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 404;
            break;
        case 2:
        case 3:
            error = data;
            error.httpCode = 401;
            break;
    }

    if (error) {
        throw error;
    }

    const token = await global.gerarToken({id: data.id, email: data.email, logon: data.logon});

    return {
        user: data,
        api: routes,
        opcao: [],
        token: token
    }
}

async function refazerLogin(params) {
    const data = await repository.refazerLogin(params);

    let error;

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 404;
    }

    if (error) {
        throw error;
    }

    const token = await global.gerarToken({id: data.id, email: data.email, logon: data.logon});

    return {
        user: data,
        api: routes,
        opcao: [],
        token: token
    }
}