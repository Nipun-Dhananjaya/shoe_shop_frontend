import {getAllOrders} from "../api/Order_api.js";
import {getAllItem} from "../api/Store_api";

let orderLst=[]
let itmLst=[]
let totSales=0;
let totSpending=0;
let totProfit=0;
$(document).ready(async function () {
    const orders = await getAllOrders();
    const items = await getAllItem();

    orders.map((ord, index) => {
        if (ord.ordDate===new Date()){
            totSales=totSales+(parseFloat(ord.subtot)-(parseFloat(ord.subtot)*parseFloat(ord.discount)));
            ord.items.map((itm, index) => {
                items.map((item, index) => {
                    if (itm.itemId===item.itemId){
                        totSpending=totSpending+parseFloat(item.buyPrice)*itm.qtv;
                    }
                });
            });
            totProfit=totProfit+(parseFloat(totSales)-(parseFloat(totSales)));
        }
    });
    $("#tot").text(totSales);
    $("#subtot").text(totProfit);
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