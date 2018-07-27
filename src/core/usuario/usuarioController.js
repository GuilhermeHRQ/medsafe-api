const scope = require('./usuarioScope');
const repository = require('./usuarioRepository');
const service = require('./usuarioService');

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

async function inserir(req, res) {
    try {
        const params = {
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            cpf: req.body.cpf,
            dataNascimento: req.body.dataNascimento,
            idTipoSanguineo: req.body.idTipoSanguineo,
            senha: req.body.senha,
            logon: req.body.logon,
            endereco: req.body.endereco ? JSON.stringify(req.body.endereco) : null,
            telefones: req.body.telefones ? JSON.stringify(req.body.telefones) : null
        };

        await scope.inserir(params);

        let content = await repository.inserir(params);

        return res.finish({
            content: content
        });

    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function selecionar(req, res) {
    try {
        const params = {
            filtro: req.query.filtro,
            pagina: req.query.pagina || 1,
            linhas: req.query.linhas || 10
        };

        await scope.selecionar(params);

        const content = await repository.selecionar(params);
        let totalLinhas = content.length ? content[0].totalLinhas : 0;

        content.forEach(item => delete item.totalLinhas);

        return res.finish({
            totalLinhas,
            content
        });

    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function selecionarPorId(req, res) {
    try {
        const params = {
            id: req.params.id
        };

        await scope.selecionarPorId(params);

        const content = await repository.selecionarPorId(params);

        return res.finish({
            content
        })
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function atualizar(req, res) {
    try {
        const params = {
            id: parseInt(req.params.id),
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            cpf: req.body.cpf,
            dataNascimento: req.body.dataNascimento,
            idTipoSanguineo: req.body.idTipoSanguineo,
            ativo: req.body.ativo,
            senha: req.body.senha || null,
            logon: req.body.logon,
            endereco: req.body.endereco ? JSON.stringify(req.body.endereco) : null,
            telefones: req.body.telefones ? JSON.stringify(req.body.telefones) : null
        };

        await scope.atualizar(params);

        const content = await repository.atualizar(params);

        return res.finish({
            content
        });

    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function remover(req, res) {
    try {
        const params = {
            id: req.params.id
        };

        await scope.remover(params);

        const content = await repository.remover(params);

        return res.finish({
            content
        });

    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function preLogin(req, res) {
    try {
        const params = {
            login: req.body.login,
        };

        await scope.preLogin(params);

        const data = await service.preLogin(params);

        return res.finish({
            content: {
                user: data
            }
        });

    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function login(req, res) {
    try {
        const params = {
            login: req.body.login,
            senha: req.body.senha
        };

        await scope.login(params);

        const content = await service.login(params);

        return res.finish({
            content
        });

    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function refazerLogin(req, res) {
    try {
        const params = {
            id: req.token.id
        };

        const content = await service.refazerLogin(params);

        return res.finish({
            content
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        })
    }
}