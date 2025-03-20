import Router from 'express';
import * as couponController from './coupon.controller.js'
import auth from '../../middleware/auth.js';
const router = Router();

router.post('/create',auth(['admin']), couponController.createCoupon);

router.get('/', auth(['admin']), couponController.getCoupons);

export default router;