function photographerTemplate(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const link = document.createElement('a');
        link.setAttribute("href", './photographer.html?id=' + id); 
        link.setAttribute("aria-label", "Accéder à la page de " + name)
        const article = document.createElement( 'article' );
        link.appendChild(article);
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.classList.add("profilePicture");
        img.setAttribute("alt", name)
        const h2 = document.createElement( 'h2' );
        h2.classList.add("name");
        h2.textContent = name;
        const h3 = document.createElement('h3');
        h3.classList.add("location");
        h3.textContent = city + ", " + country;
        const p = document.createElement('p');
        p.classList.add("tagline");
        p.textContent = tagline;
        const p2 = document.createElement('p');
        p2.classList.add("price");
        p2.textContent = price + "€/jour";
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(p);
        article.appendChild(p2);
        return (link);
    }
    return { name, picture, getUserCardDOM }
}