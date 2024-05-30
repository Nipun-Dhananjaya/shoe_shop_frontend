import {ItemModel} from "../model/ItemModel.js";
import {deleteItem, getAllItem, saveItem, updateItem} from "../api/Store_api.js";
import {getAllSupplier} from "../api/Supplier_api.js";


// validation patterns
const pricePattern = /^\d+(\.\d{2})?$/;
var quantityPattern = /^\d+$/;

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
    generateNextItemId();
}

//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}


$("#fileInput").change(function(event) {
    var input = event.target;
    var file = input.files[0];

    if (file) {
        new Compressor(file, {
            quality: 0.6, // Compress to 60% of original quality
            success(result) {
                var reader = new FileReader();

                reader.onload = function() {
                    var dataURL = reader.result;
                    console.log("Compressed Base64 length:", dataURL.length);
                    $("#previewImage").attr('src', dataURL);
                    $("#previewImage").show();
                };

                reader.readAsDataURL(result);
            },
            error(err) {
                console.error(err.message);
            },
        });
    }
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

//save item
$("#itm-save").on('click', async () => {
    const occasion=$("#occasion").val();
    const verities=$("#verities").val();
    const gender = $("input[name='gender']:checked").val();
    const socks = $("input[name='socks']:checked").val();
    const itmCode=$("#itm-code").val();
    const cleaner=$("#cleaner").val();
    const itmDesc=$("#itm-name").val();
    const size=$("#itm-size").val();
    const salePrice=$("#sale-price").val();
    const buyPrice=$("#buy-price").val();
    const expProfit=$("#exp-profit").val();
    const supName=$("#sup-name").val();
    const profitMargin=$("#prof-margin").val();
    const itmStatus=$("#status").val();

    const suppliers=await getAllSupplier();
    let supCode='';
    await suppliers.map((item, index) => {
        if (item.supName===supName){
            supCode=item.supCode;
        }
    });

    if (!$("#itm-code").val() || !$("#itm-size").val()
        || !$("#sup-name").val() || !$("#sale-price").val() || !$("#buy-price").val() ||
        !$("#exp-profit").val() || !$("#status").val()) {
        showError("Please fill in all fields correctly");
        return;
    }

    if (!pricePattern.test($("#sale-price").val()) || !pricePattern.test($("#buy-price").val())) {
        showError("invalid price, Enter only numbers.( maximum 2 cents )");
        return;
    }

    if (!quantityPattern.test($("#status").val())) {
        showError("Invalid quantity, Enter only whole numbers");
        return;
    }

    let base64String = '';
    var file = $("#fileInput")[0].files[0];

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            if (file) {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } else {
                reject('Profile Picture Not Selected');
            }
        });
    };
    try {
        base64String = await readFileAsDataURL(file);
        console.log(base64String);
        let letter='';
        let occ='';
        let ver='';
        let gender='';

        if (occasion==='Formal'){
            occ='F';
        }else if(occasion==='Casual'){
            occ='C';
        }else if(occasion==='Industrial'){
            occ='I';
        }else if(occasion==='Sport'){
            occ='S';
        }

        if (verities==='Heels'){
            ver='H';
        }else if(verities==='Flats'){
            ver='F';
        }else if(verities==='Wedges'){
            ver='W';
        }else if(verities==='Shoes'){
            ver='S';
        }else if ((verities)==='Flip Flops'){
            ver='FF';
        }else if((verities)==='Sandals'){
            ver='SD';
        }else if((verities)==='Slippers'){
            ver='SL';
        }
        if (gender==='Male'){
            letter='M'
        }else{
            letter='W'
        }
        let itemCode=occ+ver+letter+itmCode;
        console.log(supCode)

        const status=await saveItem(new ItemModel(itemCode, itmDesc,base64String,verities,size,socks,cleaner,supCode,salePrice,buyPrice, expProfit, profitMargin,itmStatus));

        if (status === 200) {
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Item saved successfully',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Item not saved, please try again',
                showConfirmButton: false,
                timer: 1500,
            });
        }

        await loadAll();
        await clearAddInputs();
    } catch (error) {
        showError(error);
    }
});


//update item
$("#itm-update").on('click', async () => {
    const occasion=$("#occasion").val();
    const verities=$("#verities").val();
    const gender = $("input[name='gender']:checked").val();
    const socks = $("input[name='socks']:checked").val();
    const itmCode=$("#itm-code").val();
    const itmDesc=$("#itm-name").val();
    const cleaner=$("#cleaner").val();
    const size=$("#itm-size").val();
    const salePrice=$("#sale-price").val();
    const buyPrice=$("#buy-price").val();
    const expProfit=$("#exp-profit").val();
    const supName=$("#sup-name").val();
    const profitMargin=$("#prof-margin").val();
    const itmStatus=$("#status").val();

    const suppliers=await getAllSupplier();
    let supCode='';
    suppliers.map((item, index) => {
        if (item.supName===supName){
            supCode=item.supCode;
        }
    })

    if (!$("#itm-code").val() || !$("#itm-size").val()
        || !$("#sup-name").val() || !$("#sale-price").val() || !$("#buy-price").val() ||
        !$("#exp-profit").val() || !$("#status").val()) {
        showError("Please fill in all fields correctly");
        return;
    }

    if (!pricePattern.test($("#sale-price").val()) || !pricePattern.test($("#buy-price").val())) {
        showError("invalid price, Enter only numbers.( maximum 2 cents )");
        return;
    }

    if (!quantityPattern.test($("#status").val())) {
        showError("Invalid quantity, Enter only whole numbers");
        return;
    }

    let base64String = '';
    var file = $("#fileInput")[0].files[0];

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            if (file) {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            } else {
                reject('Profile Picture Not Selected');
            }
        });
    };
    try {
        base64String = await readFileAsDataURL(file);
        console.log(base64String);
        let letter='';
        let occ='';
        let ver='';
        let gender='';

        if (occasion==='Formal'){
            occ='F';
        }else if(occasion==='Casual'){
            occ='C';
        }else if(occasion==='Industrial'){
            occ='I';
        }else if(occasion==='Sport'){
            occ='S';
        }

        if (verities==='Heels'){
            ver='H';
        }else if(verities==='Flats'){
            ver='F';
        }else if(verities==='Wedges'){
            ver='W';
        }else if(verities==='Shoes'){
            ver='S';
        }else if ((verities)==='Flip Flops'){
            ver='FF';
        }else if((verities)==='Sandals'){
            ver='SD';
        }else if((verities)==='Slippers'){
            ver='SL';
        }
        if (gender==='Male'){
            letter='M'
        }else{
            letter='W'
        }
        let itemCode=occ+ver+letter+itmCode;

        const status=await updateItem(itemCode, new ItemModel(itemCode, itmDesc,base64String,verities,size,socks,cleaner,supCode,salePrice,buyPrice, expProfit, profitMargin,itmStatus));

        if (status === 200) {
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Item Updated successfully',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Item not Updated, please try again',
                showConfirmButton: false,
                timer: 1500,
            });
        }

        await loadAll();
        await clearAddInputs();
    } catch (error) {
        showError(error);
    }
});

//remove item
$("#itm-delete").on('click', async () => {
    const itmCode = $("#itm-code").val();
    const occasion=$("#occasion").val();
    const verities=$("#verities").val();
    const gender = $("input[name='gender']:checked").val();
    let letter='';
    let occ='';
    let ver='';

    if (occasion==='Formal'){
        occ='F';
    }else if(occasion==='Casual'){
        occ='C';
    }else if(occasion==='Industrial'){
        occ='I';
    }else if(occasion==='Sport'){
        occ='S';
    }

    if (verities==='Heels'){
        ver='H';
    }else if(verities==='Flats'){
        ver='F';
    }else if(verities==='Wedges'){
        ver='W';
    }else if(verities==='Shoes'){
        ver='S';
    }else if ((verities)==='Flip Flops'){
        ver='FF';
    }else if((verities)==='Sandals'){
        ver='SD';
    }else if((verities)==='Slippers'){
        ver='SL';
    }
    if (gender==='Male'){
        letter='M'
    }else{
        letter='W'
    }
    let itemCode=occ+ver+letter+itmCode;
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

//load all item to table
async function loadAll() {
    const items = await getAllItem();
    const suppliers=await getAllSupplier();
    $("#itm-tbl-body").empty();
    items.map(async (item, index) => {
        let supName = '';
        let occasion = '';
        let verities = '';
        let gender = '';
        for (let i = 0; i < suppliers.length; i++) {
            if (suppliers[i].supCode === item.supCode) {
                supName = suppliers[i].supName;
            }
        }
        let str = item.itemId;
        let match = str.match(/([A-Za-z]+)(\d+)/);

        if (match) {
            let part1 = match[1];
            let part2 = match[2];
            console.log(part1, part2);
            if (part1.length === 3) {
                if (part1[0] === 'F') {
                    occasion = 'Formal';
                } else if (part1[0] === 'C') {
                    occasion = 'Casual';
                } else if (part1[0] === 'I') {
                    occasion = 'Industrial';
                } else if (part1[0] === 'S') {
                    occasion = 'Sport';
                }

                if (part1[1] === 'H') {
                    verities = 'Heel';
                } else if (part1[1] === 'F') {
                    verities = 'Flats';
                } else if (part1[1] === 'W') {
                    verities = 'Wedges';
                } else if (part1[1] === 'S') {
                    verities = 'Shoes';
                }

                if (part1[2] === 'M') {
                    gender = 'Man';
                } else if (part1[2] === 'W') {
                    gender = 'Women';
                }
            }
            if (part1.length === 4) {
                if (part1[0] === 'F') {
                    occasion = 'Formal';
                } else if (part1[0] === 'C') {
                    occasion = 'Casual';
                } else if (part1[0] === 'I') {
                    occasion = 'Industrial';
                } else if (part1[0] === 'S') {
                    occasion = 'Sport';
                }

                if ((part1[1] + part1[2]) === 'FF') {
                    verities = 'Flip Flops';
                } else if ((part1[1] + part1[2]) === 'SD') {
                    verities = 'Sandals';
                } else if ((part1[1] + part1[2]) === 'SL') {
                    verities = 'Slippers';
                }

                if (part1[3] === 'M') {
                    gender = 'Man';
                } else if (part1[3] === 'W') {
                    gender = 'Women';
                }
            }
        }
        let item_row = `<tr>
                <td class="itemName">${item.itemName}</td>
                <td class="itemId">${item.itemId}</td>
                <td class="occasion">${occasion}</td>
                <td class="category">${item.category}</td>
                <td class="gender">${gender}</td>
                <td class="cleaner">${item.cleaner}</td>
                <td class="socks">${item.socks}</td>
                <td class="size">${item.size}</td>
                <td class="supplierName">${supName}</td>
                <td class="salePrice">${item.salePrice}</td>
                <td class="buyPrice">${item.buyPrice}</td>
                <td class="expectedProfit">${item.expectedProfit}</td>
                <td class="profitMargin">${item.profitMargin}</td>
                <td class="qtv">${item.qtv}</td>
                </tr>`;
        $("#itm-tbl-body").append(item_row);
    })
}

//clicked raw set to input fields
$("#itm-tbl-body").on('click', 'tr', async function () {
    let occasion='';
    let verities='';
    let gender='';
    let str = $(this).find(".itemId").text();
    let match = str.match(/([A-Za-z]+)(\d+)/);

    let part1='';
    let part2='';
    if (match) {
        part1 = match[1];
        part2 = match[2];
        console.log(part1, part2);
        if (part1.length===3){
            if (part1[0]==='F'){
                occasion='Formal';
            }else if(part1[0]==='C'){
                occasion='Casual';
            }else if(part1[0]==='I'){
                occasion='Industrial';
            }else if(part1[0]==='S'){
                occasion='Sport';
            }

            if (part1[1]==='H'){
                verities='Heels';
            }else if(part1[1]==='F'){
                verities='Flats';
            }else if(part1[1]==='W'){
                verities='Wedges';
            }else if(part1[1]==='S'){
                verities='Shoes';
            }

            if (part1[2]==='M'){
                gender='Man';
            }else if(part1[2]==='W'){
                gender='Women';
            }
        }
        if (part1.length===4){
            if (part1[0]==='F'){
                occasion='Formal';
            }else if(part1[0]==='C'){
                occasion='Casual';
            }else if(part1[0]==='I'){
                occasion='Industrial';
            }else if(part1[0]==='S'){
                occasion='Sport';
            }

            if ((part1[1]+part1[2])==='FF'){
                verities='Flip Flops';
            }else if((part1[1]+part1[2])==='SD'){
                verities='Sandals';
            }else if((part1[1]+part1[2])==='SL'){
                verities='Slippers';
            }

            if (part1[3]==='M'){
                gender='Man';
            }else if(part1[3]==='W'){
                gender='Women';
            }
        }
    }
    $("#itm-code").val(part2);
    $("#itm-name").val($(this).find(".itemName").text());
    $("#status").val($(this).find(".qtv").text());
    $("#verities").val(verities);
    $("#occasion").val(occasion);
    $("#cleaner").val($(this).find(".cleaner").text());
    $("#itm-size").val($(this).find(".size").text());
    $("#sale-price").val($(this).find(".salePrice").text());
    $("#buy-price").val($(this).find(".buyPrice").text());
    $("#exp-profit").val($(this).find(".expectedProfit").text());
    $("#sup-name").val($(this).find(".supplierName").text());
    $("#prof-margin").val($(this).find(".profitMargin").text());
    if (gender==='Male'){
        $("#flexRadioDefault1").prop("checked", true);
    }else{
        $("#flexRadioDefault2").prop("checked", true);
    }
    if ($(this).find(".socks").text()==='Half Socks'){
        $("#flexRadioDefault-s1").prop("checked", true);
    }else{
        $("#flexRadioDefault-s2").prop("checked", true);
    }
    const items = await getAllItem();
    items.forEach((item) => {
        if (item.itemId === $(this).find(".itemId").text()) {
            var base64String = item.picture;

            // Optional: Convert base64 string to a Blob
            function base64ToBlob(base64, contentType) {
                const byteCharacters = atob(base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                return new Blob([byteArray], { type: contentType });
            }

            // Get the base64 data (assuming it's a base64 string without the prefix)
            const base64Data = base64String.split(",")[1];
            const blob = base64ToBlob(base64Data, "image/jpeg"); // Change the content type if necessary

            // Create a URL for the blob and set it as the src for the image
            const url = URL.createObjectURL(blob);

            // Set the src attribute of the img element
            $("#previewImage").attr("src", url);

            // Create a File object from the Blob
            const file = new File([blob], "picture.jpg", { type: "image/jpeg" });

            // Use DataTransfer to simulate file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            $("#fileInput")[0].files = dataTransfer.files;
        }
    });

});

//search item
$("#store-search").on("input", async function () {
    const items = await getAllItem();
    const suppliers=await getAllSupplier();
    $("#itm-tbl-body").empty();
    items.map((item, index) => {
        if (item.itemId.toLowerCase().startsWith($("#store-search").val().toLowerCase()) || item.itemName.toLowerCase().startsWith($("#store-search").val().toLowerCase())) {
            let supName='';
            let occasion='';
            let verities='';
            let gender='';
            suppliers.map((sup, index) => {
                if (sup.supCode===item.supCode){
                    supName=item.supName;
                }
            });
            let str = item.itemId;
            let match = str.match(/([A-Za-z]+)(\d+)/);

            if (match) {
                let part1 = match[1];
                let part2 = match[2];
                console.log(part1, part2);
                if (part1.length===3){
                    if (part1[0]==='F'){
                        occasion='Formal';
                    }else if(part1[0]==='C'){
                        occasion='Casual';
                    }else if(part1[0]==='I'){
                        occasion='Industrial';
                    }else if(part1[0]==='S'){
                        occasion='Sport';
                    }

                    if (part1[1]==='H'){
                        verities='Heels';
                    }else if(part1[1]==='F'){
                        verities='Flats';
                    }else if(part1[1]==='W'){
                        verities='Wedges';
                    }else if(part1[1]==='S'){
                        verities='Shoes';
                    }

                    if (part1[2]==='M'){
                        gender='Man';
                    }else if(part1[2]==='W'){
                        gender='Women';
                    }
                }
                if (part1.length===4){
                    if (part1[0]==='F'){
                        occasion='Formal';
                    }else if(part1[0]==='C'){
                        occasion='Casual';
                    }else if(part1[0]==='I'){
                        occasion='Industrial';
                    }else if(part1[0]==='S'){
                        occasion='Sport';
                    }

                    if ((part1[1]+part1[2])==='FF'){
                        verities='Flip Flops';
                    }else if((part1[1]+part1[2])==='SD'){
                        verities='Sandals';
                    }else if((part1[1]+part1[2])==='SL'){
                        verities='Slippers';
                    }

                    if (part1[3]==='M'){
                        gender='Man';
                    }else if(part1[3]==='W'){
                        gender='Women';
                    }
                }
            }
            let item =`<tr>
                <td class="itemName">${item.itemName}</td>
                <td class="itemId">${item.itemId}</td>
                <td class="occasion">${occasion}</td>
                <td class="category">${item.category}</td>
                <td class="gender">${gender}</td>
                <td class="cleaner">${item.cleaner}</td>
                <td class="socks">${item.socks}</td>
                <td class="size">${item.size}</td>
                <td class="supplierName">${supName}</td>
                <td class="salePrice">${item.salePrice}</td>
                <td class="buyPrice">${item.buyPrice}</td>
                <td class="expectedProfit">${item.expectedProfit}</td>
                <td class="profitMargin">${item.profitMargin}</td>
                <td class="qtv">${item.qtv}</td>
            </tr>`
            $("#itm-tbl-body").append(item);
        }
    })
});
$("#store-search-btn").on("input", async function () {
    const items = await getAllItem();

    const suppliers=await getAllSupplier();
    $("#itm-tbl-body").empty();
    items.map((item, index) => {
        if (item.itemId.toLowerCase()===($("#store-search").val().toLowerCase()) || item.itemName.toLowerCase()===($("#store-search").val().toLowerCase())) {
            let supName='';
            let occasion='';
            let verities='';
            let gender='';
            suppliers.map((sup, index) => {
                if (sup.supCode===item.supCode){
                    supName=item.supName;
                }
            });
            let str = item.itemId;
            let match = str.match(/([A-Za-z]+)(\d+)/);

            if (match) {
                let part1 = match[1];
                let part2 = match[2];
                console.log(part1, part2);
                if (part1.length===3){
                    if (part1[0]==='F'){
                        occasion='Formal';
                    }else if(part1[0]==='C'){
                        occasion='Casual';
                    }else if(part1[0]==='I'){
                        occasion='Industrial';
                    }else if(part1[0]==='S'){
                        occasion='Sport';
                    }

                    if (part1[1]==='H'){
                        verities='Heel';
                    }else if(part1[1]==='F'){
                        verities='Flats';
                    }else if(part1[1]==='W'){
                        verities='Wedges';
                    }else if(part1[1]==='S'){
                        verities='Shoes';
                    }

                    if (part1[2]==='M'){
                        gender='Man';
                    }else if(part1[2]==='W'){
                        gender='Women';
                    }
                }
                if (part1.length===4){
                    if (part1[0]==='F'){
                        occasion='Formal';
                    }else if(part1[0]==='C'){
                        occasion='Casual';
                    }else if(part1[0]==='I'){
                        occasion='Industrial';
                    }else if(part1[0]==='S'){
                        occasion='Sport';
                    }

                    if ((part1[1]+part1[2])==='FF'){
                        verities='Flip Flops';
                    }else if((part1[1]+part1[2])==='SD'){
                        verities='Sandals';
                    }else if((part1[1]+part1[2])==='SL'){
                        verities='Slippers';
                    }

                    if (part1[3]==='M'){
                        gender='Man';
                    }else if(part1[3]==='W'){
                        gender='Women';
                    }
                }
            }

            let item =`<tr>
                <td class="itemName">${item.itemName}</td>
                <td class="itemId">${item.itemId}</td>
                <td class="occasion">${occasion}</td>
                <td class="category">${item.category}</td>
                <td class="gender">${gender}</td>
                <td class="cleaner">${item.cleaner}</td>
                <td class="socks">${item.socks}</td>
                <td class="size">${item.size}</td>
                <td class="supplierName">${supName}</td>
                <td class="salePrice">${item.salePrice}</td>
                <td class="buyPrice">${item.buyPrice}</td>
                <td class="expectedProfit">${item.expectedProfit}</td>
                <td class="profitMargin">${item.profitMargin}</td>
                <td class="qtv">${item.qtv}</td>
            </tr>`
            $("#itm-tbl-body").append(item);
        }
    })
});

//generate next item id
async function generateNextItemId() {
    const itms = await getAllItem();
    if (itms.length === undefined) {
        $("#itm-code").val("00001");
    } else {
        $("#itm-code").val("0000" + (itms.length + 1));
    }
}

async function loadSuppliers() {
    const suppliers = await getAllSupplier();
    const selectElement = document.getElementById('sup-name');

    // Iterate through the array and create option elements
    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.supName;
        option.textContent = supplier.supName;
        selectElement.appendChild(option);
    });
}

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
    function itemIdMakeReadonly() {
        $("#itm-code").prop("readonly",true);
        $("#sup-name").prop("readonly",true);
    }
    itemIdMakeReadonly();
    generateNextItemId();
    clearAddInputs();
    loadAll();
    loadSuppliers();
});


