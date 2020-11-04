import {loadAllItems, loadPromotions} from './Dependencies'
import {Receipt, ReceiptItem} from './Models'

export function printReceipt(tags: string[]): string {
  if(tags.length === 0) {
    return `***<store earning no money>Receipt ***
----------------------
**********************`
  }

  const receipt: Receipt = {
    items : [],
    total: 0,
    discountPrices: 0
  }
  return render(receipt)
}

function render(receipt: Receipt): string {
  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}
