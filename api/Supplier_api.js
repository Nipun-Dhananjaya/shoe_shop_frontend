export const saveSupplier = async (supplier) => {
    try {
        const response = await fetch('http://localhost:8081/scope/customer', {
            method: 'POST',
            body: JSON.stringify(supplier),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error :' + error);
    }
};
export const getAllSupplier = async () => {
    try {
        const response = await fetch(`http://localhost:8081/scope/customer?action=all`);
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateSupplier = async (supplier) => {
    try {
        const response = await fetch('http://localhost:8081/scope/customer', {
            method: 'PUT',
            body: JSON.stringify(supplier),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}
export const deleteSupplier = async (id) => {
    try {
        const response = await fetch(`http://localhost:8081/scope/customer?id=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}
export const nextSupplierId = async () => {
    try {
        const response = await fetch(`http://localhost:8081/scope/customer?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}