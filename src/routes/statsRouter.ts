import express from 'express';
import { getStatByProduct, getStaticsStats, getTop } from '../controllers/stats/controller';

const router = express.Router();

router.get('/statics', getStaticsStats);
router.get('/top-products', getTop);
router.get('/product/:product_id', getStatByProduct);

export { router }