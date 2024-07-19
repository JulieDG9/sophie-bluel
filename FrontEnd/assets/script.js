const apiUrl = "http://localhost:5678/api";
const token = sessionStorage.getItem("token");

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const editionBar = document.getElementById("editionBar");
const editBtn = document.getElementById("editBtn");
const bodyContainer = document.querySelector("body");
const logBtn = document.getElementById("logBtn");
const btnEdit = document.getElementById("editBtn");
const modalGallery = document.querySelector(".modalGallery");
const modal = document.getElementById("modal");
const modalBg = document.querySelector(".modalBg");
const crossClosed = document.querySelector(".fa-xmark");
const arrowLeft = document.querySelector(".fa-arrow-left");
const modalAddPhoto = document.querySelector(".modalAddPhoto");
const modalBtn = document.querySelector(".modalBtn");
const modalBtnPhoto = document.querySelector(".modalBtnPhoto");
const modalTitle = document.querySelector(".modalTitle");
const modalForm = document.getElementById("addPhotoForm");
const titleFileForm = document.getElementById("title");
const category = document.getElementById("category");

/* Création Galerie Photo sur page Accueil */
function createImg(img) {
  img.forEach((index) => {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const captionElement = document.createElement("figcaption");

    imgElement.src = index.imageUrl;
    imgElement.alt = index.title;
    captionElement.textContent = index.title;

    figureElement.dataset.categoryId = index.categoryId;
    figureElement.dataset.workId = index.id;

    figureElement.appendChild(imgElement);
    figureElement.appendChild(captionElement);

    gallery.appendChild(figureElement);
  });
}

/* Création des boutons de filtres de la Galerie Photo */
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

/* Fonction de filtre de la galerie */
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
    modal.style.display = "none";
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
  logBtn.classList.add("logOut");
  document.querySelector(".logOut").addEventListener("click", () => {
    sessionStorage.removeItem("token");
    logBtn.classList.remove("logOut");
  });
}

/* Création Galerie Photo (modal) */
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

    iconElement.addEventListener("click", () => {
      const imageId = figureElement.dataset.id;

      deleteImg(imageId)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression");
          }

          figureElement.style.display = "none";
          gallery.querySelector("[data-work-id]").style.display = "none";
        })
        .catch((error) => {
          alert("Une erreur s'est produite lors de la suppression de l'image.");
          console.error("erreur:", error);
        });
    });
  });
}

function deleteImg(id) {
  const url = `${apiUrl}/works/${id}`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

fetch(apiUrl + "/works")
  .then((response) => response.json())
  .then((modalImg) => {
    createModalGallery(modalImg);
  });

/* Ouverture de la modale sur la section Galerie Photo */

function modalOpen() {
  modal.style.display = "block";
  arrowLeft.style.visibility = "hidden";
  modalAddPhoto.style.display = "none";
  modalGallery.style.display = "flex";
  modalTitle.innerText = "Galerie Photo";
  modalBtn.style.display = "block";
  modalBtnPhoto.style.display = "none";
}

btnEdit.addEventListener("click", () => {
  modalOpen();
});

crossClosed.addEventListener("click", () => {
  modal.style.display = "none";
  clearForm();
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    clearForm();
  }
});

// modalBg.addEventListener("click", () => {
//   clearForm();
// });

/* section Ajout Photo de la modale   */

function modalAddPhotoView() {
  arrowLeft.style.visibility = "visible";
  modalGallery.style.display = "none";
  modalAddPhoto.style.display = "flex";
  modalTitle.innerText = "Ajout Photo";
  modalBtn.style.display = "none";
  modalBtnPhoto.style.display = "block";
}

modalBtn.addEventListener("click", () => {
  modalAddPhotoView();
});

arrowLeft.addEventListener("click", () => {
  modalOpen();
  modalGallery.style.display = "flex";
  arrowLeft.style.display = "hidden";
  clearForm();
});

const inputFile = document.getElementById("addPhoto");
const imgAddFile = document.querySelector(".imgAddFile");
inputFile.addEventListener("change", () => {
  const photo = inputFile.files;
  if (photo) {
    const fileReader = new FileReader();
    const previewImg = document.getElementById("previewImg");
    fileReader.onload = (event) => {
      previewImg.setAttribute("src", event.target.result);
    };
    fileReader.readAsDataURL(photo[0]);
    imgAddFile.style.display = "none";
    previewImg.style.display = "block";
    isFormValid(); // Écoute les changements sur l'élément inputFile
  }
});
// Écouter les changements sur les éléments de formulaire
titleFileForm.addEventListener("input", isFormValid);
category.addEventListener("change", isFormValid);

// Fonction pour vérifier si tous les champs du formulaire sont remplis
function isFormValid() {
  if (
    inputFile.files.length > 0 &&
    titleFileForm.value !== "" &&
    category.selectedIndex !== 0
  ) {
    modalBtnPhoto.classList.add("modalBtnActive");
    modalBtnPhoto.disabled = false;
  } else {
    modalBtnPhoto.classList.remove("modalBtnActive");
    modalBtnPhoto.disabled = true;
  }
}

// Affichage de l'image chargée dans le formulaire
const btnAddPhoto = document.querySelector(".btnAddPhoto");
btnAddPhoto.addEventListener("click", () => {
  previewImg.style.display = "flex";
});

// Fonction pour vider le formulaire
const previewImg = document.getElementById("previewImg");
function clearForm() {
  imgAddFile.style.display = "flex";
  previewImg.style.display = "none";
  titleFileForm.value = "";
  category.selectedIndex = 0;
}

/* Recupération de la liste de catégorie pour le form d'ajout photo (modal)   */

let selectCategorie;

fetch(apiUrl + "/categories")
  .then((response) => response.json())
  .then((data) => {
    selectCategorie = data;

    const textInputCategory = {
      id: 0,
      name: "",
    };

    selectCategorie.unshift(textInputCategory);

    for (let i = 0; i < selectCategorie.length; i++) {
      const categorieName = selectCategorie[i].name;

      const optionCategorie = document.createElement("option");
      optionCategorie.innerText = selectCategorie[i].name;
      optionCategorie.value = selectCategorie[i].id;

      category.appendChild(optionCategorie);
    }
  });

// Fonction d'ajout de work
modalBtnPhoto.addEventListener("click", async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append("image", inputFile.files[0]);
  formData.append("title", titleFileForm.value);
  formData.append("category", category.value);

  fetch(apiUrl + "/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Votre formulaire a été envoyé avec succès");
        return response.json();
      } else if (response.status === 400) {
        alert("Veuillez vérifier que tous les champs sont remplis");
      } else if (response.status === 401) {
        alert("Vous n'avez pas l'authorisation de publier");
      } else if (response.status === 500) {
        alert("Une erreur s'est produite, veuillez réessayer");
      }
    })

    .then(() => {
      createProject(project);
    })

    .catch((error) => {
      console.error("erreur:", error);
    });

  clearForm();
});

let state = {};
// Ajout de nouveau work
function createProject(project) {
  console.log(project);
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const figCaption = document.createElement("figcaption");

  image.src = project.imageUrl;
  figCaption.innerText = project.title;
  // Ajouter les éléments au DOM
  figure.appendChild(image);
  figure.appendChild(figCaption);
  gallery.appendChild(figure);

  state[project.id] = { figure };
}

// Fonction pour mettre à jour la galerie
function updateGallery() {
  fetch(apiUrl + "/works")
    .then((response) => response.json())
    .then((data) => {
      createModalGallery(data);
    })
    .catch((error) =>
      console.error("Erreur lors de la mise à jour de la galerie:", error)
    );
}
