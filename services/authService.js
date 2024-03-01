const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../constants');


exports.register = async (userData) => {
    const user = await User.findOne({ email: userData.email });
    
    if (user) {
        throw new Error('Email already exists');
    }

    const createdUser = await User.create(userData);

    const token = await generateToken(createdUser);

    return token;
}

exports.login = async (email, password) => {
    // Get user from db
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
        throw new Error('Cannot find email or password');
    }

    // Check if password is valid
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Cannot find email or password');
    }

    const token = await generateToken(user);

    // return token
    return token;
}

function generateToken(user){
      // Generate jwt token
      const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    };

    return jwt.sign(payload, SECRET, { expiresIn: '6h' });
};

   