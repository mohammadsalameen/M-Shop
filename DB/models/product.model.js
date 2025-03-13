import mongoose, { model, Schema, Types } from "mongoose";

const productSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        min : 3,
        max : 20
    },
    slug : {
        type : String,
        required : true
    },
    image : {
        type : Object
    },
    status : {
        type : String,
        default : 'active',
        enum : ["active", "not_active"]
    },
    createdBy : {
        type : Types.ObjectId,
        ref : 'User'
    },
    updatedBy : {
        type : Types.ObjectId,
        ref : 'User'
    }
}, {
    timestamps : true
});

const ProductModel = mongoose.models.Product || model('Product', productSchema);
export default ProductModel;