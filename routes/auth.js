const express = require("express");
const router = express.Router();
const {login, register, getAccessToken} = require("../controllers/auth");


router.post('/login', login);
router.post('/register', register);
router.post('/access-token', getAccessToken);



module.exports = router;
