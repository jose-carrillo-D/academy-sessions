'use strict'

const cardContainer = document.querySelector(".card-container");
const cards = cardContainer.querySelectorAll('.card');
cards.forEach((card, i) => card.addEventListener('click', () => {
    //Remove Open CSS class from all cards
    cards.forEach(existingCard => existingCard.classList.remove('open'));
    //Add Open CSS class to clicked card
    card.classList.add('open');
    //Re-estructure gridCSS
    let template = new Array(cards.length).fill("1fr");
    template[i] = "2fr";
    template = template.join(" ");
    cardContainer.style.gridTemplateColumns = template;

}));