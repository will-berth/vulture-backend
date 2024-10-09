import { SQL, sql } from "drizzle-orm";
import { db } from "../../db";
import { Product } from "../../types";


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

export const getAllProducts = async(page: number, limit: number, name: string | undefined): Promise<Product[]> => {
    const offset: number = (page - 1) * limit;
    const search: SQL = name ? sql`WHERE LOWER(name) LIKE '%${sql.raw(name)}%'` : sql``;
    const result: any = await db?.execute(sql`
        SELECT 
            id, 
            name,
            description,
            price,
            stock,
            created_at
        FROM products
        ${search}
        LIMIT ${limit}
        OFFSET ${offset};    
    `);

    if (!result || !Array.isArray(result)) {
        return [];
    }

    return result?.map((row: any) => row) as Product[];
}