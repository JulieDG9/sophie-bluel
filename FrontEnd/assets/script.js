const apiUrl = "http://localhost:5678/api";

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

function createImg(data) {
  data.forEach((index) => {
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
  btnElement.addEventListener("click", () => {});
}

fetch(apiUrl + "/works")
  .then((response) => response.json())
  .then((data) => {
    createImg(data);
  });

fetch(apiUrl + "/categories")
  .then((response) => response.json())
  .then((data) => {
    createFilterBtn({
      id: 0,
      name: "Tous",
    });
    data.forEach((filtre) => {
      createFilterBtn(filtre);
    });
  });
