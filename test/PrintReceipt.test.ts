import {promote, expandItemFromBarcode, decodeTags, printReceipt} from '../src/PrintReceipt'

describe('printReceipt', () => {
  it('should print receipt with promotion when print receipt', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ]

    const expectText = `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`

    expect(printReceipt(tags)).toEqual(expectText)
  })

  it('should decode tags', () => {
    //given
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ]

    //when
    const actual = decodeTags(tags)

    //then
    const expected = [{
      barcode: 'ITEM000001',
      quantity: 5,
    }, {
      barcode: 'ITEM000003',
      quantity: 2.5,
    }, {
      barcode: 'ITEM000005',
      quantity: 3
    }]
    expect(actual).toEqual(expected)
  })

  it('should expand items from barcodes', () => {
    //given
    const items = [{
      barcode: 'ITEM000001',
      quantity: 5,
    }, {
      barcode: 'ITEM000003',
      quantity: 2.5,
    }, {
      barcode: 'ITEM000005',
      quantity: 3
    }]

    //when
    const actual = expandItemFromBarcode(items)

    //then
    const expected = [{
      barcode: 'ITEM000001',
      quantity: 5,
      name: 'Sprite',
      unit: 'bottle',
      price: 3.00,
      subtotal: 15
    }, {
      barcode: 'ITEM000003',
      quantity: 2.5,
      name: 'Litchi',
      unit: 'pound',
      price: 15.00,
      subtotal: 37.5
    }, {
      barcode: 'ITEM000005',
      quantity: 3,
      name: 'Instant Noodles',
      unit: 'bag',
      price: 4.50,
      subtotal: 13.5
    }]
    expect(actual).toEqual(expected)
  })

  it('should calculate subtotal of items on sale', () => {
    //given
    const items = [{
      barcode: 'ITEM000001',
      quantity: 5,
      name: 'Sprite',
      unit: 'bottle',
      price: 3.00,
      subtotal: 15
    }, {
      barcode: 'ITEM000003',
      quantity: 2.5,
      name: 'Litchi',
      unit: 'pound',
      price: 15.00,
      subtotal: 37.5
    }, {
      barcode: 'ITEM000005',
      quantity: 3,
      name: 'Instant Noodles',
      unit: 'bag',
      price: 4.50,
      subtotal: 13.5
    }]

    //when
    const actual = promote(items)

    //then
    const expected = [{
      barcode: 'ITEM000001',
      quantity: 5,
      name: 'Sprite',
      unit: 'bottle',
      price: 3.00,
      subtotal: 12
    }, {
      barcode: 'ITEM000003',
      quantity: 2.5,
      name: 'Litchi',
      unit: 'pound',
      price: 15.00,
      subtotal: 37.5
    }, {
      barcode: 'ITEM000005',
      quantity: 3,
      name: 'Instant Noodles',
      unit: 'bag',
      price: 4.50,
      subtotal: 9
    }]
    expect(actual).toEqual(expected)
  })
})
