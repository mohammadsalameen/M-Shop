import UserModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async(req, res, next) =>{
    const {userName, email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
        return res.status(404   ).json({message : "email is already exist"});
    }
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
    const createdUser = await UserModel.create({userName, email, password : hashedPassword});

    return res.status(201).json({message : 'success', createdUser});
}