import UserModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken'
import { customAlphabet } from "nanoid";

export const register = async (req, res, next) =>{
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

export const login = async (req, res) =>{
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});

    if(!user){
        return res.status(400).json({message : 'invalid data'});
    }
    if(!user.confirmEmail){
        return res.status(400).json({message : 'please confirm your email'});
    }

    if(user.status == 'not active'){
        return res.status(400).json({message : 'your account is blocked'});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).json({message : 'invalid data'});
    }

    const token = jwt.sign({id : user._id, userName : user.userName, role : user.role}, process.env.LOGIN_SIGNATURE);
    return res.status(200).json({message : "success", token});
}

export const sendCode = async (req, res) =>{
    const {email} = req.body;
    const code = customAlphabet('1234567890abcdef', 4)();
    const user = await UserModel.findOneAndUpdate({email : email}, {sendCode : code});
    const html = `<h2>Your code is ${code}</h2>`;
    await sendEmail(email, 'reset password', html);
    return res.status(200).json({message : "success"});
}

export const resetPassword = async (req, res) =>{
    const {code, email, password} = req.body;
    const user = await UserModel.findOne({email});
    
    if(!user){
        return res.status(400).json({message : "not register account"});
    }
    
    if(user.sendCode != code){
        return res.status(400).json({message : "invalid code"});
    }
    
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
    user.password = hashedPassword;
    user.sendCode = null;
    
    await user.save();

    return res.status(200).json({message : "success"})

}