function uploadPhoto() {
    let url = "http://localhost:8762/photoms/photos/" + localStorage.getItem("userId");
    let formData = new FormData();
    let fileField = document.querySelector('input[type="file"]');
    let photoName = document.getElementById("photoName").value.toString();
    let hashtagName = document.getElementById("hashtagName").value.toString();
    formData.append('hashtag', hashtagName);
    formData.append("photoName", photoName);
    formData.append('file', fileField.files[0]);

    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': '*/*'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'POST',
        body: formData
    }).then(feedback => {
        document.location.reload();
    })
}

function uploadPhotoToGroup(groupId) {
    let url = "http://localhost:8762/photoms/photos/" + localStorage.getItem("userId") + "/group/" + groupId;
    let formData = new FormData();
    let fileField = document.querySelector('input[type="file"]');
    let photoName = document.getElementById("photoName").value.toString();
    let hashtagName = document.getElementById("hashtagName").value.toString();
    formData.append('hashtag', hashtagName);
    formData.append("photoName", photoName);
    formData.append('file', fileField.files[0]);

    fetch(url, {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token"),
            'Accept': '*/*'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer',
        method: 'POST',
        body: formData
    }).then(feedback => {
        document.location.reload();
    })

}

function validatePhotoInput() {
    if (document.getElementById("uploadedPhoto").files.length === 0) {
        console.log("no files selected");
        return false;
    }
    return true;

}

function validatePhotoName() {
    let inpObj = document.getElementById("photoName");
    let feedback = document.getElementById("photoNameFeedback");

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

function validateHashtagName() {
    let inpObj = document.getElementById("hashtagName");
    let feedback = document.getElementById("hashtagNameFeedback");

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

function validateAll() {

    let uploadButton = document.getElementById("uploadButton");
    uploadButton.disabled = true;
    uploadButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" +
        "        <span class=\"sr-only\">Uploading...</span>";

    if (validatePhotoName && validateHashtagName() && validatePhotoInput()) {
        let id = document.querySelector("select").value;
        if (id.toString() === "0")
            uploadPhoto();
        else uploadPhotoToGroup(id);
    } else {
        uploadButton.disabled = false;
        uploadButton.innerHTML = "Upload";
    }
}

function validateAllFromProfile(){
    let uploadButton = document.getElementById("uploadButton");
    uploadButton.disabled = true;
    uploadButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" +
        "        <span class=\"sr-only\">Uploading...</span>";

    if (validatePhotoName && validateHashtagName() && validatePhotoInput()) {
            uploadPhoto();
    } else {
        uploadButton.disabled = false;
        uploadButton.innerHTML = "Upload";
    }

}

function validateAllFromGroup(){
    let uploadButton = document.getElementById("uploadButton");
    uploadButton.disabled = true;
    uploadButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" +
        "        <span class=\"sr-only\">Uploading...</span>";

    if (validatePhotoName && validateHashtagName() && validatePhotoInput()) {
        uploadPhotoToGroup(localStorage.getItem("groupId"));
    } else {
        uploadButton.disabled = false;
        uploadButton.innerHTML = "Upload";
    }

}

function previewPhoto(element) {
    if (element.files && element.files[0]) {
        let reader = new FileReader();
        let col = document.getElementById("imgCol");
        col.innerHTML = "";
        let img = document.createElement("img");
        img.setAttribute("alt", "...");
        img.setAttribute("id", "previewImg");
        img.setAttribute("style", " max-width:180px;");
        col.appendChild(img);

        let buttonCol = document.getElementById("buttonCol");
        buttonCol.classList.add("col-md-3", "offset-md-1");
        buttonCol.classList.remove("col-md-4");
        let middleCol = document.getElementById("middleCol");
        middleCol.classList.add("col-md-1");
        middleCol.classList.remove("col-md-2");

        reader.onload = function (e) {
            $('#previewImg')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(element.files[0]);
    }

}
