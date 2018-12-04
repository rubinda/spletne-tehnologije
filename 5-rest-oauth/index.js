const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const chalk = require('chalk');
const mongoose = require('mongoose');
const OAuth2Server = require('oauth2-server');

const models = require('./models');
const apiRoutes = require('./routes');
const unprotected = require('./routes/unprotected');

const app = express();

// Uporabi te plugine (bodyParser je kljucen)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Belezenje requestov
app.use(morgan('dev'));

// Da preprecimo deprecated error, issue na trenutne driverju
// https://github.com/Automattic/mongoose/issues/6880
mongoose.set('useFindAndModify', false);


// Vzpostavi povezavo z bazo
mongoose.connect('mongodb://localhost/node-news', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, chalk.red('Napaka na povezavi z bazo :(')));
db.once('open', () => {
    console.log(chalk.greenBright('Povezan'), 'z bazo novic', chalk.yellowBright(':)'));
});

// OAuth2 avtentikacija
const oauth = new OAuth2Server({
    model: {
        generateAccessToken(client, user, scope) { // eslint-disable-line no-unused-vars
            // console.log(chalk.blue('Generating'), 'an access token');
        },

        generateRefreshToken(client, user, scope) { // eslint-disable-line no-unused-vars
            // console.log(chalk.blue('Generating'), 'a refresh token');
        },
        getClient(clientId, clientSecret) { // eslint-disable-line no-unused-vars
            // Posici klienta v bazi in ga vrni?
            return {
                id: 'NodeNews',
                grants: ['password', 'refresh_token'],
            };
        },

        getUserFromClient(client) { // eslint-disable-line no-unused-vars
            // console.log(chalk.blue('Getting'), 'user from client');
        },

        async getUser(username, password) {
            // Poisci uporabnika v bazi in ga vrni
            // console.log(chalk.blue('Getting'), 'user from pass');
            const user = await models.User.findOne({
                username,
                password,
            });
            return user;
        },

        saveToken(token, client, user) {
            // console.log('Saving token: ', JSON.stringify(token), 'for user: ',
            //    JSON.stringify(user), 'and client:', JSON.stringify(client));
            const tokec = new models.Token({
                access: token.accessToken,
                accessExp: token.accessTokenExpiresAt,
                refresh: token.refreshToken,
                refreshExp: token.refreshTokenExpiresAt,
                scope: token.scope,
                client: client.id,
                user: user.id,
            });
            tokec.save();
            return {
                accessToken: tokec.access,
                accessTokenExpiresAt: tokec.accessExp,
                refreshToken: tokec.refresh,
                refreshTokenExpiresAt: tokec.refreshExp,
                scope: tokec.scope,
                client: tokec.client,
                user: tokec.user,
            };
        },

        async validateScope(user, client, scope) {
            // uporabnik zahteva določen scope in tu spustimo naprej samo scope, ki jih dovolimo
            // ne rabimo mu odobriti vseh scopov, ki jih zahteva
            // dovoljeni scopi uporabnika so ponavadi zapisani v bazi
            // scope je poljuben niz, ponavadi več scopov ločimo z vejico
            const usr = await models.User.findOne({ _id: user.id });
            const VALID_SCOPES = usr.scopes;
            return scope.split(' ').filter(s => VALID_SCOPES.indexOf(s) >= 0).join(' ');
        },

        generateAuthorizationCode(code, client, user) { // eslint-disable-line no-unused-vars
            // console.log('generateAuthorizationCode');
        },

        async getAccessToken(accessToken) {
            // če najdeš token v bazi (shranjen je bil v funkciji saveToken) vrni objekt s tokenom
            // drugace null ali false
            // console.log(chalk.blue('Looking'), 'for an access token');

            const tokec = await models.Token.findOne({
                access: accessToken,
            }).populate('user');
            if (!tokec) {
                return false;
            }
            return {
                accessToken: tokec.access,
                accessTokenExpiresAt: tokec.accessExp,
                scope: tokec.user.scopes.join(' '),
                client: { id: tokec.client },
                user: tokec.user,
            };
        },

        getAuthorizationCode(authorizationCode) { // eslint-disable-line no-unused-vars
            // console.log('getAuthorizationCode');
        },

        async getRefreshToken(refreshToken) {
            // console.log(chalk.blue('Looking'), 'for a refresh token');
            const tokec = await models.Token.findOne({
                refresh: refreshToken,
            }).populate('user');
            if (!tokec) {
                return false;
            }
            return {
                refreshToken: tokec.refresh,
                refreshTokenExpiresAt: tokec.refreshExp,
                scope: tokec.user.scopes.join(' '),
                client: { id: tokec.client },
                user: tokec.user,
            };
        },

        revokeAuthorizationCode(code) { // eslint-disable-line no-unused-vars
            // console.log('revokeAuthorizationCode');
        },
        async revokeToken(token) {
            // iz baze pobriši refresh token
            // console.log(`revokeToken: ${JSON.stringify(token)}`);
            // če najdes vrnes true drugace false
            const found = await models.Token.findOneAndDelete({
                refresh: token,
            });
            if (!found) {
                return false;
            }
            return true;
        },
        saveAuthorizationCode(code, client, user) { // eslint-disable-line no-unused-vars
            // console.log('saveAuthorizationCode');
        },
        verifyScope(accessToken, scope) {
            // zahtevan scope je v scope, ki se poda pri klicu authenicate za api metodo
            // scope, ki je dovoljen userju je shranjen v accessToken.scope,
            // scope, ki ga uporabnik hoče uveljavit pa v argumentu scope
            // console.log(`verifyScope: ${JSON.stringify(accessToken)} scope: ${scope}`);
            if (!accessToken.scope) {
                return false;
            }
            const requestedScopes = scope.split(' ');
            const authorizedScopes = accessToken.scope.split(' ');
            return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
        },
    },
});

// endpoint za pridobivanje access in refresh tokena
app.post('/oauth/token', async (req, res, next) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
        const token = await oauth.token(request, response);
        // Todo: remove unnecessary values in response
        // console.log("oauth.token: " + JSON.stringify(token));
        return res.json(token);
    } catch (err) {
        return next(err);
    }
});

function authMiddleware(options) {
    return async (req, res, next) => {
        const request = new OAuth2Server.Request({
            headers: { authorization: req.headers.authorization },
            method: req.method,
            query: req.query,
            body: req.body,
        });
        const response = new OAuth2Server.Response(res);

        try {
            const token = await oauth.authenticate(request, response, options);
            req.user = token;
            next();
        } catch (err) {
            // Zahtevek ni avtoriziran
            next(err);
        }
    };
}

// Ce je zahteva prisla z Authorization headerjem poskusi preveriti
// ali je avtorizacija prava (klici naslednji route), ce pa ni prisoten,
// pa uporabi nezavarovan del
app.use('/api', (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        next();
    } else {
        unprotected(req, res, next);
    }
});
// Registrira auth habdlerja na cel endpoint
app.use('/api', authMiddleware(), apiRoutes);


// Dev error handler, will print a stacktrace
if (app.get('env') === 'development') {
    console.info(chalk.keyword('orange')('Using the development env, are you a developer?'));
    console.log('');
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            next(err);
        } else {
            res.status(err.status || 500).json({
                error: err.message,
                description: err.description,
                stack: err.stack,
            });
        }
    });
} else {
    // Production error handler, shouldn't leak
    // stacktraces to the user
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            next(err);
        } else {
            res.status(err.status || 500).json({
                error: err.message,
                description: err.description,
            });
        }
    });
}

app.listen(process.env.port || 3000, () => {
    console.log('Server running on', chalk.blue('http://localhost:3000'));
});
