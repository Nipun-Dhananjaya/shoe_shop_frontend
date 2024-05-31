export const saveSupplier = async (supplier) => {
    try {
        const response = await fetch('http://localhost:8081/shop/api/v1/supplier', {
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
        const response = await fetch(`http://localhost:8081/shop/api/v1/supplier`);
        const suppliers = await response.json();
        return suppliers;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateSupplier = async (supCode,supplier) => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/supplier/${supCode}`, {
            method: 'PUT',
            body: JSON.stringify(supplier),
            headers: {
                'Content-type': 'application/json',
            },
        })
        console.log(response)
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}
export const deleteSupplier = async (supCode) => {
    try {
        console.log('deleteA')
        const response = await fetch(`http://localhost:8081/shop/api/v1/supplier/${supCode}`, {
            method: 'DELETE',
        });
        console.log(response)
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}

