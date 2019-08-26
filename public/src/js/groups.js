function switchToGroup(groupId) {
    localStorage.setItem("groupId", groupId);
    window.location.href = "../html/group.html";
}

function loadGroup() {
    let id = localStorage.getItem("groupId");
    let container = document.getElementById("groupContainer");
    makeGroupInfoBar(id);
    addMembersModal();
    getGroupContent(id).then(groupPhotos => {

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

        container.appendChild(bigRow);
        if (groupPhotos.length === 0) {
            bigRow.innerHTML = "<h1 style='padding-top: 5rem;font-weight: bold; margin-left:30%;'>This group is empty!</h1>";
        } else {

            for (let i = groupPhotos.length - 1; i > -1; i--) {
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

                    makeGroupElementCard(groupPhotos[i], smallCol);
                    let card = document.createElement("div");
                    card.classList.add("card");
                    smallCol.appendChild(card);
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
        }

    })
        .catch(error => {
                internalServerError(error);
                window.location.href = "../html/groups.html";
            }
        )

}

function loadPersonalGroups() {
    getUserGroups().then(groupResults => {
        let tableBody = document.getElementById("groupTableBody");
        for (let i = 0; i < groupResults.length; i++) {
            if (groupResults[i]["userId"] !== localStorage.getItem("userId")) {
                let item = document.createElement("tr");
                tableBody.appendChild(item);
                item.innerHTML = "<td style=\"text-align:center\" onclick='switchToGroup(" + groupResults[i]["id"] + ")'>"
                    + "<a href='#' style='color:black; text-decoration: none; vertical-align: center;'>" + groupResults[i]["name"][0].toUpperCase() + groupResults[i]["name"].slice(1) + "</a>" + "</td>"
                    + "<td style=\"text-align:center; vertical-align: center;\" onclick='switchToGroup(" + groupResults[i]["id"] + ")'>" + groupResults[i]["description"] + "</td>"
                    + "<td style=\"text-align:center; vertical-align: center\" onclick='switchToGroup(" + groupResults[i]["id"] + ")'>" + groupResults[i]["members"].length + " members" + "</td>" +
                    "<td id='joinButtonCol" + groupResults[i]["id"] + "'>" + "</td>";
                if (groupResults[i]["creatorId"].toString() === localStorage.getItem("userId").toString())
                    loadDeleteButton(groupResults[i]["id"], groupResults[i]["id"]);
                else
                    loadLeaveButton(groupResults[i]["id"], groupResults[i]["id"]);

            }
        }
    });
}

function makeGroupInfoBar(id) {
    getGroupInfo(id).then(info => {
        if (info["creatorId"].toString() === localStorage.getItem("userId").toString())
            setCreator(true);
        else setCreator(false);
        let groupName = document.getElementById("groupName");
        let groupDescription = document.getElementById("groupDescription");
        groupName.innerHTML = info["name"][0].toUpperCase() + info["name"].slice(1);
        localStorage.setItem("groupName", info["name"][0].toUpperCase() + info["name"].slice(1));
        groupDescription.innerHTML = info["description"];
        localStorage.setItem("description", info["description"]);
        let members = document.getElementById("members");
        members.setAttribute("onclick", "showMembers(false)");
        members.setAttribute("data-toggle", "modal");
        members.setAttribute("data-target", "#membersModal");
        members.setAttribute("style", "font-weight:600;")

        members.innerHTML = info["members"].length + " members";
        getUserInfo(info["creatorId"]).then(userInfo => {
            let creator = document.getElementById("creator");
            creator.setAttribute("href", "#");
            creator.classList.add("card-link");
            creator.setAttribute("style", "color:black; font-weight:600;");
            creator.innerHTML = "Created by " + userInfo["username"];
            creator.setAttribute("onclick", "switchToProfile(" + userInfo["userId"] + ");")

            localStorage.setItem("members", JSON.stringify(info["members"]));
            localStorage.setItem("requests", JSON.stringify(info["requests"]));
            if (isCreator()) {
                loadDeleteButton(id);

            } else {

                let loaded = false;
                for (let i = 0; i < info["members"].length; i++) {
                    if (info["members"][i]["compositeKey"]["userId"].toString() === localStorage.getItem("userId").toString()) {
                        loadLeaveButton(info["id"]);
                        setIfMember(true);
                        loaded = true;
                        break;
                    }
                }

                if (!loaded) {
                    for (let i = 0; i < info["requests"].length; i++)
                        if (info["requests"][i]["userId"].toString() === localStorage.getItem("userId").toString()) {
                            loadRequestedButton();
                            loaded = true;
                            setIfMember(false);
                            break;
                        }
                }
                if (!loaded) {
                    loadJoinButton();
                    setIfMember(false)
                }

                if (!isAMember()) {
                    let button = document.getElementById("dropdownMenuButton");
                    button.setAttribute("style", "display: none;");
                }
            }

            getGroupTags(id).then(tags => {
                let col = document.getElementById("tagCol");
                for (let i = 0; i < tags.length; i++) {
                    let tag = document.createElement("a");
                    col.appendChild(tag);
                    tag.setAttribute("href", "#");
                    tag.classList.add("badge", "badge-secondary");
                    tag.setAttribute("onclick", "searchForPhotos(\"" + tags[i] + "\")");
                    tag.setAttribute("style", "margin-left:0.25rem;");
                    tag.innerHTML = "#" + tags[i];
                }
                if (isCreator()) {
                    makeCreatorSideBar(info);

                }
            })
        })
    })
}

function searchForPhotos(hashtagName) {
    localStorage.setItem("search", hashtagName);
    window.location.href = "../html/searchResults.html";
}

function loadRequestedButton() {
    let buttonCol = document.getElementById("joinButtonCol");
    buttonCol.innerHTML = "<button type=\"button\" class=\"btn btn-primary btn-md\" disabled>Requested</button>"
}

function loadLeaveButton(id, idOfCol = "") {
    let buttonCol = document.getElementById("joinButtonCol" + idOfCol);
    buttonCol.innerHTML = "";
    let button = document.createElement("button");
    buttonCol.appendChild(button);
    button.setAttribute("type", "button");
    button.classList.remove("btn-outline-primary");
    button.classList.add("btn", "btn-primary", "btn-md");
    if (idOfCol !== "")
        button.setAttribute("onclick", "leaveGroup(" + id + ", " + false + ")");
    else button.setAttribute("onclick", "leaveGroup(" + id + ")");
    button.innerHTML = "Leave";
}

function loadJoinButton() {
    let buttonCol = document.getElementById("joinButtonCol");
    buttonCol.innerHTML = "";
    let button = document.createElement("button");
    buttonCol.appendChild(button);
    button.setAttribute("type", "button");
    button.classList.remove("btn-primary");
    button.classList.add("btn", "btn-primary", "btn-md");
    button.setAttribute("onclick", "joinGroup()");
    button.innerHTML = "Join";
}

function loadDeleteButton(id, idOfCol = "") {
    let buttonCol = document.getElementById("joinButtonCol" + idOfCol);
    let button = document.createElement("button");
    buttonCol.appendChild(button);
    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#deleteModal")
    button.classList.remove("btn-primary");
    button.classList.add("btn", "btn-danger", "btn-md");
    button.innerHTML = "Delete";

    let modalWrapper = document.getElementById("modalWrapper");
    modalWrapper.innerHTML = "<div class=\"modal fade\" id=\"deleteModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\"\n" +
        "         aria-hidden=\"true\">\n" +
        "        <div class=\"modal-dialog\" role=\"document\">\n" +
        "            <div class=\"modal-content\">\n" +
        "                <div class=\"modal-header\">\n" +
        "                    <h5 class=\"modal-title\" id=\"exampleModalLabel\">Delete Group</h5>\n" +
        "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
        "                        <span aria-hidden=\"true\">&times;</span>\n" +
        "                    </button>\n" +
        "                </div>\n" +
        "                <div class=\"modal-body\">\n" +
        "                    <p>You are about to delete this group. Group content will be\n" +
        "                        permanently deleted. Are you sure you want to proceed?</p>\n" +
        "\n" +
        "                </div>\n" +
        "                <div class=\"modal-footer\">\n" +
        "                    <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
        "                    <button type=\"button\" class=\"btn btn-danger\" onclick=\"deleteGroup(" + id + ")\">Delete Group</button>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>";
}

function deleteGroup(id) {
    let url = "http://localhost:8762/groupms/groups/" + id + "/" + localStorage.getItem("userId");
    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'DELETE',
    }).then(response => {
        window.location.href = '../html/groups.html'
    }).catch(error => {
        console.log(error);
    })

}

function leaveGroup(id, bool = true) {
    let url = "http://localhost:8762/groupms/groups/" + id + "/user/" + localStorage.getItem("userId");
    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'DELETE'
    }).then(response => {
        if (!bool)
            refresh();
        else {
            setIfMember(false);
            loadJoinButton();
        }

    })
}

function isAMember() {
    return (localStorage.getItem("isMember").toString() === "true");

}

function setIfMember(bool) {
    localStorage.setItem("isMember", bool);

}

function joinGroup() {
    let id = localStorage.getItem("groupId");
    let url = "http://localhost:8762/groupms/requests/" + id + "/requests/" + localStorage.getItem("userId");
    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'POST'
    }).then(response => {
        loadRequestedButton();
    })

}

function isCreator() {
    return (localStorage.getItem("isCreator").valueOf().toString() === "true");
}

function setCreator(bool) {
    localStorage.setItem("isCreator", bool);
}

function makeGroupElementCard(imageResponse, col) {
    let card = document.createElement("div");
    card.classList.add("card");
    let img = document.createElement("img");
    img.setAttribute("src", "../images/" + imageResponse["name"]);
    img.classList.add("img-fluid", "rounded", "card-img-top");
    if (isCreator() || imageResponse["userId"].toString() === localStorage.getItem("userId")) {
        let button = document.createElement("button");
        button.classList.add("btn");
        button.setAttribute("type", "button");
        button.setAttribute("data-toggle", "modal");
        button.setAttribute("data-target", "#editPhotoModal");
        button.setAttribute("style", "padding:0;");
        button.setAttribute("data-src", "../images/" + imageResponse["name"]);
        button.setAttribute("data-id", imageResponse["id"]);
        button.appendChild(img);
        card.appendChild(button);
    } else {
        card.appendChild(img);
    }
    let timestamp = document.createElement("small");
    timestamp.innerHTML = getTimeStamp(imageResponse["timeStamp"]);
    let userLink;
    getUser(imageResponse["userId"]).then(data => {
        userLink = document.createElement("a");
        userLink.setAttribute("id", "userLink");
        userLink.setAttribute("onclick", "switchToProfile(" + data["userId"] + ");");
        userLink.setAttribute("href", "#");
        userLink.innerHTML = data["username"] + "\n";
        userLink.classList.add("card-link", "text-muted");
        let cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer", "text-muted");
        cardFooter.innerHTML = timestamp.innerHTML + " by " + userLink.outerHTML;
        card.appendChild(cardFooter);
        col.appendChild(card);
    })

}

function getTimeStamp(timestamp) {

    let year = Number(timestamp.toString().substr(0, 4));
    let month = Number(timestamp.toString().substr(5, 2));
    let day = Number(timestamp.toString().substr(8, 2));
    let hour = Number(timestamp.toString().substr(11, 2));
    let minute = Number(timestamp.toString().substr(14, 2));

    let today = new Date();
    let yearNow = Number(today.getFullYear());
    let monthNow = Number(today.getMonth() + 1);
    let dayNow = Number(today.getDate());
    let hourNow = Number(today.getHours());
    let minutesNow = Number(today.getMinutes());

    if (yearNow - year !== 0)
        return yearNow - year + " years ago";
    else if (monthNow - month !== 0)
        return (monthNow - month === 1) ? "1 month ago" : monthNow - month + " months ago";
    else if (dayNow - day !== 0)
        return (dayNow - day === 1) ? "1 day ago" : dayNow - day + " days ago";
    else if (hourNow - hour !== 0)
        return (hourNow - hour === 1) ? "1 hour ago" : hourNow - hour + " hours ago";
    else if (minutesNow - minute !== 0)
        return (minutesNow - minute === 1) ? "1 minute ago" : minutesNow - minute + " minutes ago";
    else return "a few seconds ago";


}

function getGroupContent(id) {
    let url = "http://localhost:8762/photoms/photos/all/group/" + localStorage.getItem("userId") + "/" + id;
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

function getUserGroups() {
    let url = "http://localhost:8762/groupms/groups/user/" + localStorage.getItem("userId") + "/";
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

function getGroupInfo(id) {
    let url = "http://localhost:8762/groupms/groups/" + id;
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

function getUserInfo(id) {
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

function getGroupTags(id) {
    let url = "http://localhost:8762/photoms/hashtags/group/" + id;
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

function makeCreatorSideBar() {
    let sidebar = document.getElementById("sidebar");
    addRequestModal();
    addChangeNameModal();
    addDescriptionModal();
    sidebar.innerHTML = "<div class=\" border-right border-top\" id=\"sidebar-wrapper\">\n" +
        "        <div class=\"sidebar-heading\">Manage Group</div>\n" +
        "        <div class=\"list-group list-group-flush\">\n" +
        "            <a href=\"#\" class=\"list-group-item list-group-item-action \"  onclick='showMembers(true)' data-toggle=\"modal\" data-target=\"#membersModal\">Manage Members</a>\n" +
        "            <a href=\"#\" class=\"list-group-item list-group-item-action \" onclick='showRequests()' data-toggle=\"modal\" data-target=\"#requestModal\" > Manage Requests<span style='margin-left: 0.5rem;' class=\"badge badge-primary\" id='requestBadge'></span></a>\n" +
        "            <a href=\"#\" class=\"list-group-item list-group-item-action \" data-toggle=\"modal\" data-target=\"#changeNameModal\">Rename Group</a>\n" +
        "            <a href=\"#\" class=\"list-group-item list-group-item-action \" data-toggle=\"modal\" data-target=\"#descriptionModal\">Change Description</a>\n" +
        "        </div>\n" +
        "    </div>";
    let wrapper = document.getElementById("wrapper");
    if (window.innerWidth < 768)
        wrapper.classList.remove("toggled");

    let col = document.getElementById("settingsCol");
    col.innerHTML = "<button type=\"button\" class=\"btn\" onclick='toggleBar()' id=\"menu-toggle\" style=\"padding: 0\"><img\n" +
        "                            src=\"../images/logos/gears.png\" alt=\"...\"></button>";


}

function makeRemoveUserButton(id) {
    return "<button type=\"button\" id='removeButton" + id + "' class=\"btn btn-outline-danger\" onclick='removeUser(" + id + ")'>Remove</button>";
}

function showMembers(bool) {
    getGroupInfo(localStorage.getItem("groupId")).then(group => {
        let members = group["members"];
        localStorage.setItem("members", JSON.stringify(members));
        let tableBody = document.getElementById("memberTable");
        tableBody.innerHTML = "";
        getMembers(members).then(memberUsersInfo => {

            if (bool.toString() === "true") { //if from manage
                for (let i = 0; i < memberUsersInfo.length; i++) {
                    if (memberUsersInfo[i]["userId"].toString() !== localStorage.getItem("userId").toString()) {
                        let item = document.createElement("tr");
                        tableBody.appendChild(item);
                        item.innerHTML = "<td style=\"text-align:center vertical-align: middle;\">"
                            + memberUsersInfo[i]["firstName"][0].toUpperCase() + memberUsersInfo[i]["firstName"].slice(1)
                            + " " + memberUsersInfo[i]["lastName"][0].toUpperCase() + memberUsersInfo[i]["lastName"].slice(1) + "</td>"
                            + "<td style=\"text-align:center vertical-align: middle;\" onclick='switchToProfile(" + memberUsersInfo[i]["userId"] + ")'>" + memberUsersInfo[i]["username"] + "</td><td>" + makeRemoveUserButton(memberUsersInfo[i]["userId"]) + "</td>";
                    }
                }
            } else {
                for (let i = 0; i < memberUsersInfo.length; i++) {
                    let item = document.createElement("tr");
                    item.setAttribute("onclick", "switchToProfile(" + memberUsersInfo[i]["userId"] + ")");
                    tableBody.appendChild(item);
                    item.innerHTML = "<td style=\"text-align:center; vertical-align: middle;\">" +
                        memberUsersInfo[i]["firstName"][0].toUpperCase() + memberUsersInfo[i]["firstName"].slice(1)
                        + " " + memberUsersInfo[i]["lastName"][0].toUpperCase() + memberUsersInfo[i]["lastName"].slice(1) + "</td>"
                        + "<td style=\"text-align:center; vertical-align: middle;\">" + memberUsersInfo[i]["username"] + "</td>";
                }
            }
        });
    })
}

function refresh() {
    window.location.reload();

}

function showRequests() {
    getGroupInfo(localStorage.getItem("groupId")).then(group => {
        getRequesters(group["requests"]).then(requesters => {
            localStorage.setItem("requests", JSON.stringify(requesters));
            let tableBody = document.getElementById("requestTable");
            tableBody.innerHTML = "";
            if (requesters.length === 0)
                tableBody.innerHTML = "<p>No new requests at this moment. </p>";
            for (let i = 0; i < requesters.length; i++) {

                if (requesters[i]["userId"].toString() !== localStorage.getItem("userId").toString()) {
                    let item = document.createElement("tr");
                    let requestId = getUserRequestId(requesters[i]["userId"], group["requests"]);
                    tableBody.appendChild(item);
                    item.innerHTML = "<td style=\"text-align:center; vertical-align: middle;\">"
                        + requesters[i]["firstName"][0].toUpperCase() + requesters[i]["firstName"].slice(1)
                        + " " + requesters[i]["lastName"][0].toUpperCase() + requesters[i]["lastName"].slice(1) + "</td>"
                        + "<td style=\"text-align:center; vertical-align: middle;\" onclick='switchToProfile(" + requesters[i]["userId"] + ")'>" + requesters[i]["username"] + "</td> <td>" + makeAcceptButton(requestId) + " </td> <td>" + makeDeclineButton(requestId) + "</td>";

                }
            }
        })

    })

}

function makeAcceptButton(id) {
    return "<button type=\"button\" id='acceptButton" + id + "' style='margin-top: 0.4rem;' class=\"btn btn-success\" onclick='acceptUser(" + id + ")'>Accept</button>";
}

function makeDeclineButton(id) {
    return "<button type=\"button\" id='declineButton" + id + "' style='margin-top: 0.4rem;' class=\"btn btn-danger\" onclick='declineUser(" + id + ")'>Decline</button>";


}

function acceptUser(id) {

    let url = "http://localhost:8762/groupms/requests/" + localStorage.getItem("userId") + "/" + id + "/true";
    return fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'DELETE'
    }).then(returned => {
        let acceptButton = document.getElementById("acceptButton" + id);
        acceptButton.disabled = true;
        acceptButton.innerHTML = "Accepted";
        let declineButton = document.getElementById("declineButton" + id);
        declineButton.disabled = true;
    })
        .catch(error => {
            internalServerError(error);
        })

}

function declineUser(id) {

    let url = "http://localhost:8762/groupms/requests/" + localStorage.getItem("userId") + "/" + id + "/false";
    return fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'DELETE'
    }).then(returned => {
        let acceptButton = document.getElementById("acceptButton" + id);
        acceptButton.disabled = true;
        let declineButton = document.getElementById("declineButton" + id);
        declineButton.disabled = true;
        declineButton.innerHTML = "Declined";
    })
        .catch(error => {
            internalServerError(error);
        })


}

function removeUser(id) {
    let url = "http://localhost:8762/groupms/groups/" + localStorage.getItem("groupId") + "/" + localStorage.getItem("userId") + "/member/" + id;
    return fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'DELETE'
    }).then(returned => {
        let acceptButton = document.getElementById("removeButton" + id);
        acceptButton.disabled = true;
        acceptButton.innerHTML = "Removed";
    })
        .catch(error => {
            internalServerError(error);
        })


}

function toggleBar() {
    getGroup(localStorage.getItem("groupId")).then(group => {
        let badge = document.getElementById("requestBadge");
        badge.classList.remove("badge-secondary", "badge-primary");
        if (group["requests"].length === 0)
            badge.classList.add("badge-secondary");
        else badge.classList.add("badge-primary");
        badge.innerHTML = group["requests"].length;
        $("#wrapper").toggleClass("toggled");
    });


}

function getRequesters(requests) {

    return getUsers(extractRequestUserIds(requests));
}

function getUserRequestId(userId, requests) {
    for (let i = 0; i < requests.length; i++) {
        if (requests[i]["userId"].toString() === userId.toString())
            return requests[i]["requestId"];
    }

}

function getMembers(members) {
    return getUsers(extractMemberUserIds(members));
}

function getUsers(userIds) {
    let url = "http://localhost:8762/userms/users/info";
    return fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'POST',
        body: userIds
    }).then(returned => returned)
        .then(returnedjson => returnedjson.json())
        .catch(error => {
            internalServerError(error);
        })
}

function extractMemberUserIds(userIds) {
    let ids = [];
    for (let i = 0; i < userIds.length; i++) {
        let composite = userIds[i]["compositeKey"];
        let userId = composite["userId"];
        ids.push(userId);
    }

    return JSON.stringify(ids);

}

function extractRequestUserIds(userIds) {
    let ids = [];
    for (let i = 0; i < userIds.length; i++) {
        let request = userIds[i];
        ids.push(request["userId"]);
    }

    return JSON.stringify(ids);

}

function changeGroupDescription() {
    let newDescription = document.getElementById("inputEditDescription").value.toString();
    let url = "http://localhost:8762/groupms/groups/" + localStorage.getItem("groupId") + "/user/" + localStorage.getItem("userId");
    let body = {
        description: newDescription
    };
    return fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'PATCH',
        body: JSON.stringify(body)
    }).then(returned => {
        refresh();
    }).catch(error => {
        internalServerError(error);
    })

}

function addMembersModal() {
    let wrapper = document.getElementById("memberModalWrapper");
    wrapper.innerHTML = "<div class=\"modal fade\" id=\"membersModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"membersModalTitle\" aria-hidden=\"true\">\n" +
        "                <div class=\"modal-dialog modal-dialog-scrollable\" role=\"document\">\n" +
        "                    <div class=\"modal-content\">\n" +
        "                        <div class=\"modal-header\">\n" +
        "                            <h5 class=\"modal-title\" id=\"membersModalTitle\">Members</h5>\n" +
        "                            <button type=\"button\" onclick='refresh()' class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
        "                                <span aria-hidden=\"true\">&times;</span>\n" +
        "                            </button>\n" +
        "                        </div>\n" +
        "                        <div class=\"modal-body\" id=\"memberWrapper\">\n" +
        "                            <table style='text-align: center; vertical-align: middle;' class=\"table table-borderless table-hover\">\n" +
        "                                <tbody id=\"memberTable\">\n" +
        "                                </tbody>\n" +
        "                            </table>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>";
}

function addRequestModal() {
    let wrapper = document.getElementById("requestModalWrapper");
    wrapper.innerHTML = "<div class=\"modal fade\" id=\"requestModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"membersModalTitle\" aria-hidden=\"true\">\n" +
        "                <div class=\"modal-dialog modal-dialog-scrollable\" role=\"document\">\n" +
        "                    <div class=\"modal-content\">\n" +
        "                        <div class=\"modal-header\">\n" +
        "                            <h5 class=\"modal-title\" id=\"membersModalTitle\">Requests</h5>\n" +
        "                            <button type=\"button\" onclick='refresh()' class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
        "                                <span aria-hidden=\"true\">&times;</span>\n" +
        "                            </button>\n" +
        "                        </div>\n" +
        "                        <div class=\"modal-body\" id=\"memberWrapper\">\n" +
        "                            <table style='text-align: center; vertical-align: middle;'  class=\"table table-borderless table-hover\">\n" +
        "\n" +
        "                                <tbody id=\"requestTable\" style=' text-align: center; \n" +
        "    vertical-align: middle;'>\n" +
        "                                </tbody>\n" +
        "                            </table>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>";

}

function addDescriptionModal() {
    let wrapper = document.getElementById("descriptionModalWrapper");
    wrapper.innerHTML = "<div class=\"modal fade\" id=\"descriptionModal\" tabindex=\"-1\" role=\"dialog\"\n" +
        "                     aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n" +
        "                    <div class=\"modal-dialog\" role=\"document\">\n" +
        "                        <div class=\"modal-content\">\n" +
        "                            <div class=\"modal-header\">\n" +
        "                                <h5 class=\"modal-title\" id=\"exampleModalLabel\">Change Description</h5>\n" +
        "                                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
        "                                    <span aria-hidden=\"true\">&times;</span>\n" +
        "                                </button>\n" +
        "                            </div>\n" +
        "                            <div class=\"modal-body\">\n" +
        "                                <h6>Current description: </h6>\n" +
        "                                <p id=\"modalDescription\"></p>\n" +
        "                                <form>\n" +
        "                                    <div class=\"form-group\">\n" +
        "                                        <label for=\"inputEditDescription\" class=\"control-label\" style=\"font-size:16px; font-weight:500;line-height:19.2px;\">New description:\n" +
        "                                        </label>\n" +
        "                                        <input type=\"text\" class=\"form-control\" id=\"inputEditDescription\"\n" +
        "                                               aria-describedby=\"emailHelp\">\n" +
        "                                    </div>\n" +
        "                                </form>\n" +
        "                            </div>\n" +
        "                            <div class=\"modal-footer\">\n" +
        "                                <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
        "                                <button type=\"button\" class=\"btn btn-primary\" onclick='changeGroupDescription()'>Save changes</button>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>";
    let description = document.getElementById("modalDescription");
    description.innerHTML = localStorage.getItem("description");
}

function addChangeNameModal() {
    let wrapper = document.getElementById("changeNameModalWrapper");
    wrapper.innerHTML = "<div class=\"modal fade\" id=\"changeNameModal\" tabindex=\"-1\" role=\"dialog\"\n" +
        "                     aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n" +
        "                    <div class=\"modal-dialog\" role=\"document\">\n" +
        "                        <div class=\"modal-content\">\n" +
        "                            <div class=\"modal-header\">\n" +
        "                                <h5 class=\"modal-title\" id=\"exampleModalLabel\">Rename Group</h5>\n" +
        "                                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
        "                                    <span aria-hidden=\"true\">&times;</span>\n" +
        "                                </button>\n" +
        "                            </div>\n" +
        "                            <div class=\"modal-body\">\n" +
        "                                <h5>Current Name: </h5>\n" +
        "                                <p id=\"modalGroupName\"></p>\n" +
        "                                <form>\n" +
        "                                    <div class=\"form-group required\">\n" +
        "                                        <label for=\"inputEditGroupName\" class=\"control-label\">New Name: </label>\n" +
        "                                        <input type=\"text\" class=\"form-control\" id=\"inputEditGroupName\"\n" +
        "                                               aria-describedby=\"emailHelp\" \n" +
        "                                               oninput=\"validateNewName(false)\">\n" +
        "                                        <div class=\"invalid-feedback\" id=\"groupNameFeedback\">\n" +
        "                                        </div>\n" +
        "                                    </div>\n" +
        "                                </form>\n" +
        "                            </div>\n" +
        "                            <div class=\"modal-footer\">\n" +
        "                                <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
        "                                <button type=\"button\" class=\"btn btn-primary\" onclick=\"validateNewName(true)\">Save\n" +
        "                                    changes\n" +
        "                                </button>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>";

    let groupName = document.getElementById("modalGroupName");
    groupName.innerHTML = localStorage.getItem("groupName");

}

function validateNewName(bool) {
    let groupName = document.getElementById("inputEditGroupName");
    let feedback = document.getElementById("groupNameFeedback");
    let url = "http://localhost:8762/groupms/groups/name/" + groupName.value.toString();

    groupName.classList.remove("is-invalid");
    groupName.classList.remove("is-valid");

    if ((groupName.value.toString().length === 0)) {
        groupName.classList.add("is-invalid");
        feedback.innerHTML = "Required field";
        return false;

    } else if (!groupName.value.toString().match("^[a-zA-Z]*$")) {
        groupName.classList.add("is-invalid");
        feedback.innerHTML = "Invalid group name";
        return false;

    } else {
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
        }).then(data => {
            if (data["status"] === 404) {
                groupName.classList.add("is-valid");
                if (bool)
                    submitGroupName();
                return true;
            } else {
                groupName.classList.add("is-invalid");
                feedback.innerHTML = "Group name is taken";
                return false;
            }
        }).catch(data => {
            if (data["status"] === 404) {
                groupName.classList.add("is-valid");
                if (bool)
                    submitGroupName();
                return true;
            } else {
                feedback.innerHTML = "Could not check availability of group name";
                return false;
            }
        });
    }
}

function submitGroupName() {
    let groupName = document.getElementById("inputEditGroupName").value.toString();
    let url = "http://localhost:8762/groupms/groups/" + localStorage.getItem("groupId") + "/user/" + localStorage.getItem("userId");
    let body = {
        name: groupName
    };
    return fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'PATCH',
        body: JSON.stringify(body)
    }).then(returned => {
        refresh();
    }).catch(error => {
        internalServerError(error);
    })
}

function sleep(milliseconds) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

$(window).resize(function () {
    let wrapper = document.getElementById("wrapper");
    if (window.innerWidth < 768)
        wrapper.classList.remove("toggled");
    else wrapper.classList.add("toggled");
})