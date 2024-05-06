export class ItemModel {
    constructor(itemId, itemName,picture,category,size,supplierCode,supplierName, salePrice,buyPrice,expectedProfit,profitMargin, qtv) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.picture = picture;
        this.category = category;
        this.size = size;
        this.supplierCode = supplierCode;
        this.supplierName = supplierName;
        this.salePrice = salePrice;
        this.buyPrice = buyPrice;
        this.expectedProfit = expectedProfit;
        this.profitMargin = profitMargin;
        this.qtv = qtv;
    }
}