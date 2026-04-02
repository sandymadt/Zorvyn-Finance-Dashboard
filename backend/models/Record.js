const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please add a type (income/expense)']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        maxlength: [200, 'Note cannot be more than 200 characters']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Record', recordSchema);
