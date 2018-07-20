const jwt = require('jsonwebtoken');
const PASSWORD = 'X3SQU3';

function verify(funcao) {
    return async (req, res, next) => {

        if (req.method === 'OPTIONS')
            return res.status(204).end();

        let auth = req.headers.authentication ? req.headers.authentication : null;

        if (!auth) return res.status(400).json({error: 'Token não fornecido'});

        jwt.verify(auth, PASSWORD, async function (error, data) {
            if (error) return res.status(401).json({error: 'Sessão invalida'});

            req.token = data;

            funcao(req, res, next).catch(next);
        })
    };
}

async function gerarToken(req, data) {
    return await jwt.sign({
        user: req.body.login,
        idUsuario: data.content.id,
        admin: data.content.admin
    }, PASSWORD, {
        //expiresIn: '2 days'
    })
}

global.gerarToken = gerarToken;
global.verify = verify;
