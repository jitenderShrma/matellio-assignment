const {User, Address} = require("../models");
const { ErrorHandler } = require('../middlewares/errorHandler');
const { personInfoValidator } = require("../validations/userValidation");




// @desc  to address update
// @route  POST /api/v1/user/address
// @access  private
exports.addressUpdate = async (req, res, next) => {
    try {
        const { error } = personInfoValidator(req.body);
        if (error) {
            throw new ErrorHandler(400, error.details[0].message);
        }

        // Update user's personal information
        const personInfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
        }
        await User.update(
            personInfo,
            {
                where: { id: req.user.id },
            });

        // Save multiple addresses linked to user id
        const addresses = req.body.addresses || [];
        for (const addressData of addresses) {
            await Address.create({
              ...addressData,
              userId: req.user.id,
            });
          }
      
        return res.status(201).json({ status: 'success' })
    } catch (error) {
        next(error);
    }
}

// @desc  to address update
// @route  GET /api/v1/user/address
// @access  private
exports.getUserInfo = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await User.findByPk(userId, {
            attributes:{
                exclude:['password']
            },
          include: {
            model: Address,
            attributes: {
                include: ['street', 'city', 'state', 'postalCode', 'country'],
                exclude: ['password']
            },
          },
        });
    
        if (!user) {    
          throw new ErrorHandler(400, 'User not found' );
        }
        return res.status(200).json({ status:'success', user:user.toJSON() });
      } catch (error) {
        next(error);
      }
}