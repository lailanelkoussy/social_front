function validateEmail() {
    var inpObj = document.getElementById("inputEmail1");
    var feedback = document.getElementById("emailFeedback");
    var regex = RegExp("(?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c" +
        "\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0" +
        "-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}" +
        "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x" +
        "5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])");

    inpObj.classList.remove("is-invalid");
    inpObj.classList.remove("is-valid");

    if ((inpObj.value.toString().length === 0)) {
        inpObj.classList.add("is-invalid");
        feedback.innerHTML = "Required field";
    } else if (!regex.test(inpObj.value)) {
        inpObj.classList.add("is-invalid");
        feedback.innerHTML = "Invalid email";
    } else {
        inpObj.classList.add("is-valid");
        return true;
    }
    return false;
}

function popoverContent() {
    let password = document.getElementById("inputPassword1");
    let contentWrapper = document.createElement("div");
    let content = document.createElement("ul");
    let length = document.createElement("li");
    length.innerHTML = "Must be between 8 and 16 characters long";
    let lowerCase = document.createElement("li");
    lowerCase.innerHTML = "Must contain one lowercase character";
    let upperCase = document.createElement("li");
    upperCase.innerHTML = "Must contain one uppercase character";
    let specialChar = document.createElement("li");
    specialChar.innerHTML = "Must contain one special character";
    let number = document.createElement("li");
    number.innerHTML = "Must contain one digit";

    if (!password.value.toString().match("\\S*\\d+\\S*"))
        content.appendChild(number);

    if (!password.value.toString().match("\\S*[!@#$%^&*(),.?\":{}|<>]+\\S*"))
        content.appendChild(specialChar);
    if (!password.value.toString().match("\\S*[a-z]\\S*"))
        content.appendChild(lowerCase);
    if (!password.value.toString().match("\\S*[A-Z]\\S*"))
        content.appendChild(upperCase);

    if (password.value.toString().length < 8 || password.value.toString().length > 16)
        content.appendChild(length);

    contentWrapper.appendChild(content);
    return contentWrapper.outerHTML;
}

function validatePassword() {
    let password = document.getElementById("inputPassword1");
    let regex = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$^+=!*()@%&]).{8,16}$");
    let feedback = document.getElementById("passwordFeedback");

    password.classList.remove("is-invalid");
    password.classList.remove("is-valid");
    if ((password.value.toString().length === 0)) {
        password.classList.add("is-invalid");
        feedback.innerHTML = "Required field";
    } else if (!regex.test(password.value)) {
        feedback.innerHTML = "Invalid password";
        password.classList.add("is-invalid");
    } else {
        password.classList.add("is-valid");
    }

    $('[data-toggle="popover"]').popover("hide");
    password.setAttribute("data-content", popoverContent());
    if (password.classList.contains("is-invalid")) {
        $('[data-toggle="popover"]').popover("show");
        return false;
    } else return true;


}

function validateFirstName() {
    let inpObj = document.getElementById("inputFirstName");
    let feedback = document.getElementById("firstNameFeedback");

    inpObj.classList.remove("is-invalid");
    inpObj.classList.remove("is-valid");

    if ((inpObj.value.toString().length === 0)) {
        inpObj.classList.add("is-invalid");
        feedback.innerHTML = "Required field";

    } else if (!inpObj.value.toString().match("^[a-zA-Z]*$")) {
        inpObj.classList.add("is-invalid");
        feedback.innerHTML = "Invalid name";

    } else {
        inpObj.classList.add("is-valid");
        return true;
    }
    return false;
}

function validateLastName() {
    var inpObj = document.getElementById("inputLastName");
    var feedback = document.getElementById("lastNameFeedback");

    inpObj.classList.remove("is-invalid");
    inpObj.classList.remove("is-valid");

    if ((inpObj.value.toString().length === 0)) {
        inpObj.classList.add("is-invalid");
        feedback.innerHTML = "Required field";

    } else if (!inpObj.value.toString().match("^[a-zA-Z]*$")) {
        inpObj.classList.add("is-invalid");
        feedback.innerHTML = "Invalid name";
    } else {
        inpObj.classList.add("is-valid");
        return true;
    }
    return false;
}

function validateUsername(bool) {
    let username = document.getElementById("inputUsername");
    let feedback = document.getElementById("usernameFeedback");
    let url = "http://localhost:8087/users/username/" + username.value.toString();

    username.classList.remove("is-invalid");
    username.classList.remove("is-valid");

    if ((username.value.toString().length === 0)) {
        username.classList.add("is-invalid");
        feedback.innerHTML = "Required field";
        return false;

    } else if (!username.value.toString().match("^[a-z0-9_-]{3,15}$")) {
        username.classList.add("is-invalid");
        feedback.innerHTML = "Invalid username";
        return false;
    } else {
        fetch(url, {
            mode: 'cors', // no-cors, cors, *same-origin
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials:
                'same-origin', // include, *same-origin, omit
            headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
        }).then(data => {
            if (data["status"] === 404) {
                username.classList.add("is-valid");
                if (bool)
                    submit();
                return true;
            } else {
                username.classList.add("is-invalid");
                feedback.innerHTML = "Username is taken";
                return false;
            }
        }).catch(data => {
            if (data["status"] === 404) {
                username.classList.add("is-valid");
                if (bool)
                    submit();
                return true;
            } else {
                feedback.innerHTML = "Could not check availability of username";
                return false;
            }
        });
    }
}

function validateBirthday() {
    let inpObj = document.getElementById("inputBirthday");
    let regex = RegExp("([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))");

    let date = new Date();
    date.setDate(Date.now());

    var feedback = document.getElementById("birthdayFeedback");

    inpObj.classList.remove("is-invalid");
    inpObj.classList.remove("is-valid");

    if (!(inpObj.value.toString().length === 0)) {

        if (!regex.test(inpObj.value)) {
            inpObj.classList.add("is-invalid");
            feedback.innerHTML = "Invalid birthday";

        } else {
            let inputDateString = inpObj.value.toString().split("-");
            let inputDate = new Date();
            let currentDate = Date.now();
            inputDate.setFullYear(Number(inputDateString[0]), Number(inputDateString[1]), Number(inputDateString[2]));
            if (currentDate < inputDate) {
                inpObj.classList.add("is-invalid");
                feedback.innerHTML = "Invalid date";

            } else {
                inpObj.classList.add("is-valid");
                return true;
            }
        }
        return false;
    }
    return true;

}

function validateMiddleName() {
    let inpObj = document.getElementById("inputMiddleName");
    let feedback = document.getElementById("middleNameFeedback");

    inpObj.classList.remove("is-invalid");
    inpObj.classList.remove("is-valid");

    if (!inpObj.value.toString().match("^[a-zA-Z]*$")) {
        inpObj.classList.add("is-invalid");
        feedback.innerHTML = "Invalid name";
        return false;
    } else if (inpObj.value.toString().length !== 0) {
        inpObj.classList.add("is-valid");
    }
    return true;
}

function validateConfirmPassword() {
    let confirmPass = document.getElementById("inputConfirmPassword");
    let pass = document.getElementById("inputPassword1");
    let feedback = document.getElementById("confirmPasswordFeedback");

    confirmPass.classList.remove("is-invalid");
    confirmPass.classList.remove("is-valid");

    if (pass.classList.contains("is-valid")) {
        if (pass.value.toString() === confirmPass.value.toString()) {
            confirmPass.classList.add("is-valid");
            return true;
        } else {
            confirmPass.classList.add("is-invalid");
            feedback.innerHTML = "Password does not match";
        }
    } else if (confirmPass.value.toString().length === 0) {
        confirmPass.classList.add("is-invalid");
        feedback.innerHTML = "Required field";

    }
    return false;

}

function validateAll() {
    if (validateEmail() && validateBirthday() && validateConfirmPassword() && validateFirstName()
        && validateMiddleName() && validateLastName() && validatePassword() && validateUsername(true))
        submit();
}

function submitSuccess(data) {

    console.log(data);

    document.getElementById("signUpForm").reset();
    let alert = document.getElementById("signUpAlert");
    alert.classList.remove("alert-danger");
    alert.classList.add("alert", "alert-success");
    alert.setAttribute("role", "alert");
    let redirectLink = document.createElement("a");
    redirectLink.setAttribute("href", "../../index.html");
    redirectLink.classList.add("alert-link");
    redirectLink.innerHTML = "sign in";
    alert.innerHTML = "Sign up successful! You can now " + redirectLink.outerHTML + ".";

}

function submitFail(data) {
    // console.log(data);

    //document.getElementById("signUpForm").reset();
    let alert = document.getElementById("signUpAlert");
    alert.classList.remove("alert-success");
    alert.classList.add("alert", "alert-danger");
    alert.setAttribute("role", "alert");
    if (data["status"] === 400)
        alert.innerHTML = "Sign up fail. We are sorry for this inconvenience, try again later?";
    else alert.innerHTML = "It seems like this email has already been used to register. Please use another email.";
}

function submit() {
    const url = "http://localhost:8087/users";
    let data = {
        username: document.getElementById("inputUsername").value.toString(),
        password: document.getElementById("inputPassword1").value.toString(),
        email: document.getElementById("inputEmail1").value.toString(),
        firstName: document.getElementById("inputFirstName").value.toString(),
        middleName: document.getElementById("inputMiddleName").value.toString(),
        lastName: document.getElementById("inputLastName").value.toString(),
        birthday: document.getElementById("inputBirthday").value.toString()
    };

    postData(url, data)
        .then(data => {
            if (data["status"] === 406)
                submitFail(data);
            else
                submitSuccess(data);
        }) // JSON-string from `response.json()` call
        .catch(error => {
            submitFail(error)
        });
}

function postData(url = '', data = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then(res => res)
}


