const validate = require('../../helpers/validacao');

module.exports = {
    inserir,
    selecionar,
    selecionarPorId,
    atualizar,
    remover
};

async function inserir(params) {
    const data = new validate.ValidationContract(params);

    try {
        data.start('nome')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(50)

            .start('sobrenome')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(50)

            .start('email')
            .isRequired()
            .isNotNull()
            .hasMaxLength(255)
            .isEmail()

            .start('cpf')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(11)

            .start('dataNascimento')
            .isRequired()
            .isNotNull()
            .isDate()

            .start('idTipoSanguineo')
            .isRequired()
            .isNotNull()
            .isNumber()

            .start('senha')
            .isRequired()
            .isNotNull()
            .isString()

            .start('ativo')
            .isRequired()
            .isNotNull()
            .isBoolean()

            .start('logon')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(30)

            .end();
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function selecionar(params) {
    const data = new validate.ValidationContract(params);

    try {
        data
            .start('filtro')
            .isString()
            .hasMaxLength(200)

            .end();
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function selecionarPorId(params) {
    const data = new validate.ValidationContract(params);

    try {
        data
            .start('id')
            .isRequired()
            .isNotNull()

            .end();
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function atualizar(params) {
    const data = new validate.ValidationContract(params);

    try {
        data
            .start('id')
            .isNotNull()
            .isRequired()

            .start('nome')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(50)

            .start('sobrenome')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(50)

            .start('email')
            .isRequired()
            .isNotNull()
            .hasMaxLength(255)
            .isEmail()

            .start('cpf')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(11)

            .start('dataNascimento')
            .isRequired()
            .isNotNull()
            .isDate()

            .start('idTipoSanguineo')
            .isRequired()
            .isNotNull()
            .isNumber()

            .start('senha')
            .isString()

            .start('logon')
            .isRequired()
            .isNotNull()
            .isString()
            .hasMaxLength(30)

            .end();
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}

async function remover(params) {
    const data = new validate.ValidationContract(params);

    try {
        data
            .start('id')
            .isRequired()
            .isNotNull()

            .end();
    } catch (error) {
        error.httpCode = 400;
        throw error;
    }
}