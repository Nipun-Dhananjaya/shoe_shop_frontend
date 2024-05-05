export class EmployeeModel {
    constructor(empCode,empName,proPic, gender,status,designation,accessRole,dob,joinedDate,branch, address, contact,email,guardian,guardianCont) {
        this.empCode = empCode;
        this.empName = empName;
        this.proPic = proPic;
        this.gender = gender;
        this.status = status;
        this.designation = designation;
        this.accessRole = accessRole;
        this.dob = dob;
        this.joinedDate = joinedDate;
        this.branch = branch;
        this.address = address;
        this.contact = contact;
        this.email = email;
        this.guardian = guardian;
        this.guardianCont = guardianCont;
    }
}