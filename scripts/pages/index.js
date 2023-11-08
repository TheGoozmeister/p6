async function getPhotographers() {
    
    const response = await fetch("./data/photographers.json");
    if (response.ok) {
        const photographersData = await response.json();
        return photographersData.photographers;
    } else {
        console.log("Failed to fetch photographers data.");
        return [];
    }
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {

    const  photographers  = await getPhotographers();
    displayData(photographers);
}

init();

