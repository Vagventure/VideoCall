const username = document.getElementById("username");
const createBtn = document.getElementById("create-user");
const allUsers = document.getElementById("allusers");
const socket = io()

createBtn.addEventListener("click", ()=>{
    const inputContainer = document.querySelector(".username-input")
    if(username.value != ""){
        socket.emit("join user",username.value)
    }
    inputContainer.style.display = 'none';

    const li = document.createElement("li");
    li.innerText = `
    
    `
})

// handle socket events
socket.on("joined", allusers => {
    console.log({allusers});
    const createUsersHtml = ()=>{
        allUsers.innerHTML = "";

        for(const user in allusers){
            const li = document.createElement("li")
            li.textContent = `${user} ${user === username.value ? "(You)":""}`

            if(user!== username.value){
                const button = document.createElement("button")
                button.classList.add("call-btn");
                button.addEventListener('click', ()=>{
                  StartCall(user);
                })
                const img = document.createElement("img");
                img.setAttribute("src", "/images/phone.png");
                img.setAttribute("width", 20);

                button.appendChild(img);

                li.appendChild(button);
            }

            allUsers.appendChild(li);
        }
    }

    createUsersHtml();
})


const StartCall = (user)=>{
    console.log(user);
}