import Router from 'express';
import * as cartController from './cart.controller.js'
import auth from '../../middleware/auth.js';
const router = Router();

router.post('/add',auth(['user']), cartController.addToCart);

export default router;