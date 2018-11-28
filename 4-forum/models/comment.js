const mongoose = require('mongoose');

// Ustvari shemo za komentar, kot pri vprasanju tudi tukaj ne implementiramo prijave,
// zato se lahko uporabnik sam odloci za ime nad komentarjem. Hranimo tudi cas, kdaj
// je bil komentar objavljen in kateremu vprasanju pripada
const commentSchema = new mongoose.Schema({
    author: String, // e.g. Nezika
    message: String, // e.g. Mislim, da se niso popravli.
    createdAt: Date, // e.g. 2018-11-27T09:12:32Z
});

const comment = mongoose.model('Comment', commentSchema, 'comments');

module.exports = comment;
