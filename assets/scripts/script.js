const gallery = document.querySelector(".gallery")
const categoriesUl = document.querySelector(".categories")
const login = document.getElementById("login")
const logout = document.getElementById("logout")
const projets = document.getElementById("projets")
const edition = document.querySelector(".edition")
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
        for (i = 0; i < works.length; i++) {
            const vignette = works[i]
            if (vignette.categoryId == selectedCat){
                worksToHtml(vignette)
            }
            else {
                if (selectedCat == 0){
                    worksToHtml(vignette)
                }
            }
        }
}

/* convertion de work vers html */

function worksToHtml(works){
    const Html = `<figure class="article" data-id="${works.categoryId}">
                     <img src= ${works.imageUrl} alt ="${works.title}">
                     <figcaption>${works.title}</figcaption>`
   // console.log(Html)
    gallery.innerHTML += Html
}

/* creation bouton categorie */

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
    }
    const buttons = document.querySelectorAll(".tri")
    const buttonsArray = Array.from(buttons)
    buttonsArray.forEach(selectedButton)
}

/* event listener sur les boutons */

function selectedButton(item){
    item.addEventListener("click", () => {
        const inactiveButton = document.querySelector(".active")
        inactiveButton.classList.remove('active')
        selectedCat = item.dataset.id
        item.classList.add("active")
        
        showWork()
    })
}

showWork()
checkToken()

function checkToken(){
    window.addEventListener("load", () => {
        const token = localStorage.getItem("token")
        if (token){
            console.log("ca marche")
            admin()
        }
        else{
            showCategories()
        }
    })
}

function admin(){
    categoriesUl.innerHTML = ''
    login.classList.add("hidden")
    logout.classList.remove("hidden")
    edition.classList.remove("hidden")
    //const edition = `<div class="edition">
    //                <i class="fa-regular fa-pen-to-square"></i>Mode edition</div>`
    const header = document.querySelector("header")
    //header.innerHTML += edition
    header.style.marginTop = "6rem"
    const edit = `<span><i class="fa-regular fa-pen-to-square"></i>modifier</span>`
    projets.innerHTML += edit

}


logout.addEventListener("click", () => {
        localStorage.removeItem("token")
        window.location.href = 'index.html'
})
    
