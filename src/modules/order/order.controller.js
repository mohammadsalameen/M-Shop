import CartModel from "../../../DB/models/cart.model.js"
import CouponModel from "../../../DB/models/coupon.model.js";
import OrderModel from "../../../DB/models/order.model.js";
import ProductModel from "../../../DB/models/product.model.js";
import UserModel from "../../../DB/models/user.model.js";

export const createOrder = async (req, res) => {
    const {couponName} = req.body;

    const cart = await CartModel.findOne({userId : req.id});
    if(!cart){
        return res.status(404).json({message : 'cart not found'});
    }

    if(couponName){
        const coupon = await CouponModel.findOne({name : couponName});
        if(!coupon){
            return res.status(404).json({message : 'coupon not found'});
        }
        if(coupon.expireDate < new Date()){
            return res.status(400).json({message : 'coupon expired'});
        }
        if(coupon.usedBy.includes(req.id)){
            return res.status(400).json({message : 'coupon already used'});
        }
        req.body.couponName = coupon;
    }

    const finalProducts = [];
    let subTotal = 0;
    for(let product of cart.products){
        const checkProduct = await ProductModel.findOne({_id : product.productId, stock : {$gte : product.quantity}});
        if(!checkProduct){
            return res.status(400).json({message : 'product quantity not available'});
        }
        product = product.toObject(); //convert bson to json
        product.productName = checkProduct.name;
        product.unitPrice = checkProduct.priceAfterDiscount;
        product.totalPrice = checkProduct.priceAfterDiscount * product.quantity; 
        subTotal += product.totalPrice;
        finalProducts.push(product);
    }
    const user = await UserModel.findById(req.id);
    if(!req.body.address){
        req.body.address = user.address;
    }
    if(!req.body.phoneNumber){
        req.body.phoneNumber = user.phoneNumber;
    }
    const order = await OrderModel.create({
        userId : req.id,
        products : finalProducts,
        couponName : couponName ?? '',
        address : req.body.address,
        phoneNumber : req.body.phoneNumber,
        totalPrice : subTotal - (subTotal * ((req.body.amount || 0)) / 100),
    });

    // decrease product stock
    for(const product of cart.products){
        await ProductModel.updateOne({_id : product.productId},{
            $inc : {stock : -product.quantity}
        })
    }

    // update coupon usedBy
    if(req.body.couponName){
        await CouponModel.updateOne({_id : coupon._id}, {
            $addToSet : {usedBy : req.id}
        });
    }

    await CartModel.updateOne({userId : req.id}, {
        products : []
    }
    )
    return res.status(201).json({message : 'success', order});
}

export const getUserOrder = async (req, res) => {
    const orders = await OrderModel.find({userId : req.id}).populate('products.productId');

    return res.status(200).json({message : 'success', orders});
}

export const getOrdersByStatus = async (req, res) => {
    const {status} = req.params;
    const orders = await OrderModel.find({status : status}).populate('products.productId');

    return res.status(200).json({message : 'success', orders});
}

export const changeOrderStatus = async (req, res) => {
    const {orderId} = req.params;
    const order = await OrderModel.findById(orderId);
    if(!order){
        return res.status(404).json({message : 'order not found'});
    }
    order.status = req.body.status;
    order.updatedBy = req.id;
    await order.save();
    return res.status(200).json({message : 'success'});
}