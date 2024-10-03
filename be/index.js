const express = require('express');
const app = express();
const router = require('./route/router');
require('dotenv').config();

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello World')
});

app.listen(process.env.DEV_PORT, () => {
    console.log('Server is running on port', process.env.DEV_PORT);
});