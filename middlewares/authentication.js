const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const {User} = require("../models");
const { ErrorHandler } = require('../middlewares/errorHandler');

exports.authentication = async (req, _, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            throw new ErrorHandler(401, 'Unauthorize');
        }
        const decode = jwt.decode(token, keys.secret);
        if (!decode) {
            throw new ErrorHandler(401, 'Unauthorize');
        }
        // Check if token is expired
        if (decode.exp < Date.now() / 1000) {
            throw new ErrorHandler(403, 'Token expired');
        }

        let user = await User.findOne({
            where: {
                id: decode.id,
            },
        });
        if (!user) {
            throw new ErrorHandler(401, 'Unauthorize');
        }
        req.user = user.dataValues;
        next();
    } catch (error) {
        return next(error);
    }
}