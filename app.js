const consign = require('consign')({verbose: false});
const express = require('express');
const app = express();
const body = require('body-parser');
require('./settings/db');
require('./src/helpers/Authentication');
const response = require('./src/api/middleware/response');

global.port = process.env.PORT || 9500;

module.exports = app;

let allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authentication');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
};

app.use(allowCors);
app.use(response);
app.use(body.json({limit: '30mb'}));
app.use(body.urlencoded({limit: '30mb', extended: true}));

app.use(express.static(require('path').join(__dirname, '/src/files')));

consign
    .include('./src/api/routes')
    .into(app);

app.listen(global.port, () => {
    console.log(`Server online on port ${global.port} `)
});
