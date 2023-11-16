export function mediaCard(index, image, generalPath, images, photographerMedias) {

    function openLightbox(mediaArray, startIndex, generalPath) {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.setAttribute("aria-label", "image closeup view");
    
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerText = "X";
        closeButton.setAttribute('aria-label', 'Close dialog'); 
    
        closeButton.addEventListener('click', () => {
            lightbox.innerHTML='';
            lightbox.style.display = "none";
        });
    
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');
        
        const media = mediaArray[startIndex];
        let fullPath;
    
        if (media.video) {
            mediaContainer.classList.add('video-media');
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
            mediaContainer.classList.add('image-media');
            fullPath = generalPath + `/${media.image}`;
            const img = document.createElement('img');
            img.setAttribute('src', fullPath);
            img.classList.add('lightbox-image');
            img.setAttribute('alt', media.image)
            mediaContainer.appendChild(img);
        }
    
        const titleElement = document.createElement('div');
        titleElement.classList.add('media-title');
        titleElement.innerText = media.title;
        mediaContainer.appendChild(titleElement);
    
        const prevButton = document.createElement('button');
        prevButton.classList.add('prev-button');
        prevButton.innerHTML = '&lt;';
        prevButton.setAttribute('aria-label', "Previous image");
        
        const nextButton = document.createElement('button');
        nextButton.classList.add('next-button');
        nextButton.innerHTML = '&gt;';
        nextButton.setAttribute('aria-label', "Next image");
    
    
        let currentIndex = startIndex;
    
        function updateMedia(index) {
        const media = mediaArray[index];
        const mediaContainer = document.querySelector('.media-container');
    
        const video = mediaContainer.querySelector('.lightbox-video');
        const img = mediaContainer.querySelector('.lightbox-image');
    
        if (media.video) {
            if (video) {
                video.style.display = 'block';
            }
    
            if (img) {
                img.style.display = 'none';
            }
    
            let fullPath = generalPath + `/${media.video}`;
    
            if (video) {
                video.querySelector('source').setAttribute('src', fullPath);
            } else {
                const newVideo = document.createElement('video');
                newVideo.setAttribute('controls', 'true');
                newVideo.setAttribute('autoplay', 'true');
                newVideo.classList.add('lightbox-video');
                const source = document.createElement('source');
                source.setAttribute('src', fullPath);
                source.setAttribute('type', 'video/mp4');
                newVideo.appendChild(source);
                mediaContainer.appendChild(newVideo);
            }
        } else {
            if (video) {
                video.style.display = 'none';
            }
    
            if (img) {
                img.style.display = 'block';
                img.setAttribute('src', generalPath + `/${media.image}`);
            } else {
                const newImg = document.createElement('img');
                newImg.setAttribute('src', generalPath + `/${media.image}`);
                newImg.classList.add('lightbox-image');
                mediaContainer.appendChild(newImg);
            }
        }
    
        titleElement.innerText = media.title;
        currentIndex = index;
    }
        
        function handlePrevious() {
            const prevIndex = (currentIndex - 1 + mediaArray.length) % mediaArray.length;
            updateMedia(prevIndex);
        }
    
        function handleNext() {
            const nextIndex = (currentIndex + 1) % mediaArray.length;
            updateMedia(nextIndex);
        }
    
        prevButton.addEventListener('click', handlePrevious);
        nextButton.addEventListener('click', handleNext);
    
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                handlePrevious();
            } else if (event.key === 'ArrowRight') {
                handleNext();
            } else if (event.key === 'Escape') { // Ajoutez cette condition pour la touche "Échap"
                mediaContainer.innerHTML='';        
                lightbox.style.display = "none";
            }
        });
    
    
        lightbox.appendChild(prevButton);
        lightbox.appendChild(closeButton);
        lightbox.appendChild(mediaContainer);
        lightbox.appendChild(nextButton);
        document.body.appendChild(lightbox);
    }

    const {title, likes, date, price} = image;
    const imageCard = document.createElement('div');
    imageCard.classList.add('card');
    const imagesContainer = document.querySelector('.cardsContainer');

    let fullPath = generalPath + `/${image.image}`;
    
    const img = document.createElement('img');
    img.setAttribute("src", fullPath);
    img.classList.add("cardImage")
    img.setAttribute("alt", title);
    img.setAttribute('tabindex', '0');
    imageCard.appendChild(img);

    const mediaInfos = document.createElement('div');
    const mediaTitle = document.createElement('h3');
    const mediaLikes = document.createElement('div');
    mediaTitle.innerText = title;
    mediaLikes.innerHTML = `<span class="likesCount">${likes}</span>` + '<img src="assets/icons/heart.png" alt="likes" class="like" tabindex="0"    /> ';
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

    img.addEventListener('keydown', event => {
        if (event.key==="Enter") {
            if (image.video) {
                openLightbox(photographerMedias.videos, index, generalPath);
            } else {
                openLightbox(images, index, generalPath);
            }   
        }
    })

    return mediaCard;
}