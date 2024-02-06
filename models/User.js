const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        validate: {
            isPhoneNumber: function (value) {
                if (!/\d{10}/.test(value)) {
                    throw new Error('Invalid phone number format');
                }
            },
        },
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        validate: {
            isDate: true,
            isBefore: function (value) {
                if (new Date(value) > new Date()) {
                    throw new Error('Date of birth must be in the past');
                }
            },
        },
    },
    gender: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['male', 'female', 'other']],
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refreshToken:{
        type:DataTypes.STRING,
        allowNull:true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
});
module.exports = User;


   