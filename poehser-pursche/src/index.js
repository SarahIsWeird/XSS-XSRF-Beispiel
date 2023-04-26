const express = require('express');

const app = express();
const hostname = '127.0.0.1';
const port = 9090;

app.use(express.static('static'));

app.listen(port, hostname, () => console.log(`Listening at http://${hostname}:${port}`));
