import Router from 'express';
import * as orderController from './order.controller.js'
import auth from '../../middleware/auth.js';
const router = Router();

router.post('/create',auth(['user']), orderController.createOrder);
router.get('/',auth(['user']), orderController.getUserOrder);
router.get('/:status',auth(['admin']), orderController.getOrdersByStatus);
router.patch('/changeStatus/:orderId', auth(['admin']), orderController.changeOrderStatus);

export default router;