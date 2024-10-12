import { Request, Response } from "express";
import { Product, QueryFilter } from "../../types";
import { sanitizeInput } from "../../utils";
import { existsProducts, getAllCategories, getAllProducts, getAllProductsCount, insertProduct, updateProductInfo } from "./functions";



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
        const limitNumber = limit ? Number(limit) : 0;

        const [products, productsCount, existsProduc] = await Promise.all([
            getAllProducts(req.query),
            getAllProductsCount(req.query),
            existsProducts()
        ]);

        const totalPages = Math.ceil(productsCount / limitNumber);
        res.status(200).json({
            success: true,
            page,
            totalPages,
            hasNextPage: Number(page) < totalPages, 
            products,
            existsProducts: existsProduc
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

export const getCategories = async function (req: Request, res: Response) {
    try {
        const categories = await getAllCategories();
        res.status(200).json({
            success: true,
            categories,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}