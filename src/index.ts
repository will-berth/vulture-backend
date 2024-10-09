import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { router as productRouter } from './routes/productsRouter';
import { router as saleRouter } from './routes/salesRouter';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/sales', saleRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port} 🚀`);
});