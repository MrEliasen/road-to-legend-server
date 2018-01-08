// Load required packages
var mongoose = require('mongoose'),
    config = require('../../../config.json'),
    moment = require('moment');

// Define our product schema
var ItemSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    item_id: {
        type: String,
        required: true,
    },
    stat_modifiers: {
        type: {},
    },
    slot: {
        type: String
    },
    date_added: String,
    date_updated: String
});

// Execute before each user.save() call
ItemSchema.pre('save', function (callback) {
    if (!this.date_added) {
        // set the date for when it was created
        this.date_added = moment().format(config.rfc2822);
    }

    // set the date for when it was updated
    this.date_updated = moment().format(config.rfc2822);
    
    callback();
});

// Export the Mongoose model
module.exports = mongoose.model('Item', ItemSchema);