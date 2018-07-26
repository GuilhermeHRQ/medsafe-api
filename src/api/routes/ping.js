module.exports = (app) => {
    app.get('/ping', (req, res) => {
        return res.status(200).json(data: new Date());
    });
};