module.exports = (app) => {
    const usuario = require('../../core/usuario/usuarioController');

    app.route('/usuario')
        .post(usuario.inserir)
        .get(usuario.selecionar);

    app.route('/usuario/:id')
        .get(usuario.selecionarPorId)
        .put(usuario.atualizar)
        .delete(usuario.remover);
};
