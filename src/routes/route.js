const express = require('express')
const router = express.Router()
const { registerUser, userLogin,getProfileData,updateUserDetails } = require("../controllers/userController")

//---USER APIS---//
//==Register User
router.post('/register', registerUser)

//==Login User
router.post('/login', userLogin) 

//==Get User
router.get('/user/:userId/profile', getProfileData) 

//==Updating User Document
router.put('/user/:userId/profile', updateUserDetails) 

module.exports = router  