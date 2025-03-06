import UserModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken'

export const register = async(req, res, next) =>{
    const {userName, email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
        return res.status(404).json({message : "email is already exist"});
    }
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
    const createdUser = await UserModel.create({userName, email, password : hashedPassword});
    const token = jwt.sign({email}, process.env.SIGNATURE);
    const html = `
    <div>
        <h1>Welcome ${userName}</h1>
        <a href = '${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'> Confirm Your Email</a>
    </div>`;

    await sendEmail(email, 'Confirm Email', html);
    return res.status(201).json({message : 'success', user : createdUser});
}

export const confirmEmail = async (req, res) =>{
    const {token} = req.params;
    const decoded = jwt.verify(token, process.env.SIGNATURE);
    await UserModel.findOneAndUpdate({email : decoded.email}, {confirmEmail : true});
    return res.status(200).json({message : "success"});
}