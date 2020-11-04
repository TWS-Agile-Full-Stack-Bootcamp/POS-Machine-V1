export function loadAllItems() {
  return [
    new Item('ITEM000000', 'Coca-Cola', 'bottle', 3.00),
    new Item('ITEM000001', 'Sprite', 'bottle', 3.00),
    new Item('ITEM000002', 'Apple', 'pound', 5.50),
    new Item('ITEM000003', 'Litchi', 'pound', 15.00),
    new Item('ITEM000004', 'Battery', 'a', 2.00),
    new Item('ITEM000005', 'Instant Noodles', 'bag', 4.50)
  ]
}

export class Item {
  constructor(public  barcode: string, public  name: string, public  unit: string, public price: number) {
  }
}

export function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'ITEM000000',
        'ITEM000001',
        'ITEM000005'
      ]
    }
  ]
}
