const apiUrl = "http://localhost:5678/api";
const token = sessionStorage.getItem("token");

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const editionBar = document.getElementById("editionBar");
const editBtn = document.getElementById("editBtn");
const bodyContainer = document.querySelector("body");
const logBtn = document.getElementById("logBtn");
const modalGallery = document.querySelector(".modalGallery");

function createImg(img) {
  img.forEach((index) => {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const captionElement = document.createElement("figcaption");

    imgElement.src = index.imageUrl;
    imgElement.alt = index.title;
    captionElement.textContent = index.title;

    figureElement.dataset.categoryId = index.categoryId;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(captionElement);

    gallery.appendChild(figureElement);
  });
}

function createFilterBtn(filtre) {
  const btnElement = document.createElement("button");
  btnElement.textContent = filtre.name;
  btnElement.classList.add("filters-btn");
  filters.appendChild(btnElement);
  btnElement.addEventListener("click", () => {
    filterGallery(filtre.id);

    document.querySelectorAll(".filters-btn").forEach((unclicked) => {
      unclicked.classList.remove("btn-clicked");
    });
    btnElement.classList.add("btn-clicked");
  });
}

function filterGallery(categoryId) {
  const figures = document.querySelectorAll(".gallery figure");
  figures.forEach((figure) => {
    if (categoryId === 0 || figure.dataset.categoryId == categoryId) {
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  });
}

fetch(apiUrl + "/works")
  .then((response) => response.json())
  .then((img) => {
    createImg(img);
  });
if (!token) {
  fetch(apiUrl + "/categories")
    .then((response) => response.json())
    .then((img) => {
      createFilterBtn({
        id: 0,
        name: "Tous",
      });
      img.forEach((filtre) => {
        createFilterBtn(filtre);
      });
      editionBar.style.display = "none";
      editBtn.style.display = "none";
      bodyContainer.style.paddingTop = "0";
      logBtn.textContent = "login";
    });
} else {
  logBtn.textContent = "logout";
}

function createModalGallery(modalImg) {
  modalImg.forEach((index) => {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const iconElement = document.createElement("icon");
    iconElement.className = "fa-solid fa-trash-can";

    figureElement.appendChild(iconElement);

    imgElement.src = index.imageUrl;
    imgElement.width = 77;
    imgElement.height = 102;
    figureElement.classList.add("imgModal");

    figureElement.dataset.id = index.id;

    figureElement.appendChild(imgElement);

    modalGallery.appendChild(figureElement);
  });
}

fetch(apiUrl + "/works")
  .then((response) => response.json())
  .then((modalImg) => {
    createModalGallery(modalImg);
  });
