/* --- Sélection des éléments du DOM --- */
//Get gallery Mes Projets
const gallery = document.querySelector(".gallery");
//Get nav Filters
const navFilters = document.querySelector(".filters-nav");

//Get modal aside
const asideModal = document.querySelector("#modal");
//Get modal-box-galerie-photo = Modale 1
const galerieModal = document.querySelector(".modal-box-galerie-photo");
//Get gallery de la modale 1
const modalGallery = document.querySelector(".modal-gallery");
//Get modal-box-ajout-photo = Modale 2
const ajoutModal = document.querySelector(".modal-box-ajout-photo");

//Fonction pour créer un projet dans la galerie
const createProject = (project) => {
  const figureProject = document.createElement("figure");
  figureProject.setAttribute("data-tag", project.category.name);
  figureProject.setAttribute("data-id", project.id);

  const imageProject = document.createElement("img");
  imageProject.src = project.imageUrl;
  imageProject.alt = project.title;

  const figcaptionProject = document.createElement("figcaption");
  figcaptionProject.innerText = project.title;

  figureProject.appendChild(imageProject);
  figureProject.appendChild(figcaptionProject);

  gallery.appendChild(figureProject);
};

// Fonction pour créer un bouton dans la nav des filtres
const createButton = (category) => {
  const buttonFilters = document.createElement("button");
  buttonFilters.setAttribute("data-tag", category.name);
  buttonFilters.setAttribute("data-id", category.id);
  buttonFilters.innerText = category.name;
  navFilters.appendChild(buttonFilters);
};

// Fonction permet d'effacer tous les éléments enfant d'un élément parent dans le DOM
const dropElement = (parent_element) => {
  // Tant qu'il y a au moins un enfant
  while (parent_element.childNodes.length > 0) {
    // On efface le dernier élément, le précédent devient le dernier, jusqu'à 0 enfants
    parent_element.removeChild(parent_element.lastChild);
  }
};

// On récupère les works de l'API,
//si le paramètre catégorie Id est renseigné,
//on affiche que les works correspondant à cette caégorie
//Sinon on affiche tout
const getWorks = async (categoryId) => {
  // On appelle l'API works
  await fetch("http://localhost:5678/api/works")
    //Si le fetch fonctionne on récupère les données en .json; Sinon on affiche une erreur
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Erreur dans la récupération des données de l'API");
      }
    })
    //On récupère chaque projet
    //Auxquels on applique la fonction createProject
    .then((project) => {
      // On efface tous les travaux pour avoir une page blanche
      dropElement(gallery);
      dropElement(modalGallery);

      project.forEach((project) => {
        //si categoryId est vide, on affiche tout
        //si categoryId est renseigné, On filtre les works sur la catégorie,
        if (categoryId == project.category.id || categoryId == null) {
          createProject(project);
          createModalProject(project);
        }
      });
    });
};

// On récupère les categories de filtres de l'API
const getCategories = async (category) => {
  await fetch("http://localhost:5678/api/categories")
    //Si le fetch fonctionne on récupère les données en .json; Sinon on affiche une erreur
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Erreur dans la récupération des donnés de l'API");
      }
    })
    //On récupère chaque categorie
    .then((category) => {
      //Auxquelles on applique la fonction createButton
      category.forEach((category) => {
        createButton(category);
      });
    })

    .then((filtre) => {
      //on récupère les boutons
      const buttons = document.querySelectorAll(".filters-nav button");
      buttons.forEach((button) => {
        //Pour chaque bouton, au clic
        button.addEventListener("click", function () {
          // Get (et Affiche le data-tag)
          let buttonTag = button.dataset.tag;
          console.log(buttonTag);

          //Get catégorie id
          let categorieId = button.getAttribute("data-id");
          console.log(categorieId);

          //on enlève, pour chaque bouton la classe is-active
          buttons.forEach((button) => button.classList.remove("is-active"));
          //puis on ajoute la classe active au bouton cliqué
          this.classList.add("is-active");
          // On récupère les works de l'API en fonction des categories
          getWorks(categorieId);
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// de base, on affiche le getWorks sans parametre (on affiche tout) + on affiche les categories
async function main() {
  await getWorks();
  await getCategories();
}

//A l'ouverture de la page, on execute le getWorks et getCategories
main();

/* --- Fonctions du mode admin --- */
// On récupère le token
const token = window.sessionStorage.getItem("token");
//console.log(token);

// Fonction pour la déconnection admin
const logOut = () => {
  //suppression du token de sessionStorage
  sessionStorage.removeItem("token");
  console.log(token);
  //redirection vers la page de connexion
  window.location.href = "/login.html";
};

// Fonction pour créer les éléments du mode admin
const adminPage = () => {
  //on récupère le body
  const body = document.querySelector("body");
  //on récupère l'image de Sophie
  const imgSophie = document.querySelector("#introduction img");
  //on récupère le titre de la gallerie
  const galleryTitle = document.querySelector("#portfolio h2");

  //on ajoute la barre du mode edition
  body.insertAdjacentHTML(
    "afterbegin",
    `<div class="edit-bar">
        <span class="edit"><i class="fa-regular fa-pen-to-square"></i> Mode édition</span>
        <button>publier les changements</button>
    </div>`
  );

  //on ajoute le bouton modifier à l'image
  imgSophie.insertAdjacentHTML(
    "afterend",
    `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`
  );
  //on ajoute le bouton modifier au titre de la gallerie
  galleryTitle.insertAdjacentHTML(
    "afterend",
    `<a id="open-modal" href="#modal" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`
  );
  //on récupère le bouton login du menu nav
  document.getElementById(
    "logButton"
  ).innerHTML = `<a href="login.html">logout</a>`; //on remplace login par logout

  //on enlève les filtres
  document.querySelector(".filters-nav").style.display = "none";

  //on récupère le bouton modifier qui ouvre la modale
  const modalLink = document.querySelector("#open-modal");
  //au click on exécute la fonction openModal
  modalLink.addEventListener("click", openModal);

  //récupération du bouton "logout"
  const logButton = document.querySelector("#logButton");
  //au clic sur le bouton on execute la fonction logout
  logButton.addEventListener("click", logOut);
};

// Fonction pour supprimer un projet de la modale
const deleteWork = (workID) => {
  //si ok
  fetch("http://localhost:5678/api/works/" + workID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  });

  //maj affichage des projets : getWorks();
  getWorks();
};

// Fonction pour créer un projet dans la modale
const createModalProject = (project) => {
  const figureModalProject = document.createElement("figure");
  figureModalProject.setAttribute("data-id", project.id);

  const imageModalProject = document.createElement("img");
  imageModalProject.src = project.imageUrl;
  imageModalProject.alt = project.title;
  imageModalProject.classList.add("modal-project-img");

  const trashIcon = document.createElement("img");
  trashIcon.src = "assets/icons/trash-icon.png";
  trashIcon.classList.add("trash-icon");
  trashIcon.setAttribute("data-id", project.id);
  let trashIconID = trashIcon.getAttribute("data-id");

  trashIcon.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("coucou");
    console.log(trashIconID);
    // confirmDelete();
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?") == true) {
      deleteWork(trashIconID);
    }
    // deleteWork();
  });

  const figcaptionModalProject = document.createElement("figcaption");
  figcaptionModalProject.innerText = "éditer";

  figureModalProject.appendChild(imageModalProject);
  figureModalProject.appendChild(trashIcon);
  figureModalProject.appendChild(figcaptionModalProject);

  modalGallery.appendChild(figureModalProject);
};

// FORMULAIRE AJOUT PROJET
// Séléction des éléments du formulaire
const formAddWork = document.querySelector(".ajout-box");
const inputElement = document.querySelector("#title");
const selectElement = document.querySelector("#category");
const fileInputElement = document.querySelector("#image");
const submitButton = document.querySelector("#valider-button");
const inputFile = document.querySelector("#image");

// Afficher la prévisualisation de l'image à télécharger
const checkFile = (e) => {
  e.preventDefault();

  // Constante et fonction pour la lecture de l'image
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    previewImage.src = reader.result;
  });
  // Lecture de l'image
  reader.readAsDataURL(inputFile.files[0]);

  // Appararition et apparence attendue
  const picture = document.querySelector(".upload-photo-box");
  const previewImage = document.createElement("img");
  previewImage.setAttribute("id", "preview_image");

  picture.appendChild(previewImage);
};
// Verifier les champs et autoriser validation
const checkForm = () => {
  if (
    inputElement.value !== "" &&
    selectElement.value !== "" &&
    fileInputElement.value !== ""
  ) {
    submitButton.style.backgroundColor = "#1D6154";
    submitButton.style.color = "#ffffff";
  }
};

// Listener des actions des éléments du formulaire
inputFile.addEventListener("change", checkFile);
inputElement.addEventListener("input", checkForm);
selectElement.addEventListener("input", checkForm);
fileInputElement.addEventListener("change", checkForm);

// Ajouter un nouveau projet
const addWork = () => {
  // Récupération des saisies pour la création du nouvel élément
  const getPhoto = document.getElementById("image").files[0];
  //console.log(getPhoto);
  const getTitle = document.getElementById("title").value;
  // console.log(getTitle);
  const getCategory = document.getElementById("category").value;
  //console.log(getCategory);
  //const getCategoryID = getCategory.options[getCategory.selectedIndex].getAttribute("data-id");
  // console.log(getCategoryID);

  // Construction du formData à envoyer
  let formData = new FormData();
  formData.append("image", getPhoto);
  formData.append("title", getTitle);
  formData.append("category", getCategory);
  console.log(formData);
  for (let pair of formData.entries()) {
    console.log(pair[0] + " - " + pair[1]);
  }

  // Appel de la fonction fetch avec toutes les informations nécessaires
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  }).then((response) => {
    if (response.ok) {
      //getWorks();
      console.log("Requete acceptée");
    } else {
      console.log("Erreur dans la récupération des donnés de l'API");
    }
  });
};

// Fonction pour vérifier si tous les éléments requis ont une valeur
const validateForm = (e) => {
  e.preventDefault();

  // cibler les messages
  const errMessImg = document.querySelector("#error-img");
  const errMessTitle = document.querySelector("#error-title");
  const errMessCat = document.querySelector("#error-category");

  // condition de validation
  if (
    inputElement.value !== "" &&
    selectElement.value !== "" &&
    fileInputElement.value !== ""
  ) {
    addWork();
    // console.log("projet ajouté");
  }

  // Affichage messages remplissage formulaire
  if (inputFile.value == "") {
    errMessImg.innerHTML = "Image obligatoire";
  } else {
    errMessImg.innerHTML = "";
  }
  if (inputElement.value == "") {
    errMessTitle.innerHTML = "Titre obligatoire";
  } else {
    errMessTitle.innerHTML = "";
  }
  if (selectElement.value == "") {
    errMessCat.innerHTML = "Catégorie obligatoire";
  } else {
    errMessCat.innerHTML = "";
  }
};

// Ouverture de la modale
const openModal = () => {
  //Active aside
  asideModal.classList.remove("modal-non-active");
  //Active modal 1
  galerieModal.classList.remove("modal-non-active");

  //Au click sur "Ajouter une photo", modale 2
  const addButton1 = document.querySelector("#add-photo-button1");
  addButton1.addEventListener("click", (event) => {
    //ajout modal-non-active sur galerie box
    galerieModal.classList.add("modal-non-active");
    //remove modal-non-active sur ajout box
    ajoutModal.classList.remove("modal-non-active");
  });

  //Au click sur bouton "Valider", modale 2
  document
    .querySelector("#valider-button")
    .addEventListener("click", validateForm);

  //Au click sur "Supprimer la galerie"
  const deleteGalery = document.querySelector("#delete-galery");
  deleteGalery.addEventListener("click", function (event) {
    event.preventDefault();

    // confirmDelete();
    if (confirm("Êtes-vous sûr de vouloir supprimer la galerie?") == true) {
      deleteAllWorks(); // a definir
    }
  });

  //Bouton back, reviens sur modale 1
  const backIcon = document.querySelector(".back-icon");
  backIcon.addEventListener("click", (event) => {
    //ajout modal-non-active sur galerie box
    galerieModal.classList.remove("modal-non-active");
    //remove modal-non-active sur ajout box
    ajoutModal.classList.add("modal-non-active");
  });
  //Fermeture de la modale sur croix
  const closeIcon = document.querySelector(".close-icon");
  closeIcon.addEventListener("click", closeModal);
  //Fermeture de la modale sur aside
  document.getElementById("modal").addEventListener("click", (event) => {
    if (event.target === document.getElementById("modal")) {
      closeModal();
    }
  });
  getWorks();
};

// Fonction fermeture de la modale au clic sur l'icone OU en dehors de la modale
const closeModal = () => {
  asideModal.classList.add("modal-non-active");
  galerieModal.classList.add("modal-non-active");
  ajoutModal.classList.add("modal-non-active");
};

// si le token est stocké, on appelle la fonction adminPage et on affiche les éléments admin
if (token !== null) {
  adminPage();
}
