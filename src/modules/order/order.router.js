import Router from 'express';
import * as orderController from './order.controller.js'
import auth from '../../middleware/auth.js';
const router = Router();

router.post('/create',auth(['user']), orderController.createOrder);

export default router;