import slugify from "slugify";
import CategoryModel from "../../../DB/models/category.model.js";

export const create = async (req, res) =>{
    const {name} = req.body;
    req.body.slug = slugify(name);
    req.body.createdBy = req.id;
    req.body.updatedBy = req.id;
    
    const category = await CategoryModel.create(req.body);
    return res.status(201).json({message : "success", category});
}

export const getCategories = async (req, res) =>{
    const categories = await CategoryModel.find({});
    return res.status(200).json({message : "success", categories});
}

export const getActiveCategories = async (req, res) =>{
    const categories = await CategoryModel.find({status : 'active'});
    return res.status(200).json({message : "success", categories});
}