import express from 'express';
import { getCategories, getProducts, registerProduct, updateProduct } from '../controllers/products/controller';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/', registerProduct);
router.put('/:id', updateProduct);

export { router }