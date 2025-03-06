import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    userName : {
        type : String,
        required : true,
        min : 3,
        max : 20
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        min : 4
    },
    image : {
        type : Object
    },
    phone : {
        type : String
    },
    address : {
        type : String
    },
    confirmEmail : {
        type : Boolean,
        default : false
    },
    gender : {
        type : String,
        enum : ["Male", "Female"]
    },
    status : {
        type : String,
        enum : ["Active", "Not_Active"]
    },
    role : {
        type : String,
        role : 'user',
        enum : ["Admin", "User"]
    }
}, {
    timestamps : true
});

const UserModel = mongoose.models.User || model('User', userSchema);
export default UserModel;