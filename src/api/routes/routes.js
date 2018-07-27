module.exports = {
    seguranca: {
        usuario: {
            refazerLogin: {
                method: 'GET',
                url: `${global.config.host}:${global.config.port}/login/refazer`
            }
        }
    }
};