import {deleteSupplier, getAllSupplier, saveSupplier, updateSupplier} from "../api/Supplier_api.js";
import {SupplierModel} from "../model/SupplierModel.js";


//regex pattern
const namePattern = /^[A-Za-z\s\-']+$/;
const nameLengthPattern = /^[A-Za-z\s\-']{3,20}$/;
const addressPattern = /^\d+\s[A-z]+\s[A-z]+(?:\s[A-z]+)?(?:,\s[A-z]+(?:\s[A-z]+)?)*(?:,\s[A-z]{2}\s\d{5})?$/;
const phoneNumberPattern = /^(?:\+?\d{1,3})?[ -]?\(?(?:\d{3})\)?[ -]?\d{3}[ -]?\d{4}$/;
const emailPattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z]+\.[a-zA-Z]+$/;

// clear inputs
function clearInputs() {
    $("#con-01").val("");
    $("#con-02").val("");
    $("#supplier-name").val("");
    $("#supplier-code").val("");
    $("#email").val("");
    $("#supplier-address").val("");
    generateNextSuplierId();
}
//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

//save customer
$("#s-save-btn").on('click', async () => {
    const supContOne = $("#con-01").val();
    const supContTwo = $("#con-02").val();
    const supName = $("#supplier-name").val();
    const supCode = $("#supplier-code").val();
    const supEmail = $("#email").val();
    const address = $("#supplier-address").val();
    const category = $("input[name='flexRadioDefault']:checked").val();

    console.log(supEmail)
    console.log(address)
    console.log(supContOne)
    console.log(supContTwo)
    console.log(supName)
    console.log(supCode)
    console.log(category)

    if (!supContOne || !supContTwo || !supName || !supCode || !supEmail || !address || !category) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(supName)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(supName)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    /*if (!addressPattern.test(address)) {
        console.log(addressPattern.test(address))
        showError("Enter a valid address.");
        return;
    }*/

    if (!phoneNumberPattern.test(supContOne) ||!phoneNumberPattern.test(supContTwo)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }

    if (!emailPattern.test(supEmail)) {
        showError("Enter a valid email address");
        return;
    }

    const status=await saveSupplier(new SupplierModel(supCode, supName,category,address,supContOne,supContTwo,supEmail));

    if (status === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Supplier saved successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    } else {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Supplier not saved, please try again',
            showConfirmButton: false,
            timer: 1500,
        });
    }

    await clearInputs();
    await loadAll();
});

//update customer
$("#s-update-btn").on('click', async () => {
    const supContOne = $("#con-01").val();
    const supContTwo = $("#con-02").val();
    const supName = $("#supplier-name").val();
    const supCode = $("#supplier-code").val();
    const supEmail = $("#email").val();
    const address = $("#supplier-address").val();
    const category = $("input[name='flexRadioDefault']:checked").val();

    if (!supContOne || !supContTwo || !supName || !supCode || !supEmail || !address || !category) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(supName)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(supName)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    /*if (!addressPattern.test(address)) {
        showError("Enter a valid address.");
        return;
    }*/

    if (!phoneNumberPattern.test(supContOne) ||!phoneNumberPattern.test(supContTwo)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }

    if (!emailPattern.test(supEmail)) {
        showError("Enter a valid email address");
        return;
    }

    const status=await updateSupplier(supCode, new SupplierModel(supCode, supName,category,address,supContOne,supContTwo,supEmail));

    if (status === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Supplier updated successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    } else {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Supplier not updated, please try again',
            showConfirmButton: false,
            timer: 1500,
        });
    }
    await loadAll();
    clearInputs()
});

// delete customer
$("#s-delete-btn").on('click', async () => {
    const supCode = $("#supplier-code").val();
    console.log(supCode);
    if (!supCode) {
        showError("Please enter a supplier code.");
        return;
    }
    try {
        const response = await deleteSupplier(supCode);
        console.log(response);
        if (response === 200) {
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Supplier deleted successfully',
                showConfirmButton: false,
                timer: 1500,
            });
            await loadAll();
            clearInputs();
        } else {
            showError("Supplier not deleted, please try again.");
        }
    } catch (error) {
        console.error(error);
        showError("An error occurred while deleting the supplier.");
    }
});

// load all customers to table
async function loadAll() {
    const suppliers = await getAllSupplier();
    $("#sup-t-body").empty();
    suppliers.map((item, index) => {
        let supplier =
            `<tr><td class="sup-code">${item.supCode}</td><td class="sup-name">${item.supName}</td><td class="category">${item.category}</td><td class="address">${item.address}</td><td class="contactOne">${item.contactOne}</td><td class="contactTwo">${item.contactTwo}</td><td class="email">${item.email}</td></tr>`
        $("#sup-t-body").append(supplier);
    })
}

// clicked raw set to input fields
$("#sup-t-body").on('click', ("tr"), async function () {
    const suppliers = await getAllSupplier();
    $("#con-01").val($(this).find(".contactOne").text());
    $("#con-02").val($(this).find(".contactTwo").text());
    $("#supplier-name").val($(this).find(".sup-name").text());
    $("#supplier-code").val($(this).find(".sup-code").text());
    $("#email").val($(this).find(".email").text());
    $("#supplier-address").val($(this).find(".address").text());

    suppliers.map((item, index) => {
        if (item.supCode===$("#supplier-code").val()) {
            if (item.category==='Local'){
                $("#flexRadioDefault2").prop("checked", true);
            }else{
                $("#flexRadioDefault1").prop("checked", true);
            }
        }
    });
});

//search customer
$("#supplier-search").on("input", async function () {
    const suppliers = await getAllSupplier();
    $("#sup-t-body").empty();
    suppliers.map((item, index) => {
        if (item.supCode.toLowerCase().startsWith($("#supplier-search").val().toLowerCase()) || item.supName.toLowerCase().startsWith($("#supplier-search").val().toLowerCase())) {
            let supplier =
                `<tr><td class="sup-code">${item.supCode}</td><td class="sup-name">${item.supName}</td><td class="category">${item.category}</td><td class="address">${item.address}</td><td class="contactOne">${item.contactOne}</td><td class="contactTwo">${item.contactTwo}</td><td class="email">${item.email}</td></tr>`
            $("#sup-t-body").append(supplier);
        }
    })
});

$("#supplier-search-btn").on("click", async function () {
    const suppliers = await getAllSupplier();
    $("#sup-t-body").empty();
    suppliers.map((item, index) => {
        if (item.supCode.toLowerCase() === ($("#supplier-search").val().toLowerCase()) || item.supName.toLowerCase() === ($("#supplier-search").val().toLowerCase())) {
            let supplier =
                `<tr><td class="sup-code">${item.supCode}</td><td class="sup-name">${item.supName}</td><td class="category">${item.category}</td><td class="address">${item.address}</td><td class="contactOne">${item.contactOne}</td><td class="contactTwo">${item.contactTwo}</td><td class="email">${item.email}</td></tr>`
            $("#sup-t-body").append(supplier);
        }
    })
});

async function generateNextSuplierId() {
    const suppliers = await getAllSupplier();
    if (suppliers.length === undefined) {
        $("#supplier-code").val("S001");
    } else {
        $("#supplier-code").val("S00" + (suppliers.length + 1));
    }
}

$(document).ready(function () {
    function supIdMakeReadonly() {
        $("#supplier-code").prop("readonly",true);
    }
    supIdMakeReadonly();
    generateNextSuplierId();
    loadAll();
    setInterval(supIdMakeReadonly,1000);
});


