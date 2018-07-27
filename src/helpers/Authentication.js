const jwt = require('jsonwebtoken');
const PASSWORD = 'X3SQU3';

function verify(fn) {
    return async (req, res, next) => {
        if (req.method === 'OPTIONS') {
            return res.finish({
                httpCode: 204
            });
        }

        const auth = req.headers.authentication || null;

        if (!auth) {
            return res.finish({
                httpCode: 401,
                message: 'Acesso restrito'
            });
        }

        jwt.verify(auth, PASSWORD, async (error, data) => {
            if (error) {
                return res.finish({
                    httpCode: 401,
                    message: 'Sessão inválida'
                });
            }

            req.token = data;

            fn(req, res, next).catch(next);
        });
    };
}

async function gerarToken(data) {
    return jwt.sign(data, PASSWORD, { expiresIn: '99d' });
}

global.gerarToken = gerarToken;
global.verify = verify;
