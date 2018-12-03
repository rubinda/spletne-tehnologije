const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String, // uporabnisko ime (e.g. rubind)
    password: String, // geslo (ni hashirano)
    givenName: String, // uporabnikovo dano ime
    familyName: String, // uporabnikov priimek
    age: String, // uporabnikova starost
    email: String, // uporabnikov naslov eposte
    role: String, // recimo admin ali basic
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

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
