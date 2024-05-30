export class ItemModel {
    constructor(itemId, itemName,picture,category,size,socks,cleaner,supCode, salePrice,buyPrice,expectedProfit,profitMargin, qtv) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.picture = picture;
        this.category = category;
        this.size = size;
        this.socks = socks;
        this.cleaner = cleaner;
        this.supCode = supCode;
        this.salePrice = salePrice;
        this.buyPrice = buyPrice;
        this.expectedProfit = expectedProfit;
        this.profitMargin = profitMargin;
        this.qtv = qtv;
    }
}