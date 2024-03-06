// Function to fetch and display all users
async function fetchAndDisplayUsers() {
    const headersList = {
        "Accept": "/",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    };

    try {
        const response = await fetch("http://localhost:9080/gnotes/api/gnotes/v1/users/fetchAll", {
            method: "GET",
            headers: headersList
        });

        const userData = await response.json();

        // Get the table body element
        const tableBody = document.getElementById("userTableBody");

        // Clear existing table rows
        tableBody.innerHTML = "";

        // Iterate over each user and create a table row
        userData.forEach(user => {
            const row = createUserRow(user);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error
    }
}

// Function to create a table row for a user
function createUserRow(user) {
    const row = document.createElement("tr");
    console.log(user.isAdmin)
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.isAdmin ? "Yes" : "No"}</td>
        <td>${user.isValide ? "Yes" : "No"}</td>
        <td>
        <button class="btn btn-danger" onclick="deleteUser(${user.id}, '${user.email}')">Delete</button>
        <button class="btn btn-primary" onclick="openUpdateModal(${user.id}, '${user.email}', ${user.isValide} , ${user.isAdmin})">Update</button>
        </td>
    `;
    return row;
}

// Function to open update modal
function openUpdateModal(userId, email, isValid, isAdmin) {
    window.userId = userId;

    // Populate the update form fields with user's information
    document.getElementById("updateEmail").value = email;
    document.getElementById("updateValid").checked = isValid;
    document.getElementById("updateAdmin").checked = isAdmin;

    // Open the update user modal
    const updateUserModal = new bootstrap.Modal(document.getElementById('updateUserModal'));
    updateUserModal.show();
}

// Function to delete a user
async function deleteUser(userId, userEmail) {
    console.log("Deleting user with ID:", userId);
    console.log("Deleting user with email:", userEmail);

    const headersList = {
        "Accept": "/",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
    };

    const bodyContent = JSON.stringify({
        "userId": userId,
        "email": userEmail
    });

    try {
        const response = await fetch("http://localhost:9080/gnotes/api/gnotes/v1/users/delete", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        const data = await response.text();
        console.log("Deletion response:");
        console.log(data);

        // Refresh the table after deleting the user
        fetchAndDisplayUsers();
    } catch (error) {
        console.error("Error deleting user:", error);
        // Handle error
    }
}

// Call the fetchAndDisplayUsers function when the page loads
window.addEventListener("load", fetchAndDisplayUsers);

// Add event listener to the form for registering new users
document.getElementById("addUserForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const isAdmin = false;
    const isValide = true;

    const headersList = {
        "Accept": "/",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
    };

    const bodyContent = JSON.stringify({
        "email": email,
        "password": password,
        "isAdmin": isAdmin,
        "isValide": isValide
    });

    try {
        const response = await fetch("http://localhost:9080/gnotes/api/gnotes/v1/users/register", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        const data = await response.text();
        console.log("Registration response:");
        console.log(data);

        // Refresh the table after adding a new user
        fetchAndDisplayUsers();

        // Close the modal after adding user
        const modal = document.getElementById("addUserModal");
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.hide();
    } catch (error) {
        console.error("Error:", error);
        // Handle error
    }
});

// Add event listener to the form for updating users
document.getElementById("updateUserForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("updateEmail").value;
    const isValid = document.getElementById("updateValid").checked;
    const isAdmin = document.getElementById("updateAdmin").checked;

    const headersList = {
        "Accept": "/",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
    };

    const bodyContent = JSON.stringify({
        "email": email,
        "isValide": isValid,
        "isAdmin": isAdmin
    });

    try {
        const response = await fetch(`http://localhost:9080/gnotes/api/v1/user/selectallusers`, {
            method: "POST",
            // body: bodyContent,
            headers: headersList
        });

        const data = await response.text();
        console.log("Update response:");
        console.log(data);

        // Refresh the table after updating the user
        fetchAndDisplayUsers();

        // Close the modal after updating user
        const updateUserModal = new bootstrap.Modal(document.getElementById('updateUserModal'));
        updateUserModal.hide();
    } catch (error) {
        console.error("Error updating user:", error);
        // Handle error
    }
});
