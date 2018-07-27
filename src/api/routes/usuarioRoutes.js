const verify = global.verify;

module.exports = (app) => {
    const usuario = require('../../core/usuario/usuarioController');

    app.route('/usuario')
            .post(usuario.inserir)
            .get(verify(usuario.selecionar));

    app.route('/usuario/:id')
            .get(verify(usuario.selecionarPorId))
            .put(verify(usuario))
            .delete(usuario.remover);

    app.route('/login/dados').post(usuario.preLogin);
    app.route('/login').post(usuario.login);
    app.route('/login/refazer').get(verify(usuario.refazerLogin))
};
