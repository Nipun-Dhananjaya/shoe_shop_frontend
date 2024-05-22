import {getAllUsers, saveUser} from "../api/User_api.js  ";
import {UserModel} from "../model/UserModel.js";


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

    if (!comPassword===password) {
        showError("Confirmation Password Is Not Match!");
        return;
    }
    const status=await saveUser(new UserModel(email, password,role));

    if (status === 200) {
        await Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User saved successfully',
            showConfirmButton: false,
            timer: 1500,
        });

        if (role === 'Admin') {
            switchToNext('admin_panel.html');
        } else {
            switchToNext('customer_users.html');
        }
    }
}

//user login
$("#admin-login-btn").on('click', () => {
    login('Admin');
});
$("#user-login-btn").on('click', () => {
    login('User');
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
    const users = await getAllUsers();
    let userFound = false;

    for (const item of users) {
        if (item.email === email) {
            userFound = true;
            console.log(email);
            console.log(item.email);
            if (password === item.password && role === item.role) {
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'User logged in successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });

                if (role === 'Admin') {
                    switchToNext('admin_panel.html');
                } else {
                    switchToNext('customer_users.html');
                }
            } else {
                showError("Invalid Password!");
            }
            break;
        }
    }

    if (!userFound) {
        showError("User not found!");
    }

}

function loadCSS(filename) {
    var link = document.createElement("link");
    link.href = filename;
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);
}

function loadJS(filename) {
    var script = document.createElement("script");
    script.src = filename;
    script.type = "text/javascript";
    document.head.appendChild(script);
}

function switchToNext(fileName) {
    fetch(fileName)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to load file: ' + fileName);
            }
        })
        .then(html => {
            document.open();
            document.write(html);
            document.close();

            loadCSS('css/normalize.css');
            loadCSS('css/index-styles.css');
            loadCSS('css/signup-styles.css');
            loadCSS('css/customer-styles.css');
            loadCSS('css/order-styles.css');

            loadJS('assets/lib/jquery.min.js');
            loadJS('controller/customer_controller.js');
            loadJS('controller/store_controller.js');
            loadJS('controller/order_controller.js');
            loadJS('controller/user_controller.js');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


