import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name : {
        type : String,
        required : true,
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
        enum : ["Active", "Not_Active"]
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

const CategoryModel = mongoose.models.Category || model('Category', categorySchema);
export default CategoryModel;