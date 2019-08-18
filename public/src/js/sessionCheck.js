function checkIfLoggedIn() {
    if (localStorage.getItem('status') === "loggedIn") {
        window.location.href = "src/html/homepage.html";
    }
}

function logOut() {
    localStorage.clear();
    localStorage.setItem('status', "loggedOut");
    window.location.href = "../../index.html";
}

function checkIfLoggedOut() {
    if (localStorage.getItem('status') === "loggedOut") {
        window.location.href = "../../index.html";
    }
    checkToken();
}

function checkToken() {
    let url = "http://localhost:8762/auth/oauth/check_token?token=" + localStorage.getItem("token");
    fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
    }).then(response => response.json())
        .then(response => {
            if (!response.hasOwnProperty("user_name")) {
                logOut();
            }
        })
        .catch(error =>{
            console.log(error);
            logOut();
        })

}