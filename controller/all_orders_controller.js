import {getAllOrders} from "../api/Order_api.js";
import {getAllCustomers} from "../api/Customer_api.js";
import {getAllItem} from "../api/Store_api.js";
import {getAllEmployees} from "../api/Employee_api.js";

$(document).ready(async function () {
    const orders=await getAllOrders();
    const customers=await getAllCustomers();
    const items=await getAllItem();
    const emps=await getAllEmployees();
    var tableBody = document.getElementById("all-order-tbl");
    var html = "";

    orders.forEach(function(order) {
        let cust;
        customers.forEach(function (item) {
            if (order.code===item.code) {
                cust=item;
            }
        });
        html += "<tr>";
        html += "<td>" + order.ordId + "</td>";
        html += "<td>" + order.ordDate + "</td>";
        html += "<td>" + order.code + "</td>";
        html += "<td>" + cust.name + "</td>";
        html += "<td><ul>";
        order.items.forEach(function(item) {
            html += "<li>" + item.itemId + "</li>";
        });
        html += "</ul></td>";
        html += "<td><ul>";
        order.items.forEach(function(item) {
            items.forEach(function(itm) {
                if (itm.itemId===item.itemId) {
                    html += "<li>" + itm.itemName + "</li>";
                }
            });
        });
        html += "</ul></td>";
        html += "<td><ul>";
        order.items.forEach(function(item) {
            html += "<li>" + item.quantity + "</li>";
        });
        html += "</ul></td>";
        html += "<td>" + order.payMethod + "</td>";
        html += "<td>" + order.discount + "</td>";
        emps.forEach(function(itm) {
            if (itm.email===order.email) {
                html += "<td>" + itm.empName+ "</td>";
            }
        });
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
    const customers=await getAllCustomers();
    const items=await getAllItem();
    const emps=await getAllEmployees();
    $("#all-order-tbl").empty();
    const orders = await getAllOrders();
    var tableBody = document.getElementById("all-order-tbl");
    var html = "";
    orders.map((order, index) => {
        console.log(order.ordId)
        if (order.ordId.startsWith($("#all-order-search").val())) {
            let cust;
            customers.forEach(function (item) {
                if (order.code===item.code) {
                    cust=item;
                }
            });
            html += "<tr>";
            html += "<td>" + order.ordId + "</td>";
            html += "<td>" + order.ordDate + "</td>";
            html += "<td>" + order.code + "</td>";
            html += "<td>" + cust.name + "</td>";
            html += "<td><ul>";
            order.items.forEach(function(item) {
                html += "<li>" + item.itemId + "</li>";
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function(item) {
                items.forEach(function(itm) {
                    if (itm.itemId===item.itemId) {
                        html += "<li>" + itm.itemName + "</li>";
                    }
                });
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function(item) {
                html += "<li>" + item.quantity + "</li>";
            });
            html += "</ul></td>";
            html += "<td>" + order.payMethod + "</td>";
            html += "<td>" + order.discount + "</td>";
            emps.forEach(function(itm) {
                if (itm.email===order.email) {
                    html += "<td>" + itm.empName+ "</td>";
                }
            });
            html += "<td>" + order.ordStatus+ "</td>";
            html += "</tr>";
        }
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
$("#ord-search-btn").on("click", async function () {
    const orders = await getAllOrders();
    const customers=await getAllCustomers();
    const items=await getAllItem();
    const emps=await getAllEmployees();
    $("#all-order-tbl").empty();
    var tableBody = document.getElementById("all-order-tbl");
    var html = "";
    orders.map((order, index) => {
        console.log(order.ordId)
        if (order.ordId===($("#all-order-search").val())) {
            console.log(order);
            let cust;
            customers.forEach(function (item) {
                if (order.code===item.code) {
                    cust=item;
                }
            });
            html += "<tr>";
            html += "<td>" + order.ordId + "</td>";
            html += "<td>" + order.ordDate + "</td>";
            html += "<td>" + order.code + "</td>";
            html += "<td>" + cust.name + "</td>";
            html += "<td><ul>";
            order.items.forEach(function(item) {
                html += "<li>" + item.itemId + "</li>";
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function(item) {
                items.forEach(function(itm) {
                    if (itm.itemId===item.itemId) {
                        html += "<li>" + itm.itemName + "</li>";
                    }
                });
            });
            html += "</ul></td>";
            html += "<td><ul>";
            order.items.forEach(function(item) {
                html += "<li>" + item.quantity + "</li>";
            });
            html += "</ul></td>";
            html += "<td>" + order.payMethod + "</td>";
            html += "<td>" + order.discount + "</td>";
            emps.forEach(function(itm) {
                if (itm.email===order.email) {
                    html += "<td>" + itm.empName+ "</td>";
                }
            });
            html += "<td>" + order.ordStatus+ "</td>";
            html += "</tr>";
        }
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