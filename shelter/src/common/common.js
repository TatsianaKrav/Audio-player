import pets from "../../data/pets.json" with {type: 'json'}


const body = document.getElementsByTagName("body")[0];

function handleBurger(body) {
    const burger = document.getElementsByClassName('burger')[0];
    const menu = document.getElementsByClassName('menu')[0];


    burger.onclick = () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');

        if (burger.classList.contains("active")) {
            body.style.overflowY = "hidden";
            menu.style.visibility = 'visible';
        } else {
            body.style.overflowY = "auto";
            menu.style.visibility = 'hidden';
        }

        document.querySelectorAll("#menu-list *").forEach((item) => {
            item.addEventListener('click', () => hideMenu(menu, burger));
        });
    }

    menu.addEventListener('click', () => hideMenu(menu, burger));
}

function hideMenu(elem1, elem2) {
    elem1.classList.remove("active");
    elem2.classList.remove("active");
    body.style.overflowY = "auto";
}

function handlePopup(elem) {
    const cards = document.querySelectorAll('.card');
    const modal = document.querySelector('.modal-wrapper');
    const pet = pets.find(pet => pet.name === elem.dataset.name); // !!! set
    const petImgPath = `../../assets/images/pets-modal${pet.name}`;

    createPopup(modal, pet, petImgPath);


    cards.forEach(item => {
        item.onclick = () => {
            openPopup(modal);
        }
    })

    closePopup(modal);
}

function closePopup(modal) {
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => hidePopup(modal));

    modal.onclick = (e) => {
        if (e.target === modal) {
            hidePopup(modal);
        }
    }
}

function openPopup(modal) {
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    body.style.overflowY = "hidden";
}

function hidePopup(modal) {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    body.style.overflowY = "auto";
}


function showCard() {
    const fiendsCards = document.querySelector('.friends');
    const petsCards = document.querySelector('.pets-cards');

    createCard(fiendsCards);
    createCard(petsCards);
}

function createCard(parent) {
    if (!parent) return false;

    pets.forEach(pet => {

        let pathToImg = `../../assets/images/pets/pets-${pet.name.toLowerCase()}.png`;
        console.log(pathToImg);

        const card = createElement('div', 'card', '');
        card.setAttribute('data-name', pet.name);

        const image = createElement('div', 'pet-image', '');
        const img = createElement('img', '', '');
        img.setAttribute('src', pathToImg);
        img.setAttribute('alt', pet.name);
        image.append(img);

        const petName = createElement('div', 'pet-name', pet.name);
        const button = createElement('button', 'pet-btn btn', 'Learn more');

        card.append(image, petName, button);

        parent.append(card);
    })


}


function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerText = text;

    return element;
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function createPopup(element, pet, petImgPath) {
    const modalWindow = createElement('div', 'modal-window', '');
    element.appendChild(modalWindow);

    const modalImage = createElement('div', 'modal-image', '');
    const modalInfo = createElement('div', 'modal-info', '');
    const closeBtn = createElement('div', 'close-btn', '');
    modalWindow.append(modalImage, modalInfo, closeBtn);

    const image = createElement('img');
    image.setAttribute = ('src', petImgPath, '');
    image.setAttribute = ('alt', `${pet.name}`, '');
    modalImage.appendChild(image);

    const petName = createElement('p', "pet-name", `${pet.name}`, '');
    const petSpan = createElement('span', '', `${pet.type} - ${pet.breed}`, '');
    const petDescription = createElement('p', "pet-description", `${pet.description}`, '');
    const petInfo = createElement('div', "pet-info");
    const ulList = createElement('ul');


    for (let i = 0; i < 4; i++) {
        const info = ['age', 'inoculations', 'diseases', 'parasites'];
        let petField = info[i];

        const liElem = createElement('li', '', '');

        const image = createElement('img', '', '');
        image.setAttribute('src', "../../assets/images/dot.png");
        image.setAttribute('alt', 'dot');

        const spanElem = createElement('span', '', capitalize(petField) + ": ");
        const pInfo = createElement('p', '', pet[petField]);
        liElem.append(image, spanElem, pInfo);
        ulList.appendChild(liElem);
    }

    petInfo.appendChild(ulList);
    modalInfo.append(petName, petSpan, petDescription, petInfo);

    closeBtn.innerHTML = ` <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.42618 6.00003L11.7046 1.72158C12.0985 1.32775 12.0985 0.689213 11.7046 0.295433C11.3108 -0.0984027 10.6723 -0.0984027 10.2785 0.295433L5.99998 4.57394L1.72148 0.295377C1.32765 -0.098459 0.68917 -0.098459 0.295334 0.295377C-0.0984448 0.689213 -0.0984448 1.32775 0.295334 1.72153L4.57383 5.99997L0.295334 10.2785C-0.0984448 10.6723 -0.0984448 11.3108 0.295334 11.7046C0.68917 12.0985 1.32765 12.0985 1.72148 11.7046L5.99998 7.42612L10.2785 11.7046C10.6723 12.0985 11.3108 12.0985 11.7046 11.7046C12.0985 11.3108 12.0985 10.6723 11.7046 10.2785L7.42618 6.00003Z"
                                    fill="#292929" />
                            </svg>`

    return element;
}


showCard();
handleBurger(body);
handlePopup();


