function switchToGroup(groupId) {
    localStorage.setItem("groupId", groupId);
    window.location.href = "../html/group.html";
}

function loadGroup() {
    let id = localStorage.getItem("groupId");
    let container = document.getElementById("groupContainer");
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
        for (let i = 0; i < groupPhotos.length; i++) {
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

    })
        .catch(error => {
                internalServerError(error);
            }
        )
        .catch(error => {
            internalServerError(error);
        })
}

function makeGroupElementCard(imageResponse, col) {
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

function switchToUserGroups() {
    getUserGroups().then(groups => {

    })

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
    let url = "http://localhost:8762/groupms/groups/" + localStorage.getItem("userId");
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


