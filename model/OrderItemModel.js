export class OrderItemModel {
    constructor(itemId, itemName,size, qtv, price) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.size = size;
        this.qtv = qtv;
        this.price = price;
    }
}