import {getAllOrders} from "../api/Order_api.js";
import {getAllItem} from "../api/Store_api.js";
import {AdminPanelModel} from "../model/AdminPanelModel.js";

let itmLst=[]
let totSales=0;
let totSpending=0;
let totProfit=0;
let topSoldItem;

function getCurrentDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
function loadData() {
    if (topSoldItem!==undefined) {
        console.log(topSoldItem)
        $("#card-title").text(topSoldItem.itemName);
        $("#card-text").text(topSoldItem.category);
        $("#qty").text(topSoldItem.qty);
        var base64String = topSoldItem.picture;

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
    }
}

$(document).ready(async function () {
    const orders = await getAllOrders();
    const items = await getAllItem();

    orders.map((ord, index) => {
        if (ord.ordDate===getCurrentDateFormatted()){
            totSales=totSales+(parseFloat(ord.subtot)-(parseFloat(ord.subtot)*parseFloat(ord.discount)/100));
            ord.items.map((itm, index) => {
                items.map((item, index) => {
                    if (itm.itemId===item.itemId){
                        totSpending=totSpending+parseFloat(item.buyPrice)*itm.quantity;
                    }
                });
            });
            totProfit=totProfit+(parseFloat(totSales)-(parseFloat(totSpending)));
        }
    });
    $("#tot").text(totSales);
    $("#subtot").text(totProfit);

    items.map((itm, index) => {
        orders.map((ord, index) => {
            if (ord.ordDate===getCurrentDateFormatted()){
                ord.items.map((ordItem, index) => {
                    console.log(ordItem)
                    if (itm.itemId===ordItem.itemId){
                        if (itmLst.length!==0){
                            itmLst.map((i, index) => {
                                if (ordItem.itemId===i.itemId){
                                    i.qty=parseFloat(i.qty)+parseFloat(ordItem.quantity);
                                }
                            });
                        }else {
                            let temp=new AdminPanelModel(ordItem.itemId,itm.itemName,itm.picture,itm.category,itm.size,ordItem.quantity)
                            itmLst.push(temp);
                            console.log(temp)
                        }
                    }
                });
            }
        });
    });
    itmLst.map((item, index) => {
        if (topSoldItem!==undefined) {
            if (item.qtv > topSoldItem.qtv) {
                topSoldItem = item;
                console.log(topSoldItem)
            }
        }else{
            topSoldItem = item;
        }
    });
    loadData();
});


$("#ord-search-btn").on('click', async (event) => {
    event.preventDefault();
    console.log('clicked')
    totSales=0;
    totSpending=0;
    totProfit=0;
    let topSoldItem;
    const orders = await getAllOrders();
    const items = await getAllItem();

    console.log(orders)

    orders.map((ord, index) => {
        console.log(ord.ordDate)
        console.log($("#all-order-search").val())
        if (ord.ordDate===$("#all-order-search").val()){
            totSales=totSales+(parseFloat(ord.subtot)-(parseFloat(ord.subtot)*parseFloat(ord.discount)/100));
            ord.items.map((itm, index) => {
                items.map((item, index) => {
                    if (itm.itemId===item.itemId){
                        totSpending=totSpending+parseFloat(item.buyPrice)*itm.quantity;
                    }
                });
            });
            totProfit=totProfit+(parseFloat(totSales)-(parseFloat(totSpending)));
        }
    });
    $("#tot").text(totSales);
    $("#subtot").text(totProfit);

    items.map((itm, index) => {
        orders.map((ord, index) => {
            if (ord.ordDate===$("#all-order-search").val()){
                ord.items.map((ordItem, index) => {
                    console.log(ordItem)
                    if (itm.itemId===ordItem.itemId){
                        if (itmLst.length!==0){
                            itmLst.map((i, index) => {
                                if (ordItem.itemId===i.itemId){
                                    i.qty=parseFloat(i.qty)+parseFloat(ordItem.quantity);
                                }
                            });
                        }else {
                            let temp=new AdminPanelModel(ordItem.itemId,itm.itemName,itm.picture,itm.category,itm.size,ordItem.quantity)
                            itmLst.push(temp);
                            console.log(temp)
                        }
                    }
                });
            }
        });
    });
    itmLst.map((item, index) => {
        if (topSoldItem!==undefined) {
            if (item.qtv > topSoldItem.qty) {
                topSoldItem = item;
            }
        }
    });
    loadData();
});