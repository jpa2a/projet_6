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
    const header = document.querySelector("header")
/*     const edition = `<div class="edition">
                    <i class="fa-regular fa-pen-to-square"></i>Mode edition</div>`
    header.innerHTML += edition */
    header.style.marginTop = "6rem"
    const edit = `<span class="editionModal"><i class="fa-regular fa-pen-to-square"></i>modifier</span>`
    projets.innerHTML += edit
    const editionModal = document.querySelector(".editionModal")
    console.log(editionModal)
    editionModal.addEventListener("click", () => {
        modalDel.showModal()
        showWorkModal()
    })

}

logout.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.href = 'index.html'
})

// modals

const modalDel = document.querySelector("[data-modal]")
const modalAdd = document.querySelector("[data-modal-add]")
const returnBtn = document.querySelector(".modal__return")
const closeModalBtn = document.querySelector(".modalDel .modal--close")
const closeModalBtn2 = document.querySelector(".modalAdd .modal--close")
const addImgModalBtn = document.querySelector(".addImg")
const galleryModal = document.querySelector(".modal__content")

console.log(addImgModalBtn)
addImgModalBtn.addEventListener("click", () => {
    modalDel.close()
    showCategoriesForm()
    modalAdd.showModal()
})
returnBtn.addEventListener("click", () => {
    modalAdd.close()
    modalDel.showModal()
})

closeModalBtn.addEventListener("click", () => {
    modalDel.close()
})

closeModalBtn2.addEventListener("click", () => {
    modalAdd.close()
})

async function showWorkModal(){
    const works = await getWorks()
    let i = 0
    galleryModal.innerHTML = ''
        for (i = 0; i < works.length; i++) {
            const vignette = works[i]
                worksToHtmlModal(vignette)   
        }
}

async function showCategoriesForm(){
    const categories = await getCategories()
    let i = 0 
    const selectCat = document.getElementById("categories")
    selectCat.innerHTML = ''
    for (i = 0; i < categories.length; i++) {
        const cat = categories[i]
        
        categoriesOptions = `<option value="${cat.id}">${cat.name}</option>`
        selectCat.innerHTML += categoriesOptions
    }
}


function worksToHtmlModal(works){
    const Html = `<div class="modal__image" data-del="${works.id}">
                     <img src= ${works.imageUrl} alt ="${works.title}"></div>
                     `
   // console.log(Html)
    galleryModal.innerHTML += Html
}



    
