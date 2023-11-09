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
    photographerImage.setAttribute('src', `assets/photographers/${photographerDatas.portrait}`);
    photographerImage.classList.add('profilePicture');
    photographerImage.setAttribute('alt', photographerDatas.name)

    photographerInfos.innerHTML = `
        <h1>${photographerDatas.name}</h1>
        <h3>${photographerDatas.city}, ${photographerDatas.country}</h3>
        <div class="tagline">${photographerDatas.tagline}</div>
    `

    photographerHeader.insertBefore(photographerInfos, document.querySelector('.contact_button'));
    photographerHeader.appendChild(photographerImage);

    const photographerName = document.getElementById('photographerName');

    photographerName.innerText = photographerDatas.name;
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
                console.log(photographerMedias);
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
    console.log(images);
    const imagesContainer = document.createElement('div');
    imagesContainer.classList.add('cardsContainer')
    const generalPath = `assets/images/${photographerName}`;

    for (let [index, image] of images.entries()) {
        const {title, likes, date, price} = image;
        const imageCard = document.createElement('div');
        imageCard.classList.add('card');

        let fullPath = generalPath + `/${image.image}`;
        
        const img = document.createElement('img');
        img.setAttribute("src", fullPath);
        img.classList.add("cardImage")
        img.setAttribute("alt", title);
        imageCard.appendChild(img);

        const mediaInfos = document.createElement('div');
        const mediaTitle = document.createElement('h3');
        const mediaLikes = document.createElement('div');
        mediaTitle.innerText = title;
        mediaLikes.innerHTML = `<span class="likesCount">${likes}</span>` + '<img src="assets/icons/heart.png" alt="likes" class="like"/>';
        mediaInfos.classList.add('cardInfos');
        mediaTitle.classList.add('cardTitle');
        mediaLikes.classList.add('cardLikes');
        mediaInfos.appendChild(mediaTitle);
        mediaInfos.appendChild(mediaLikes);
        imageCard.appendChild(mediaInfos);

        imagesContainer.appendChild(imageCard);

        img.addEventListener('click', () => {
            if (image.video) {
                openLightbox(photographerMedias.videos, index, generalPath);
            } else {
                openLightbox(images, index, generalPath);
            }
        });
    }
    const body = document.querySelector("body");
    body.appendChild(imagesContainer);
}

function initializeTotalLikes(photographerMedias) {
    let likesCount = 0;
    for (let media of photographerMedias.images) {
        likesCount+=media.likes;
    }
    for (let media of photographerMedias.videos) {
        likesCount+=media.likes;
    }
    console.log(likesCount);
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

function openLightbox(mediaArray, startIndex, generalPath) {
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerText = "X";

    closeButton.addEventListener('click', () => {
        lightbox.style.display = "none";
    });

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media-container');

    const media = mediaArray[startIndex];
    let fullPath;

    if (media.video) {
        fullPath = generalPath + `/${media.video}`;
        const video = document.createElement('video');
        video.setAttribute('controls', 'true');
        video.setAttribute('autoplay', 'true');
        video.classList.add('lightbox-video');
        const source = document.createElement('source');
        source.setAttribute('src', fullPath);
        source.setAttribute('type', 'video/mp4');
        video.appendChild(source);
        mediaContainer.appendChild(video);
    } else {
        fullPath = generalPath + `/${media.image}`;
        const img = document.createElement('img');
        img.setAttribute('src', fullPath);
        img.classList.add('lightbox-image');
        mediaContainer.appendChild(img);
    }

    const titleElement = document.createElement('div');
    titleElement.classList.add('media-title');
    titleElement.innerText = media.title;
    mediaContainer.appendChild(titleElement);

    const prevButton = document.createElement('button');
    prevButton.classList.add('prev-button');
    prevButton.innerHTML = '&lt;';

    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');
    nextButton.innerHTML = '&gt;';

    let currentIndex = startIndex;

    function updateMedia(index) {
        const media = mediaArray[index];
        let fullPath;
    
        if (media.video) {
            fullPath = generalPath + `/${media.video}`;
            const video = mediaContainer.querySelector('.lightbox-video');
            const img = mediaContainer.querySelector('.lightbox-image');
    
            if (video) {
                video.querySelector('source').setAttribute('src', fullPath);
            } else {
                // Créez un nouvel élément vidéo et ajoutez-le à la lightbox
                const newVideo = document.createElement('video');
                newVideo.setAttribute('controls', 'true');
                newVideo.setAttribute('autoplay', 'true');
                newVideo.classList.add('lightbox-video');
                const source = document.createElement('source');
                source.setAttribute('src', fullPath);
                source.setAttribute('type', 'video/mp4');
                newVideo.appendChild(source);
                mediaContainer.appendChild(newVideo);
    
                if (img) {
                    // Masquez l'élément image s'il existe
                    img.style.display = 'none';
                }
            }
        } else {
            fullPath = generalPath + `/${media.image}`;
            const img = mediaContainer.querySelector('.lightbox-image');
            if (img) {
                img.setAttribute('src', fullPath);
                img.style.display = 'block'; // Assurez-vous que l'élément image est visible
            } else {
                // Créez un nouvel élément image et ajoutez-le à la lightbox
                const newImg = document.createElement('img');
                newImg.setAttribute('src', fullPath);
                newImg.classList.add('lightbox-image');
                mediaContainer.appendChild(newImg);
            }
        }
        titleElement.innerText = media.title;
        currentIndex = index;
    }
    

    prevButton.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + mediaArray.length) % mediaArray.length;
        updateMedia(prevIndex);
    });

    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % mediaArray.length;
        updateMedia(nextIndex);
    })

    lightbox.appendChild(prevButton);
    lightbox.appendChild(closeButton);
    lightbox.appendChild(mediaContainer);
    lightbox.appendChild(nextButton);
    document.body.appendChild(lightbox);
}

function updateMediaDisplay(sortedMediaArray, photographerName) {
    const mediaContainer = document.querySelector('.cardsContainer'); 
    mediaContainer.remove();
    console.log(sortedMediaArray)
    addMediasToDOM(sortedMediaArray, photographerName);
}

function sortDropdown() {
    const selectedOption = document.getElementById('selected-option');
    const popularity = document.getElementById('popularity');
    const title = document.getElementById('title');
    const date = document.getElementById('date');

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
        console.log("Trier par popularité");
        sortedMediaArray = photographerMedias.images.sort((a,b) => b.likes - a.likes);    
        console.log(sortedMediaArray);
        updateMediaDisplay(sortedMediaArray, photographerName);
    });
    
    titleButton.addEventListener('click', () => {
        console.log("Trier par titre");
        sortedMediaArray = photographerMedias.images.sort((a,b) => a.title.localeCompare(b.title));
        console.log(sortedMediaArray)
        updateMediaDisplay(sortedMediaArray, photographerName);
    });
    sortDropdown();
}

main();