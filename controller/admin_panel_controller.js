import {getAllOrders} from "../api/Order_api.js";
import {getAllItem} from "../api/Store_api";

let orderLst=[]
let itmLst=[]
let totSales=0;
let totProfit=0;
$(document).ready(async function () {
    const orders = await getAllOrders();
    const items = await getAllItem();

    orders.map((item, index) => {
        if (item.ordDate===new Date()){
            totSales=totSales+(parseFloat(item.subtot)-(parseFloat(item.subtot)*parseFloat(item.discount)));
        }
    });
    $("#tot").text(totSales);
    items.map((item, index) => {
        if (item.ordDate===new Date()){
            totSales=totSales+(parseFloat(item.subtot)-(parseFloat(item.subtot)*parseFloat(item.discount)));
        }
    });
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