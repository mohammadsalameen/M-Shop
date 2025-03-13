import Router from 'express';
import * as categoryController from './category.controller.js'
import auth from '../../middleware/auth.js';
const router = Router();

router.post('/create',auth(['admin']), categoryController.create);
router.get('/', auth(['admin', 'user']), categoryController.getCategories);
router.get('/active', categoryController.getActiveCategories);
router.put('/:id', auth(['admin']), categoryController.updateCategory);
router.delete('/:id',auth(['admin']), categoryController.removeCategory);

export default router;