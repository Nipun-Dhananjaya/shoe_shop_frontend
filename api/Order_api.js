export const saveOrder = async (employee) => {
    try {
        const response = await fetch('http://localhost:8081/shop/api/v1/sales', {
            method: 'POST',
            body: JSON.stringify(employee),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error :' + error);
    }
};
export const getAllOrders = async () => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/sales?action=all`);
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateOrder = async (order) => {
    try {
        const response = await fetch('http://localhost:8081/shop/api/v1/sales', {
            method: 'PUT',
            body: JSON.stringify(order),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}
export const deleteOrder = async (id) => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/sales?id=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}
export const nextOrderId = async () => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/sales?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}