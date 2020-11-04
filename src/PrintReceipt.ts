import {loadAllItems, loadPromotions} from './Dependencies'
import {Item} from './Item'

interface SKU {
  barcode: string
  name: string
  unit: string
  price: number
}

interface Tag {
  barcode: string
  quantity: number
}

interface Promotion {
  type: string
  barcodes: string[]
  promote: Function
}

export class ReceiptPrinter {
  renderUnit = (item: Item): string => item.unit + ((item.quantity > 1) ? 's' : '')

  renderFloat = (target: number): string => target.toFixed(2)

  renderItems = (items: Item[]): string => {
    return items
      .map(item => `Name：${item.name}，Quantity：${item.quantity} ${this.renderUnit(item)}，Unit：${this.renderFloat(item.price)}(yuan)，Subtotal：${this.renderFloat(item.subtotal)}(yuan)`)
      .join('\n')
  }

  sum = (a: number, b: number): number => a + b

  calculateTotal = (items: Item[]): number => {
    return items.map(item => item.subtotal).reduce(this.sum, 0)
  }

  calculateDiscount = (items: Item[]): number => {
    return items.map(item => item.price * item.quantity - item.subtotal).reduce(this.sum, 0)
  }

  renderReceipt = (items: Item[]): string => {
    return `***<store earning no money>Receipt ***
${this.renderItems(items)}
----------------------
Total：${this.renderFloat(this.calculateTotal(items))}(yuan)
Discounted prices：${this.renderFloat(this.calculateDiscount(items))}(yuan)
**********************`
  }

  byBarcodeOf = (target: {barcode: string}) => (({barcode}: {barcode: string}) => barcode === target.barcode)

  promote (items: Item[]): Item[] {
    const promotions: Promotion[] = loadPromotions()
    const discounts = promotions.flatMap(({barcodes, promote}) => items
      .filter(item => barcodes.includes(item.barcode))
      .map(item => ({
        barcode: item.barcode,
        subtotal: promote(item)
      })))
    return items.map(item => {
      const theDiscount = discounts.find(this.byBarcodeOf(item))
      return theDiscount ? Object.assign(item, {subtotal: theDiscount.subtotal}) : item
    })
  }

  expandItemFromBarcode (tags: Tag[]): Item[] {
    const skus: SKU[] = loadAllItems()
    return tags.map(tag => {
      const theSku = skus.find(this.byBarcodeOf(tag))
      return {
        barcode: theSku!.barcode,
        name: theSku!.name,
        unit: theSku!.unit,
        price: theSku!.price,
        quantity: tag.quantity,
        subtotal: tag.quantity * theSku!.price
      }
    })
  }

  decodeTags (tags: string[]): Tag[] {
    const decodedTags: Tag[] = []
    tags.forEach(tagString => {
      const [barcode, quantityString] = tagString.split('-')
      const quantity = quantityString ? parseFloat(quantityString) : 1
      const found = decodedTags.find(this.byBarcodeOf({barcode}))
      if (!found) decodedTags.push({barcode, quantity})
      else found.quantity += quantity
    })
    return decodedTags
  }

  public printReceipt (tags: string[]): string {
    return this.renderReceipt(this.promote(this.expandItemFromBarcode(this.decodeTags(tags))))
  }
}
