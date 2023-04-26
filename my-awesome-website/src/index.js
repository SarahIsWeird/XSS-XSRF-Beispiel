const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const host = '127.0.0.1';
const port = 8080;

const passwords = {
    'Sarah': 'vollkrassespw',
};

const sessions = {};

const generateSessionToken = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYXYZ0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        const charIndex = Math.floor(Math.random() * chars.length);
        token += chars[charIndex];
    }

    return token;
};

const setSessionCookie = (res, session) => {
    const tenHours = 36000000;

    res.cookie('session', session, {
        domain: 'localhost',
        httpOnly: false,
        maxAge: tenHours,
        sameSite: 'lax',
        secure: false,
    });
};

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static('static'));

app.post('/login', (req, res) => {
    const username = req.body.username;
    if (!username) {
        res.status(400).send('Missing the username parameter.');
        return;
    }

    const password = req.body.password;
    if (!password) {
        res.status(400).send('Missing the password parameter.');
        return;
    }

    if (!passwords[username]) {
        res.status(404).send('Unknown user.');
        return;
    }

    if (passwords[username] !== password) {
        res.status(403).send('Wrong password.');
        return;
    }

    const session = generateSessionToken(16);
    sessions[session] = username;

    setSessionCookie(res, session);

    res.redirect('/');
});

const getSessionOrSend403 = (req, res) => {
    const session = req.cookies.session;
    if (!session || !sessions[session]) {
        res.status(403).send('You\'re not authorized to get this resource.');
        return null;
    }

    return session;
};

app.post('/changePassword', (req, res) => {
    const session = getSessionOrSend403(req, res);
    if (!session) return;

    if (!req.body.password) {
        res.send(400).send('Missing password field');
        return;
    }

    const username = sessions[session];
    passwords[username] = req.body.password;

    res.status(204).send();
});

app.get('/secret', (req, res) => {
    const session = getSessionOrSend403(req, res);
    if (!session) return;

    res.send(`Pst, ${sessions[session]}! Das ist voll krass geheim yo!`);
});

app.get('/welcome', (req, res) => {
    const name = req.query.name || 'wonderful person';

    const page = fs.readFileSync('templates/welcome.html', 'utf8')
        .replace('$NAME$', name);

    res.send(page);
});

app.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));
