// Sélection de la galerie HTML
const gallery = document.querySelector('.gallery');
// Suppression de la galerie HTML
gallery.innerHTML = '';

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

// On récupère les works de l'API
fetch("http://localhost:5678/api/works")

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
        project.forEach((project) => {
            createProject(project);
        });
    })

//// FILTRES ////   
// Sélection de la nav Filters
const navFilters = document.querySelector('.filters-nav');

// Fonction pour créer un bouton dans la nav des filtres
const createButton = (category) => {
    const buttonFilters = document.createElement('button');
    buttonFilters.setAttribute("data-tag", category.name);
    buttonFilters.setAttribute("data-id", category.id);
    buttonFilters.innerText = category.name;
    navFilters.appendChild(buttonFilters);
}

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
        //on affiche tous les projets
        const projects = document.querySelectorAll(".gallery figure");
        projects.forEach((figure) => {
            figure.style.display = 'inline';          
        })
        
    })

    .then((filtration) => {
        //on récupère les boutons
        const buttons = document.querySelectorAll(".filters-nav button");
        buttons.forEach((button) => {
            //Pour chaque bouton, au clic
            button.addEventListener("click", function () {
                // Get et Affiche le data-tag
                const buttonTag = button.dataset.tag;
                console.log(buttonTag);
                //on récupère les projets
                const projects = document.querySelectorAll(".gallery figure");
                console.log(projects)

                projects.forEach((figure) => {
                    //pour chaque figure de projet on recupere son tag
                    console.log(figure.getAttribute("data-tag"))

                    //si le projet a le meme tag que le button cliqué
                    if (figure.getAttribute("data-tag") === buttonTag) {
                        //on affiche le projet
                        figure.style.display = 'inline';
                    } else {
                        //on masque les projets hors categorie
                        figure.style.display = 'none';
                    }
                });
            })
            // On récupère le bouton Tous
            const boutonTous = document.querySelector('button[data-tag="Tous"]');
            //Pour le bouton Tous, au clic
            boutonTous.addEventListener("click", function () {
                //on récupère les projets faites plus haut
                const projects = document.querySelectorAll(".gallery figure");
                projects.forEach((figure) => {
                    figure.style.display = 'inline';
                })
            })
        })
        
    })


    // Il va falloir appliquer les filtres
        // si button data-id=1 (objets) alors afficher les figureProject avec attribut data-id = 1
        // si button data-id=2 (appartements) alors afficher les figureProject avec attribut data-id = 2
        // si button data-id=3 (hotels et restaurants)alors afficher les figureProject avec attribut data-id = 3
        // Trouver un moyen d'afficher le button "tous" par defaut - si on reclique dessus, refaire apparaitre tous les projets




