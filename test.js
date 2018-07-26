const consign = require('consign')({verbose: false});
const express = require('express');
const app = express();
const body = require('body-parser');
const response = require('./src/api/middleware/response');
const cors = require('./src/api/middleware/cors');
require('./settings/db');
require('./src/helpers/Authentication');

global.port = process.env.PORT || 9500;

module.exports = app;

app.use(cors);
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



setTimeout(() => {
    process.exit(0);
}, 1000);