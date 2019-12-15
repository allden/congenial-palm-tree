const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

MessageSchema
.virtual('deleteUrl')
.get(function() {
    return `/message/delete/${this._id}`;
});

MessageSchema
.virtual('formatTime')
.get(function() {
    return this.time.toUTCString();
});

module.exports = mongoose.model('Message', MessageSchema);