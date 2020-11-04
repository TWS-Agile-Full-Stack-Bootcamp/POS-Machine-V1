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

const renderItems = (items: Item[]): string => {
  return `Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)`
}

const sum = (a: number, b: number): number => a + b

const calculateTotal = (items: Item[]): number => {
  return items.map(item => item.subtotal).reduce(sum, 0)
}

const calculateDiscount = (items: Item[]): number => {
  return items.map(item => item.price * item.quantity - item.subtotal).reduce(sum, 0)
}

const renderReceipt = (items: Item[]): string => {
  return `***<store earning no money>Receipt ***
${renderItems(items)}
----------------------
Total：${calculateTotal(items).toFixed(2)}(yuan)
Discounted prices：${calculateDiscount(items).toFixed(2)}(yuan)
**********************`
}

export const promote = (items: Item[]): Item[] => {
  const promotions: Promotion[] = loadPromotions()
  const discounts = promotions.flatMap(({barcodes, promote}) => items
    .filter(item => barcodes.includes(item.barcode))
    .map(item => ({
      barcode: item.barcode,
      subtotal: promote(item)
    })))
  return items.map(item => {
    const theDiscount = discounts.find(discount => discount.barcode === item.barcode)
    return theDiscount ? Object.assign(item, {subtotal: theDiscount.subtotal}) : item
  })
}

export const expandItemFromBarcode = (tags: Tag[]): Item[] => {
  const skus: SKU[] = loadAllItems()
  return tags.map(tag => {
    const theSku = skus.find(sku => sku.barcode === tag.barcode)
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

export const decodeTags = (tags: string[]): Tag[] => {
  const decodedTags: Tag[] = []
  tags.forEach(tagString => {
    const [barcode, quantityString] = tagString.split('-')
    const quantity = quantityString ? parseFloat(quantityString) : 1
    const found = decodedTags.find(tag => tag.barcode === barcode)
    if (!found) decodedTags.push({barcode, quantity})
    else found.quantity += quantity
  })
  return decodedTags
}

export function printReceipt(tags: string[]): string {
  return renderReceipt(promote(expandItemFromBarcode(decodeTags(tags))))
}
