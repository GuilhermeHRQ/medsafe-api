module.exports = (app) => {
    const usuario = require('../../core/usuario/usuarioController');

    app.route('/usuario').post(usuario.inserir);
};
