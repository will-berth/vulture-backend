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
    start_date?: string;
    end_date?: string;
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
    request_id?: string;
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

export interface SaleByProduct{
    sale_id: string;
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: Date;
}

export interface StaticStats {
    sales?: number;
    sales_percentage_change?: number;
    earning?: number;
    earning_percentage_change?: number;
    total_added?: number;
    added_this_month?: number;
}

export interface TopProducts {
    product_id: number;
    request_id: string;
    name: string;
    quantity: number;
}

export interface StatsByProduct {
    sales_date: string;
    total_sales: number;
    sales_by_cash: number;
    sales_by_credit_card: number;
    sales_by_bank_transfer: number;
}