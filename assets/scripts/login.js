const email = document.getElementById("email")
const password = document.getElementById("password")
const form = document.querySelector("form")
const login = { email:"", password:"" }

async function postLogin(){
    const logins = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
    })
    if (logins.ok){
        loginJson = await logins.json()
        localStorage.setItem("token", loginJson.token); 
        window.location.href = 'index.html'           
    }
    else{
        if (logins.status === 401){
        console.log("MAUVAIS MOT DE PASSE")
        }
        else{
            console.log("RIEN NE VA")
        }
            
    }

}

form.addEventListener("submit", (event) =>{
    event.preventDefault()
    login.email = email.value
    login.password = password.value
    postLogin()
})
