const apiUrl = "http://localhost:5678/api";
const token = sessionStorage.getItem("token");

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const editionBar = document.getElementById("editionBar");
const editBtn = document.getElementById("editBtn");
const bodyContainer = document.querySelector("body");
const logBtn = document.getElementById("logBtn");
const modalGallery = document.querySelector(".modalGallery");
const modal = document.getElementById("modal");
const modalBg = document.querySelector(".modalBg");
const crossClosed = document.querySelector(".fa-xmark");
const arrowLeft = document.querySelector(".fa-arrow-left");
const modalAddPhoto = document.querySelector(".modalAddPhoto");
const modalBtn = document.querySelector(".modalBtn");
const modalBtnPhoto = document.querySelector(".modalBtnPhoto");
const modalBtnActive = document.querySelector("modalBtnPhoto.modalBtnActive");
const modalTitle = document.querySelector(".modalTitle");
const modalForm = document.getElementById("addPhotoForm");
const btnAddPhoto = document.querySelector(".btnAddPhoto");
const titleFileForm = document.getElementById("title");
const category = document.getElementById("category");
const previewImg = document.getElementById("previewImg"); // déplacement de la constante
const inputFile = document.getElementById("addPhoto"); // déplacement de la constante
const imgAddFile = document.querySelector(".imgAddFile"); // déplacement de la constante

// Variables pour stocker les données   // AJOUT
const worksCache = {};
const catCache = {};

// Fonction pour récupérér les works    // AJOUT

async function fetchData(endpoint, cache) {
  if (!cache[endpoint]) {
    cache[endpoint] = fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Le reseau ne repond pas");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Erreur:", error);
        delete cache[endpoint];
      });
  }
  return cache[endpoint];
}

async function fetchWorks() {
  return fetchData(`${apiUrl}/works`, worksCache);
}

async function fetchCategories() {
  return fetchData(`${apiUrl}/categories`, catCache);
}

function initialize() {
  modal.style.display = "none";
  gallery.innerHTML = "";
  modalGallery.innerHTML = "";

  fetchWorks()
    .then((works) => {
      works.forEach((work) => {
        createImg(work);
        createModalGallery(work);
      });
    })
    .catch((error) => console.error(error));

  if (!token) {
    fetchCategories().then((categories) => {
      console.log("Categories fetched:", categories);
      createFilterBtn({
        id: 0,
        name: "Tous",
      });
      categories.forEach((category) => {
        if (category.name) {
          console.log("Creating button for category:", category);
          createFilterBtn(category);
        }
      });

      editionBar.style.display = "none";
      editBtn.style.display = "none";
      bodyContainer.style.paddingTop = "0";
      logBtn.textContent = "login";
    });
  } else {
    logBtn.textContent = "logout";
    logBtn.classList.add("logOut");
    document.querySelector(".logOut").addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      sessionStorage.removeItem("token");
      logBtn.classList.remove("logOut");
      window.location.reload(); // AJOUT
    });
  }
}

/* Création Galerie Photo sur page Accueil */
function createImg(work) {
  // gallery.innerHTML = ""; //  AJOUT
  // works.forEach((index) => {
  const figureElement = document.createElement("figure");
  const imgElement = document.createElement("img");
  const captionElement = document.createElement("figcaption");
  imgElement.src = work.imageUrl;
  imgElement.alt = work.title;
  captionElement.textContent = work.title;
  figureElement.dataset.categoryId = work.categoryId;
  figureElement.dataset.workId = work.id;
  figureElement.appendChild(imgElement);
  figureElement.appendChild(captionElement);
  gallery.appendChild(figureElement);
}

document.addEventListener("DOMContentLoaded", () => {
  // event.stopPropagation();
  // event.preventDefault();
  initialize();
  // modal.style.display = "none";
});

/* Création des boutons de filtres de la Galerie Photo */
function createFilterBtn(filtre) {
  // filters.innerHTML = ""; // AJOUT
  const btnElement = document.createElement("button");
  btnElement.textContent = filtre.name;
  btnElement.classList.add("filters-btn");
  filters.appendChild(btnElement);
  btnElement.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
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

modalGallery.addEventListener("click", function (event) {
  event.stopPropagation();
  event.preventDefault();
});

/* Ouverture de la modale sur la section Galerie Photo */

editBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  event.preventDefault();
  console.log("editBtn clicked");
  modalOpen();
});

function modalOpen() {
  modal.style.display = "block";
  arrowLeft.style.visibility = "hidden";
  modalAddPhoto.style.display = "none";
  modalGallery.style.display = "flex";
  modalTitle.innerText = "Galerie Photo";
  modalBtn.style.display = "block";
  modalBtnPhoto.style.display = "none";
}

crossClosed.addEventListener("click", () => {
  // event.stopPropagation();
  // event.preventDefault();
  console.log("cross clicked");
  modal.style.display = "none";
  clearForm();
});

window.addEventListener("click", (event) => {
  // event.stopPropagation();
  // event.preventDefault();
  if (modal.style.display === "block") {
    if (event.target === modalBg) {
      // if (!modal.contains(event.target)) {
      // } && event.target == modal))
      modal.style.display = "none";
      clearForm();
      console.log("modal closed");
    }
  }
});

/* Création Galerie Photo (modal) */
function createModalGallery(work) {
  // works.forEach((index) => {
  const figureElement = document.createElement("figure");
  const imgElement = document.createElement("img");
  const iconElement = document.createElement("icon");
  iconElement.className = "fa-solid fa-trash-can";
  figureElement.appendChild(iconElement);
  imgElement.src = work.imageUrl;
  imgElement.width = 77;
  imgElement.height = 102;
  figureElement.classList.add("imgModal");
  figureElement.dataset.id = work.id;
  figureElement.appendChild(imgElement);
  modalGallery.appendChild(figureElement);
  // iconElement.addEventListener("click", () => {
  iconElement.addEventListener("click", async (event) => {
    event.stopPropagation();
    event.preventDefault();
    console.log("trash clicked");
    const imageId = figureElement.dataset.id;
    try {
      const response = await deleteImg(imageId);
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // deleteImg(imageId)
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error("Erreur lors de la suppression");
      //     }
      // Suppression de l'élément dans la modal
      figureElement.remove();

      // Suppression de l'élément correspondant dans la galérie principale
      const galleryItem = gallery.querySelector(`[data-work-id="${imageId}"]`);
      if (galleryItem) {
        galleryItem.remove();
      }
    } catch (error) {
      // })
      // .catch((error) => {
      alert("Une erreur s'est produite lors de la suppression de l'image.");
      console.error("erreur:", error);
    }
  });
}

//         });
//     });
//   });
// }

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

/* section Ajout Photo de la modale   */

modalBtn.addEventListener("click", (event) => {
  // event.stopPropagation();
  // event.preventDefault();
  modalAddPhotoView();
});

function modalAddPhotoView() {
  arrowLeft.style.visibility = "visible";
  modalGallery.style.display = "none";
  modalAddPhoto.style.display = "flex";
  modalTitle.innerText = "Ajout Photo";
  modalBtn.style.display = "none";
  modalBtnPhoto.style.display = "block";
}

arrowLeft.addEventListener("click", () => {
  modalOpen();
  modalGallery.style.display = "flex";
  arrowLeft.style.visibility = "hidden";
  clearForm();
});

// Affichage de l'image chargée dans le formulaire
btnAddPhoto.addEventListener("click", (event) => {
  event.stopPropagation();
  event.preventDefault();
  previewImg.style.display = "flex";
});

inputFile.addEventListener("change", (event) => {
  event.stopPropagation();
  event.preventDefault();
  const errorMessageAddPhoto = document.getElementById("errorMessageAddPhoto");
  const photo = inputFile.files[0];
  errorMessageAddPhoto.textContent = "";
  if (photo) {
    const fileType = photo.type;
    const fileSize = photo.size;
    const maxFileSize = 4 * 1024 * 1024;
    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(fileType)) {
      errorMessageAddPhoto.textContent =
        "Seuls les fichiers PNG et JPG sont autorisés.";
      // inputFile.value = "";
      imgAddFile.style.display = "flex";
      previewImg.style.display = "none";
    } else if (fileSize > maxFileSize) {
      errorMessageAddPhoto.textContent =
        "La taille du fichier ne doit pas dépasser 4 Mo.";
      // inputFile.value = "";
      imgAddFile.style.display = "flex";
      previewImg.style.display = "none";
    } else {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        previewImg.setAttribute("src", event.target.result);
      };
      fileReader.readAsDataURL(photo);
      imgAddFile.style.display = "none";
      previewImg.style.display = "block";
      isFormValid(); // Écoute les changements sur l'élément inputFile
    }
  }
});

// Écouter les changements sur les éléments de formulaire
titleFileForm.addEventListener("input", (event) => {
  event.preventDefault();
  event.stopPropagation();
  isFormValid(event);
});
category.addEventListener("change", (event) => {
  event.preventDefault();
  event.stopPropagation();
  isFormValid(event);
});

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

// Fonction pour vider le formulaire
function clearForm() {
  imgAddFile.style.display = "flex";
  previewImg.style.display = "none";
  titleFileForm.value = "";
  category.selectedIndex = 0;
}

/* Recupération de la liste de catégorie pour le form d'ajout photo (modal)   */
let selectCategorie;

fetchCategories().then((data) => {
  selectCategorie = data;
  const textInputCategory = {
    id: 0,
    name: "",
  };
  selectCategorie.unshift(textInputCategory);
  for (let i = 0; i < selectCategorie.length; i++) {
    const optionCategorie = document.createElement("option");
    optionCategorie.innerText = selectCategorie[i].name;
    optionCategorie.value = selectCategorie[i].id;
    category.appendChild(optionCategorie);
  }
});

// Fonction d'ajout de work
modalBtnPhoto.addEventListener("click", () => {
  // event.stopPropagation();
  // event.preventDefault();
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
        return response.json();
      } else if (response.status === 400) {
        alert("Veuillez vérifier que tous les champs sont remplis");
      } else if (response.status === 401) {
        alert("Vous n'avez pas l'authorisation de publier");
      } else if (response.status === 500) {
        alert("Une erreur s'est produite, veuillez réessayer");
      }
    })
    .then((work) => {
      createImg(work);
      createModalGallery(work);
    })
    .catch((error) => {
      console.error("erreur:", error);
    });
  clearForm();
});

let state = {};
// Ajout de nouveau work
function createWork(work) {
  console.log(work);
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const figCaption = document.createElement("figcaption");
  image.src = work.imageUrl;
  figCaption.innerText = work.title;
  // Ajout des éléments au DOM
  figure.appendChild(image);
  figure.appendChild(figCaption);
  gallery.appendChild(figure);
  state[work.id] = { figure };
}

// // Fonction pour mettre à jour la galerie
// function updateGallery(event) {
//   event.stopPropagation();
//   gallery.innerHTML = "";
//   modalGallery.innerHTML = "";

//   fetch(apiUrl + "/works")
//     .then((response) => response.json())
//     .then((work) => {
//       createImg(work);
//       createModalGallery(work);
//     })
//     .catch((error) =>
//       console.error("Erreur lors de la mise à jour de la galerie:", error)
//     );

//   modal.style.display = "none";
// }
