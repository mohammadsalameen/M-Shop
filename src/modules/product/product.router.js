import Router from 'express';
import * as productController from './product.controller.js'
import auth from '../../middleware/auth.js';
import fileUpload, { fileValidation } from '../../utils/multer.js';
const router = Router();

router.post('/create', auth(['admin']), fileUpload(fileValidation.image).fields([
    {name : 'mainImage', maxCount : 1},
    {name : 'subImages', maxCount : 4}
]), productController.createProduct);


export default router;