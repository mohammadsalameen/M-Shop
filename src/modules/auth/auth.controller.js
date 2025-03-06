import UserModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../../utils/sendEmail.js";

export const register = async(req, res, next) =>{
    const {userName, email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
        return res.status(404).json({message : "email is already exist"});
    }
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
    const createdUser = await UserModel.create({userName, email, password : hashedPassword});
    const html = `
    <div>
        <h1>Welcome ${userName}</h1>
        <a href = 'http://localhost:3000/auth/confirmEmail/${email}'> Confirm Your Email</a>
    </div>`;

    await sendEmail(email, 'Confirm Email', html);
    return res.status(201).json({message : 'success', user : createdUser});
}

export const confirmEmail = async (req, res) =>{
    const {email} = req.params;
    await UserModel.findOneAndUpdate({email : email}, {confirmEmail : true});
    return res.status(200).json({message : "success"});
}