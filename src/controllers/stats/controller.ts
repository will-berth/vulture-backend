import { Request, Response } from "express";

import { StaticStats, StatsByProduct, TopProducts } from "../../types";
import { getStaticStatsDb, getStatsByProductId, getTopProducts } from "./functions";

export const getStaticsStats = async function (req: Request, res: Response) {
    try {
        const stats: StaticStats = await getStaticStatsDb();

        res.status(200).json({
            success: true,
            stats
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const getTop = async function (req: Request, res: Response) {
    try {
        const stats: TopProducts[] = await getTopProducts();

        res.status(200).json({
            success: true,
            stats
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const getStatByProduct = async function(req: Request, res: Response){
    try {
        const { product_id } = req.params
        const stats: StatsByProduct[] = await getStatsByProductId(Number(product_id), req.query);
        res.status(200).json({
            success: true,
            stats
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}