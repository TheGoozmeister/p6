import { mediaCard } from "../templates/media.js";


function getPhotographerDatas(photographersDatas, photographerId) {  
    for (let photographer of photographersDatas.photographers) {
        if (photographer.id==photographerId) {
            return photographer;
        } 
    }
}

function addPhotograherToDOM(photographerDatas) {
    const photographerHeader = document.querySelector('.photograph-header');
    const photographerInfos = document.createElement('div');
    const photographerImage = document.createElement('img');
    photographerInfos.classList.add('photographerInfos');
    photographerInfos.setAttribute('tabindex', '0');
    photographerImage.setAttribute('src', `assets/photographers/${photographerDatas.portrait}`);
    photographerImage.classList.add('profilePicture');
    photographerImage.setAttribute('alt', photographerDatas.name)
    photographerImage.setAttribute('tabindex', '0');

    photographerInfos.innerHTML = `
        <h1>${photographerDatas.name}</h1>
        <h3>${photographerDatas.city}, ${photographerDatas.country}</h3>
        <div class="tagline">${photographerDatas.tagline}</div>
    `

    photographerHeader.insertBefore(photographerInfos, document.querySelector('.contact_button'));
    photographerHeader.appendChild(photographerImage);

    const photographerName = document.getElementById('photographerName');

    photographerName.innerText = photographerDatas.name;

    const modal = document.getElementById("contact_modal");
    modal.setAttribute('aria-label', 'Contact me ' + photographerName);
}

async function getPhotographersDatas() {
    const response = await fetch("./data/photographers.json");
    if (response.ok) {
        const photographersDatas = await response.json();
        return photographersDatas;
    }
}

function getPhotographerId() {
    const photographerUrl = new URL(window.location.href);
    return photographerUrl.searchParams.get("id");
}

function getPhotographerName(photographer) {
    const fullName = photographer.name;
    const partName = fullName.split(' ');
    return partName[0];
}

function getPhotographerMedias(photographersDatas, photographerId) {
    
    let photographerMedias = {
        images: [],
        videos: []
    };
    for (let media of photographersDatas.media) {
        if (media.photographerId==photographerId) {
            if (media.video) {
                photographerMedias.videos.push(media);
                const thumbnail = media;
                thumbnail.image = thumbnail.video.replace("mp4", "jpg");
                photographerMedias.images.push(thumbnail);
            } else if (media.image) {
                photographerMedias.images.push(media);
            }
        }
    }
    return photographerMedias;
}

function addMediasToDOM(photographerMedias, photographerName) {
    let images=[];
    if (!Array.isArray(photographerMedias)) { // si cest deja un tableau, cest quon 'est en train de mettre à jour
        images = photographerMedias.images; 
    } else {
        images = photographerMedias;
    }
    const generalPath = `assets/images/${photographerName}`;

    for (let [index, image] of images.entries()) {
        mediaCard(index, image, generalPath, images, photographerMedias);
    }
}

function initializeTotalLikes(photographerMedias) {
    let likesCount = 0;
    for (let media of photographerMedias.images) {
        likesCount+=media.likes;
    }
    for (let media of photographerMedias.videos) {
        likesCount+=media.likes;
    }
    return likesCount;
}

function handleLikes() {

    const likeButtons = document.querySelectorAll(".like");
    
    likeButtons.forEach((button) => {
        button.addEventListener("click", function(event) {
            const likesCount = event.target.closest(".cardLikes").querySelector(".likesCount");
            const currentLikes = parseInt(likesCount.textContent);
            likesCount.textContent = (currentLikes + 1).toString();
            const actualTotalLike = document.querySelector('.totalLikesAmount');
            const currentTotalLikes = parseInt(actualTotalLike.innerText);
            actualTotalLike.innerText = (currentTotalLikes + 1).toString();
        });
        button.addEventListener('keydown', (event)=>{
            if (event.key === "Enter") {
                const likesCount = event.target.closest(".cardLikes").querySelector(".likesCount");
                const currentLikes = parseInt(likesCount.textContent);
                likesCount.textContent = (currentLikes + 1).toString();
                const actualTotalLike = document.querySelector('.totalLikesAmount');
                const currentTotalLikes = parseInt(actualTotalLike.innerText);
                actualTotalLike.innerText = (currentTotalLikes + 1).toString();
            }
        })
    });
}

function addLikesAndPrice(totalLikes, photographerDatas) {
    const price = photographerDatas.price;
    const likesAndPrice = document.createElement('div');
    likesAndPrice.classList.add('likesAndPrice');
    likesAndPrice.innerHTML = `
        <div class="totalLikes">
            <div class="totalLikesAmount">${totalLikes}</div>
            <div class="totalLikesImg">
                <img src="assets/icons/heart.png" alt="likes" id="like"/>
            </div>
        </div>
        <div id="price">${price}€ / jour</div>
    `;
    document.querySelector("body").appendChild(likesAndPrice);
}

function updateMediaDisplay(sortedMediaArray, photographerName) {
    const mediaContainer = document.querySelector('.cardsContainer'); 
    mediaContainer.innerHTML = '';
    addMediasToDOM(sortedMediaArray, photographerName);
    handleLikes();
}

function sortDropdown() {
    const selectedOption = document.getElementById('selected-option');
    const popularity = document.getElementById('popularity');
    const title = document.getElementById('title');
    const date = document.getElementById('date');
    const options = document.querySelector('.dropdown-content');

    selectedOption.addEventListener("keydown", (event)=>{
        if (event.key === "Enter") {
            event.preventDefault();     
            options.style.display = 'block';
            popularity.focus();
        } else if (event.key === "Escape") {
            options.style.display = "none";  
        }
    })

    popularity.addEventListener('keydown', (event) => {
        if (event.key === "ArrowDown") {
            title.focus();
        } else if (event.key === "Escape") {
            event.preventDefault();
            options.style.display = "none";
        }
    })

    title.addEventListener('keydown', (event) => {
        if (event.key === "ArrowDown") {
            date.focus();
        } else if (event.key === "ArrowUp") {
            popularity.focus();
        } else if (event.key === "Escape") {
            options.style.display = "none";
        }
    })

    date.addEventListener('keydown', (event) => {
        if (event.key === "ArrowUp") {
            title.focus();
        } else if (event.key === "Escape") {
            options.style.display = "none";
        }
    })
    
    popularity.addEventListener("click", function() {
        selectedOption.innerHTML = '<span class="dropdownTitle">Popularité</span><span id="dropdownIcon">^</span>'
    })
    title.addEventListener("click", function() {
        selectedOption.innerHTML = '<span class="dropdownTitle">Titre</span><span id="dropdownIcon">^</span>'
    })
    date.addEventListener("click", function() {
        selectedOption.innerHTML = '<span class="dropdownTitle">Date</span><span id="dropdownIcon">^</span>'
    })

    
}

async function main() {

    const photographerId = getPhotographerId();
    const photographersDatas = await getPhotographersDatas();
    const photographerDatas =  getPhotographerDatas(photographersDatas, photographerId);
    addPhotograherToDOM(photographerDatas);
    const photographerName = getPhotographerName(photographerDatas);
    let photographerMedias = getPhotographerMedias(photographersDatas, photographerId);
    addMediasToDOM(photographerMedias, photographerName);
    let totalLikes = initializeTotalLikes(photographerMedias);
    addLikesAndPrice(totalLikes, photographerDatas)
    handleLikes();


    const popularityButton = document.getElementById('popularity');
    const titleButton = document.getElementById('title');    
    let sortedMediaArray;
    popularityButton.addEventListener('click', () => {
        sortedMediaArray = photographerMedias.images.sort((a,b) => b.likes - a.likes);    
        updateMediaDisplay(sortedMediaArray, photographerName);
    });
    
    titleButton.addEventListener('click', () => {
        sortedMediaArray = photographerMedias.images.sort((a,b) => a.title.localeCompare(b.title));
        updateMediaDisplay(sortedMediaArray, photographerName);
    });
    sortDropdown();
}

main();