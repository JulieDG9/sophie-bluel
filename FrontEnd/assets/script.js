const apiUrl = "http://localhost:5678/api";

const gallery = document.querySelector(".gallery");

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

fetch(apiUrl + "/works")
  .then((response) => response.json())
  .then((data) => {
    createImg(data);
  });
