const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    access: String,
    accessExp: Date,
    refresh: String,
    refreshExp: Date,
    scope: String,
    client: { type: mongoose.SchemaTypes.String, ref: 'Client' },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
}, {
    toJSON: {
        transform: (docs, ret) => {
            const obj = ret;
            obj.id = obj._id;
            obj.user.id = obj.user._id;
            delete obj._id;
            delete obj.__v;
            return obj;
        },
    },
});
const token = mongoose.model('Token', tokenSchema, 'tokens');

module.exports = token;
