module.exports = {
    ValidationContract
};

function ValidationContract(params) {
    this.errors = [];
    this.error = {};

    this.start = (field) => {
        this.field = field;
        return this
    };

    this.isString = () => {
        if (params[this.field] && (typeof params[this.field]) !== 'string')
            this.errors.push(`O campo ${this.field} deve ser um texto!`);
        return this
    };

    this.isNumber = () => {
        let num = parseFloat(params[this.field]);
        if (params[this.field] && ((typeof num) !== 'number' || isNaN(num)))
            this.errors.push(`O campo ${this.field} deve ser um número!`);
        return this
    };

    this.isBoolean = () => {
        if ((typeof params[this.field]) !== 'boolean')
            this.errors.push(`O campo ${this.field} deve ser um booleano!`);
        return this
    };

    this.isJSON = () => {
        if (params[this.field] && (typeof params[this.field]) !== 'object')
            this.errors.push(`O campo ${this.field} deve ser um objeto!`);
        return this
    };

    this.isRequired = () => {
        if (!params[this.field] || (typeof params[this.field]) === 'undefined')
            this.errors.push(`O campo ${this.field} é obrigatório!`);
        return this
    };

    this.hasMinLength = (min) => {
        if (!params[this.field] || params[this.field].length < min)
            this.errors.push(`O campo ${this.field} deve ter no mínimo ${min} caracteres!`);
        return this
    };

    this.hasMaxLength = (max) => {
        if (params[this.field] && params[this.field].length > max)
            this.errors.push(`O campo ${this.field} deve ter no máximo ${max} caracteres!`);
        return this
    };

    this.isFixedLength = (length) => {
        if (params[this.field] && params[this.field].length !== length)
            this.errors.push(`O campo ${this.field} deve ter ${max} caracteres!`);
        return this
    };

    this.isEmail = () => {
        let regExp = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!regExp.test(params[this.field]))
            this.errors.push(`O campo ${this.field} deve ser um E-mail válido!`);
        return this
    };

    this.isNotNull = () => {
        if (!params[this.field] || params[this.field] == null)
            this.errors.push(`O campo ${this.field} não pode ser nulo!`);
        return this
    };

    this.end = () => {
        if (this.errors.length > 0) {
            this.error = {
                list: this.errors
            };
            throw this.error
        }
    }
}