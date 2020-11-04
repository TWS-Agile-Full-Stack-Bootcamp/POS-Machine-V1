export interface Receipt {
    items: ReceiptItem[],
    total: number,
    discountPrices: number
}

export interface ReceiptItem{
    barcode: string,
    name: string,
    unit: string,
    quantity: number,
    unitPrice: number,
    originalSubTotal: number,
    promotedSubTotal: number
}
