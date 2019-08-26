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
            option.innerHTML = groups[i]["name"][0].toUpperCase() + groups[i]["name"].slice(1);
            option.setAttribute("value", groups[i]["id"]);
            wrapper.appendChild(option);
        }
    })
}

function refresh() {
    window.location.reload();
}

function deletePhoto(id) {
    let url = "http://localhost:8762/photoms/photos/" + id + "/user/" + localStorage.getItem("userId");

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
        window.location.reload();
    })
}

function setAsProfilePicture(id) {
    let url = "http://localhost:8762/userms/users/" + localStorage.getItem("userId") + "/profilepicture/" + id;

    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'PUT'
    }).then(response => {
        window.location.reload();
    })


}

function validateNewGroupCreationName() {

    let groupName = document.getElementById("inputGroupNameCreation");
    let feedback = document.getElementById("groupNameCreationFeedback");
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
                return true;
            } else {
                groupName.classList.add("is-invalid");
                feedback.innerHTML = "Group name is taken";
                return false;
            }
        }).catch(data => {
            if (data["status"] === 404) {
                groupName.classList.add("is-valid");
                return true;
            } else {
                feedback.innerHTML = "Could not check availability of group name";
                return false;
            }
        });
    }
}

function submitGroupCreation() {
    validateNewGroupCreationName().then(whatever => {
        let groupName = document.getElementById("inputGroupNameCreation");
        if (groupName.classList.contains("is-valid")) {
            let uploadButton = document.getElementById("createGroupButton");
            uploadButton.disabled = true;
            uploadButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" +
                "        <span class=\"sr-only\">Creating...</span>";
            let groupDescription = document.getElementById("inputCreationDescription").value.toString();

            let url = "http://localhost:8762/groupms/groups/";
            let body = {
                name: groupName.value.toString(),
                description: groupDescription,
                creatorId: localStorage.getItem("userId")
            };
            fetch(url, {
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem("token"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer',
                method: 'POST',
                body: JSON.stringify(body)
            }).then(info => {
                getGroupByName(groupName.value.toString()).then(group => {
                    switchToGroup(group["id"]);
                });
            }).catch(error => {
                internalServerError(error);
                uploadButton.disabled = false;
                uploadButton.innerHTML = "Create Group";
            })
        }
    });
}

function getGroupByName(groupName) {
    let getUrl = "http://localhost:8762/groupms/groups/name/" + groupName;
    return fetch(getUrl, {
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
    }).then(returnedjson => returnedjson.json())
}