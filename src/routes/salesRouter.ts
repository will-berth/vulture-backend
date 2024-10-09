import express from 'express';
import { generateSale, getSaleInfo, getSales } from '../controllers/sales/controller';

const router = express.Router();

router.get('/', getSales);
router.get('/:id', getSaleInfo);
router.post('/', generateSale);

export { router }