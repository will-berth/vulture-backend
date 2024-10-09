import { Request, Response } from "express";
import { ProductResponse, Sale, SaleDetail, SaleInput } from "../../types";
import { getProductsInfo, getSaleDetail, insertSale } from "./functions";


export const getSaleInfo = async function (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const sale: Sale = await getSaleDetail(Number(id));

        res.status(200).json({
            success: true,
            sale,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const generateSale = async function (req: Request, res: Response) {
    try {
        const { payment_method, products }: SaleInput = req.body;
        const productsInfo: ProductResponse[] = await getProductsInfo(products);

        const productsMap = productsInfo.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }, {} as Record<number, ProductResponse>);

        let subTotal: number = 0;

        const saleDetail: SaleDetail[] = products.map(p => {
            const productData: ProductResponse = productsMap[p.product_id as number];

            if(Number(p.quantity) > Number(productData.stock)) throw new Error("no stock!");

            let subTotalPerProduct: number = Number(productData.price) * Number(p.quantity);
            subTotal += subTotalPerProduct;

            return {
                product_id: p.product_id as number,
                quantity: p.quantity,
                price: productData.price,
                subtotal: subTotalPerProduct
            }
        });

        await insertSale(subTotal, payment_method, saleDetail);

        res.status(200).json({
            success: true,
            message: "Sale registered successfully!",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}