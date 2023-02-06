const jwt = require('jsonwebtoken');
const User = require("../model/user.model")

const verify = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        console.log(token);
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: verifyUser._id });

        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send('Not Match Data');
    }
};

module.exports = verify;