const {
    GraphQLObjectType, GraphQLString,
    GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList,
} = require('graphql');
const GraphQLDate = require('graphql-date');

const models = require('../models');

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        givenName: { type: GraphQLString },
        familyName: { type: GraphQLString },
        age: { type: GraphQLInt },
        email: { type: GraphQLString },
        role: { type: GraphQLString },
    }),
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        author: {
            type: AuthorType,
            resolve(parent, args, req) { // eslint-disable-line no-unused-vars
                return models.User.findOne({ _id: parent.author });
            },
        },
        contents: { type: GraphQLString },
        createdAt: { type: GraphQLDate },
    }),
});

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        createdAt: { type: GraphQLDate },
        author: {
            type: AuthorType,
            resolve(parent, args, req) { // eslint-disable-line no-unused-vars
                return models.User.findOne({ _id: parent.author });
            },
        },
        lastModified: { type: GraphQLDate },
        subscriptionType: { type: GraphQLString },
        comments: {
            type: GraphQLList(CommentType),
            resolve(parent, args) { // eslint-disable-line no-unused-vars
                return models.Comment.find({ article: parent.id });
            },
        },
    }),
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        article: {
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return models.Article.findOne({ _id: args.id, subscriptionType: 'free' });
            },
        },
        articleByTitle: {
            type: new GraphQLList(ArticleType),
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                // console.log(res)
                return models.Article.find({ title: { $regex: args.name, $options: 'i' }, subscriptionType: 'free' });
            },
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return models.User.findOne({ _id: args.id });
            },
        },
        news: {
            type: new GraphQLList(ArticleType),
            resolve(parent, args) { // eslint-disable-line no-unused-vars
                return models.Article.find({ subscriptionType: 'free' });
            },
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) { // eslint-disable-line no-unused-vars
                return models.User.find({});
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
