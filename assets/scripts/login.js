const email = document.getElementById("email")
const password = document.getElementById("password")
const form = document.querySelector("form")
const login = { email:"", password:"" }
//const regexEmail = new RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")

async function postLogin(){
    const logins = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
    })
    if (logins.ok){
        loginJson = await logins.json()
        localStorage.setItem("token", loginJson.token) 
        window.location.href = 'index.html'           
    }
    else{

        const warning = await document.createElement("div")
        warning.classList.add("warning")
        await password.after(warning)
        if (logins.status === 401){
            warning.innerText = "Mauvais mot de passe"
        }
        else{
            warning.innerText = "Utilisateur inconnu"
        } 
    }
}

form.addEventListener("submit", (event) =>{
    event.preventDefault()
    const warningCheck = document.querySelector(".warning")
    if(warningCheck){
        warningCheck.remove()
    }
    login.email = email.value
    login.password = password.value
    postLogin()
})
