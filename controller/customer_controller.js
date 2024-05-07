// customer db
import {CustomerModel} from "../model/CustomerModel.js";
import {deleteCustomer, getAllCustomers, saveCustomer, updateCustomer} from "../api/Customer_api.js";

// clear inputs
function clearInputs() {
    $("#customer-address").val("");
    $("#customer-name").val("");
    $("#customer-nic").val("");
    $("#customer-contact").val("");
    $("#customer-search").val("");
    $("#customer-code").val("");
    $("#customer-email").val("");
}

// load all customers to table
async function loadAll() {
    const customers = await getAllCustomers();
    $("#customer-t-body").empty();
    customers.map((item, index) => {
        let customer =
            `<tr><td class="customer-code">${item.code}</td><td class="customer-name">${item.name}</td><td class="gender">${item.gender}</td><td class="joined-date">${item.joinedDate}</td><td class="level">${item.level}</td><td class="points">${item.totPoints}</td><td class="dob">${item.dob}</td><td class="address">${item.address}</td><td class="contact">${item.contact}</td><td class="email">${item.email}</td></tr>`
        $("#customer-t-body").append(customer);
    })
}

//regex pattern
const namePattern = /^[A-Za-z\s\-']+$/;
const nameLengthPattern = /^[A-Za-z\s\-']{3,20}$/;
const addressPattern = /^[A-Za-z0-9'\/\.\,  ]{5,}$/;
const phoneNumberPattern = /^(07[0125678]\d{7})$/;
const emailPattern = /^[a-zA-Z0-9_.-]@([a-zA-Z]+)([\\.])([a-zA-Z]+)$/;

//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

//save customer
$("#c-save-btn").on('click', async () => {
    const customerCont = $("#customer-contact").val();
    const customerName = $("#customer-name").val();
    const customerCode = $("#customer-code").val();
    const customerEmail = $("#customer-email").val();
    const address = $("#customer-address").val();
    const joindeDate = $("#customer-joined-date").val();
    const dob = $("#customer-dob").val();
    const level = $("#level").val();
    const points = $("#point").val();
    const gender = $("input[name='flexRadioDefault']:checked").val();

    if (!customerCont || !customerName || !address || !customerCode || !customerEmail || !joindeDate || !dob) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(customerName)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(customerName)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    if (!addressPattern.test(address)) {
        showError("Enter a valid address.");
        return;
    }

    if (!phoneNumberPattern.test(customerCont)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }

    if (!emailPattern.test(customerEmail)) {
        showError("Enter a valid email address");
        return;
    }

    const status=await saveCustomer(new CustomerModel(customerCode, customerName,gender,joindeDate, level, points,dob,address,customerCont,customerEmail,new Date()));

    if (status === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Customer saved successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    } else {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Customer not saved, please try again',
            showConfirmButton: false,
            timer: 1500,
        });
    }

    await clearInputs();
    await loadAll();
});

//update customer
$("#c-update-btn").on('click', async () => {
    const customerCont = $("#customer-contact").val();
    const customerName = $("#customer-name").val();
    const customerCode = $("#customer-code").val();
    const customerEmail = $("#customer-email").val();
    const address = $("#customer-address").val();
    const joindeDate = $("#customer-joined-date").val();
    const dob = $("#customer-dob").val();
    const level = $("#level").val();
    const points = $("#point").val();
    const gender = $("input[name='flexRadioDefault']:checked").val();

    if (!customerCont || !customerName || !address || !customerCode || !customerEmail || !joindeDate || !dob) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(customerName)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(customerName)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    if (!addressPattern.test(address)) {
        showError("Enter a valid address.");
        return;
    }

    if (!phoneNumberPattern.test(customerCont)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }

    if (!emailPattern.test(customerEmail)) {
        showError("Enter a valid email address");
        return;
    }

    const status = await updateCustomer(new CustomerModel(customerCode, customerName, gender, joindeDate, level, points, dob, address, customerCont,customerEmail, new Date()));

    if (status === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Customer Updated successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    } else {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Customer not updated, please try again',
            showConfirmButton: false,
            timer: 1500,
        });
    }
    await loadAll();
    clearInputs()
});

// delete customer
$("#c-delete-btn").on('click', async () => {
    const customerCode = $("#customer-code").val();
    const response = await deleteCustomer(customerCode);
    if (200 == response) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Customer deleted successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    }
    await loadAll();
    clearInputs();
});

// clicked raw set to input fields
$("#customer-t-body").on('click', ("tr"), function () {
    $("#customer-name").val($(this).find(".customer-name").text());
    $("#customer-nic").val($(this).find(".customer-code").text());
    $("#customer-address").val($(this).find(".address").text());
    $("#customer-contact").val($(this).find(".contact").text());
    $("#customer-joined-date").val($(this).find(".joined-date").text());
    $("#dob").val($(this).find(".dob").text());
    $("#point").val($(this).find(".points").text());
    $("#level").val($(this).find(".level").text());
});

//search customer
$("#customer-search").on("input", async function () {
    const customers = await getAllCustomers();
    $("#customer-t-body").empty();
    customers.map((item, index) => {
        if (item.code.toLowerCase().startsWith($("#customer-search").val().toLowerCase()) || item.name.toLowerCase().startsWith($("#customer-search").val().toLowerCase()) || item.email.toLowerCase().startsWith($("#customer-search").val().toLowerCase())) {
            let customer =
                `<tr><td class="customer-code">${item.code}</td><td class="customer-name">${item.name}</td><td class="gender">${item.gender}</td><td class="joined-date">${item.joinedDate}</td><td class="level">${item.level}</td><td class="points">${item.totPoints}</td><td class="dob">${item.dob}</td><td class="address">${item.address}</td><td class="contact">${item.contact}</td><td class="email">${item.email}</td></tr>`
            $("#customer-t-body").append(customer);
        }
    })
});
$("#customer-search-btn").on("click", async function () {
    const customers = await getAllCustomers();
    $("#customer-t-body").empty();
    customers.map((item, index) => {
        if (item.code.toLowerCase() === ($("#customer-search").val().toLowerCase()) || item.name.toLowerCase() === ($("#customer-search").val().toLowerCase()) || item.email.toLowerCase() === ($("#customer-search").val().toLowerCase())) {
            let customer =
                `<tr><td class="customer-code">${item.code}</td><td class="customer-name">${item.name}</td><td class="gender">${item.gender}</td><td class="joined-date">${item.joinedDate}</td><td class="level">${item.level}</td><td class="points">${item.totPoints}</td><td class="dob">${item.dob}</td><td class="address">${item.address}</td><td class="contact">${item.contact}</td><td class="email">${item.email}</td></tr>`
            $("#customer-t-body").append(customer);
        }
    })
});


//generate next item id
function generateNextCustomerId() {
    const customers = getAllCustomers();
    $("#cust-id").val("C00" + (customers.length + 1));
}

$(document).ready(function () {
    function custIdMakeReadonly() {
        $("#cust-id").prop("readonly",true);
    }
    custIdMakeReadonly();
    generateNextCustomerId();
    loadAll();
    setInterval(custIdMakeReadonly,1000);
});