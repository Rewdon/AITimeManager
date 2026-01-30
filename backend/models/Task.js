const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Tytuł zadania jest wymagany'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    taskType: { 
        type: String, 
        enum: ['ACTIVE', 'PASSIVE'], 
        default: 'ACTIVE', 
        required: true 
    },
    estimatedTime: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['TODO', 'IN_PROGRESS', 'DONE'], 
        default: 'TODO' 
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    subtasks: [{
        title: String,
        isCompleted: {
            type: Boolean,
            default: false
        }
    }],
    isAIBrokenDown: {
        type: Boolean,
        default: false
    },
    scheduledFor: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

taskSchema.index({ user: 1, scheduledFor: 1 });

module.exports = mongoose.model('Task', taskSchema);