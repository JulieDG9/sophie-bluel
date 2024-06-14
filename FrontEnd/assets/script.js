const gallery = document.querySelector(".gallery");

// const url = "http://localhost:5678/api/works";
// fetch(url)
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    function createImg(data) {
      data.forEach((index) => {
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const captionElement = document.createElement("figcaption");

        imgElement.src = index.imageUrl;
        imgElement.alt = index.title;
        captionElement.textContent = index.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(captionElement);

        gallery.appendChild(figureElement);
      });
    }
    createImg(data);
  });
