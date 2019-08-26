function search() {
    let query = document.getElementById("searchQuery").value.toString();
    localStorage.setItem("search", query);
    window.location.href = "../html/searchResults.html";

}

function getSearchResults() {
    let query = localStorage.getItem("search").valueOf();

    getUserSearch(query).then(userResults => {
        getGroupSearch(query).then(groupResults => {
            getPhotoSearch(query).then(photoResults => {
                generatePhotoDisplay(photoResults);
                generateUserDisplay(userResults);
                generateGroupDisplay(groupResults);


            })
        })

    })

}

function generateUserDisplay(userResults) {

    let userTab = document.getElementById("userTab");
    let userNumber = document.getElementById("userNumber");
    userNumber.innerHTML = userResults.length;

    if (userResults.length === 0) {
        userNumber.classList.remove("badge-primary");
        userNumber.classList.add("badge-secondary");
        userTab.innerHTML = "<div class='row' style='text-align: center; padding:2rem;'><div class='col'><h5>No users found</h5></div> </div>"

    } else {
        let tableBody = document.getElementById("tableBody");

        for (let i = 0; i < userResults.length; i++) {
            if (userResults[i]["userId"] !== localStorage.getItem("userId")) {
                let item = document.createElement("tr");
                item.setAttribute("onclick", "switchToProfile(" + userResults[i]["userId"] + ")");
                tableBody.appendChild(item);
                item.innerHTML = "<td style=\"text-align:center\">" +
                    userResults[i]["firstName"][0].toUpperCase() + userResults[i]["firstName"].slice(1) + " "
                    + userResults[i]["lastName"][0].toUpperCase() + userResults[i]["lastName"].slice(1) + "</td>"
                    + "<td style=\"text-align:center;\"><a style='color: black; font-weight: 600; text-decoration: none;'>" + userResults[i]["username"] + "</a></td>";
            }
        }
    }
}

function generateGroupDisplay(groupResults) {
    let groupTab = document.getElementById("groupTab");
    let groupNumber = document.getElementById("groupNumber");
    groupNumber.innerHTML = groupResults.length;
    if (groupResults.length === 0) {
        groupNumber.classList.remove("badge-primary");
        groupNumber.classList.add("badge-secondary");
        groupTab.innerHTML = "<div class='row' style='text-align: center; padding:2rem;'><div class='col'><h5>No groups found</h5></div> </div>";
    } else {
        let tableBody = document.getElementById("groupTableBody");
        for (let i = 0; i < groupResults.length; i++) {
            if (groupResults[i]["userId"] !== localStorage.getItem("userId")) {
                let item = document.createElement("tr");
                item.setAttribute("onclick", "switchToGroup(" + groupResults[i]["id"] + ")");
                tableBody.appendChild(item);
                item.innerHTML = "<td style=\"text-align:center\"><a href='#' style='color:black; text-decoration: none;'></a>" + groupResults[i]["name"][0].toUpperCase() +
                    groupResults[i]["name"].slice(1)+ "</td>"
                    + "<td style=\"text-align:center\">" + groupResults[i]["description"] + "</td>"
                    + "<td style=\"text-align:center\">" + groupResults[i]["members"].length + "</td>";
            }
        }
    }
}

function getUserSearch(query) {
    let url = "http://localhost:8762/userms/users/search/" + query;
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

function getGroupSearch(query) {
    let url = "http://localhost:8762/groupms/groups/search/" + query;
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

function getPhotoSearch(query) {
    let url = "http://localhost:8762/photoms/photos/search/" + query;
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

function getGroup(id) {
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

function generatePhotoDisplay(photoResults) {
    let photoDiv = document.getElementById("photoTab");
    let photoNumber = document.getElementById("photoNumber");
    photoNumber.innerHTML = photoResults.length;

    if (photoResults.length === 0) {
        photoDiv.innerHTML = "<div class='row' style='text-align: center; padding:2rem;'><div class='col'><h5>No photos found</h5></div> </div>"
        photoNumber.classList.remove("badge-primary");
        photoNumber.classList.add("badge-secondary");
    } else {
        let bigRow = document.createElement("div");
        photoDiv.appendChild(bigRow);
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
        for (let i = 0; i < photoResults.length; i++) {
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
                makeSearchElementCard(photoResults[i], smallCol);
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
                console.log(e);
            }
        }


    }
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

function makeSearchElementCard(imageResponse, smallCol) {
    let card = document.createElement("div");
    card.classList.add("card");
    let img = document.createElement("img");
    img.setAttribute("src", "../images/" + imageResponse["name"]);
    img.classList.add("img-fluid", "rounded", "card-img-top");
    card.appendChild(img);
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
        let groupLink;
        if (imageResponse["groupId"] !== 0) {
            groupLink = document.createElement("a");
            groupLink.setAttribute("id", "groupLink");
            groupLink.setAttribute("onclick", "switchToGroup(" + imageResponse["groupId"] + ");");
            groupLink.setAttribute("href", "#");
            groupLink.setAttribute("style", "margin-left:0;");
            groupLink.classList.add("card-link", "text-muted");
            getGroup(imageResponse["groupId"]).then(
                data => {
                    groupLink.innerHTML = data["name"];
                    cardFooter.innerHTML = timestamp.innerHTML + " by " + userLink.outerHTML + " in " + groupLink.outerHTML;
                }
            )
        }
        card.appendChild(cardFooter);
        smallCol.appendChild(card);
    })

}
