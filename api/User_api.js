export const saveUser = async (supplier) => {
    try {
        const response = await fetch('http://localhost:8081/shop/api/v1/user', {
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
export const getAllUsers = async () => {
    try {
        console.log('getAll')
        const response = await fetch(`http://localhost:8081/shop/api/v1/user`,{
        method: 'GET',});
        const employees = await response.json();
        console.log(employees)
        return employees;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateUser = async (supplier) => {
    try {
        const response = await fetch('http://localhost:8081/shop/api/v1/user', {
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
export const deleteUser = async (email) => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/user/${email}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}

