const apiUrl = "http://localhost:5678/api";

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

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
  filters.appendChild(btnElement);
  btnElement.addEventListener("click", () => {
    filterGallery(filtre.id);

    // btnElement.onclick = function () {
    btnElement.style.backgroundColor = "#1d6154";
    btnElement.style.color = "white";
    //   };
  });

  btnElement.addEventListener("blur", () => {
    filterGallery(filtre.id);

    btnElement.style.backgroundColor = "";
    btnElement.style.color = "";
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
  });
