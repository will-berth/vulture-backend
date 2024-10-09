import express from 'express';
import { getProducts, registerProduct, updateProduct } from '../controllers/products/controller';

const router = express.Router();

router.get('/', getProducts);
router.post('/', registerProduct);
router.put('/:id', updateProduct);

export { router }