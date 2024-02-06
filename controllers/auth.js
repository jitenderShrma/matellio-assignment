const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const { ErrorHandler } = require('../middlewares/errorHandler');
const { loginOrRegisterValidator } = require("../validations/userValidation");


const generateJwt = async (user) => {
    const accessToken = await jwt.sign(
        { id: user.id },
        keys.secret,
        { expiresIn: keys.jwtAccessTokenExpiration }
    );
    const refreshToken = await jwt.sign(
        { id: user.id },
        keys.secret,
        { expiresIn: keys.jwtRefreshTokenExpiration }
    );
    return { accessToken, refreshToken }
}

// @desc  to login
// @route  POST /api/v1/auth/login
// @access  public
exports.login = async (req, res, next) => {
    try {
        // validate input body
        const { error } = loginOrRegisterValidator(req.body);
        if (error) {
            throw new ErrorHandler(400, error.details[0].message);
        }
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            throw new ErrorHandler(401, 'Invalid email or password');
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            throw new ErrorHandler(401, 'Invalid email or password');
        }
        const { accessToken, refreshToken } = await generateJwt(user);
        // save refreshToken to DB
        await User.update(
            { refreshToken },
            {
                where: { id: user.id },
            });
        return res.status(200).json({
            status: 'success',
            message: 'Login successfully',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }

}


// @desc  to register
// @route  POST /api/v1/auth/register
// @access  public
exports.register = async (req, res, next) => {
    try {
        // validate input body
        const { error } = loginOrRegisterValidator(req.body);
        if (error) {
            throw new ErrorHandler(400, error);
        }
        // check user with already exist
        let existingUser = await User.findOne({
            where: { email: req.body.email },
        });
        existingUser && (existingUser = existingUser.toJSON());
        if (existingUser) {
            throw new ErrorHandler(409, 'User already exist with the email');
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        // Create a new user
        await User.create({
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(201).send({ status: 'success', message: 'User created successfully.' });
    } catch (error) {
        next(error);
    }

}

// @desc  Refresh access token
// @route  POST /api/v1/auth/refresh-token
// @access  public
exports.getAccessToken = async (req, res, next) => {
    try {
        if (!req.body.refreshToken) {
            throw new ErrorHandler(400, 'Refresh token is required');
        }

        // Verify the refresh token's expiration
        const decoded = jwt.verify(req.body.refreshToken, keys.secret);
        if (!decoded || (decoded.exp < Date.now() / 1000)) {
            throw new ErrorHandler(401, 'Refresh token has expired');
        }
        // Find user by refresh token
        const user = await User.findOne({
            where: {
                refreshToken: req.body.refreshToken
            }
        });
        if (!user) {
            throw new ErrorHandler(401, 'Invalid refresh token');
        }

        const { accessToken, refreshToken:newRefreshToken } = await generateJwt(user);
        await User.update(
            { refreshToken:newRefreshToken },
            {
                where: { id: user.id },
            });
        res.status(200).json({
            status: 'success',
            refreshToken:newRefreshToken,
            accessToken
        });
    } catch (error) {
        next(error);
    }
}
