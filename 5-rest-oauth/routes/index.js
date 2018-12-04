const express = require('express');
const mongoose = require('mongoose');

const mw = require('./middleware');
const ValidError = require('./valid-error');
const models = require('../models');

const router = express.Router();

// Zavarovan API, uporanbik lahko glede na vlogo in scope izvaja razlicne akcije,
// glej README.md za poln opis
router.get('/', (req, res, next) => {
    res.send('Premium API');
});


// /news lahko bere vsak prijavljen uporabnik (scope read ali write)
router.get('/news', async (req, res, next) => {
    const news = await models.Article.aggregate([
        {
            $lookup: {
                from: models.Comment.collection.name,
                localField: '_id',
                foreignField: 'article',
                as: 'comments',
            },
        },
        {
            $project: {
                id: '$_id',
                author: '$author',
                title: '$title',
                description: '$description',
                createdAt: '$createdAt',
                lastModified: '$lastModifed',
                subscriptionType: '$subscriptionType',
                comments: '$comments',
                _id: 0,
            },
        },
    ]);
    const authorsPopulated = await models.User.populate(news, { path: 'author', select: '-scopes ' });
    const commentAuthorPopulated = await models.User.populate(authorsPopulated, { path: 'comments.author', select: '-scopes ' });
    res.status(200).json(commentAuthorPopulated);
});

// Dobi podatke o doloceni novici
router.get('/news/:id', async (req, res, next) => {
    const { id } = req.params;

    // Preveri ali je ID veljaven MongoDB ObjectID
    if (mongoose.Types.ObjectId.isValid(id)) {
        const news = await models.Article.findOne({ _id: id }).populate('author');
        if (news) {
            res.status(200).json(news);
        } else {
            // ID veljaven, vendar ne obstaja novica
            next(new ValidError('News article not found', 'The news article with the given ID was not found', 400));
        }
    } else {
        // Ni veljaven MongoDB ObjectID
        next(new ValidError('Not a valid id', 'The given ID is not a valid MongoDB ObjectID', 400));
    }
});

// novico lahko ureja le tisti, ki jo je ustvaril
router.patch('/news/:id', mw.isAdmin, mw.ownsArticle, async (req, res, next) => {
    // Pridobi podatke o novici iz URL in telesa zahtevka
    const { id } = req.params;
    const { title, description, subscriptionType } = req.body;
    const updateFields = {};

    // Dodaj parametre za posodobitev, ce so nastavljeni
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (subscriptionType) updateFields.subscriptionType = subscriptionType;

    // nastavi, da je novica bila posodobljena
    updateFields.lastModified = Date.now();
    const updatedArticle = await models.Article.findOneAndUpdate({ _id: id },
        { $set: updateFields }, { new: true });
    res.status(200).json(updatedArticle);
});

// Adminu dovoli, da posodobi scope za dolocenega uporabnika
router.patch('/users/:id/scope', mw.isAdmin, mw.hasValidScopes, async (req, res, next) => {
    // Pridobi id iz URL zahtevka in scopes iz telesa
    const { id } = req.params;
    const { scopes } = req.body;

    // Preveri ali je ID veljaven MongoDB ObjectID
    if (mongoose.Types.ObjectId.isValid(id)) {
        // Posodobi uporabnika in vrni novo vrednost
        const updatedUser = await models.User.findOneAndUpdate({ _id: id },
            { $set: { scopes } }, { new: true });
        res.status(200).json(updatedUser);
    } else {
        // Ni veljaven MongoDB ObjectID
        next(new ValidError('Not a valid id', 'The given ID is not a valid MongoDB ObjectID', 400));
    }
});


// Middleware preveri ali je uporabnik admin in ali imamo vsa potrebna polja
// za kreiranje nove novice.
router.post('/news', mw.isAdmin, mw.hasArticle, (req, res, next) => {
    // Pridobi podatke o novici iz telesa zahtevka
    const { subscriptionType, title, description } = req.body;

    // Ustvari novo novico
    const newNews = models.Article({
        title,
        description,
        author: req.user.user._id,
        subscriptionType,
        createdAt: Date.now(),
        lastModified: Date.now(),
    });
    newNews.save();

    // Pri odgovoru poslji No content in lokacijo v headerju
    res.setHeader('Location', `http://localhost:3000/api/news/${newNews.id}`);
    res.sendStatus(201);
});

// Komentarje lahko ustvarja le admin / uporabnik, ki ima write scope
router.post('/comments', mw.canComment, mw.hasComment, (req, res, next) => {
    const { contents, article } = req.body;

    const newComment = models.Comment({
        author: req.user.user,
        article,
        contents,
        createdAt: Date.now(),
    });
    newComment.save();
    res.sendStatus(201);
});


module.exports = router;
