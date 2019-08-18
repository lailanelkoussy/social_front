function getInitialFeed() {
    localStorage.setItem("pageNumber", "0");
    localStorage.setItem("pageSize", "2");
    loadFromAPI().then(response => {
            addElementsToPage(response);
        }
    )
        .catch(error => {
            internalServerError(error);
        })
}

function addElementsToPage(response) {
    if (!response.hasOwnProperty("status")) {
        let container = document.getElementById("homepageContainer");
        for (let i = 0; i < response.length; i++) {
            try {
                let row = document.createElement("div");
                row.classList.add("row", "mt-2");
                let col8 = document.createElement("div");
                col8.classList.add("col-lg-8", "offset-lg-2");
                row.appendChild(col8);
                container.appendChild(row);
                makeElementCard(response[i], col8);
            } catch (e) {
            }
        }
    } else {
        internalServerError();
    }
}

function makeElementCard(imageResponse, col) {
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

function loadFromAPI(pageNumber = 0, pageSize = 2) {
    let userId = localStorage.getItem("userId");
    let url = "http://localhost:8762/photoms/photos/user/" + userId + "/home/" + pageNumber + "/" + pageSize;
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

$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        let pageNumber = localStorage.getItem("pageNumber");
        localStorage.setItem("pageNumber", String(Number(pageNumber) + 1));

        loadFromAPI(Number(pageNumber) + 1, localStorage.getItem("pageSize")).then(
            response => {
                addElementsToPage(response);
            }
        ).catch(
            error => {
                internalServerError(error);
            }
        )
    }
});

function internalServerError(error) {
    console.log(error);
}
