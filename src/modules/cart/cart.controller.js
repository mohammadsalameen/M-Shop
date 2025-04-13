import CartModel from "../../../DB/models/cart.model.js";

export const addToCart = async (req, res) =>{
    const {productId} = req.body;
    const cart = await CartModel.findOne({userId : req.id}); // check if cart already exists
    
    if(!cart){
        const newCart = await CartModel.create({
            userId : req.id,
            products : {productId}
        });
        return res.status(201).json({message : 'success', cart : newCart});
    }
    for(let i = 0; i < cart.products.length; i++){
        if(cart.products[i].productId == productId){
            return res.status(409).json({message : 'product already exists in cart'});
        }
    }
    cart.products.push({productId});
    await cart.save();
    return res.status(201).json({message : 'success'});
}