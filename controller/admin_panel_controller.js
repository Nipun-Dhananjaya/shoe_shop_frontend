import {getAllOrders} from "../api/Order_api.js";

let orderLst=[]
let itmLst=[]
let totSales=0;
let totProfit=0;
$(document).ready(async function () {
    const orders = await getAllOrders();

    orders.map((item, index) => {
        totSales=totSales+(parseFloat(item.subtot)-(parseFloat(item.subtot)*parseFloat(item.discount)));
    });
    $("#tot").text(totSales);
});


$("#ord-search-btn").on("click", async function () {
    const orders = await getAllOrders();

    orders.map((item, index) => {
        if (item.ordDate===new Date()){
            orderLst.push(item);
        }
    });
    orderLst.map((item, index) => {
        if (item.ordDate===new Date()){
            orderLst.push(item);
        }
    });
});