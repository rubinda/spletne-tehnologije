const {
    GraphQLObjectType, GraphQLString, GraphQLNonNull,
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
        contents: { type: GraphQLString },
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
        keywords: { type: GraphQLList(GraphQLString) },
    }),
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        article: {
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return models.Article.findOne({ _id: args.id });
            },
        },
        articleByTitle: {
            type: new GraphQLList(ArticleType),
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                // console.log(res)
                return models.Article.find({ title: { $regex: args.name, $options: 'i' } });
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
            args: { filter: { type: GraphQLString } },
            resolve(parent, args) { // eslint-disable-line no-unused-vars
                if (args.filter) {
                    return models.Article.find({
                        $or: [
                            {
                                title: { $regex: args.filter, $options: 'i' },
                            },
                            {
                                contents: { $regex: args.filter, $options: 'i' },
                            },
                            {
                                keywords: { $regex: args.filter, $options: 'i' },
                            },
                        ],
                    });
                }
                return models.Article.find({});
            },
        },
        newsFromAuthor: {
            type: new GraphQLList(ArticleType),
            args: { username: { type: GraphQLString } },
            async resolve(parent, args) {
                if (args.username) {
                    const user = await models.User.findOne({ username: args.username });
                    return models.Article.find({
                        author: user.id,
                    });
                }
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

const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        insertAuthor: {
            type: AuthorType,
            args: {
                givenName: { type: new GraphQLNonNull(GraphQLString) },
                familyName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                email: { type: GraphQLString },
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                const tokec = req.userInfo;
                if (tokec.user.role !== 'admin') {
                    throw new Error('Samo admin lahko ustvari novega uporabnika');
                }
                const newAuthor = new models.User({
                    username: args.username,
                    password: args.password,
                    givenName: args.givenName,
                    familyName: args.familyName,
                    age: args.age,
                    email: args.email,
                    scopes: [
                        'read', 'write',
                    ],
                    role: 'basic',
                });
                const id = await newAuthor.save();
                return id;
            },
        },

        insertArticle: {
            type: ArticleType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                contents: { type: new GraphQLNonNull(GraphQLString) },
                subscriptionType: { type: new GraphQLNonNull(GraphQLString) },
                keywords: { type: new GraphQLList(GraphQLString) },
            },
            async resolve(parent, args, req) {
                const tokec = req.userInfo;
                if (tokec.user.role !== 'admin') {
                    throw new Error('Samo admin lahko ustvari novico');
                }
                const newArticle = new models.Article({
                    title: args.title,
                    contents: args.contents,
                    author: tokec.user.id,
                    createdAt: Date.now(),
                    lastModified: Date.now(),
                    subscriptionType: args.subscriptionType,
                    keywords: args.keywords,
                });

                const id = await newArticle.save();
                return id;
            },
        },

        modifyArticle: {
            type: ArticleType,
            args: {
                title: { type: GraphQLString },
                contents: { type: GraphQLString },
                subscriptionType: { type: GraphQLString },
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                const tokec = req.userInfo;
                if (tokec.user.role !== 'admin') {
                    throw new Error('Samo admin lahko ureja novico');
                }
                const novica = await models.Article.findOne({ _id: args.id });
                if (novica.author != tokec.user.id) { // eslint-disable-line eqeqeq
                    throw new Error('Urejas lahko samo svoje novice');
                }
                novica.lastModified = Date.now();
                if (args.title) {
                    novica.title = args.title;
                }
                if (args.contents) {
                    novica.contents = args.contents;
                }
                if (args.subscriptionType) {
                    novica.subscriptionType = args.subscriptionType;
                }
                novica.save();
                return novica;
            },
        },

        addComment: {
            type: CommentType,
            args: {
                contents: { type: new GraphQLNonNull(GraphQLString) },
                article: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args, req) {
                const tokec = req.userInfo;
                if (!tokec.scope.includes('write')) {
                    throw new Error('Nimate dovoljenja za komentiranje');
                }
                const newComment = new models.Comment({
                    contents: args.contents,
                    author: tokec.user.id,
                    createdAt: Date.now(),
                    article: args.article,
                });

                newComment.save();
                return newComment;
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations,
});
