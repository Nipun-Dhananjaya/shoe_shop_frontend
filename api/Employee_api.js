export const saveEmployee = async (employee) => {
    try {
        console.log(employee)
        const response = await fetch(`http://localhost:8081/shop/api/v1/employee`, {
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
export const getAllEmployees = async () => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/employee`);
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateEmployee = async (id,employee) => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/employee?empCode=${id}`, {
            method: 'PUT',
            body: JSON.stringify(employee),
            headers: {
                'Content-type': 'application/json',
            },
        })
        return response.status;

    } catch (error) {
        console.log('Error :' + error)
    }
}
export const deleteEmployee = async (id) => {
    try {
        const response = await fetch(`http://localhost:8081/shop/api/v1/employee?empCode=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}
