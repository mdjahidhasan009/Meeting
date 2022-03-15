const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModal');

router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if(password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 character long' });;

        let userExists = await User.findOne({ email });
        if(userExists) return res.status(400).json({ message: "User already exits with this email!" });
        userExists = await User.findOne({ username });
        if(userExists) return res.status(400).json({ message: 'User already exits with this username!' });

        const user = new User({
            name, username, email, password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({
            message: 'User created!'
        })
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: 'Email or password does not match' });
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Email or password does not match' });
        const token = await jwt.sign(user.id, process.env.SECRET);
        console.log('login will pass1')
        res.json(token);
        console.log('login will pass2')
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
