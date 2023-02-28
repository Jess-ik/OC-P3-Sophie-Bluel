

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

    


