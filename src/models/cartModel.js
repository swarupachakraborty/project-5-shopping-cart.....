const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const cartSchema = mongoose.Schema({
    userId : {type:ObjectId,require: true, unique: true, ref:'newUser'},
    items : [{
        productId : {type : ObjectId,require: true, ref : 'Product'},
        quantity : {type: Number, require: true},
        _id : false,
    }],
    totalPrice : {type: Number, require: true},
    totalItems : {type: Number, require: true}
},{ timestamps: true })

module.exports = mongoose.model('Cart', cartSchema)