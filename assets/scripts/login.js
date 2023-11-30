const email = document.getElementById("email")
const password = document.getElementById("password")

async function postLogins(){
    const logins = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{""}'
    });
    const data = await logins.json()
    return data
}

async function checkLogin(){
    const login = await postLogins()
    console.log(login)
}

//checkLogin()

/* liens */
const projetPage = document.getElementById("index")
projetPage.addEventListener("click", () => {
    window.location.href = 'index.html';
})

const contactTag = document.getElementById("contactTag")
contactTag.addEventListener("click", () => {
    window.location.href = 'index.html#contact';
})