export class OrderModel {
    constructor(ordId, ordDate, code, items, payMethod,subtot, discount, email,ordStatus) {
        this.ordId = ordId;
        this.ordDate = ordDate;
        this.code = code;
        this.items = items;
        this.payMethod = payMethod;
        this.subtot = subtot;
        this.discount = discount;
        this.email = email;
        this.ordStatus = ordStatus;
    }
}