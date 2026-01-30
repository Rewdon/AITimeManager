const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Proszę podać wszystkie wymagane dane' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Użytkownik o tym adresie email już istnieje' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Błąd rejestracji:', error);
        res.status(500).json({ 
            message: 'Błąd serwera podczas rejestracji', 
            error: error.message 
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Proszę podać email i hasło' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Nieprawidłowy adres email lub hasło' });
        }
    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({ 
            message: 'Błąd serwera podczas logowania', 
            error: error.message 
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        };
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Błąd pobierania danych użytkownika' });
    }
};

module.exports = { registerUser, loginUser, getMe };