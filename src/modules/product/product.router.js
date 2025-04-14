import Router from 'express';
import * as productController from './product.controller.js'
import auth from '../../middleware/auth.js';
import fileUpload, { fileValidation } from '../../utils/multer.js';
import reviewRouter from '../review/review.router.js';
const router = Router();
router.use('/:productId/reviews', reviewRouter);

router.post('/create', auth(['admin']), fileUpload(fileValidation.image).fields([
    {name : 'mainImage', maxCount : 1},
    {name : 'subImages', maxCount : 4}
]), productController.createProduct);

router.get('/', auth(['admin']), productController.getProducts);
router.get('/:id', auth(['admin']), productController.getProductDetails);

router.delete('/remove-product/:id', auth(['admin']), productController.deleteProduct);


export default router;