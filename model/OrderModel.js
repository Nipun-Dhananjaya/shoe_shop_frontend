export class OrderModel {
    constructor(ordId, ordDate, cust, items, payMethod,subtot, discount, cashierName,ordStatus) {
        this.ordId = ordId;
        this.ordDate = ordDate;
        this.cust = cust;
        this.items = items;
        this.payMethod = payMethod;
        this.subtot = subtot;
        this.discount = discount;
        this.cashierName = cashierName;
        this.ordStatus = ordStatus;
    }
}