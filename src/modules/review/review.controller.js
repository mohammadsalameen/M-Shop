import OrderModel from "../../../DB/models/order.model.js";
import ReviewModel from "../../../DB/models/review.model.js";

export const createReview = async (req, res) => {
    const {userId} = req.id;
    const {productId} = req.params;
    const {comment, rating} = req.body;

    const order = await OrderModel.findOne({UserId : userId, status : 'delivered', 'products.productId': productId});
    if (!order) {
        return res.status(404).json({message: 'order not found'});
    }

    const review = await ReviewModel.create({
        createdBy : userId,
        productId,
        comment,
        rating
    });
    if(!review){
        return res.status(400).json({message: 'failed to create review'});
    }

    return res.status(201).json({message: 'success', review});
}