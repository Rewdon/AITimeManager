const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  description: String,
  color: {
    type: String,
    default: 'blue' // blue, red, green, purple
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);