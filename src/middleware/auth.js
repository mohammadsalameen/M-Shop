import jwt from "jsonwebtoken";
import UserModel from "../../DB/models/user.model.js";

const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return res.status(400).json({ message: "invalid auth" });
    }

    const decoded = jwt.verify(token, process.env.LOGIN_SIGNATURE);

    const user = await UserModel.findById(decoded.id); //to prevent update a token

    if (!accessRoles.includes(user.role) == "user") {
      return res.status(400).json({ message: "not auth user" });
    }

    req.id = decoded.id;

    next();
  };
};
export default auth;
