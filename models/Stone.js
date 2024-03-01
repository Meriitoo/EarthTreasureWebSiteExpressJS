const mongoose = require('mongoose');

const stoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
    },
    category: {
        type: String,
        required: true,
        minLength: 3,
    },
    color: {
        type: String,
        required: true,
        minLength: 2,
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//,
    },
    location: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 15,   
    },
    formula: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
    },
    likedList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
    },
});

stoneSchema.pre('save', function () {
    if (!this.createdAt) {
        this.createdAt = Date.now();
    }
})


const Stone = mongoose.model('Stone', stoneSchema);

module.exports = Stone;