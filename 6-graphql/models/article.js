const mongoose = require('mongoose');

// Shema za posamezno novico, sestavljena je iz naslova,
// opisa (tekst novice) in datuma ko je bila kreirana.
// Prav tako vsebuje podatek o avtorju in o tem ali je
// brezplacna ali placljiva
const articleSchema = new mongoose.Schema({
    title: String, // e.g. Konjice dobile novega Zupana
    contents: String, // e.g. V drugem krogu lokalnih volitev so v Sl. Konjicah
    // Izvolili novega zupana.
    createdAt: Date, // e.g. 2.12.2018 8.10
    lastModified: Date, // e.g. 2.12.2018 8.33
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }, // User id
    subscriptionType: String, // e.g. premium || free/basic
    keywords: [String], // Kljucne besede, recimo angular, mongodb, apollo, graphql
}, {
    toJSON: {
        transform: (docs, ret) => {
            const obj = ret;
            obj.id = obj._id;
            delete obj.author.scopes;
            delete obj._id;
            delete obj.__v;
            return obj;
        },
    },
});

const Article = mongoose.model('Article', articleSchema, 'news');

module.exports = Article;
