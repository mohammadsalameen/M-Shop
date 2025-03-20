import couponModel from "../../../DB/models/coupon.model.js"

export const createCoupon = async (req, res) =>{
    if(await couponModel.findOne({name : req.body.name})){
        return res.status(409).json({message : "coupon is already exist"});
    }

    req.body.expireDate = new Date(req.body.expireDate);
    req.body.createdBy = req.id;
    req.body.updatedBy = req.id;

    const coupon = await couponModel.create(req.body);

    return res.status(201).json({message : "success", coupon});
}

export const getCoupons = async (req, res) =>{
    const coupons = await couponModel.find({});

    return res.status(200).json({message : 'success', coupons});
}