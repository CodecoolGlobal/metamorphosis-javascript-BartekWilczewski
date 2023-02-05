const dom = {
    isEmpty: function (el) {
        return el.children.length === 0;
    },
    hasClass: function (el, cls) {
        return el.classList.contains(cls);
    },
};

const ui = {
    mixedCardsContainer: null,
    slots: null,
    cards: null,
};

const game = {
    dragged: null,
};

function initDragAndDrop() {
    initElements();
    shuffleCards();
    initDragEvents();
}

function initElements() {
    ui.cards = document.querySelectorAll(".card");
    ui.slots = document.querySelectorAll(".drop-zone");
    ui.mixedCardsContainer = document.querySelector(".mixed-cards");

    ui.cards.forEach(function (card) {
        card.setAttribute("draggable", true);
    });
}

function shuffleCards() {
    const mixedCards = ui.mixedCardsContainer.children;

    for (let i = mixedCards.length; i >= 0; i--) {
        ui.mixedCardsContainer.appendChild(         mixedCards[(Math.random() * i) | 0]);
    }
}

function initDragEvents() {
    ui.cards.forEach(function (card) {
        initDraggable(card);
    });

    ui.slots.forEach(function (slot) {
        initDropzone(slot);
    });
}

function initDraggable(draggable) {
    draggable.setAttribute("draggable", true);
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("drag", dragHandler);
    draggable.addEventListener("dragend", handleDragEnd);
}

function initDropzone(dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}

function handleDragStart(e) {
    game.dragged = e.currentTarget;
    this.classList.add("dragged");
    let animalType = this.dataset.animalType;
    e.dataTransfer.setData(`type/dragged-${animalType}`, animalType);
    e.dataTransfer.setData("type/dragged", animalType);
    toggleDropZonesHighlight();
    //console.log("Drag start of", game.dragged);
}

function handleDragEnd() {
    //console.log("Drag end of", game.dragged);
    game.dragged = null;
    this.classList.remove("dragged");
    toggleDropZonesHighlight(false);
}

function dragHandler(e){
    //console.log("Dragging", e.currentTarget);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    if(canDropHere(e)){
        this.classList.add("over-zone");
        e.preventDefault();
    }else{
        this.classList.remove("active-zone");
    }
    //console.log("Drag enter of", e.currentTarget);
}

function handleDragLeave(e) {
    //console.log("Drag leave of", e.currentTarget);
    this.classList.remove("over-zone");
    this.classList.add("active-zone");
}

function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.currentTarget;
    //console.log("Drop of", dropzone);

    if (canDropHere(e)) {
        dropzone.appendChild(game.dragged);
        checkWin();   
        return;
    }
}

initDragAndDrop();

/*Highlight drop zones */
function toggleDropZonesHighlight(highlight = true){
    let dropZones = document.querySelectorAll(".drop-zone");
    for(let zone of dropZones){
        if(highlight)
            zone.classList.add("active-zone");
        else{
            zone.classList.remove("active-zone");
            zone.classList.remove("over-zone");
        }
    }
}

/*can I drop it here */
function canDropHere(e){
    return canDropInSlot(e)
    || canDropInDeck(e);
}

function canDropInDeck(e){
    return e.currentTarget.classList.contains("mixed-cards") && e.dataTransfer.types.includes("type/dragged");
}

function canDropInSlot(e){
    return e.currentTarget.classList.contains("card-slot") && e.currentTarget.children.length === 0 
    && e.dataTransfer.types.includes(`type/dragged-${e.currentTarget.parentElement.dataset.acceptedCards}`)
}

function checkWin(){
    let placedCards = document.querySelectorAll(".card-slot > .card");
    
    if(placedCards.length < 8)
        return;

    let lastOrderNo = 0;
    for(let placedCard of placedCards){
        if(placedCard.dataset.order <= lastOrderNo)
        {
            console.log(placedCard.dataset.order);
            console.log(lastOrderNo);
            console.log(placedCard.dataset.order <= lastOrderNo);
            return;
        }
        lastOrderNo = placedCard.dataset.order;
    }
    alert("you're osom");
}