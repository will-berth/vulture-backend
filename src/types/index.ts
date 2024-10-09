export interface Product {
    id?: number;
    category_id: number; 
    name: string;
    description: string;
    price: number; 
    stock: number;
    created_at?: Date
}

export interface QueryFilter {
    page?: number;
    limit?: number;
    name?: string;
}