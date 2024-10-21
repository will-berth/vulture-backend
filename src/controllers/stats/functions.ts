import { SQL, sql } from "drizzle-orm";
import { db } from "../../db";
import { ProductResponse, QueryFilter, Sale, SaleDetail, StaticStats, StatsByProduct, TopProducts } from "../../types";
import { getPaymentMethodLabel, parseDate } from "../../utils";
import { customAlphabet } from "nanoid";

export const getStaticStatsDb = async(): Promise<StaticStats> => {
    const result = await db?.execute(sql`
        WITH months AS (
            SELECT 
                date_trunc('month', current_date) AS current_month,
                date_trunc('month', current_date) - INTERVAL '1 month'::interval AS last_month
        ),data_current_last_month AS (
            SELECT 
            quantity,
            subtotal,
            date_trunc('month', created_at) AS truncated_date
            FROM sale_details sd 
            WHERE (date_trunc('month', created_at) = (SELECT current_month FROM months))
            OR (date_trunc('month', created_at) = (SELECT last_month FROM months))
        ), data_per_month AS (
            SELECT 
                count(quantity) AS sales,
                sum(subtotal) AS earning,
                CASE 
                    WHEN truncated_date = (SELECT current_month FROM months) THEN TRUE
                    ELSE false
                END AS current_month,
                truncated_date AS "month"
            FROM data_current_last_month
            GROUP BY truncated_date
        ), calculate_percent AS (
            SELECT 
                cm.sales,
                CASE 
                    WHEN lm.sales = 0 THEN 0
                    ELSE ((cm.sales - lm.sales) / lm.sales) 
                END AS sales_percentage_change,
                cm.earning,
                CASE 
                    WHEN lm.earning = 0 THEN 0
                    ELSE ((cm.earning - lm.earning) / lm.earning) 
                END AS earning_percentage_change
            FROM data_per_month cm
            CROSS JOIN (SELECT COALESCE(MAX(sales), 0) AS sales, COALESCE(MAX(earning), 0) AS earning FROM data_per_month WHERE current_month = FALSE) AS lm
            WHERE cm.current_month = true
        ), products_stats AS (
            SELECT 
                COUNT(*) AS total_added,
                SUM(CASE WHEN date_trunc('month', created_at) = date_trunc('month', current_date) THEN 1 ELSE 0 END) AS added_this_month
            FROM products
        )
        SELECT 
        cp.*,
        ps.*
        FROM calculate_percent cp
        CROSS JOIN products_stats ps
    `);

    if (!result || !Array.isArray(result)) {
        return {};
    }

    return {
        sales: result[0].sales,
        sales_percentage_change: result[0].sales_percentage_change,
        earning: result[0].earning,
        earning_percentage_change: result[0].earning_percentage_change,
        total_added: result[0].total_added,
        added_this_month: result[0].added_this_month,
    } as StaticStats;
}

export const getTopProducts = async(): Promise<TopProducts[]> => {
    const result = await db?.execute(sql`
        SELECT 
            sd.product_id,
            p.request_id,
            p."name",
            sum(sd.quantity) AS quantity
        FROM sale_details sd 
        LEFT JOIN products p ON p.id = sd.product_id
        GROUP BY 1,2,3
        ORDER BY quantity DESC
        LIMIT 3
    `);

    if(!result){
        return []
    }

    return result?.map((row: any) => row) as TopProducts[];
}

export const getStatsByProductId = async(id: number, query: QueryFilter): Promise<StatsByProduct[]> => {
    const { start_date, end_date } = query;
    const filters: SQL[] = [];

    if(start_date && end_date ) {
        const startDate = parseDate(start_date);
        const endDate = parseDate(end_date);
        filters.push(sql`(sd.created_at BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp + interval '1 day')`);
    }

    const result = await db?.execute(sql`
        SELECT 
            sd.created_at::date AS sales_date,
            sum(sd.quantity) AS total_sales,
            sum(CASE WHEN s.payment_method = 'cash' THEN quantity ELSE 0 END) AS sales_by_cash,
            sum(CASE WHEN s.payment_method = 'credit_card' THEN quantity ELSE 0 END) AS sales_by_credit_card,
            sum(CASE WHEN s.payment_method = 'bank_transfer' THEN quantity ELSE 0 END) AS sales_by_bank_transfer
        FROM sale_details sd 
        LEFT JOIN sales s ON s.id = sd.sale_id 
        WHERE sd.product_id = ${id} ${filters.length > 0 ? sql`AND ${sql.join(filters, sql` AND `)}` : sql``}
        GROUP BY 1
        ORDER BY sd.created_at::date ASC  
    `)

    if(!result){
        return []
    }

    return result?.map((row: any) => row) as StatsByProduct[];
}
