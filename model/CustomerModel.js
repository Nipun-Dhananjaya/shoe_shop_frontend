export class CustomerModel {
    constructor(code,name, gender,joinedDate,level,totPoints,dob, address, contact,email,recentPurchase) {
        this.code = code;
        this.name = name;
        this.gender = gender;
        this.joinedDate = joinedDate;
        this.level = level;
        this.totPoints = totPoints;
        this.dob = dob;
        this.address = address;
        this.contact = contact;
        this.email = email;
        this.recentPurchase = recentPurchase;
    }
}