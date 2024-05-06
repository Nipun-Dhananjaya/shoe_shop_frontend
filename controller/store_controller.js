import {ItemModel} from "../model/ItemModel.js";
import {deleteItem, getAllItem, saveItem, updateItem} from "../api/Store_api.js";

//item id make read only
$(document).ready(function () {
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

//clear add inputs
function clearAddInputs() {
    $("#itm-code").val("");
    $("#itm-name").val("");
    $("#category").val("");
    $("#itm-size").val("");
    $("#sup-code").val("");
    $("#sale-price").val("");
    $("#buy-price").val("");
    $("#exp-profit").val("");
    $("#sup-name").val("");
    $("#prof-margin").val("");
    $("#status").val("");
}

//load all item to table
async function loadAll() {
    const items = await getAllItem();
    $("#itm-tbl-body").empty();
    items.map((item, index) => {
        let item_row = `<tr><td class="itemName">${item.itemName}</td><td class="itemId">${item.itemId}</td><td class="category">${item.category}</td>
<td class="size">${item.size}</td><td class="supplierCode">${item.supplierCode}</td><td class="supplierName">${item.supplierName}</td>
<td class="salePrice">${item.salePrice}</td><td class="buyPrice">${item.buyPrice}</td><td class="expectedProfit">${item.expectedProfit}</td>
<td class="qtv">${item.qtv}</td><td class="profitMargin">${item.profitMargin}</td><td class="qtv">${item.qtv}</td></tr>`;
        $("#itm-tbl-body").append(item_row);
    })
}

//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

// validation patterns
const namePattern = /^[A-Za-z\s\-']+$/;
const nameLengthPattern = /^[A-Za-z\s\-']{3,15}$/;
const pricePattern = /^\d+(\.\d{2})?$/;
var quantityPattern = /^\d+$/;

//save item
$("#itm-save").on('click', async () => {
    const itmCode=$("#itm-code").val();
    const itmDesc=$("#itm-name").val();
    const category=$("#category").val();
    const size=$("#itm-size").val();
    const supCode=$("#sup-code").val();
    const salePrice=$("#sale-price").val();
    const buyPrice=$("#buy-price").val();
    const expProfit=$("#exp-profit").val();
    const supName=$("#sup-name").val();
    const profitMargin=$("#prof-margin").val();
    const itmStatus=$("#status").val();

    if (!$("#itm-code").val() || !$("#itm-name").val() || !$("#itm-price").val() || !$("#itm-qty").val() || !$("#itm-size").val()
        || !$("#sup-code").val() || !$("#sup-name").val() || !$("#sale-price").val() || !$("#buy-price").val() || !$("#exp-profit").val() || !$("#status").val()) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test($("#itm-name").val())) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test($("#itm-name").val())) {
        showError("Name must be 3 to 15 characters long.");
        return;
    }

    if (!pricePattern.test($("#itm-price").val())) {
        showError("invalid price, Enter only numbers.( maximum 2 cents )");
        return;
    }

    if (!quantityPattern.test($("#itm-qty").val())) {
        showError("Invalid quantity, Enter only whole numbers");
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

    const status=await saveItem(new ItemModel(itmCode, itmDesc,base64String,category,size,supCode,supName,salePrice,buyPrice, expProfit, profitMargin,itmStatus));

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
    await clearAddInputs();
});

//clicked raw set to input fields
$("#itm-tbl-body").on('click', 'tr', async function () {
    $("#itm-code").val($(this).find(".itemId").text());
    $("#itm-name").val($(this).find(".itemName").text());
    $("#status").val($(this).find(".qtv").text());
    $("#category").val($(this).find(".category").text());
    $("#itm-size").val($(this).find(".size").text());
    $("#sup-code").val($(this).find(".supplierCode").text());
    $("#sale-price").val($(this).find(".salePrice").text());
    $("#buy-price").val($(this).find(".buyPrice").text());
    $("#exp-profit").val($(this).find(".expectedProfit").text());
    $("#sup-name").val($(this).find(".supplierName").text());
    $("#prof-margin").val($(this).find(".profitMargin").text());
    const items = await getAllItem();
    $("#itm-tbl-body").empty();
    items.map((item, index) => {
        if (item.itemId===$("#itm-code").val()){
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

//update item
$("#itm-update").on('click', async () => {
    const itmCode=$("#itm-code").val();
    const itmDesc=$("#itm-name").val();
    const category=$("#category").val();
    const size=$("#itm-size").val();
    const supCode=$("#sup-code").val();
    const salePrice=$("#sale-price").val();
    const buyPrice=$("#buy-price").val();
    const expProfit=$("#exp-profit").val();
    const supName=$("#sup-name").val();
    const profitMargin=$("#prof-margin").val();
    const itmStatus=$("#status").val();

    if (!$("#itm-code").val() || !$("#itm-name").val() || !$("#itm-price").val() || !$("#itm-qty").val() || !$("#itm-size").val()
        || !$("#sup-code").val() || !$("#sup-name").val() || !$("#sale-price").val() || !$("#buy-price").val() || !$("#exp-profit").val() || !$("#status").val()) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!namePattern.test($("#itm-name").val())) {
        showError("Name must start with a letter and can only include letters, hyphens, and apostrophes.");
        return;
    }

    if (!nameLengthPattern.test($("#itm-name").val())) {
        showError("Name must be 3 to 15 characters long.");
        return;
    }

    if (!pricePattern.test($("#itm-price").val())) {
        showError("invalid price, Enter only numbers.( maximum 2 cents )");
        return;
    }

    if (!quantityPattern.test($("#itm-qty").val())) {
        showError("Invalid quantity, Enter only whole numbers");
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

    const status=await updateItem(new ItemModel(itmCode, itmDesc,base64String,category,size,supCode,supName,salePrice,buyPrice, expProfit, profitMargin,itmStatus));

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
            title: 'Customer not Updated, please try again',
            showConfirmButton: false,
            timer: 1500,
        });
    }

    await loadAll();
    await clearAddInputs();
});

//remove item
$("#itm-delete").on('click', async () => {
    const itemCode = $("#itm-code").val();
    const response = await deleteItem(itemCode);
    if (200 == response) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Item deleted successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    }
    await loadAll();
    clearAddInputs();
});

//search item
$("#store-search").on("input", async function () {
    const items = await getAllItem();
    $("#itm-tbl-body").empty();
    items.map((item, index) => {
        if (item.itemId.toLowerCase().startsWith($("#store-search").val().toLowerCase()) || item.itemName.toLowerCase().startsWith($("#store-search").val().toLowerCase())) {
            let item =`<tr>
                <td className="itemName">${item.itemName}</td>
                <td className="itemId">${item.itemId}</td>
                <td className="category">${item.category}</td>
                <td className="size">${item.size}</td>
                <td className="supplierCode">${item.supplierCode}</td>
                <td className="supplierName">${item.supplierName}</td>
                <td className="salePrice">${item.salePrice}</td>
                <td className="buyPrice">${item.buyPrice}</td>
                <td className="expectedProfit">${item.expectedProfit}</td>
                <td className="qtv">${item.qtv}</td>
                <td className="profitMargin">${item.profitMargin}</td>
                <td className="qtv">${item.qtv}</td>
            </tr>`
            $("#itm-tbl-body").append(item);
        }
    })
});
$("#store-search-btn").on("input", async function () {
    const items = await getAllItem();
    $("#itm-tbl-body").empty();
    items.map((item, index) => {
        if (item.empCode.toLowerCase() === ($("#emp-search").val().toLowerCase()) || item.empName.toLowerCase() === ($("#emp-search").val().toLowerCase()) || item.email.toLowerCase() === ($("#emp-search").val().toLowerCase())) {
            let item =`<tr>
                <td className="itemName">${item.itemName}</td>
                <td className="itemId">${item.itemId}</td>
                <td className="category">${item.category}</td>
                <td className="size">${item.size}</td>
                <td className="supplierCode">${item.supplierCode}</td>
                <td className="supplierName">${item.supplierName}</td>
                <td className="salePrice">${item.salePrice}</td>
                <td className="buyPrice">${item.buyPrice}</td>
                <td className="expectedProfit">${item.expectedProfit}</td>
                <td className="qtv">${item.qtv}</td>
                <td className="profitMargin">${item.profitMargin}</td>
                <td className="qtv">${item.qtv}</td>
            </tr>`
            $("#itm-tbl-body").append(item);
        }
    })
});
