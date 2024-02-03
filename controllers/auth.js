const {User} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const { ErrorHandler } = require('../middlewares/errorHandler');
const { loginOrRegisterValidator } = require("../validations/userValidation");


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
        const token = jwt.sign(
            { id: user.id },
            keys.secret,
            { expiresIn: keys.jwtExpireInNumberOfDays }
        ); // generate jwt
        return res.status(200).json({
            status:'success',
            message: 'Login successfully',
            token,
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
        const existingUser = await User.findOne({
            where: { email: req.body.email },
        });
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
        res.status(201).send({ status:'success', message: 'User created successfully.' });
    } catch (error) {
        next(error);
    }

}