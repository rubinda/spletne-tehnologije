// Omogoca lazje importanje modelov, da ni potrebno definirati vsak import posebej
const models = {};
models.Question = require('./question');
models.Comment = require('./comment');

module.exports = models;
