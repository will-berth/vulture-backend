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