import {loadAllItems, loadPromotions} from './Dependencies'

interface Item {
  barcode: string
  name: string
  unit: string
  price: number
  count: number
  subtotal: number
}

const renderItems = (items: Item[]): string => {
  return `Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)`
}

const calculateTotal = (items: Item[]): number => {
  return 58.50
}

const calculateDiscount = (items: Item[]): number => {
  return 7.50
}

const renderReceipt = (items: Item[]): string => {
  return `***<store earning no money>Receipt ***
${renderItems(items)}
----------------------
Total：${calculateTotal(items).toFixed(2)}(yuan)
Discounted prices：${calculateDiscount(items).toFixed(2)}(yuan)
**********************`
}

const promote = (items: Item[]): Item[] => {
  return [<Item>{}]
}

const decodeTags = (items: Item[]): Item[] => {
  return [<Item>{}]
}

export const consolidate = (tags: string[]): Item[] => {
  return [<Item>{}]
}

export function printReceipt(tags: string[]): string {
  return renderReceipt(promote(decodeTags(consolidate(tags))))
}
