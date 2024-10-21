import { SQL, sql } from "drizzle-orm";
import { db } from "../../db";
import { ProductResponse, QueryFilter, Sale, SaleByProduct, SaleDetail } from "../../types";
import { getPaymentMethodLabel, parseDate } from "../../utils";
import { customAlphabet } from "nanoid";

export const getProductsInfo = async(products: SaleDetail[]): Promise<ProductResponse[]> => {
    const productIds: SQL[] = products.map(p => sql`${p.product_id}`);
    const result = await db?.execute(sql`
        SELECT 
            id,
            price, 
            stock 
        FROM products 
        WHERE id IN(${sql.join(productIds, sql`,`)})
    `);

    if (!result || !Array.isArray(result)) {
        return [];
    }

    return result?.map((row: any) => row) as ProductResponse[];
}

export const getSaleDetail = async(id: number): Promise<Sale> => {
    const result = await db?.execute(sql`
        WITH product_details AS (
            SELECT 
                sd.*,
                p.name AS product_name
            FROM sale_details sd
            LEFT JOIN products p ON p.id = sd.product_id
            WHERE sd.sale_id = ${id}
        )
        SELECT 
            s.id,
            s.total,
            s.payment_method,
            s.created_at,
            jsonb_agg(sd.*) AS products
        FROM sales s
        LEFT JOIN product_details sd ON sd.sale_id = s.id
        WHERE s.id = ${id}
        GROUP BY 1
    `);

    if(!result){
        return {}
    }

    return result[0] as Sale;
}

export const insertSale = async(subTotal:number, paymentMethod: string, saleDetail: SaleDetail[]) => {
    await db?.transaction(async(tx) => {
        const requestId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
        const sale = await tx.execute(sql`
            INSERT INTO sales(request_id, total, payment_method)
            VALUES(${requestId()}, ${subTotal}, ${paymentMethod})
            RETURNING id;
        `);

        const saleId: number = sale[0].id as number;

        const queries: SQL[][] = [[],[],[]];

        for(let sale of saleDetail){
            queries[0].push(sql`(${saleId}, ${sale.product_id}, ${sale.quantity}, ${sale.price}, ${sale.subtotal})`); // insert sale details
            queries[1].push(sql`WHEN id = ${sale.product_id}::integer THEN ${sale.quantity}::integer `); // update stock
            queries[2].push(sql`${sale.product_id}`); // update stock by product id
        }

        await tx.execute(sql`
            INSERT INTO sale_details(sale_id, product_id, quantity, price, subtotal)
            VALUES ${sql.join(queries[0], sql`,`)}    
        `);

        await tx.execute(sql`
            UPDATE products
            SET stock = stock - CASE
                ${sql.join(queries[1], sql``)}
                ELSE 0
            END
            WHERE id IN(${sql.join(queries[2], sql`,`)})
        `);
    });
}

export const getSalesData = async(query: QueryFilter): Promise<SaleByProduct[]> => {
    // const offset: number = (page - 1) * limit;
    const { start_date, end_date } = query;
    const filters: SQL[] = [];

    if(start_date && end_date ) {
        const startDate = parseDate(start_date);
        const endDate = parseDate(end_date);
        filters.push(sql`(sd.created_at BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp)`);
    }
    const result: any = await db?.execute(sql`
        SELECT 
            s.request_id AS sale_id,
            p.request_id AS product_id,
            p."name",
            sd.quantity,
            sd.price,
            sd.subtotal,
            sd.created_at
        FROM sale_details sd 
        LEFT JOIN products p ON p.id = sd.product_id 
        LEFT JOIN sales s ON s.id = sd.sale_id
        ${filters.length > 0 ? sql`WHERE ${sql.join(filters, sql` AND `)}` : sql``}  
        ORDER BY sd.created_at DESC
    `);

    if (!result || !Array.isArray(result)) {
        return [];
    }

    return result?.map((row: any) => ({
        sale_id: row.sale_id,
        product_id: row.product_id,
        quantity: row.quantity,
        name: row.name,
        price: row.price,
        subtotal: row.subtotal,
        created_at: row.created_at
    })) as SaleByProduct[];
}