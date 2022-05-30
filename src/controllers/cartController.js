const  userModel= require("../models/userModel");
const productModel  = require("../models/productModel");
const   cartModel  = require("../models/cartModel");
const validators = require('../utilities/validators')




//Create Cart
const createCart = async function (req, res) {
  try {
    const userId = req.params.userId;

    if (validators.isValid(userId)) {
      return res
        .status(400)
        .send({ status: "false", msg: "please provide userId" });
    }
    if (!validators.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: "false", msg: "please enter a valid userId" });
    }

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send({ status: "false", msg: "user not found" });
    }

    const cartAlreadyPresent = await cartModel.findOne({
      userId: userId,
    });

    const data = req.body;

    if (validators.isValidBody(data)) {
      return res.status(400).send({ status: "false", msg: "please provide data" });
    }

    const { items,totalPrice ,totalItems} = data;


    if (validators.isValid(items.productId)) {
      return res
        .status(400)
        .send({ status: "false", msg: "enter the productId" });
    }

    if (!validators.isValidobjectId(items.productId)) {
      return res
        .status(400)
        .send({ status: "false", msg: "enter a valid productId" });
    }

    if (!validators.isValid(items.quantity) && items.quantity < 1 && items.quantity<=0) {
      return res
        .status(400)
        .send({ status: "false", msg: "enter a qunatity more than 1 " });
    }

    const product = await productModel.findOne({ _id: items.productId });

    if (!product) {
      return res
        .status(404)
        .send({ status: "false", msg: "product not found" });
    }

    let saveCartDetails={
        userId:userId,items, totalPrice,totalItems}
    
    let productAddToCart=await cartModel.create(saveCartDetails);
    return res.status(201).send({status:true,msg:"Product Added To Cart Successful",data:productAddToCart})

  } 
  catch (error) {
    res.status(500).send({ status: "false", msg: error.message });

  }
};


const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body
        const { cartId, productId,removeProduct } = data
        
        if (!validate.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid user Id, please provide valid user Id" })
        }
        const checkuser = await userModel.findById({ _id: userId })
        if (!checkuser) {
            return res.status(400).send({ status: false, msg: "This user is not exist" })
        }

        let searchCart = await cartModel.findOne({ userId: userId })
        if (!searchCart) {
            return res.status(404).send({ status: false, msg: "User does not have any cart" })
        }

        if (validate.isValidBody(data)) {
            return res.status(400).send({ status: false, msg: "please provide data inside body to update" })
        }

        if (!cartId)
            return res.status(400).send({ status: false, msg: "cartId is required" })

        if (!validate.isValidObjectId(cartId))
            return res.status(400).send({ status: false, msg: "Invalid Cart Id, please provide valid cart Id" })

        const checkCart = await cartModel.findById({ _id: cartId })
        if (!checkCart)
            return res.status(400).send({ status: false, msg: "this cart Id does not exist" })

        if (!productId) {
            return res.status(400).send({ status: false, msg: "Product Id is required" })
        }

        if (!validate.isValidObjectId(productId))
            return res.status(400).send({ status: false, msg: "Invalid Product Id, please provide valid Product Id" })
      
        let { items, totalItems, totalPrice } = searchCart

        const checkProduct = await productModel.findById({ _id: productId })
        if (!checkProduct)
            return res.status(400).send({ status: false, msg: "this Product Id does not exist" })
      
      if(validate.isValid(removeProduct)){
              return res.status(400).send({status:false,msg:"removeproduct is required"})
            }
            if ((isNaN(Number(removeProduct)))) {
              return res.status(400).send({ status: false, message: 'removeProduct should be a valid number' })
          }
            if ((removeProduct != 0) && (removeProduct != 1)) {
             return res.status(400).send({ status: false, message: 'removeProduct should be 0 or 1' })
         }

        let getPrice = checkProduct.price

        for (let i = 0; i < items.length; i++) {
            if (items[i].productId === productId) {
                let totelProductprice = items[i].quantity * getPrice

                if (removeProduct === 0) {
                    const updateProductItem = await cartModel.findOneAndUpdate({ userId: userId }, { $pull: { items: { productId: productId } }, totalPrice: searchCart.totalPrice - totelProductprice, totalItems: searchCart.totalItems - 1 }, { new: true })
                    return res.status(200).send({ status: true, msg: 'sucessfully removed product', data: updateProductItem })

                }
                if (removeProduct === 1) {
                    if (items[i].quantity === 1 && removeProduct === 1) {
                        const removedProduct = await cartModel.findOneAndUpdate({ userId: userId }, { $pull: { items: { productId: productId } }, totalPrice: searchCart.totalPrice - totelProductprice, totalItems: searchCart.totalItems - 1 }, { new: true })
                        return res.status(200).send({ status: true, msg: 'sucessfully removed product or cart is empty', data: removedProduct })
                    }
                    items[i].quantity = items[i].quantity - 1
                    const updatedCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: items, totalPrice: searchCart.totalPrice - getPrice }, { new: true });
                    return res.status(200).send({ status: true, msg: 'sucessfully decress product', data: updatedCart })
                }
            }


        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err })
    }
}
const getCart = async function (req, res) {
    try {
        const userId = req.params.userId
        if (Object.keys(userId) == 0) {
            return res.status(400).send({ status: false, message: "userId is required" })
        }
        if (!validators.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId is invalid" })
        }
        const getData = await cartModel.findOne({ userId: userId }).select({ _id: 0 })
        if (!getData) {
            return res.status(404).send({ status: false, message: "cart not found" })
        }
        return res.status(200).send({ status: true, message: "cart details", data: getData })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

