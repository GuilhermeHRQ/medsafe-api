const messagePool = {
    200: 'OK',
    400: 'Requisição inválida',
    401: 'Requisição não autorizada',
    403: 'Requisição proibida',
    404: 'Recurso não encontrado',
    409: 'Requisição conflitante',
    500: 'Erro interno'
};

module.exports = response;

//noinspection JSUnusedLocalSymbols
function response(req, res, next) {
    res.finish = (result) => {
        finish(res, result, next);
    };

    next();
}

function finish(res, result, next) {
    if (!result) result = {};

    result.httpCode = result.httpCode || 200;

    res.httpCode = result.httpCode;

    let message = result.message || messagePool[result.httpCode];

    if (result.error) {
        message = ((result.httpCode < 500) ? result.error.message : null) || message;

        res.errorCode = result.error.executionCode;
        res.description = result.error.message || result.error;
    }

    res.status(result.httpCode);

    res.json({
        executionCode: result.error && result.error.executionCode !== 0 ? result.error.executionCode : undefined,
        content: result.content,
        message,
        validationErrors: (result.httpCode === 400) ? result.error : undefined,
        totalLinhas: (result.content && result.content.length > -1) ? (result.totalLinhas ? result.totalLinhas : (result.content[0] ? result.content[0].totalLinhas : 0)) : undefined,
        // internalError: !global.config.isProduction && result.httpCode === 500 ? res.description : undefined
    });

    next();
}
