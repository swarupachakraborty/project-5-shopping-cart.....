const express = require('express')
const router = express.Router()
const { authentication,authorization } = require("../middleware/auth")
const { registerUser, userLogin,getProfileData,updateUserDetails } = require("../controllers/userController")
const {createProduct,getProduct,getProductById,updateProductDetails,deleteProduct} = require("../controllers/productController")


//---USER APIS---//
//==Register User
router.post('/register', registerUser)

//==Login User
router.post('/login', userLogin) 

//==Get User
router.get('/user/:userId/profile',authentication, getProfileData) 

//==Updating User Document
router.put('/user/:userId/profile', authentication,authorization, updateUserDetails) 


//---PRODUCT APIS---//
//==create product document
router.post('/products', createProduct)

//==get product document(all or filter)
router.get('/products', getProduct)

//==get product by Id
router.get('/products/:productId', getProductById)

//==update product document
router.put('/products/:productId', updateProductDetails)

//==delete product document
router.delete('/products/:productId', deleteProduct)

module.exports = router  