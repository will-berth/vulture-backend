import { SQL, sql } from "drizzle-orm";
import { db } from "../../db";
import { Category, Product, QueryFilter } from "../../types";


export const insertProduct = async(product: Product) => {
    return await db?.execute(sql`
        INSERT INTO products (category_id, name, description, price, stock)
        VALUES(${product.category_id}, ${product.name}, ${product.description}, ${product.price}, ${product.stock});
    `);
}

export const updateProductInfo = async(product: Product) => {
    return await db?.execute(sql`
        UPDATE products
        SET category_id = ${product.category_id},
        name = ${product.name},
        description = ${product.description},
        price = ${product.price},
        stock = ${product.stock}
        WHERE id = ${product.id};
    `);
}

export const getAllProducts = async(query: QueryFilter): Promise<Product[]> => {
    const { page, limit, name, price_min, price_max, stock_min, stock_max, category_ids, created_at } = query;
    const offset: number = (page && limit ) ? (page - 1) * limit : 0;
    const filters: SQL[] = []
    if(name) filters.push(sql`(LOWER(p.name) LIKE '%${sql.raw(name)}%')`);
    if(category_ids) filters.push(sql`(p.category_id IN(${sql.raw(category_ids)}))`);

    if(price_min) filters.push(sql`(p.price >= ${price_min}::INTEGER)`);
    if(price_max) filters.push(sql`(p.price <= ${price_max}::INTEGER)`);
    if(stock_min) filters.push(sql`(p.stock >= ${stock_min}::INTEGER)`);
    if(stock_max) filters.push(sql`(p.stock <= ${stock_max}::INTEGER)`);

    
    if(created_at) {
        const date = new Date(created_at as string);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        const formattedDate = `${year}-${month}-${day}`;
        filters.push(sql`(p.created_at >= ${formattedDate}::timestamp AND p.created_at <= ${formattedDate}::timestamp + interval '1  day')`)
    }

    const result: any = await db?.execute(sql`
        SELECT 
            p.id, 
            p.name,
            p.description,
            p.price,
            p.stock,
            p.created_at,
            p.category_id,
            c."name" AS category
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ${filters.length > 0 ? sql`WHERE ${sql.join(filters, sql` AND `)}` : sql``}
        ORDER BY p.created_at DESC
        ${(page && limit ) ? sql`LIMIT ${limit}` : sql``}
        OFFSET ${offset}
    `);

    if (!result || !Array.isArray(result)) {
        return [];
    }

    return result?.map((row: any) => row) as Product[];
}

export const getAllProductsCount = async(query: QueryFilter): Promise<number> => {
    const { name, price_min, price_max, stock_min, stock_max, category_ids } = query;
    const filters: SQL[] = []
    if(name) sql`(LOWER(p.name) LIKE '%${sql.raw(name)}%')`;
    if(category_ids) sql`(c.category_id IN(${sql.raw(category_ids)}))`;

    if(price_min) filters.push(sql`(p.price >= ${price_min}::INTEGER)`);
    if(price_max) filters.push(sql`(p.price <= ${price_max}::INTEGER)`);
    if(stock_min) filters.push(sql`(p.stock >= ${stock_min}::INTEGER)`);
    if(stock_max) filters.push(sql`(p.stock <= ${stock_max}::INTEGER)`);

    const result: any = await db?.execute(sql`
        SELECT 
            COUNT(p.id)
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ${filters.length > 0 ? sql`WHERE ${sql.join(filters, sql` AND `)}` : sql``}
    `);

    if (!result || !Array.isArray(result)) {
        return 0;
    }

    return result?.length;
}

export const existsProducts = async(): Promise<boolean> => {
    const result: any = await db?.execute(sql`
        SELECT EXISTS (SELECT id FROM products p)
    `);

    return result[0].exists;
} 

export const getAllCategories = async(): Promise<Category[]> => {
    const result: any = await db?.execute(sql`
        SELECT
            id,
            name
        FROM categories
        ORDER BY name ASC
    `);

    return result;
}