const mongoose = require('mongoose');
const models = require('../models');
const ValidError = require('./valid-error');

module.exports = {
    // Preveri ali je zahtevo prozil uporabnik, ki je tudi admin
    isAdmin: (req, res, next) => {
        // Vedno ima podanega uporabnika v zahtevi, saj se klice pri zavarovanim viru
        const tokec = req.user;
        if (tokec.user.role === 'admin') {
            next();
        } else {
            next(new ValidError('Unauthorized', 'Given user is not an admin', 401));
        }
    },

    // Preveri ali so v telesu zahtevka podatki za ustvarjanje nove novice
    hasArticle: (req, res, next) => {
        const { subscriptionType, title, description } = req.body;
        if (!subscriptionType || !title || !description) {
            next(new ValidError('Missing article fields in request body', 'Please include a title, description and subscriptionType field', 400));
        } else {
            next();
        }
    },

    // Preveri ali posiljatelj zahteve (vedno znan) lastnik za zahtevan clanek (novico)
    ownsArticle: async (req, res, next) => {
        const { id } = req.params;
        const tokec = req.user;

        models.Article.findById(id, (err, art) => {
            if (err) {
                next(err);
            } else if (art.user.equals(tokec.user._id)) {
                // all ok
                next();
            } else {
                next(new ValidError('Unauthorized to edit this news article', 'You are not the owner of this article and can not edit it', 401));
            }
        });
    },

    // Preveri ali zahtevek v telesu vsebuje veljavne scope
    hasValidScopes: (req, res, next) => {
        const { scopes } = req.body;

        // Preveri ali so podani scopes v seznamu
        if (Array.isArray(scopes)) {
            const VALID_SCOPES = ['read', 'write'];
            const newScopes = scopes.filter(s => VALID_SCOPES.indexOf(s) >= 0);
            req.body.scopes = newScopes;
            next();
        } else {
            next(new ValidError('Invalid scopes given', 'The scopes should be sent in an array of strings', 400));
        }
    },

    // Preveri ali je v telesu dovolj podatkov za ustvarjanje novega komentarja
    hasComment: async (req, res, next) => {
        const { contents, article } = req.body;
        if (!contents) {
            next(new ValidError('Comment can not be empty', 'Include a contents field with the comment in the body', 400));
        } else if (!article) {
            next(new ValidError('Comment must belong to an article', 'Include an article field in the request', 400));
        } else if (!mongoose.Types.ObjectId.isValid(article)) {
            next(new ValidError('Invalid news article ID', 'Please provide a valid MongoDB ObjectID', 400));
        } else if (await models.Article.find({ _id: article }).limit(1) == null) {
            next(new ValidError('Article does not exist', 'You can not comment on an article that doesn\'t exist', 400));
        } else {
            next();
        }
    },

    // Preveri ali podan uporabnik lahko komentira
    canComment: async (req, res, next) => {
        const tokec = req.user;

        // Komentira lahko uporabnik, ki je admin ali ima scope write
        if (tokec.user.role === 'admin' || tokec.user.scopes.includes('write')) {
            next();
        } else {
            next(new ValidError('Unauthorized to comment', 'You are not authorized to comment on articles', 401));
        }
    },
};
