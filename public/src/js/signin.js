function postData(url = '', data) {
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.

        headers: {
            'Authorization': "Basic " + btoa(unescape(encodeURIComponent('client' + ':' + 'client'))),
            'Accept': '*/*'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: data, // body data type must match "Content-Type" header
    }).then(res => res)
}


function signIn() {
    let username = document.getElementById("inputUsername");
    let password = document.getElementById("inputPassword");
    let url = "http://localhost:8762/auth/oauth/token";

    let data = new FormData();
    data.append("grant_type", "password");
    data.append("username", username.value.toString());
    data.append("password", password.value.toString());

    postData(url, data).then(response => response.json())
        .then(data => {
            if (data.hasOwnProperty("access_token")) {
                localStorage.setItem('token', data["access_token"]);
                signInSuccess(username.value.toString());
            } else {
                signInFail(true);
            }
        }) // JSON-string from `response.json()` call
        .catch(error => {
            signInFail(false);
        });

}

function signInFail(bool) {
    let alert = document.getElementById("signInAlert");
    alert.classList.add("alert", "alert-danger");
    alert.setAttribute("role", "alert");
    if (bool)
        alert.innerHTML = "Invalid username or password.";
    else
        alert.innerHTML = "Unable to sign in at this moment. Please try again later."

}

function signInSuccess(username) {
    let url = "http://localhost:8762/userms/users/username/" + username;
    localStorage.setItem('status', 'loggedIn');
    localStorage.setItem('username', username);
    fetch(url, {
        mode: 'cors', // no-cors, cors, *same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials:
            'same-origin', // include, *same-origin, omit
        headers:
            {
                'Authorization': "Bearer " + localStorage.getItem("token"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
    }).then(response => response.json())
        .then(response => {
            localStorage.setItem("userId", response["userId"]);
            window.location.href = "src/html/homepage.html";
        });

}
