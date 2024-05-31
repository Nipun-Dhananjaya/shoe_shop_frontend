import {getAllItem, updateItem} from "../api/Store_api.js";
import {order_items_db} from "../api/Order_Items_DB.js";
import {OrderItemModel} from "../model/OrderItemModel.js";
import {ItemModel} from "../model/ItemModel.js";
import {getAllCustomers, updateCustomer} from "../api/Customer_api.js";
import {getAllOrders, saveOrder, updateOrder} from "../api/Order_api.js";
import {CustomerModel} from "../model/CustomerModel.js";
import {OrderModel} from "../model/OrderModel.js";
import {getAllEmployees} from "../api/Employee_api.js";

// clear inputs
function clearInputs() {
    $("#cust-name").val("");
        $("#cust-loyalty-level").val("");
        $("#cust-points").val("");
        $("#balance").val("");
        $("#discount").val("");
        $("#cash").val("");
        $("#subtot").text("0.00 /=");
        $("#tot").text("0.00 /=");
    generateNextOrderId();
    $("#order-item-table-body").empty();
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

//action on discount textfield
$("#discount").on("keyup", function(event) {
    if (event.keyCode === 13) {
        let subtot=$("#subtot").text();
        let discountAmount = (parseFloat(subtot) * parseFloat($("#discount").val())) / 100;
        $("#tot").text(subtot - discountAmount);
    }
});
//action on cash textfield
$("#cash").on("keyup", function(event) {
    if (event.keyCode === 13) {
        let total=$("#tot").text();
        console.log(parseFloat($("#cash").val()));
        console.log(total);
        $("#balance").val(parseFloat($("#cash").val())-parseFloat(total));
    }
});

//check buying item is have in order list
function isAlreadyBuying(itemId,newQty,price) {
    let index=order_items_db.findIndex(item => item.itemId === itemId);
    if (index>-1) {
        order_items_db[index].qtv = parseFloat(order_items_db[index].qtv) + parseFloat(newQty);
        order_items_db[index].price = parseFloat(order_items_db[index].price) + (parseFloat(newQty) * parseFloat(price));
        return true;
    }
    return false; // item not in past list
}

//reduce item count
async function reduceItemCount(itemId, Qty) {
    const items = await getAllItem();
    items.map(async (item, index) => {
        if (item.itemId === itemId) {
            const status = updateItem(itemId,new ItemModel(itemId, item.itemName, item.picture, item.category, item.size, item.socks,item.cleaner, item.supCode, item.salePrice, item.buyPrice, item.expectedProfit, item.profitMargin, (parseFloat(item.qtv) - parseFloat(Qty))));
        }
    });
}
//generate next order-id
async function generateNextOrderId() {
    const orders = await getAllOrders();
    if (orders.length === undefined) {
        $("#customer-nic").val("O001");
    } else {
        $("#ord-id").val("O00" + (orders.length + 1));
    }
}

// Function to dynamically create cards
let total=0;
function createCards(itemLst) {
    const container = document.getElementById('card-container');
    container.innerHTML = ''; // Clear existing content

    itemLst.forEach(item => {
        const cardHtml = `
            <div class="col m-2" style="width: 16rem;">
                <div class="card" style="width: 14rem;">
                    <img src="" class="card-img-top" alt="top sales">
                    <div class="card-body">
                        <h3 class="card-title">${item.name}</h3>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${item.code}</li>
                        <li class="list-group-item">${item.size}</li>
                        <li class="list-group-item">${item.price}</li>
                        <li class="list-group-item"><button type="button" class="btn btn-primary add-to-cart">Add to cart</button></li>
                    </ul>
                </div>
            </div>
        `;

        // Insert the card HTML into the DOM
        container.insertAdjacentHTML('beforeend', cardHtml);

        // Now set the image source for the newly created card
        const cards = container.querySelectorAll('.card');
        const lastCard = cards[cards.length - 1];
        const imgElement = lastCard.querySelector('.card-img-top');

        const base64String = item.image;

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
        imgElement.src = url;
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            // Handle button click action here
            if (!isAlreadyBuying(itemLst[index].code, 1, itemLst[index].price) === true) {
                order_items_db.push(new OrderItemModel(itemLst[index].code, itemLst[index].name, itemLst[index].size, 1, (parseFloat(itemLst[index].price))));
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'item added!',
                    showConfirmButton: false,
                    timer: 1500
                });
                total = parseFloat($("#subtot").text());
                total += (parseFloat(itemLst[index].price) * 1);
                $("#subtot").text(total);

                await loadAllItems();
                await reduceItemCount(itemLst[index].code, 1);
                $("#order-item-table-body").empty();
                order_items_db.map((item, index) => {
                    let employee =
                        `<tr><td class="code">${item.itemId}</td><td class="name">${item.itemName}</td><td class="size">${item.size}</td><td class="qty">${item.qtv}</td><td class="price">${item.price}</td></tr>`
                    $("#order-item-table-body").append(employee);
                })
            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'item added!',
                    showConfirmButton: false,
                    timer: 1500
                });
                total = parseFloat($("#subtot").text());
                total += (parseFloat(itemLst[index].price) * 1);
                $("#subtot").text(total);

                await loadAllItems();
                await reduceItemCount(itemLst[index].code, 1);
                $("#order-item-table-body").empty();
                order_items_db.map((item, index) => {
                    let employee =
                        `<tr><td class="code">${item.itemId}</td><td class="name">${item.itemName}</td><td class="size">${item.size}</td><td class="qty">${item.qtv}</td><td class="price">${item.price}</td></tr>`
                    $("#order-item-table-body").append(employee);
                })
            }
        });
    });
    $("#cat-name").val($("#category-lst").val());
}

$('#category-lst').on('change', function() {
    loadAllItems();
});

// load all order items
async function loadAllItems() {
    let itemLst=[];
    const items = await getAllItem();
    await items.map((item, index) => {
        if (item.category===$("#category-lst").val()){
            const itm={code:item.itemId,name:item.itemName,image:item.picture,price:item.salePrice,size:item.size};
            itemLst.push(itm);
        }else if ($("#category-lst").val()==='All'){
            const itm={code:item.itemId,name:item.itemName,image:item.picture,price:item.salePrice,size:item.size};
            itemLst.push(itm);
        }else{
            itemLst.length=0;
        }
    });
    await createCards(itemLst);
}

//realtime date date input
$(document).ready(async function () {
    function updateInputs() {
        $("#ord-id").prop("readonly", true);
        $("#ord-date").prop("readonly", true);
        $("#cust-name").prop("readonly", true);
        $("#cust-loyalty-level").prop("readonly", true);
        $("#cust-points").prop("readonly", true);
        $("#balance").prop("readonly", true);
    }

    async function loadUsers() {
        const employees = await getAllEmployees();
        const selectElement = document.getElementById('cashier-name');

        // Iterate through the array and create option elements
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.empName;
            option.textContent = employee.empName;
            selectElement.appendChild(option);
        });
    }

    async function updateDropdowns() {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
        var day = now.getDate().toString().padStart(2, '0'); // Add leading zero if needed

        var formattedDate = `${year}-${month}-${day}`;

        $("#ord-date").val(formattedDate);

        const customers = await getAllCustomers();

        var dropdownMenuCust = document.getElementById('dropdown-menu-cusID');
        var existingItems = {}; // Object to store existing items

        // Clear previous dropdown items
        dropdownMenuCust.innerHTML = "";

        customers.forEach(function (item) {
            if (!existingItems[item.code]) {
                existingItems[item.code] = true;
                var listItem = document.createElement('li');
                var anchor = document.createElement('a');
                anchor.href = '#';
                anchor.classList.add('dropdown-item');
                anchor.textContent = item.code;

                listItem.appendChild(anchor);

                dropdownMenuCust.appendChild(listItem);

                anchor.addEventListener('click', function (event) {
                    event.preventDefault();
                    var selectedValue = this.dataset.value;
                    var selectedItem = this.textContent;
                    document.getElementById('cust-id').textContent = selectedItem;
                    $("#cust-name").val(item.name);
                    $("#cust-loyalty-level").val(item.level);
                    $("#cust-points").val(item.totPoints);
                });
            }
        });
    }

    await loadAllItems();
    updateInputs();
    generateNextOrderId();
    updateDropdowns();
    loadUsers();
    setInterval(updateInputs, 1000);
    setInterval(updateDropdowns, 1000);

    async function setOrdData() {
        var queryParams = new URLSearchParams(window.location.search);
        var ordId = queryParams.get('ordId');

        const orders = await getAllOrders();
        orders.map((item, index) => {
            if (item.ordId === ordId) {
                $("#ord-id").val(ordId);
                $("#ord-date").val(item.ordDate);
                $("#cust-id").val(item.cust.code);
                $("#cust-name").val(item.cust.name);
                $("#cust-loyalty-level").val(item.cust.level);
                $("#cust-points").val(item.cust.totPoints);
                $("#discount").val(item.discount);
                $("#subtot").text(item.subtot);
                $("#tot").text(parseFloat(item.subtot) * parseFloat(item.discount) / 100)
            }
        })
    }

    setOrdData();
    setInterval(setOrdData, 1000);
});

//purchase order
$("#purchase").on('click', async () => {
    if(order_items_db.length===0) {
        showError("Item list is empty");
        return;
    }
    if($("#discount").val()==="") {
        showError("Discount field is empty");
        return;
    }
    if ($("input[name='flexRadioDefault']:checked").val()==="Cash"){
        if(($("#cash").val()==="" || $("#balance").val()==="")) {
            showError("Payment fields are empty");
            return;
        }
    }else if($("input[name='flexRadioDefault']:checked").val()==="Card"){
        if($("#bank").val()==="" || $("#digits").val()===""){
            showError("Payment fields are empty");
            return;
        }
    }else{
        showError("Please Select Payment Method!");
        return;
    }

    if($("#cashier-name").val()==="") {
        showError("Cashier Name is empty");
        return;
    }
    const customers=await getAllCustomers();
    let cust;
    let stat;
    await customers.map((item, index) => {
        if (item.code===$("#cust-id").val()){
            cust=item;
            stat= updateCustomer(item.code,new CustomerModel(item.code, item.name, item.gender, item.joinedDate, item.level, item.totPoints, item.dob, item.address, item.contact,item.email, new Date()));
        }
    });
    console.log(stat)

    let temp=[];
    for (let i = 0; i < order_items_db.length; i++) {
        temp.push(order_items_db[i]);
    }

    const ordStatus=saveOrder(new OrderModel($("#ord-id").val(), $("#ord-date").val(), cust,temp,
        $("input[name='flexRadioDefault']:checked").val(),parseFloat($("#subtot").text()),parseFloat($("#discount").val()),$("#cashier-name").text(),"Filled"));
    console.log(ordStatus)
    if (stat === 200 && ordStatus === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Order Saved successfully',
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
    clearInputs();
    generateNextOrderId();
    order_items_db.length=0;
    loadAllItems();
});

//Refund order
$("#refund-ord").on('click', async () => {
    const orders=await getAllOrders();
    await orders.map(async (item, index) => {
        if (item.ordId === $("#ord-id").val()) {
            const d1 = new Date();
            const d2 = new Date(item.ordDate);

            const timeDifference = Math.abs(d2.getTime() - d1.getTime());

            const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            if (differenceInDays > 3) {
                showError("Order Exceeded the refund duration!");
                return;
            } else {
                const items = await getAllItem();
                item.items.map(async (orditm, index) => {
                    items.map(async (itm, index) => {
                        if (itm.itemId === orditm.itemId) {
                            const status = updateItem(itm.itemId,new ItemModel(itm.itemId, itm.itemName, itm.picture, itm.category, itm.size, itm.socks,itm.cleaner, itm.supCode, itm.salePrice, itm.buyPrice, itm.expectedProfit, itm.profitMargin, (parseFloat(itm.qtv) + parseFloat(orditm.qtv))));
                        }
                    });
                });
                const ordStatus = updateOrder(item.ordId,new OrderModel(item.ordId, item.ordDate, item.cust, item.items,
                   item.payMethod, item.subtot, item.discount, item.cashierName, "Refunded"));
                console.log(ordStatus)
                if (ordStatus === 200) {
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Order Saved successfully',
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
                clearInputs();
                generateNextOrderId();
                order_items_db.length = 0;
                loadAllItems();
            }
        }
    });
    await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Do you want to remove order?',
        showConfirmButton: false,
        timer: 1500
    });
    clearInputs();
    generateNextOrderId();
    order_items_db.length=0;
    loadAllItems();
});

//All orders
$("#all-orders-btn").on('click', async () => {
    const orders=await getAllOrders();
    var tableBody = document.getElementById("all-order-tbl");
    var html = "";

    orders.forEach(function(order) {
        html += "<tr>";
        html += "<td>" + order.ordId + "</td>";
        html += "<td>" + order.ordDate + "</td>";
        html += "<td>" + order.cust.code + "</td>";
        html += "<td>" + order.cust.name + "</td>";
        html += "<td><ul>";
        order.items.forEach(function(item) {
            html += "<li>" + item.itemId + "</li>";
        });
        html += "</ul></td>";
        html += "<td><ul>";
        order.items.forEach(function(item) {
            html += "<li>" + item.itemName + "</li>";
        });
        html += "</ul></td>";
        html += "<td><ul>";
        order.items.forEach(function(item) {
            html += "<li>" + item.qtv + "</li>";
        });
        html += "</ul></td>";
        html += "<td>" + order.payMethod + "</td>";
        html += "<td>" + order.discount + "</td>";
        html += "<td>" + order.cashierName+ "</td>";
        html += "<td>" + order.ordStatus+ "</td>";
        html += "</tr>";
    });

    tableBody.innerHTML = html;

    var rows = document.querySelectorAll("#all-order-tbl tr");
    rows.forEach(function(row) {
        row.addEventListener("click", function() {
            var cells = row.getElementsByTagName("td");
            var rowData = [];
            for (var i = 0; i < cells.length; i++) {
                rowData.push(cells[i].innerText);
            }
            console.log("Clicked row data:", rowData);
            let ordId=rowData[0];
            window.location.href = "sales.html?ordId=" + ordId;
        });
    });
});

//Search Order
$("#all-order-search").on("input", async function () {
    $("#all-order-tbl").empty();
    const orders = await getAllOrders();
    var tableBody = document.getElementById("all-order-tbl");
    var html = "";
    orders.map((order, index) => {
        console.log(order.ordId)
        if (order.ordId.toLowerCase().startsWith($("#all-order-search").val().toLowerCase()) ||
            order.cust.name.toLowerCase().startsWith($("#all-order-search").val().toLowerCase())) {
            console.log(order);
            html += "<tr>";
            html += "<td>" + order.ordId + "</td>";
            html += "<td><ul>";
            order.items.forEach(function (item) {
                html += "<li>" + item.itemId + "</li>";
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function (item) {
                html += "<li>" + item.itemName + "</li>";
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function (item) {
                html += "<li>" + item.qtv + "</li>";
            });
            html += "</ul></td>";
            html += "<td>" + order.cust.nic + "</td>";
            html += "<td>" + order.cust.name + "</td>";
            html += "</tr>";
        }
    });

    tableBody.innerHTML = html;

    var rows = document.querySelectorAll("#all-order-tbl tr");
    rows.forEach(function (row) {
        row.addEventListener("click", function () {
            var cells = row.getElementsByTagName("td");
            var rowData = [];
            for (var i = 0; i < cells.length; i++) {
                rowData.push(cells[i].innerText);
            }
            console.log("Clicked row data:", rowData);
            orders.map(async (itm, index) => {
                if (itm.ordId === rowData[0]) {
                    $("#ord-id").val(itm.ordId);
                    $("#ord-date").val(itm.ordDate);
                    $("#cust-id").text(itm.cust.code);
                    $("#cust-name").val(itm.cust.name);
                    $("#cust-loyalty-level").val(itm.cust.level);
                    $("#cust-points").val(itm.cust.totPoints);
                    $("#cashier-name").val(itm.cust.cashierName);
                    $("#discount").val(itm.discount);
                    $("#subtot").text(itm.subtot);
                    $("#tot").text(parseFloat(itm.subtot)-(parseFloat(itm.subtot)*parseFloat(itm.discount)/100));
                    if (itm.payMethod==='Card'){
                        $("#flexRadioDefault1").prop("checked", true);
                    }else{
                        $("#flexRadioDefault2").prop("checked", true);
                    }
                    $("#order-item-table-body").empty();
                    itm.items.map((item, index) => {
                        let items =
                            `<tr><td class="code">${item.itemId}</td><td class="name">${item.itemName}</td><td class="size">${item.size}</td><td class="qty">${item.qtv}</td><td class="price">${item.price}</td></tr>`
                        $("#order-item-table-body").append(items);
                    })
                }
            });
            loadAllItems();
        });
    });
});
$("#ord-search-btn").on("click", async function () {
    $("#all-order-tbl").empty();
    const orders = await getAllOrders();
    var tableBody = document.getElementById("all-order-tbl");
    var html = "";
    orders.map((order, index) => {
        console.log(order.ordId)
        if (order.ordId.toLowerCase()===($("#all-order-search").val().toLowerCase()) ||
            order.cust.name.toLowerCase()===($("#all-order-search").val().toLowerCase())) {
            console.log(order);
            html += "<tr>";
            html += "<td>" + order.ordId + "</td>";
            html += "<td><ul>";
            order.items.forEach(function (item) {
                html += "<li>" + item.itemId + "</li>";
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function (item) {
                html += "<li>" + item.itemName + "</li>";
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function (item) {
                html += "<li>" + item.qtv + "</li>";
            });
            html += "</ul></td>";
            html += "<td>" + order.cust.nic + "</td>";
            html += "<td>" + order.cust.name + "</td>";
            html += "</tr>";
        }
    });

    tableBody.innerHTML = html;

    var rows = document.querySelectorAll("#all-order-tbl tr");
    rows.forEach(function (row) {
        row.addEventListener("click", function () {
            var cells = row.getElementsByTagName("td");
            var rowData = [];
            for (var i = 0; i < cells.length; i++) {
                rowData.push(cells[i].innerText);
            }
            console.log("Clicked row data:", rowData);
            orders.map(async (itm, index) => {
                if (itm.ordId === rowData[0]) {
                    $("#ord-id").val(itm.ordId);
                    $("#ord-date").val(itm.ordDate);
                    $("#cust-id").text(itm.cust.code);
                    $("#cust-name").val(itm.cust.name);
                    $("#cust-loyalty-level").val(itm.cust.level);
                    $("#cust-points").val(itm.cust.totPoints);
                    $("#cashier-name").val(itm.cust.cashierName);
                    $("#discount").val(itm.discount);
                    $("#subtot").text(itm.subtot);
                    $("#tot").text(parseFloat(itm.subtot) - (parseFloat(itm.subtot) * parseFloat(itm.discount) / 100));
                    if (itm.payMethod === 'Card') {
                        $("#flexRadioDefault1").prop("checked", true);
                    } else {
                        $("#flexRadioDefault2").prop("checked", true);
                    }
                    $("#order-item-table-body").empty();
                    itm.items.map((item, index) => {
                        let items =
                            `<tr><td class="code">${item.itemId}</td><td class="name">${item.itemName}</td><td class="size">${item.size}</td><td class="qty">${item.qtv}</td><td class="price">${item.price}</td></tr>`
                        $("#order-item-table-body").append(items);
                    })
                }
            });
            loadAllItems();
        });
    });
});
