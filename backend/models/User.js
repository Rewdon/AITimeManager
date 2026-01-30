const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Imię jest wymagane']
    },
    email: {
        type: String,
        required: [true, 'Email jest wymagany'],
        unique: true,
        match: [/.+\@.+\..+/, 'Podaj poprawny adres email']
    },
    password: {
        type: String,
        required: [true, 'Hasło jest wymagane'],
        minlength: 6
    }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);