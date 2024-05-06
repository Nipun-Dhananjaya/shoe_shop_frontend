import {getAllUsers, user_db} from "../api/User_api.js  ";
import {UserModel} from "../model/UserModel.js";
import {saveSupplier} from "../api/Supplier_api";
import {SupplierModel} from "../model/SupplierModel";


//regex pattern
const emailPattern = /(^[a-zA-Z0-9_.-]+)@([a-zA-Z]+)([\.])([a-zA-Z]+)$/;

//error alert
function showError(message) {
    Swal.fire({
        icon: 'error',
        text: message,
    });
}

//save user
$("#user-signup-btn").on('click',  () => {
    signup('User');
});
$("#admin-signup-btn").on('click',  () => {
    signup('Admin');
});

async function signup(role)  {
    const comPassword = $("#floatingPassword-2").val();
    const password = $("#floatingPassword-1").val();
    const email = $("#floatingInputSignup").val();

    if (!comPassword || !password || !email) {
        showError("Please fill in all fields correctly.");
        return;
    }

    if (!emailPattern.test(email)) {
        showError("Invalid Email!");
        return;
    }

    user_db.push(new UserModel(email, password,role));

    await Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'User saved successfully',
        showConfirmButton: false,
        timer: 1500,
    });
    const status=await saveUser(new UserModel(email, password,role));

    if (status === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Supplier saved successfully',
            showConfirmButton: false,
            timer: 1500,
        });
    }
}

//user login
$("#admin-login-btn").on('click', () => {
    login('Admin');
});
$("#user-login-btn").on('click', () => {
    login('Admin');
});

async function login(role) {
    const password = $("#floatingPassword").val();
    const email = $("#floatingInputLogin").val();

    if (!password || !email) {
        showError("Please fill in all fields correctly!");
        return;
    }

    if (!emailPattern.test(email)) {
        showError("Invalid Email!");
        return;
    }
    const users=await getAllUsers(new UserModel(email, password,role));
    users.map(async (item, index) => {
        if (item.email.toLowerCase() === email) {
            if (password === user_db[index].password) {
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'User logged in successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                showError("Invalid Password!");
                return;
            }
        }else{
            showError("User not found!");
            return;
        }
    });
}