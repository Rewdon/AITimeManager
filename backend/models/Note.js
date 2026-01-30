const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  color: {
    type: String,
    enum: ['yellow', 'blue', 'green', 'purple', 'red'],
    default: 'yellow'
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);