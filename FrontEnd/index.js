// Sélection de la galerie HTML
const gallery = document.querySelector('.gallery');
// Sélection de la nav Filters
const navFilters = document.querySelector('.filters-nav');

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
    const buttonFilters = document.createElement('button');
    buttonFilters.setAttribute("data-tag", category.name);
    buttonFilters.setAttribute("data-id", category.id);
    buttonFilters.innerText = category.name;
    navFilters.appendChild(buttonFilters);
}

// Cette fonction permet d'effacer tous les éléments enfant d'un élément parent dans le DOM
const dropElement = (parent_element) => {

    // Tant qu'il y a au moins un enfant
    while (parent_element.childNodes.length > 0) {

        // On efface le dernier élément, le précédent devient le dernier, jusqu'à 0 enfants
        parent_element.removeChild(parent_element.lastChild);
    }
}

// On récupère les works de l'API, 
//si le paramètre catégorie Id est renseigné, on affiche que les works correspondant à cette caégorie
const getWorks = async (categoryId) => {
    // On appelle l'API works
    await fetch("http://localhost:5678/api/works")
        //Si le fetch fonctionne on récupère les données en .json; Sinon on affiche une erreur
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Erreur dans la récupération des donnés de l'API");
            }
        })
        //On récupère chaque projet
        //Auxquels on applique la fonction createProject
        .then((project) => {

            // On efface tous les travaux pour avoir une page blanche
            dropElement(gallery);

            project.forEach((project) => {
                //si categoryId est vide, on affiche tout
                //si categoryId est renseigné, On filtre les works sur la catégorie, 
                if ((categoryId == project.category.id) || (categoryId == null)) {
                    createProject(project);
                }
            });
        })
}


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
            })
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
                    buttons.forEach((button) =>
                        button.classList.remove("is-active")
                    );
                    //puis on ajoute la classe active au bouton cliqué
                    this.classList.add("is-active");
                    // On récupère les works de l'API en fonction des categories
                    getWorks(categorieId);
                })
            })
        })
}

// de base, on affiche le getWorks sans parametre (on affiche tout) + on affiche les categories
async function main() {
    await getWorks();
    await getCategories();
}

main();