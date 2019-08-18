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

    if (validatePhotoName && validateHashtagName() && validatePhotoInput())
        uploadPhoto();

}