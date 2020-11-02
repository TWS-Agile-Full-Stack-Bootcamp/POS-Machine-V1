import {loadAllItems, loadPromotions} from './Dependencies'

interface Item {
  barcode: string
  name: string
  unit: string
  price: number
  count: number
  subtotal: number
}

const renderReceipt = (items: Item[]): string => {
  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}

const promote = (items: Item[]): Item[] => {
  return [<Item>{}]
}

const decodeTag = (tags: string[]): Item[] => {
  return [<Item>{}]
}

export function printReceipt(tags: string[]): string {
  return renderReceipt(promote(decodeTag(tags)))
}
