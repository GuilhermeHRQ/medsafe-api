const scope = require('./usuarioScope');
const repository = require('./usuarioRepository');

module.exports = {
    inserir
}


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