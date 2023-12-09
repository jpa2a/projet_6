const gallery = document.querySelector(".gallery")
const categoriesUl = document.querySelector(".categories")
const login = document.getElementById("login")
const logout = document.getElementById("logout")
const projets = document.getElementById("projets")
const edition = document.querySelector(".edition")
const token = localStorage.getItem("token")


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

/* check if token exist */

function checkToken(){
    window.addEventListener("load", () => {
        if (token){
            console.log("ca marche")
            admin()
        }
        else{
            showCategories()
        }
    })
}

/* interface admin si token exist */

function admin(){
    categoriesUl.innerHTML = ''
    login.classList.add("hidden")
    logout.classList.remove("hidden")
    edition.classList.remove("hidden")
    const header = document.querySelector("header")
    header.style.marginTop = "6rem"
    const edit = `<span class="editionModal"><i class="fa-regular fa-pen-to-square"></i>modifier</span>`
    projets.innerHTML += edit
    const editionModal = document.querySelector(".editionModal")
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
const formModal = {image :"", title:"",category:""}

/* close modal if click outside */

function CloseModalClickOutside(){
    const selectModal = document.querySelectorAll(".modalBox")
    const selected = Array.from(selectModal)
    selected.forEach((element) => {
        element.addEventListener("click", (event) => {
            if(event.target == element){
                element.close()
            }

        })

    }
    )
}

CloseModalClickOutside()

/* event listeners pour ouvrir et fermer les modales */

addImgModalBtn.addEventListener("click", () => {
    modalDel.close()
    showCategoriesForm()
    modalAdd.showModal()
    
})
returnBtn.addEventListener("click", () => {
    modalAdd.close()
    showWorkModal()
    modalDel.showModal()
})

closeModalBtn.addEventListener("click", () => {
    modalDel.close()
})

closeModalBtn2.addEventListener("click", () => {
    modalAdd.close()
})

/* MODALE 1 */ 
/* afficher les vignettes dans la premiere modale */

async function showWorkModal(){
    const works = await getWorks()
    let i = 0
    galleryModal.innerHTML = ''
        for (i = 0; i < works.length; i++) {
            const vignette = works[i]
                worksToHtmlModal(vignette)  
  
        }
        const img = document.querySelectorAll(".modal__image")
        const imgArray = Array.from(img)
        imgArray.forEach(delImg)
    
}


function worksToHtmlModal(works){
    const Html = `<div class="modal__image" data-del="${works.id}">
                     <img src= ${works.imageUrl} alt ="${works.title}"><i class="fa-solid fa-trash-can"></i></div>
                     `
    galleryModal.innerHTML += Html

   
}

/* supprimer une entrée de work lorsqu'on sur click la vignette */

async function delImg(item){
    item.addEventListener("click", () => {
        
        const deleteItem = parseInt(item.dataset.del)

            if(confirm("Supprimer cet element ?")){
                fetch("http://localhost:5678/api/works/" + deleteItem, {
                    method: "DELETE",
                    headers: { "Authorization": "Bearer " + token }, 
                }) 
                showWork()
                showWorkModal()
            }
        
    })
}

/* MODAL 2 */

/* afficher les categories dans le formulaire */

async function showCategoriesForm(){
    const categories = await getCategories()
    let i = 0 
    const selectCat = document.getElementById("categories")
    selectCat.innerHTML = ''
    unselectedCategorie = `<option value="0"></option>`
    selectCat.innerHTML += unselectedCategorie
    for (i = 0; i < categories.length; i++) {
        const cat = categories[i]
       
        categoriesOptions = `<option value="${cat.id}">${cat.name}</option>`
        selectCat.innerHTML += categoriesOptions
    }
}

const formImage = document.querySelector(".form__addPhoto")
const imgFileBtn = document.getElementById("imgFile")
const formTitre = document.getElementById("titre")
const formCategorie = document.getElementById("categories")

/* remplacement image form */

 imgFileBtn.addEventListener('change', event => {
    const files = event.target.files;
    const file = files[0];
    newImg = URL.createObjectURL(file)
    const filler = document.querySelector(".form__filler")
    const textsu = document.querySelector(".form__subtext")
    const labbtn = document.querySelector(".form__btn")
    if((filler) && (textsu) && (labbtn)){
    filler.remove()
    textsu.remove()
    labbtn.remove()
        }
        else{
            const labgen = document.querySelector(".labgen")
            labgen.remove()
        }
    const label = document.createElement("label")
    label.classList.add("labgen")
    label.htmlFor = 'imgFile'
    const labelImg = document.createElement("img")
    labelImg.src = `${newImg}`
    labelImg.classList.add("imgSize")
    label.appendChild(labelImg)
    formImage.prepend(label)
 
}); 

const formModalAdd = document.querySelector(".form")
const warningPlace = document.getElementById("categories")
const warning = document.createElement("div")
warning.classList.add("warning")
const btnValid = document.getElementById("form__valid")

/* verification des differents champs du formulaire */

formModalAdd.addEventListener("change", (event) =>{
 
    if(imgFileBtn.files[0] === undefined){
        warning.innerText = "manque image"
        warningPlace.after(warning)
        btnValid.disabled = true
    }
    else if(formTitre.value === ""){
        warning.innerText = "manque titre"
        warningPlace.after(warning)
        btnValid.disabled = true
    }
    else if(formCategorie.value == 0){
        warning.innerText = "manque categorie"
        warningPlace.after(warning)
        btnValid.disabled = true
    }
    else {
        warning.innerText = ""
    btnValid.disabled = false
    }

})  

/* envoi du formulaire */

formModalAdd.addEventListener("submit", (event) =>{
    event.preventDefault()
 
    formModal.image = imgFileBtn.files[0]
    formModal.title = formTitre.value
    formModal.category = formCategorie.value

    postNewItem()
})

async function postNewItem(){
    const formData = new FormData();
    formData.append("image", formModal.image);
    formData.append("title", formModal.title);
    formData.append("category", parseInt(formModal.category));

    await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        body:formData,
    })
    imgFileBtn.value = ""
    formTitre.value = ""
    warning.innerText = ""
    formCategorie.value = 0
    btnValid.disabled = true
    originalImageForm()

    showWork()
}

/* reinitialiser la partie upload image du formulaire */

function originalImageForm(){
 
    const image = document.querySelector(".labgen")
    image.remove()
    const divOne = document.createElement("div")
    divOne.classList.add("form__filler")
    const divOneI = document.createElement("i")
    divOneI.classList.add("fa-regular")
    divOneI.classList.add("fa-image")
    divOne.appendChild(divOneI)

    const label = document.createElement("label")
    label.classList.add("form__btn")
    label.htmlFor = 'imgFile'
    label.innerText = "+ Ajouter Photo"

    const p = document.createElement("p")
    p.classList.add("form__subtext")
    p.innerText = "jpg, png : 4mo max"

    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("name", "imgFile")
    input.setAttribute("id", "imgFile")
    input.setAttribute("accept", "image/jpeg, image/png, image/jpg")

    formImage.appendChild(divOne)
    formImage.appendChild(label)
    formImage.appendChild(p)
    formImage.appendChild(input)
}
