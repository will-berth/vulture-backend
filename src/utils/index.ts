enum PaymentMethods {
    cash = 'Efectivo',
    credit_card = 'Tarjeta',
    bank_transfer = 'Transferencia'
}

export function sanitizeInput(input: string): string {
    return input
        .replace(/'/g, "''")
        .replace(/"/g, '""')
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '')
        .replace(/--/g, '')
        .trim();
}

export function getPaymentMethodLabel(payment_method: keyof typeof PaymentMethods): string {
    return PaymentMethods[payment_method];
}

export function generateProductCode(prefix: string = 'PROD', length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}