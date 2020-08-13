const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    fullName: { type: String, required: true, minlength: 8, maxlength: 120, },
    birthDate: { type: Date, required: true, },
    email: { type: String, required: true, unique: true, trim: true, },
    password: { type: String, required: true, },
    status: { type: Boolean, required: true, },
    date_insert: { type: Date, required: true, },
    date_update: { type: Date, },
    date_delete: { type: Date, },
});

module.exports = mongoose.model('User', schema);