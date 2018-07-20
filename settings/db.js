const databaseConfig = {
    'host': '52.90.224.139',
    'port': 5432,
    'database': 'medsafe',
    'user': 'postgres',
    'password': 'fakeTrello'
};

const db = require('pg-promise')()(databaseConfig);

global.db = {
    json: async function (query, params) {
        let result = await db.proc(query, params);

        return result ? result[Object.keys(result)[0]] : null;
    },
    query: db.query,
    proc: db.proc,
    func: db.func
};