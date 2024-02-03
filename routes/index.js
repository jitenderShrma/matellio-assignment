const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const authRoute = require("./auth");


router.use('/api/v1/users', userRoute);
router.use('/api/v1/auth', authRoute);

module.exports = router;