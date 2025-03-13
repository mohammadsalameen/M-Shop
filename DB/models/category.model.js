import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        min : 3,
        max : 20
    },
    description : {
        type : String,
        required : true,
    },
    stock : {
        type : Number,
        default : 1
    },
    price : {
        type : Number,
        required : true
    },
    discount : {
        type : Number,
        default : 0
    },
    slug : {
        type : String,
        required : true
    },
    mainImage : {
        type : Object
    },
    subImages : [
        {
            type : Object,
            required : true
        }
    ],
    status : {
        type : String,
        default : 'active',
        enum : ["active", "not_active"]
    },
    createdBy : {
        type : Types.ObjectId,
        ref : 'User'
    },
    colors : [String],
    sizes : [
        {
            type : [String],
            enum : ['small', 'medium', 'large', 'xlarge']
        }
    ],
    updatedBy : {
        type : Types.ObjectId,
        ref : 'User'
    },
    categoryId : {
        type : Types.ObjectId,
        ref : 'Category'
    },
}, {
    timestamps : true
});

const CategoryModel = mongoose.models.Category || model('Category', categorySchema);
export default CategoryModel;