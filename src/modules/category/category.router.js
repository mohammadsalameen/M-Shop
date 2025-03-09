import Router from 'express';
import * as categoryController from './category.controller.js'
const router = Router();

router.post('/create', categoryController.create);

export default router;