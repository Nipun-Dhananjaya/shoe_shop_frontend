export const saveEmployee = async (employee) => {
    try {
        const response = await fetch('http://localhost:8081/scope/customer', {
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
        const response = await fetch(`http://localhost:8081/scope/customer?action=all`);
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error :' + error);
    }
}
export const updateEmployee = async (employee) => {
    try {
        const response = await fetch('http://localhost:8081/scope/customer', {
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
        const response = await fetch(`http://localhost:8081/scope/customer?id=${id}`, {
            method: 'DELETE',
        });
        return response.status;
    } catch (error) {
        console.log("error :" + error);
    }
}
export const nextEmployeeId = async () => {
    try {
        const response = await fetch(`http://localhost:8081/scope/customer?action=nextVal`);
        const nextId = await response.text();
        return nextId;
    } catch (error) {
        console.error('Error :' + error);
    }
}