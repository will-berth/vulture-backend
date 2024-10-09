import { Request, Response } from "express";
import { Product, QueryFilter } from "../../types";
import { sanitizeInput } from "../../utils";
import { getAllProducts, insertProduct, updateProductInfo } from "./functions";



export const registerProduct = async function (req: Request, res: Response) {
    try {
        const { category_id, name, description, price, stock }: Product = req.body;
        const productClean: Product = {
            category_id,
            name: sanitizeInput(name),
            description: sanitizeInput(description),
            price,
            stock
        }

        await insertProduct(productClean);

        res.status(200).json({
            success: true,
            message: "Product registered successfully!",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const getProducts = async function (req: Request, res: Response) {
    try {
        const { page, limit, name }: QueryFilter = req.query;
        const products = await getAllProducts(page as number, limit as number, name);
        res.status(200).json({
            success: true,
            products,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const updateProduct = async function(req: Request, res: Response) {
    try {
        const { id, category_id, name, description, price, stock }: Product = req.body;
        const productClean: Product = {
            id,
            category_id,
            name: sanitizeInput(name),
            description: sanitizeInput(description),
            price,
            stock
        }

        await updateProductInfo(productClean);

        res.status(200).json({
            success: true,
            message: "Product registered successfully!",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}