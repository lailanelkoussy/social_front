function loadProfile() {
    let ppcol = document.getElementById("profilePictureCol");
    ppcol.innerHTML = "";
    let id = localStorage.getItem("profileId");
    let container = document.getElementById("profileContainer");
    let load = document.createElement("div");
    let photoCount = 0;
    load.innerHTML = "<div class=\"d-flex justify-content-center\">\n" +
        "  <div class=\"spinner-border\" role=\"status\">\n" +
        "    <span class=\"sr-only\">Loading...</span>\n" +
        "  </div>\n" +
        "</div>";
    container.appendChild(load);

    getUser(id).then(userData => {
        loadUserPhotos(id).then(userPhotos => {
            container.removeChild(load);
            let bigRow = document.createElement("div");
            bigRow.classList.add("row");
            let col1 = document.createElement("div");
            let col2 = document.createElement("div");
            let col3 = document.createElement("div");
            col1.classList.add("col-lg-4");
            col2.classList.add("col-lg-4");
            col3.classList.add("col-lg-4");
            col1.setAttribute("style", "padding-right: 0px;" +
                " padding-left: 0px;/");
            col2.setAttribute("style", "padding-right: 0px;" +
                " padding-left: 0px;/");
            col3.setAttribute("style", "padding-right: 0px;" +
                " padding-left: 0px;/");
            bigRow.appendChild(col1);
            bigRow.appendChild(col2);
            bigRow.appendChild(col3);

            getUserFollowing(id).then(userFollowing => {
                makeFollowingModal(userFollowing);
                container.appendChild(bigRow);
                userCardContainer(userData, userPhotos, userFollowing);
                if (userPhotos.length === 0) {
                    bigRow.setAttribute("style", "padding-left:10rem;");
                    bigRow.innerHTML = "<h1 style='padding-top: 5rem;font-weight: bold; padding-left: 30%'>This profile is empty!</h1>";
                } else {
                    for (let i = userPhotos.length; i > -1; i--) {
                        try {
                            let smallContainer = document.createElement("div");
                            smallContainer.classList.add("container");
                            smallContainer.setAttribute("style", "    padding-right: 1%;" +
                                " padding-left: 1%;");
                            let smallRow = document.createElement("div");
                            smallRow.classList.add("row", "mt-4");
                            smallContainer.appendChild(smallRow);
                            let smallCol = document.createElement("div");
                            smallCol.classList.add("col-lg");
                            smallRow.appendChild(smallCol);
                            let card = document.createElement("div");
                            card.classList.add("card");
                            let img = document.createElement("img");
                            img.setAttribute("src", "../images/" + userPhotos[i]["name"]);
                            img.classList.add("img-fluid", "rounded", "card-img-top");

                            if (id.toString() === localStorage.getItem("userId")) {
                                let button = document.createElement("button");
                                button.classList.add("btn");
                                button.setAttribute("type", "button");
                                button.setAttribute("data-toggle", "modal");
                                button.setAttribute("data-target", "#editPhotoModal");
                                button.setAttribute("style", "padding:0; margin:0;");
                                button.setAttribute("data-src", "../images/" + userPhotos[i]["name"]);
                                if (userPhotos[i]["id"].toString() === userData["photoId"].toString()) {
                                    button.setAttribute("data-id", "0");
                                } else button.setAttribute("data-id", userPhotos[i]["id"]);
                                button.appendChild(img);
                                card.appendChild(button);

                            } else {
                                card.appendChild(img);
                            }
                            if (userPhotos[i]["groupId"].toString() === "0") {
                                smallCol.appendChild(card);
                                photoCount++;
                            }

                            switch (i % 3) {
                                case 0: //col1
                                    col1.appendChild(smallContainer);
                                    break;
                                case 1: //col2
                                    col2.appendChild(smallContainer);
                                    break;
                                case 2: //col3
                                    col3.appendChild(smallContainer);
                                    break;
                            }
                        } catch (e) {

                        }
                    }
                    if (photoCount === 0) {
                        bigRow.innerHTML = "<h1 style='padding-top: 5rem;font-weight: bold; padding-left: 30%'>This profile is empty!</h1>";
                    }
                    let posts = document.getElementById("posts");
                    posts.innerHTML = photoCount + " posts";
                }
            }).catch(error => {
                    internalServerError(error);
                }
            )
        })
            .catch(error => {
                    internalServerError(error);
                }
            )

    }).catch(error => {
        internalServerError(error);
    })


}

function internalServerError(error) {
    console.log(error);
    // let container = document.getElementById("internalServerError");
    // container.innerHTML = "<div class=\"toast\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n" +
    //     "  <div class=\"toast-header\">\n" +
    //     "    <img src=\"...\" class=\"rounded mr-2\" alt=\"...\">\n" +
    //     "    <strong class=\"mr-auto\">Error</strong>\n" +
    //     "    <small>11 mins ago</small>\n" +
    //     "    <button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\">\n" +
    //     "      <span aria-hidden=\"true\">&times;</span>\n" +
    //     "    </button>\n" +
    //     "  </div>\n" +
    //     "  <div class=\"toast-body\">\n" +
    //     "    Uh oh! It seems like there has been some error, some content might not display the way it should." +
    //     "  </div>\n" +
    //     "</div>"

}

function switchToProfile(id) {
    localStorage.setItem("profileId", id);
    if (Number(id) === Number(localStorage.getItem("userId"))) {
        window.location.href = "../html/personalProfile.html";
    } else {
        window.location.href = "../html/profile.html";
    }
}

function getUserProfilePicSrc(userData, userPhotos) {
    let photoId = userData["photoId"];
    for (let i = 0; i < userPhotos.length; i++) {
        if (userPhotos[i]["id"].toString() === photoId.toString())
            return userPhotos[i]["name"];
    }

}

function userCardContainer(userData, userPhotos, userFollowing) {

    if (userData["photoId"].toString() !== "0") {
        let ppcol = document.getElementById("profilePictureCol");
        let pp = document.createElement("img");
        ppcol.appendChild(pp);
        pp.setAttribute("alt", "...");
        pp.setAttribute("style", "  width: 90px;\n" +
            "  height: 90px;  border-radius: 50%; object-fit: cover;");
        pp.setAttribute("src", "../images/" + getUserProfilePicSrc(userData, userPhotos));
    }

    let name = document.getElementById("name");
    name.innerHTML = userData["firstName"][0].toUpperCase() + userData["firstName"].slice(1) + " " +
        userData["lastName"][0].toUpperCase() + userData["lastName"].slice(1);
    let posts = document.getElementById("posts");
    posts.innerHTML = userPhotos.length + " posts";

    let following = document.getElementById("following");
    following.innerHTML = userFollowing.length + " following";
    let username = document.getElementById("username");
    username.innerHTML = userData["username"];

    if (Number(userData["userId"]) !== Number(localStorage.getItem("userId"))) {
        let followCol = document.getElementById("followButtonCol");
        let followButton = document.createElement("button");
        followButton.setAttribute("id", "followButton");
        followCol.appendChild(followButton);
        getUserFollowing(localStorage.getItem("userId")).then(follow => {
            let followBool = false;
            for (let i = 0; i < follow.length; i++)
                if (follow[i]["userId"] === userData["userId"]) { //if following
                    followBool = true;
                }
            if (followBool) {
                loadUnfollowButton();
            } else {
                loadFollowButton();
            }
        });
    }

}

function loadUnfollowButton() {
    let followButton = document.getElementById("followButton");
    followButton.setAttribute("type", "button");
    followButton.classList.remove("btn-outline-primary");
    followButton.classList.add("btn", "btn-primary");
    followButton.setAttribute("onclick", "unfollowUser()");
    followButton.innerHTML = "unfollow";
}

function loadFollowButton() {
    let followButton = document.getElementById("followButton");
    followButton.setAttribute("type", "button");
    followButton.classList.remove("btn-primary");
    followButton.classList.add("btn", "btn-outline-primary");
    followButton.innerHTML = "follow";
    followButton.setAttribute("onclick", "followUser()");

}

function loadPersonalProfile() {
    switchToProfile(localStorage.getItem("userId"));
}

function followUser(userId = "0") {
    let id = localStorage.getItem("profileId");
    let url = "http://localhost:8762/userms/users/" + localStorage.getItem("userId");
    let userList;
    if (userId === "0")
        userList = {
            follow: [id]
        };
    else userList = {
        follow: [userId]
    };
    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'PATCH',
        body: JSON.stringify(userList)
    }).then(response => {
        loadUnfollowButton();
    })

}

function unfollowUser(userId = "0") {
    let id = localStorage.getItem("profileId");
    console.log("unfollowed");
    let url = "http://localhost:8762/userms/users/" + localStorage.getItem("userId") + "/following";
    let userList;
    if (userId === "0")
        userList =
            {
                unfollow: [id]
            };
    else userList =
        {
            unfollow: [userId]
        };

    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'DELETE',
        body: JSON.stringify(userList)
    }).then(response => {
        loadFollowButton();
    })

}

function loadUserPhotos(userId) {
    let url = "http://localhost:8762/photoms/photos/all/user/" + userId;
    return fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': '*/*'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer'

    }).then(response => response.json())
}

function getUser(id) {
    let url = "http://localhost:8762/userms/users/" + id;
    return fetch(url, {
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
    }).then(returned => returned)
        .then(returnedjson => returnedjson.json())
        .catch(error => {
            internalServerError(error);
        })
}

function getUserFollowing(id) {
    let url = "http://localhost:8762/userms/users/" + id + "/following";
    return fetch(url, {
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
    }).then(returned => returned)
        .then(returnedjson => returnedjson.json())
        .catch(error => {
            internalServerError(error);
        })
}

function makeFollowingModal(userFollowing) {
    let table = document.getElementById("followingTableBody");
    let modalBody = document.getElementById("followingModalBody");
    if (userFollowing.length === 0) {
        modalBody.innerHTML = "<h5>This user is not following anyone.</h5>"
    } else {
        for (let i = 0; i < userFollowing.length; i++) {
            let element = document.createElement("tr");
            element.setAttribute("onclick", "switchToProfile(" + userFollowing[i]["userId"]+")");
            element.innerHTML = "<td>" +
                userFollowing[i]["firstName"][0] + userFollowing[i]["firstName"].slice(1) + " "+
                userFollowing[i]["lastName"][0] + userFollowing[i]["lastName"].slice(1)
                + "</td>" + "<td>" +
                userFollowing[i]["username"] + "</td>";
            table.appendChild(element);

        }
    }

}
