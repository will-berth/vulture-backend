export interface Product {
    id?: number;
    category_id: number; 
    name: string;
    description: string;
    price: number; 
    stock: number;
    created_at?: Date
}

export interface ProductResponse {
    id: number;
    category_id?: number; 
    name?: string;
    description?: string;
    price?: number; 
    stock?: number;
    created_at?: Date
}

export interface QueryFilter {
    page?: number;
    limit?: number;
    name?: string;
    category_ids?: string;
    created_at?: string;
    price_min?: number;
    price_max?: number;
    stock_min?: number;
    stock_max?: number;
}

export interface SaleDetail {
    id?: number;
    sale_id?: number;
    product_id?: number;
    quantity?: number;
    price?: number;
    subtotal?: number;
    product_name?: string;
}

export interface SaleInput {
    id?: number;
    payment_method: string;
    products: SaleDetail[];
}

export interface Sale{
    id?: number;
    total?: number;
    payment_method?: string;
    payment_method_label?: string;
    created_at?: Date;
    products?: SaleDetail[];
}

export interface Category{
    id: number;
    name: string;
}