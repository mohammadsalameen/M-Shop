import slugify from "slugify";
import CategoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import ProductModel from "../../../DB/models/product.model.js";

export const createProduct = async (req, res) =>{
    const {name, categoryId, discount, price} = req.body;
    
    const checkCategory = await CategoryModel.findById(categoryId);
    try{
        if(!checkCategory){
            return res.status(404).json({message : 'category not found'});
        }
          
        
        req.body.slug = slugify(name);
        
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path, {folder : `${process.env.APP_NAME}/products/${name}`});
        if(!req.files){
            return res.status(400).json({message : "no files uploaded"});
        }
        
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

        if(discount){
            req.body.priceAfterDiscount = price - (price * (discount / 100));
        } else{
            req.body.priceAfterDiscount = price;
        }
        req.body.priceAfterDiscount = price - (price * ((discount || 0) / 100));
        const product = await ProductModel.create(req.body);
        return res.status(201).json({message : "success", product});
    }catch(err){
        return res.status(500).json({message : err.message});
    }
}

export const getProducts = async (req, res) =>{
    const products = await ProductModel.find({}).select('name mainImage price discount');

    return res.status(200).json({message : 'success', products})
}

export const getProductDetails = async (req, res) =>{
    const {id} = req.params;
    const product = await ProductModel.findById(id).select('-discount').populate('reviews'); // exclude discount from the response 

    return res.status(200).json({message : 'success', product});
}

export const deleteProduct = async (req, res) =>{
    const {id} = req.params;

    const product = await ProductModel.findByIdAndDelete(id);
    if(!product){
        return res.status(404).json({message : 'product not found'});
    }
    
    await cloudinary.uploader.destroy(product.mainImage.public_id); // delete main image from cloudinary
    for(const image of product.subImages){
        await cloudinary.uploader.destroy(image.public_id); // delete subImages from cloudinary
    }

    return res.status(200).json({message : 'success'});
}