const loggedUser = JSON.parse(getCookie("userData"));
const form = document.getElementById('change-password-form');
const inputs = form.querySelectorAll('input');

document.addEventListener('DOMContentLoaded', function () {
    const changeNameButton = document.getElementById('change-name-button');
    const changeUsernameButton = document.getElementById('change-username-button');

    // Function to replace text with input field
    function replaceWithInput(fieldId, defaultValue) {
        const field = document.getElementById(fieldId);
        const inputField = document.createElement('input');

        inputField.type = 'text';
        inputField.value = defaultValue;
        inputField.className = 'form-control'; // Bootstrap class for styling
        // Replace the text with input field
        field.parentNode.replaceChild(inputField, field);

        // Focus on the input field immediately after replacing
        inputField.focus();

        // Handle saving the new value on blur and Enter key
        const saveNewValue = () => {
            changeUsernameButton.classList.remove('d-none');
            changeNameButton.classList.remove('d-none');
            const newValue = inputField.value;

            // Replace the input field with the new text
            const newText = document.createElement('a');
            newText.id = fieldId; // Restore the original ID
            newText.textContent = newValue;

            // Reinsert the new text
            inputField.parentNode.replaceChild(newText, inputField);

            // AJAX POST request to save the new value to the server
            fetch(`/auth/update-${fieldId}`, { // Adjust the URL as needed
                method: 'POST',
                headers: {
                    'CSRF-Token': csrfToken, // The token from the cookie or as passed in your view
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [fieldId]: newValue }) // Sending the new value
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse JSON response
                })
                .then(data => {
                    console.log(`${fieldId} updated to: ${newValue}`, data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        };


        inputField.addEventListener('blur', saveNewValue);

        // Add event listener for Enter key press
        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                inputField.blur();
            }
        });
    }


    // Add click event listeners
    changeNameButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('name').focus();
        replaceWithInput('name', document.getElementById('name').textContent);
        changeNameButton.classList.add('d-none');
    });

    changeUsernameButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('username').focus();
        replaceWithInput('username', document.getElementById('username').textContent);
        changeUsernameButton.classList.add('d-none');
    });

    fetchUserInfo();
    const cancelchangePasswordButton = document.getElementById("cancel-password-reset-button");
    const changePasswordButton = document.getElementById("change-password-button");
    cancelchangePasswordButton.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            HidePasswordReset();
        }
    });
    changePasswordButton.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            ShowPasswordReset();
        }
    });
    changePasswordButton.addEventListener("click", ShowPasswordReset);
    cancelchangePasswordButton.addEventListener("click", HidePasswordReset);


    // Add event listener to each input field
    inputs.forEach(function (input, index) {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                if (index != 2) { // If the current input field is the third one (index 2)S
                    event.preventDefault();
                    const nextIndex = (index + 1) % inputs.length;
                    inputs[nextIndex].focus();
                }
                else {
                    document.getElementById('submitbutton').focus();
                }
            }
        });
    });
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        // Reset visuals for current password
        document.getElementById('current-password-red').style.color = 'rgb(255,255,255)';
        document.getElementById('current-password').classList.remove('form-control-incorrect');
        document.getElementById('EmptyOldPassword').classList.add('nodisplay');
        document.getElementById('WrongPassword').classList.add('nodisplay');

        // Resets visuals for new password
        document.getElementById('new-password-red').style.color = 'rgb(255,255,255)';
        document.getElementById('new-password').classList.remove('form-control-incorrect');
        document.getElementById('EmptyNewPassword').classList.add('nodisplay');
        document.getElementById('UnsafeNewPassword').classList.add('nodisplay');


        // Resets visuals for confirm new password
        document.getElementById('confirm-new-password-red').style.color = 'rgb(255,255,255)';
        document.getElementById('confirm-new-password').classList.remove('form-control-incorrect');
        document.getElementById('EmptyConfirmPassword').classList.add('nodisplay');
        document.getElementById('NoMatchPassword').classList.add('nodisplay');

        // gets base values
        const currentPassword = document.getElementById('current-password').value.trim();
        const newPassword = document.getElementById('new-password').value.trim();
        const confirmNewPassword = document.getElementById('confirm-new-password').value.trim();


        // Checks for empty fields, if empty change forum accordingly and exit the function
        if (currentPassword == '') {
            document.getElementById('current-password-red').style.color = 'rgb(255,0,0)';
            document.getElementById('current-password').classList.add('form-control-incorrect');
            document.getElementById('EmptyOldPassword').classList.remove('nodisplay');
            return
        }

        if (newPassword == '') {
            document.getElementById('new-password-red').style.color = 'rgb(255,0,0)';
            document.getElementById('new-password').classList.add('form-control-incorrect');
            document.getElementById('EmptyNewPassword').classList.remove('nodisplay');
            return
        }
        if (confirmNewPassword == '') {
            document.getElementById('confirm-new-password-red').style.color = 'rgb(255,0,0)';
            document.getElementById('confirm-new-password').classList.add('form-control-incorrect');
            document.getElementById('EmptyConfirmPassword').classList.remove('nodisplay');
            return
        }

        // Checks if enterred password is safe
        const passwordRegex = /^(?=.*[0-9A-Z!@#$%^&*])(.{5,})$/;

        if (!passwordRegex.test(newPassword)) {
            document.getElementById('new-password-red').style.color = 'rgb(255,0,0)';
            document.getElementById('new-password').classList.add('form-control-incorrect');
            document.getElementById('UnsafeNewPassword').classList.remove('nodisplay');
            return
        }

        // Checks if confirm password matches newpasword
        if (newPassword != confirmNewPassword) {
            document.getElementById('confirm-new-password-red').style.color = 'rgb(255,0,0)';
            document.getElementById('confirm-new-password').classList.add('form-control-incorrect');
            document.getElementById('NoMatchPassword').classList.remove('nodisplay');
            return
        }
        console.log(JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
            UUID: loggedUser.UUID
        }));

        // Communication with API to change password
        fetch('/auth/change-password', {
            method: 'POST',
            headers: {
                'CSRF-Token': csrfToken, // The token from the cookie or as passed in your view
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword,
                UUID: loggedUser.UUID
            }),
        })
            .then(response => response.json())

            .then(data => {
                // Handle the response from the server
                if (data.status === 'success') {
                    document.getElementById('customPasswordChangeAlert').classList.remove('nodisplay');
                    setTimeout(function () {
                        document.getElementById('customPasswordChangeAlert').classList.add('nodisplay');
                    }, 2000);
                    document.querySelector('form').reset();
                    HidePasswordReset();
                }
                else {
                    document.getElementById('current-password-red').style.color = 'rgb(255,0,0)';
                    document.getElementById('current-password').classList.add('form-control-incorrect');
                    document.getElementById('WrongPassword').classList.remove('nodisplay');
                }

            })
            .catch(error => {
                console.error('Error:', error);
            });
    });


    // Functions for showing password reset form
    function ShowPasswordReset() {

        document.getElementById('change-password-form').classList.remove('nodisplay');
        document.getElementById('profile-info').classList.add('nodisplay');

    }
    function HidePasswordReset() {
        document.querySelector('form').reset();
        document.getElementById('change-password-form').classList.add('nodisplay');
        document.getElementById('profile-info').classList.remove('nodisplay');
        // Reset visuals for current password
        document.getElementById('current-password-red').style.color = 'rgb(255,255,255)';
        document.getElementById('current-password').classList.remove('form-control-incorrect');
        document.getElementById('EmptyOldPassword').classList.add('nodisplay');
        document.getElementById('WrongPassword').classList.add('nodisplay');

        // Resets visuals for new password
        document.getElementById('new-password-red').style.color = 'rgb(255,255,255)';
        document.getElementById('new-password').classList.remove('form-control-incorrect');
        document.getElementById('EmptyNewPassword').classList.add('nodisplay');
        document.getElementById('UnsafeNewPassword').classList.add('nodisplay');


        // Resets visuals for confirm new password
        document.getElementById('confirm-new-password-red').style.color = 'rgb(255,255,255)';
        document.getElementById('confirm-new-password').classList.remove('form-control-incorrect');
        document.getElementById('EmptyConfirmPassword').classList.add('nodisplay');
        document.getElementById('NoMatchPassword').classList.add('nodisplay');
    }

    // Removes form red border when user clicks on set parts of form
    document.getElementById('current-password').addEventListener('focus', function () {
        document.getElementById('current-password').classList.remove('form-control-incorrect');
    });

    document.getElementById('new-password').addEventListener('focus', function () {
        document.getElementById('new-password').classList.remove('form-control-incorrect');
    });

    document.getElementById('confirm-new-password').addEventListener('focus', function () {
        document.getElementById('confirm-new-password').classList.remove('form-control-incorrect');
    });

});

// Communication with API for getting information and showing it
function fetchUserInfo() {
    // Fetch user information from the server
    fetch(`/auth/ProfileInfo`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Update the profile information on the page
                document.getElementById("name").innerText = data.user.Name;
                document.getElementById("username").innerText = data.user.Username;
                document.getElementById("email").innerText = data.user.Email;
            } else {
                console.error('Error fetching user information:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
        });
}