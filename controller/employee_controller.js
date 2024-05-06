import {deleteEmployee, getAllEmployees, saveEmployee, updateEmployee} from "../api/Employee_api.js";
import {EmployeeModel} from "../model/EmployeeModel.js";

// clear inputs
function clearInputs() {
    $("#emp-address").val("");
    $("#emp-name").val("");
    $("#emp-nic").val("");
    $("#emp-contact").val("");
    $("#emp-search").val("");
    $("#emp-code").val("");
    $("#emp-email").val("");
}

// load all customers to table
async function loadAll() {
    const customers = await getAllEmployees();
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
$("#e-save-btn").on('click', async () => {
    const empCont = $("#emp-contact").val();
    const empName = $("#emp-name").val();
    const empCode = $("#emp-code").val();
    const empEmail = $("#emp-email").val();
    const address = $("#emp-address").val();
    const joindeDate = $("#emp-joined-date").val();
    const dob = $("#emp-dob").val();
    const guardian = $("#guardian-name").val();
    const guardianCont = $("#guardian-contact").val();
    const eStatus = $("#status").val();
    const designation = $("#designation").val();
    const role = $("#role").val();
    const branch = $("#branch").val();
    const gender = $("input[name='flexRadioDefault']:checked").val();

    if (!empCont || !empName || !address || !empCode || !empEmail || !joindeDate || !dob) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(empName)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(empName)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    if (!addressPattern.test(address)) {
        showError("Enter a valid address.");
        return;
    }

    if (!phoneNumberPattern.test(empCont)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }

    if (!emailPattern.test(empEmail)) {
        showError("Enter a valid email address");
        return;
    }
    let base64String='';
    var file = $("#fileInput")[0].files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function() {
            base64String = reader.result;
            console.log("File converted to Base64:", base64String);
        };

        reader.onerror = function(error) {
            showError("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        showError('Profile Picture Not Selected');
    }

    const status=await saveEmployee(new EmployeeModel(empCode, empName,base64String,gender,eStatus,designation,role,dob,joindeDate, branch, address,empCont,empEmail,guardian,guardianCont));

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
$("#e-update-btn").on('click', async () => {
    const empCont = $("#emp-contact").val();
    const empName = $("#emp-name").val();
    const empCode = $("#emp-code").val();
    const empEmail = $("#emp-email").val();
    const address = $("#emp-address").val();
    const joindeDate = $("#emp-joined-date").val();
    const dob = $("#emp-dob").val();
    const guardian = $("#guardian-name").val();
    const guardianCont = $("#guardian-contact").val();
    const eStatus = $("#status").val();
    const designation = $("#designation").val();
    const role = $("#role").val();
    const branch = $("#branch").val();
    const gender = $("input[name='flexRadioDefault']:checked").val();

    if (!empCont || !empName || !address || !empCode || !empEmail || !joindeDate || !dob) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test(empName)) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test(empName)) {
        showError("Name must be 3 to 20 characters long.");
        return;
    }

    if (!addressPattern.test(address)) {
        showError("Enter a valid address.");
        return;
    }

    if (!phoneNumberPattern.test(empCont)) {
        showError("Enter a valid phone number (e.g., 0772461021).");
        return;
    }

    if (!emailPattern.test(empEmail)) {
        showError("Enter a valid email address");
        return;
    }
    let base64String='';
    var file = $("#fileInput")[0].files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function() {
            base64String = reader.result;
            console.log("File converted to Base64:", base64String);
        };

        reader.onerror = function(error) {
            showError("Error reading file:", error);
        };

        reader.readAsDataURL(file);
    } else {
        showError('Profile Picture Not Selected');
    }

    const status=await updateEmployee(new EmployeeModel(empCode, empName,base64String,gender,eStatus,designation,role,dob,joindeDate, branch, address,empCont,empEmail,guardian,guardianCont));

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
    await loadAll();
    clearInputs()
});

// delete customer
$("#c-delete-btn").on('click', async () => {
    const empCode = $("#emp-nic").val();
    const response = await deleteEmployee(empCode);
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
$("#emp-t-body").on('click', ("tr"), async function () {
    const employees = await getAllEmployees();
    $("#emp-name").val($(this).find(".emp-name").text());
    $("#emp-nic").val($(this).find(".emp-code").text());
    $("#emp-email").val($(this).find(".email").text());
    $("#emp-address").val($(this).find(".address").text());
    $("#emp-contact").val($(this).find(".contact").text());
    $("#emp-joined-date").val($(this).find(".joined-date").text());
    $("#dob").val($(this).find(".dob").text());
    $("#role").val($(this).find(".accessRole").text());
    $("#designation").val($(this).find(".designation").text());
    $("#guardian-name").val($(this).find(".guardian").text());
    $("#guardian-contact").val($(this).find(".guardianCont").text());
    $("#status").val($(this).find(".status").text());
    employees.map((item, index) => {
        if (item.empCode.toLowerCase()===$(this).find(".emp-code").text()) {
            $("#emp-gender").val(item.gender);

            var convertedFile = convertBase64ToFile(item.proPic, "proPic");

            // Set the converted file back to the file input field
            var newFileInput = $("#fileInput")[0];
            newFileInput.files = [convertedFile];
            if (item.gender==='Male'){
                $("#flexRadioDefault2").prop("checked", true);
            }else{
                $("#flexRadioDefault1").prop("checked", true);
            }
        }
    })

});

function convertBase64ToFile(base64String, fileName) {
    // Remove the data URL prefix if present
    var base64WithoutPrefix = base64String.replace(/^data:[^;]+;base64,/, '');

    // Convert the Base64 string to a Uint8Array
    var binaryString = atob(base64WithoutPrefix);
    var binaryLength = binaryString.length;
    var bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryLength; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    var blob = new Blob([bytes], { type: 'image/jpeg' }); // Specify the appropriate MIME type here

    // Create a File object from the Blob
    var file = new File([blob], fileName, { type: 'image/jpeg' }); // Specify the appropriate MIME type here

    return file;
}

//search customer
$("#emp-search").on("input", async function () {
    const employees = await getAllEmployees();
    $("#emp-t-body").empty();
    employees.map((item, index) => {
        if (item.empCode.toLowerCase().startsWith($("#emp-search").val().toLowerCase()) || item.empName.toLowerCase().startsWith($("#emp-search").val().toLowerCase()) || item.email.toLowerCase().startsWith($("#emp-search").val().toLowerCase())) {
            let employee =
                `<tr><td class="emp-code">${item.empCode}</td><td class="emp-name">${item.empName}</td><td class="gender">${item.gender}</td><td class="joined-date">${item.joinedDate}</td><td class="status">${item.status}</td><td class="accessRole">${item.accessRole}</td><td class="dob">${item.dob}</td><td class="address">${item.address}</td><td class="contact">${item.contact}</td><td class="email">${item.email}</td><td class="branch">${item.branch}</td><td class="designation">${item.designation}</td><td class="guardian">${item.guardian}</td><td class="guardianCont">${item.guardianCont}</td></tr>`
            $("#emp-t-body").append(employee);
        }
    })
});
$("#emp-search-btn").on("click", async function () {
    const employees = await getAllEmployees();
    $("#emp-t-body").empty();
    employees.map((item, index) => {
        if (item.empCode.toLowerCase() === ($("#emp-search").val().toLowerCase()) || item.empName.toLowerCase() === ($("#emp-search").val().toLowerCase()) || item.email.toLowerCase() === ($("#emp-search").val().toLowerCase())) {
            let employee =
                `<tr><td class="emp-code">${item.empCode}</td><td class="emp-name">${item.empName}</td><td class="gender">${item.gender}</td><td class="joined-date">${item.joinedDate}</td><td class="status">${item.status}</td><td class="accessRole">${item.accessRole}</td><td class="dob">${item.dob}</td><td class="address">${item.address}</td><td class="contact">${item.contact}</td><td class="email">${item.email}</td><td class="branch">${item.branch}</td><td class="designation">${item.designation}</td><td class="guardian">${item.guardian}</td><td class="guardianCont">${item.guardianCont}</td></tr>`
            $("#emp-t-body").append(employee);
        }
    })
});

$(document).ready(function() {
    $("#fileInput").change(function(event) {
        var input = event.target;
        var reader = new FileReader();

        reader.onload = function(){
            var dataURL = reader.result;
            $("#previewImage").attr('src', dataURL);
            $("#previewImage").show();
        };

        reader.readAsDataURL(input.files[0]);
    });
});
