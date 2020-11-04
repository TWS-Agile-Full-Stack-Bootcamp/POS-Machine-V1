import {loadAllItems, loadPromotions} from './Dependencies'
import {Receipt, ReceiptItem} from './Models'

export function printReceipt(tags: string[]): string {
  if(tags.length === 0) {
    return `***<store earning no money>Receipt ***
----------------------
**********************`
  }

  // const receipt: Receipt = {
  //   items :
  //   [
  //     {
  //       barcode: 'ITEM000001',
  //       name: 'Sprite',
  //       unit: 'bottle',
  //       quantity: 5,
  //       unitPrice: 3.00,
  //       originalSubTotal: 15.00,
  //       promotedSubTotal: 12.00
  //     },
  //     {
  //       barcode: 'ITEM000003',
  //       name: 'Litchi',
  //       unit: 'pound',
  //       quantity: 2.5,
  //       unitPrice: 15.00,
  //       originalSubTotal: 37.50,
  //       promotedSubTotal: 37.50
  //     },
  //     {
  //       barcode: 'ITEM000005',
  //       name: 'Instant Noodles',
  //       unit: 'bag',
  //       quantity: 3,
  //       unitPrice: 4.50,
  //       originalSubTotal: 13.50,
  //       promotedSubTotal: 9.00
  //     },
  //   ],
  //   total: 58.50,
  //   discountPrices: 7.50
  // }
  const receiptItems: ReceiptItem[] =
    [
      {
        barcode: 'ITEM000001',
        name: 'Sprite',
        unit: 'bottle',
        quantity: 5,
        unitPrice: 3.00,
        originalSubTotal: 15.00,
        promotedSubTotal: 12.00
      },
      {
        barcode: 'ITEM000003',
        name: 'Litchi',
        unit: 'pound',
        quantity: 2.5,
        unitPrice: 15.00,
        originalSubTotal: 37.50,
        promotedSubTotal: 37.50
      },
      {
        barcode: 'ITEM000005',
        name: 'Instant Noodles',
        unit: 'bag',
        quantity: 3,
        unitPrice: 4.50,
        originalSubTotal: 13.50,
        promotedSubTotal: 9.00
      },
    ]
  const receipt: Receipt = buildReceipt(receiptItems)

  return formatReceipt(receipt)
}

function buildReceipt(receiptItems: ReceiptItem[]): Receipt {
  const promotions = loadPromotions()

  receiptItems.map(item => {
    item.originalSubTotal = item.quantity * item.unitPrice
    promotions.find(promotion => {
      promotion.barcodes.includes(item.barcode) ?
        item.promotedSubTotal = item.originalSubTotal - Math.floor(item.quantity/3) * item.unitPrice : 0
    })
  })

  const total: number = receiptItems.reduce((sum, item) => {
    return sum + item.promotedSubTotal
  }, 0)

  const discountPrices: number = receiptItems.reduce((sum, item) => {
    return sum + item.originalSubTotal - item.promotedSubTotal
  }, 0)

  const receipt: Receipt = {
    items: receiptItems,
    total: total,
    discountPrices: discountPrices
  }

  return receipt
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
