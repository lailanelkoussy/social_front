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

function makeGroupDropDown() {
    getUserGroups().then(groups => {
        let wrapper = document.getElementById("inputGroupSelect01");
        for (let i = 0; i < groups.length; i++) {
            let option = document.createElement("option");
            option.innerHTML = groups[i]["name"][0].toUpperCase() + groups[i]["name"].slice(1) ;
            option.setAttribute("value", groups[i]["id"]);
            wrapper.appendChild(option);
        }
    })
}

function resetPhotoUploadModal() {
    let form = document.getElementById("")
}

function refresh() {
    window.location.reload();
}