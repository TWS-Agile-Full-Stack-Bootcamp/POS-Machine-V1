import {loadAllItems, loadPromotions} from './Dependencies'
import {Receipt, ReceiptItem, Promotion, Item, QuantitiedBarcode} from './Models'

export function printReceipt(tags: string[]): string {
  if(tags.length === 0) {
    return `***<store earning no money>Receipt ***
----------------------
**********************`
  }

  const receiptItems: ReceiptItem[] = parseToReceiptItems(tags)

  const receipt: Receipt = buildReceipt(receiptItems)

  return formatReceipt(receipt)
}

function parseToReceiptItems(tags: string[]): ReceiptItem[] {
  const allItems: Item[] = loadAllItems()

  const quantitiedBarcodes: QuantitiedBarcode[] = []

  tags.map(tag => {
    let quantitiedBarcode: QuantitiedBarcode
    if(tag.includes('-')) {
      const splittedTag: string[] = tag.split('-')
      quantitiedBarcode = {
        barcode: splittedTag[0],
        quantity: splittedTag[1].includes('.') ? parseFloat(splittedTag[1]) :parseInt(splittedTag[1])
      }
    } else {
      quantitiedBarcode = {
        barcode: tag,
        quantity: 1
      }
    }

    quantitiedBarcodes.some(barcdoe => barcdoe.barcode === quantitiedBarcode.barcode) ? quantitiedBarcodes.find(barcode => {
      if(barcode.barcode === quantitiedBarcode.barcode) {
        barcode.quantity += quantitiedBarcode.quantity
      }
    }) : quantitiedBarcodes.push(quantitiedBarcode)
  })

  const receiptItems: ReceiptItem[] = quantitiedBarcodes.map(barcode => {
    let receiptItem : ReceiptItem = {
      barcode: barcode.barcode,
      name: '',
      unit: '',
      quantity: barcode.quantity,
      unitPrice: 0,
      originalSubTotal: 0,
      promotedSubTotal: 0
    }
    allItems.find(item => {
      if(item.barcode === barcode.barcode ) {
        receiptItem =  {
          barcode: barcode.barcode,
          name: item.name,
          unit: item.unit,
          quantity: barcode.quantity,
          unitPrice: item.price,
          originalSubTotal: 0,
          promotedSubTotal: 0
        }
      }
    })
    return receiptItem
  })

  return receiptItems
}

function buildReceipt(receiptItems: ReceiptItem[]): Receipt {
  const promotions = loadPromotions()

  const receipt: Receipt = generateReceipt(receiptItems, promotions)

  return receipt
}

function generateReceipt(receiptItems: ReceiptItem[], promotions: Promotion[]) {
  const items: ReceiptItem[] = calculateSubTotals(receiptItems, promotions)

  const total: number = calculateTotal(items)

  const discountPrices: number = calculateDiscountPrices(items)

  const receipt: Receipt = {
    items: items,
    total: total,
    discountPrices: discountPrices
  }

  return receipt
}

function calculateDiscountPrices(receiptItems: ReceiptItem[]) {
  return receiptItems.reduce((sum, item) => {
    return sum + item.originalSubTotal - item.promotedSubTotal
  }, 0)
}

function calculateTotal(receiptItems: ReceiptItem[]) {
  return receiptItems.reduce((sum, item) => {
    return sum + item.promotedSubTotal
  }, 0)
}

function calculateSubTotals(receiptItems: ReceiptItem[], promotions: Promotion[]): ReceiptItem[]{
  receiptItems.map(item => {
    item.originalSubTotal = item.quantity * item.unitPrice
    promotions.find(promotion => {
      promotion.barcodes.includes(item.barcode)
        ? item.promotedSubTotal = item.originalSubTotal - Math.floor(item.quantity/3) * item.unitPrice
        : item.promotedSubTotal = item.originalSubTotal
    })
  })
  return receiptItems
}
function formatReceipt(receipt: Receipt): string {
  let printReceipt = '***<store earning no money>Receipt ***\n'

  printReceipt += renderItems(receipt.items)

  printReceipt += '\n----------------------\n'

  printReceipt += renderTotal(receipt.total, receipt.discountPrices)

  return printReceipt
}

function renderItems(items: ReceiptItem[]): string {
  return items.map(item => {
    return `Name：${item.name}，Quantity：${item.quantity} ${item.unit}s，Unit：${item.unitPrice.toFixed(2)}(yuan)，Subtotal：${item.promotedSubTotal.toFixed(2)}(yuan)`
  }).join('\n').trim()
}

function renderTotal(total: number, discountPrices: number): string {
  return `Total：${total.toFixed(2)}(yuan)
Discounted prices：${discountPrices.toFixed(2)}(yuan)
**********************`
}
