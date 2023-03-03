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


// On récupère les works de l'API
const getWorks = (category) => {
    // On appelle l'API works
    fetch("http://localhost:5678/api/works")
        //Si le fetch fonctionne on récupère les données en .json
        .then((response) => response.json())
        //On récupère chaque projet
        //Auxquels on applique la fonction createProject
        .then((project) => {
            project.forEach((project) => {
                createProject(project);
            });            
        })       
}
// On execute la fonction getWorks
getWorks()



// On récupère les categories de filtres de l'API
fetch("http://localhost:5678/api/categories")
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
                const buttonTag = button.dataset.tag;
                console.log(buttonTag);
                
                //on enlève, pour chaque bouton la classe is-active
                buttons.forEach((button) =>
                    button.classList.remove("is-active")
                );
                //puis on ajoute la classe active au bouton cliqué
                this.classList.add("is-active");
            })
                
           
            // si buttonTag === projects categorie.name
            // alors createProject
        })

    })