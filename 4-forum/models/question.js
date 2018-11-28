const mongoose = require('mongoose');

// Shema za mongo objekt (prijava ni potrebna, zato se enostavno podpises)
const questionSchema = new mongoose.Schema({
    author: String, // e.g. David
    question: String, // e.g. Kaj so ze popravli kolokvij?
    createdAt: Date, // e.g. 2018-11-27T08:56:46Z
    comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' }],
});
// Ustvari nov model imenovan Question v kolekciji questions
const Question = mongoose.model('Question', questionSchema, 'questions');

module.exports = Question;
