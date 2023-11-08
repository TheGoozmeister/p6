function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

function getUserDatas () {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const submitButton = document.getElementById("submitButton");
    
    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Prénom: " + firstName.value);
        console.log("Nom: " + lastName.value);
        console.log("Email: " + email.value);
        console.log("Message: " + message.value);
    });
    
}

getUserDatas();