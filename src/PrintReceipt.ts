import {loadAllItems, loadPromotions, Item} from './Dependencies'
import {cursorTo} from 'readline'

function parseTagsToItems(tags: string[]) {
  return tags.map(tag => {
    const splitedTags = tag.split('-')
    if (splitedTags.length === 2) {
      const result = new OrderItem(splitedTags[0], parseFloat(splitedTags[1]))
      return result
    }
    return new OrderItem(tag, 1)
  })
}

function sumAllItems(allItems: OrderItem[]): Array<OrderItem> {
  return allItems.reduce((items: Array<OrderItem>, current: OrderItem) => {
    let findItem = items.find(item => item.barcode === current.barcode)
    if (!findItem) {
      findItem = new OrderItem(current.barcode, 0)
      items.push(findItem)
    }
    findItem.quantity += current.quantity
    return items
  }, Array<OrderItem>())
}

function getQuantityOrders(calculatedItems: Array<OrderItem>, allItems: ({ unit: string; price: number; name: string; barcode: string } | { unit: string; price: number; name: string; barcode: string } | { unit: string; price: number; name: string; barcode: string } | { unit: string; price: number; name: string; barcode: string } | { unit: string; price: number; name: string; barcode: string } | { unit: string; price: number; name: string; barcode: string })[]) {
  return calculatedItems.reduce((orders: Array<PromotionOrder>, current: OrderItem) => {
    let findOrderItem = orders.find(order => order.barcode === current.barcode)

    if (!findOrderItem) {
      let findItem = allItems.find(item => item.barcode === current.barcode)
      if (!findItem) {
        findItem = new Item('', '', '', 0)
      }
      findOrderItem = new PromotionOrder(current.barcode, findItem.name, findItem.price, findItem.unit)
      orders.push(findOrderItem)
    }
    findOrderItem.quantity += current.quantity
    return orders
  }, new Array<PromotionOrder>())
}

function renderOrderReceipt(quantityOrders: Array<PromotionOrder>) {
  return quantityOrders.reduce((pre, currect) => {
    pre.push(currect.render())
    return pre
  }, new Array<string>()).join('\n')
}

function getSumSaving(quantityOrders: Array<PromotionOrder>) {
  return quantityOrders.reduce((pre: number, current: PromotionOrder) => {
    pre += current.saving
    return pre
  }, 0)
}

function getSumTotal(quantityOrders: Array<PromotionOrder>) {
  return quantityOrders.reduce((pre: number, currnet: PromotionOrder) => {
    pre += currnet.subTotal
    return pre
  }, 0)
}

export function printReceipt(tags: string[]): string {
  const items = parseTagsToItems(tags)
  const calculatedItems = sumAllItems(items)

  const allItems = loadAllItems()
  const promotions = loadPromotions()

  const quantityOrders = getQuantityOrders(calculatedItems, allItems)

  const sumTotal = getSumTotal(quantityOrders)

  const  sumSaving = getSumSaving(quantityOrders)

  let receipt = '***<store earning no money>Receipt ***\n'
  receipt += renderOrderReceipt(quantityOrders)

  receipt += '\n----------------------\n'

  receipt +=  `Total：${sumTotal.toFixed(2)}(yuan)\n`

  receipt +=  `Discounted prices：${sumSaving.toFixed(2)}(yuan)\n`

  receipt +=  '**********************'

  return receipt
}

class OrderItem {
  constructor(public barcode: string, public quantity: number) {
  }
}

class PromotionOrder {
    public quantity: number
    private readonly halfPromotion = 0.5

    constructor(public  barcode: string, public  name: string, public price: number, public  unit: string) {
      this.quantity = 0
    }

    public render(): string {
      return `Name：${this.name}，Quantity：${this.quantity} ${this.unit}s，Unit：${this.price.toFixed(2)}(yuan)，Subtotal：${this.subTotal.toFixed(2)}(yuan)`
    }

    public get saving(): number {
      const allPromotions = loadPromotions()
      const promotion = allPromotions.find(promotion => promotion.barcodes.findIndex(barcode => barcode === this.barcode) > 0)

      if (promotion) {
        return Math.floor(this.quantity / 3) * this.price
      } else {
        return 0
      }
    }

    public get subTotal(): number {
      return this.total - this.saving
    }

    public get total(): number {
      return this.price * this.quantity
    }
}
