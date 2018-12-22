const models = {};
models.User = require('./user');
models.Token = require('./token');
models.Client = require('./client');
models.Article = require('./article');
models.Comment = require('./comment');

module.exports = models;
