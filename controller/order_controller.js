import {getAllItem, updateItem} from "../api/Store_api.js";
import {order_items_db} from "../api/Order_Items_DB.js";
import {OrderItemModel} from "../model/OrderItemModel.js";
import {ItemModel} from "../model/ItemModel.js";
import {getAllCustomers, updateCustomer} from "../api/Customer_api.js";
import {getAllOrders, saveOrder, updateOrder} from "../api/Order_api.js";
import {CustomerModel} from "../model/CustomerModel.js";
import {OrderModel} from "../model/OrderModel.js";
import {getAllEmployees} from "../api/Employee_api.js";

let selectedCustomer = '';

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
$("#discount").on("keyup", function (event) {
    if (event.keyCode === 13) {
        let subtot = $("#subtot").text();
        let discountAmount = (parseFloat(subtot) * parseFloat($("#discount").val())) / 100;
        $("#tot").text(subtot - discountAmount);
    }
});
//action on cash textfield
$("#cash").on("keyup", function (event) {
    if (event.keyCode === 13) {
        let total = $("#tot").text();
        console.log(parseFloat($("#cash").val()));
        console.log(total);
        $("#balance").val(parseFloat($("#cash").val()) - parseFloat(total));
    }
});

//check buying item is have in order list
function isAlreadyBuying(itemId, newQty, price) {
    let index = order_items_db.findIndex(item => item.itemId === itemId);
    if (index > -1) {
        order_items_db[index].quantity = parseFloat(order_items_db[index].quantity) + parseFloat(newQty);
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
            const status = updateItem(itemId, new ItemModel(itemId, item.itemName, item.picture, item.category, item.size, item.socks, item.cleaner, item.supCode, item.salePrice, item.buyPrice, item.expectedProfit, item.profitMargin, (parseFloat(item.qtv) - parseFloat(Qty))));
        }
    });
}

//generate next order-id
async function generateNextOrderId() {
    const orders = await getAllOrders();
    console.log(orders)
    if (orders === undefined) {
        $("#customer-nic").val("O001");
    } else {
        $("#ord-id").val("O00" + (orders.length + 1));
    }
}

// Function to dynamically create cards
let total = 0;

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
            return new Blob([byteArray], {type: contentType});
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
                        `<tr><td class="code">${item.itemId}</td><td class="name">${item.itemName}</td><td class="size">${item.size}</td><td class="qty">${item.quantity}</td><td class="price">${item.price}</td></tr>`
                    $("#order-item-table-body").append(employee);
                })
            } else {
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
                        `<tr><td class="code">${item.itemId}</td><td class="name">${item.itemName}</td><td class="size">${item.size}</td><td class="qty">${item.quantity}</td><td class="price">${item.price}</td></tr>`
                    $("#order-item-table-body").append(employee);
                })
            }
        });
    });
    $("#cat-name").val($("#category-lst").val());
}

$('#category-lst').on('change', function () {
    loadAllItems();
});

// load all order items
async function loadAllItems() {
    let itemLst = [];
    const items = await getAllItem();
    await items.map((item, index) => {
        if (item.category === $("#category-lst").val()) {
            const itm = {
                code: item.itemId,
                name: item.itemName,
                image: item.picture,
                price: item.salePrice,
                size: item.size
            };
            itemLst.push(itm);
        } else if ($("#category-lst").val() === 'All') {
            const itm = {
                code: item.itemId,
                name: item.itemName,
                image: item.picture,
                price: item.salePrice,
                size: item.size
            };
            itemLst.push(itm);
        } else {
            itemLst.length = 0;
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
                    selectedCustomer = selectedItem;
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
});

//purchase order
$("#purchase").on('click', async () => {
    if (order_items_db.length === 0) {
        showError("Item list is empty");
        return;
    }
    if ($("#discount").val() === "") {
        showError("Discount field is empty");
        return;
    }
    if ($("input[name='flexRadioDefault']:checked").val() === "Cash") {
        if (($("#cash").val() === "" || $("#balance").val() === "")) {
            showError("Payment fields are empty");
            return;
        }
    } else if ($("input[name='flexRadioDefault']:checked").val() === "Card") {
        if ($("#bank").val() === "" || $("#digits").val() === "") {
            showError("Payment fields are empty");
            return;
        }
    } else {
        showError("Please Select Payment Method!");
        return;
    }

    if ($("#cashier-name").val() === "") {
        showError("Cashier Name is empty");
        return;
    }
    const customers = await getAllCustomers();
    const employees = await getAllEmployees();
    let empEmail = '';
    employees.forEach(function (item) {
        if ($("#cashier-name").val() === item.empName) {
            empEmail = item.email;
        }
    });
    let cust;
    await customers.map(async (item, index) => {
        console.log(item.code);
        console.log($("#cust-id").val());
        console.log(selectedCustomer);
        let subtot = $("#subtot").text();
        let discount = $("#discount").val();

        let temp = [];
        for (let i = 0; i < order_items_db.length; i++) {
            temp.push(order_items_db[i]);
        }
        if (item.code === selectedCustomer) {
            cust = item;
            const stat = await updateCustomer(item.code, new CustomerModel(item.code, item.name, item.gender, item.joinedDate, item.level, item.totPoints, item.dob, item.address, item.contact, item.email, new Date()));
            console.log(stat);
            if (stat === 200) {
                const ordStatus = await saveOrder(new OrderModel($("#ord-id").val(), $("#ord-date").val(), cust.code, temp,
                    $("input[name='flexRadioDefault']:checked").val(), parseFloat(subtot), parseFloat(discount), empEmail, "Filled"));
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
                        title: 'Order not saved, please try again',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
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
    });
});

//Refund order
$("#refund-ord").on('click', async () => {
    const orders = await getAllOrders();
    const customers = await getAllCustomers();
    await orders.map(async (item, index) => {
        if (item.ordId === $("#ord-id").val()) {
            let cust;
            customers.forEach(function (itm) {
                if (itm.code === item.code) {
                    cust = itm;
                }
            });
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
                            const status = updateItem(itm.itemId, new ItemModel(itm.itemId, itm.itemName, itm.picture, itm.category, itm.size, itm.socks, itm.cleaner, itm.supCode, itm.salePrice, itm.buyPrice, itm.expectedProfit, itm.profitMargin, (parseFloat(itm.qtv) + parseFloat(orditm.qtv))));
                        }
                    });
                });
                const status = updateOrder(item.ordId, new OrderModel(item.ordId, item.ordDate, cust.code, item.items,
                    item.payMethod, item.subtot, item.discount, item.email, "Refunded"));
                console.log(status)
                if (status === 200) {
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Order Refunded successfully',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    await Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Order not Refunded, please try again',
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
    clearInputs();
    generateNextOrderId();
    order_items_db.length = 0;
    loadAllItems();
});

document.addEventListener("DOMContentLoaded", async () => {
    const orders = await getAllOrders();
    const customers = await getAllCustomers();
    const items = await getAllItem();
    const emps = await getAllEmployees();
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('ordId')) {
        const ordId = urlParams.get('ordId');
        console.log('ordId found:', ordId);
        orders.map(async (itm, index) => {
            if (itm.ordId === ordId) {
                let cust;
                customers.forEach(function (item) {
                    if (itm.code === item.code) {
                        cust = item;
                    }
                });
                $("#ord-id").val(itm.ordId);
                $("#ord-date").val(itm.ordDate);
                $("#cust-id").text(cust.code);
                $("#cust-name").val(cust.name);
                $("#cust-loyalty-level").val(cust.level);
                $("#cust-points").val(cust.totPoints);
                emps.forEach(function (item) {
                    if (item.email === itm.email) {
                        $("#cashier-name").val(item.empName);
                    }
                });
                $("#discount").val(itm.discount);
                $("#subtot").text(itm.subtot);
                $("#tot").text(parseFloat(itm.subtot) - (parseFloat(itm.subtot) * parseFloat(itm.discount) / 100));
                if (itm.payMethod === 'Card') {
                    $("#cardRadio").prop("checked", true);
                } else {
                    $("#cashRadio").prop("checked", true);
                }
                $("#order-item-table-body").empty();
                itm.items.map((item, index) => {
                    items.map((itm, index) => {
                        if (itm.itemId === item.itemId) {
                            let price = parseFloat(itm.salePrice) * parseFloat(item.quantity);
                            let itms =
                                `<tr><td class="code">${itm.itemId}</td><td class="name">${itm.itemName}</td><td class="size">${itm.size}</td><td class="qty">${item.quantity}</td><td class="price">${price}</td></tr>`
                            $("#order-item-table-body").append(itms);
                        }
                    })
                })
            }
        });
    } else {
        // ordId does not exist, do nothing
        console.log('ordId not found, doing nothing.');
    }
});
