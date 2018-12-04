const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Types.ObjectId, ref: 'User' }, // e.g. MongoDB id for the User
    contents: String, // e.g. 'Woo, koncno ti je uspelo zakjucit nalogo'
    createdAt: Date, // e.g. 5.12.2018 17:30
    article: { type: mongoose.Types.ObjectId, ref: 'Article' }, // e.g. MongoDB id for the news Article
}, {
    toJSON: {
        transform: (docs, ret) => {
            const obj = ret;
            obj.id = obj._id;
            delete obj._id;
            delete obj.__v;
            return obj;
        },
    },
});

const Comment = mongoose.model('Comment', commentSchema, 'comments');

module.exports = Comment;
