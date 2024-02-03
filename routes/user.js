const express = require("express");
const router = express.Router();
const {addressUpdate, getUserInfo} = require("../controllers/user");
const {authentication} = require("../middlewares/authentication");

router.post('/address', authentication, addressUpdate);
router.get('/address', authentication, getUserInfo);



module.exports = router;
