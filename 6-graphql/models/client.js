const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    _id: String,
    grants: [String],
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

const Client = mongoose.model('Client', clientSchema, 'clients');

module.exports = Client;
