const express = require('express');

const models = require('../models');

const router = express.Router();

// Nezavarovan API, uporabnik ki ga klice lahko bere le brezplacne novice
router.get('/', (req, res, next) => {
    res.send('Free API');
});

router.get('/news', async (req, res, next) => {
    const news = await models.Article.aggregate([
        {
            $match: {
                subscriptionType: 'free',
            },
        },
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
                description: '$desciprtion',
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


module.exports = router;
