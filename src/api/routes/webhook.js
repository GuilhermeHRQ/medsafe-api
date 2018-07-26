// const exec = require('child_process').exec;
//
// module.exports = (app) => {
//     app.route('/webhook').post((req, res) => {
//         let command = 'git pull';
//
//         exec(command, (err, out) => {
//             if (err) console.error(err);
//
//             console.log(out);
//             return res.status(200).json({content: out})
//         })
//     })
// };