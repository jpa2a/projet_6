
const gallery = document.querySelector(".gallery")
const categoriesUl = document.querySelector(".categories")
let selectedCat = 0

/* fetch */

async function getWorks(){
    const works = await fetch("http://localhost:5678/api/works")
    const data = await works.json()
    return data
}

async function getCategories(){
    const categories = await fetch("http://localhost:5678/api/Categories")
    const data = await categories.json()
    return data
}

/* fonction affichant les vignette en fonction de la categorie */

async function showWork(){
    const works = await getWorks()
    let i = 0
    gallery.innerHTML = ''
    if (selectedCat === 0){
    for (i = 0; i < works.length; i++) {
        const vignette = works[i]
        worksToHtml(vignette)
        }
    }
    else {  
        for (i = 0; i < works.length; i++) {
            const vignette = works[i]
            if (vignette.categoryId == selectedCat){
                worksToHtml(vignette)
            }
        }
   }
}

/* convertion de work vers html */

function worksToHtml(works){
    const imageElement = document.createElement("img")
    imageElement.src = works.imageUrl
    imageElement.alt = works.title
    const nomElement = document.createElement("figcaption")
    nomElement.innerText = works.title
    const figureTag = document.createElement("figure")
    figureTag.dataset.id = works.categoryId
    figureTag.classList.add("article")
    gallery.appendChild(figureTag)
    figureTag.appendChild(imageElement)
    figureTag.appendChild(nomElement)

}

/* creation bouton categorie + event listener */

async function showCategories(){
    const categories = await getCategories()
    let i = 0 
    for (i = 0; i < categories.length; i++) {
        const cat = categories[i]
        const liElement = document.createElement("li");
        liElement.innerText = cat.name
        liElement.dataset.id = cat.id
        liElement.classList.add("tri")
        categoriesUl.appendChild(liElement)
        liElement.addEventListener("click", () => {
            selectedCat = liElement.dataset.id
            showWork()
        }
        )
    }

}

/* reset categorie pour tout afficher sur bouton tout */

const resetTri = document.querySelector('.tri[data-id="0"]')
resetTri.addEventListener("click", () => {
    selectedCat = 0
    showWork()
}
)

showWork()
showCategories()
