var activeProfile = document.querySelector("#activeProfile");
var activeSettings = document.querySelector("#activeSettings");
var editButton = document.querySelector("#editButton");
var submitButton = document.querySelector("#submitButton");
var inputUsername = document.querySelector("#username");
var inputEmail = document.querySelector("#email");
var inputContactNo = document.querySelector("#contactNo");
var editDiv = document.querySelector("#editDiv");

activeProfile.addEventListener("click", function () {
    if (activeSettings.classList.contains("active")) {
        activeProfile.classList.add("active");
        activeSettings.classList.remove("active");
        settingsDiv.style.display = "none";
        editDiv.style.display = "block";
    };
});

activeSettings.addEventListener("click", function () {
    if (activeProfile.classList.contains("active")) {
        activeSettings.classList.add("active");
        activeProfile.classList.remove("active");
        editDiv.style.display = "none";
        settingsDiv.style.display = "block";
    };
});

editButton.addEventListener("click", function () {
    inputUsername.removeAttribute("readonly");
    inputEmail.removeAttribute("readonly");
    editButton.style.display = "none";
    submitButton.style.display = "block";
});

//find images edit form

// var imagesEditForm = document.getElementById("imagesEditForm");
// imagesEditForm.addEventListener("submit", function (event) {
//     //find length of uploaded images 
//     var imageUploads = document.getElementById("imageUpload").files.length;
//     //find total no of existing imaged
//     var existingImgs = document.querySelectorAll(".imageDeleteCheckbox").length;
//     //find total no of possible deletions
//     var imgDeletions = document.querySelectorAll(".imageDeleteCheckbox:checked").length;
//     //figure out if form can be submitted or not
//     var newTotal = existingImgs - imgDeletions + imageUploads;
//     if (newTotal > 5) {
//         event.preventDefault();
//         var removalAmt = newTotal - 5;
//         alert(`You need to remove atleast ${removalAmt} image ${removalAmt === 1 ? 's' : ''}!`);
//     }
// });

function checkPasswordMatch() {
    var password = $("#password").val();
    var confirmPassword = $("#retypedpassword").val();

    if (password != confirmPassword)
        $("#divCheckPasswordMatch").html("Passwords do not match!");
    else {
        $("#divCheckPasswordMatch").html("Passwords match.");
        $("#register").removeAttribute("disabled");
    }
}

$(document).ready(function () {
    $("#retypedpassword").keyup(checkPasswordMatch);
});


