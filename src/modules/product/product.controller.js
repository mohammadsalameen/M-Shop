import slugify from "slugify";
import CategoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import ProductModel from "../../../DB/models/product.model.js";

export const createProduct = async (req, res) =>{
    const {name, categoryId} = req.body;
    
    const checkCategory = await CategoryModel.findById(categoryId);
    if(!checkCategory){
        return res.status(404).json({message : 'category not found'});
    }
    
    req.body.slug = slugify(name);
    
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path, {folder : `M-Shop/products/${name}`});
    return res.json(req.files);
    
    req.body.subImages = [];
    if(req.files.subImages){
        for(const file of req.files.subImages){
            const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {folder : `M-Shop/products/${name}/subImages`});
            req.body.subImages.push({secure_url, public_id});
        }
    }
    req.body.mainImage = {secure_url, public_id};
    req.body.createdBy = req.id;
    req.body.updatedBy = req.id;
    
    const product = await ProductModel.create(req.body);
    return res.status(201).json({message : "success", product});
}