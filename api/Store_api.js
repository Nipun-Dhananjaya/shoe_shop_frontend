export const saveItem = async (item) => {
    try {
        const response = await fetch('http://localhost:8081/shop/api/v1/inventory', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error :' + error);
    }
};
export const getAllItem = async () => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/inventory?action=all`);
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateItem = async (item) => {
    try {
        const response = await fetch('http://localhost:8081/shop/api/v1/inventory', {
            method: 'PUT',
            body: JSON.stringify(item),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}
export const deleteItem = async (id) => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/inventory?id=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}
export const nextItemId = async () => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/inventory?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}