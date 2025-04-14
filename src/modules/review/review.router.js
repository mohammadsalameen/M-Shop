import Router from 'express';
import * as reviewController from './review.controller.js'
import auth from '../../middleware/auth.js';
const router = Router({mergeParams: true});

router.post('/',auth(['user']), reviewController.createReview);

export default router;