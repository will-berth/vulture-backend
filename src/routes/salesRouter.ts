import express from 'express';
import { generateSale, getSaleInfo } from '../controllers/sales/controller';

const router = express.Router();

router.get('/:id', getSaleInfo);
router.post('/', generateSale);

export { router }