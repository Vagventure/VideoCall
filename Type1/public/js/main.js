const createBtn = document.getElementById("create-user");
const allUsersHtml = document.getElementById("allusers");
const localVideo = document.getElementById("localVideo")
const remoteVideo = document.getElementById("remoteVideo")
const endCallBtn = document.getElementById("end-call-btn")
const roomId = document.querySelector(".room-id")
const username = document.getElementById("username");
const joinBtn = document.getElementById("join-room")
const room = document.getElementById("roomid")
let localStream;
let currentRoomId;
const socket = io()
let caller = [];


const PeerConnection = (function () {
    let peerConnection;


    const createPeerConnection = () => {
        const config = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                },
                {
                    urls: "turn:global.relay.metered.ca:80",
                    username: "openai",
                    credential: "openai123"
                },
                {
                    urls: "turns:global.relay.metered.ca:443",
                    username: "openai",
                    credential: "openai123"
                }
            ]
        }
        peerConnection = new RTCPeerConnection(config)

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = function (event) {
            remoteVideo.srcObject = event.streams[0];
        }

        peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                console.log(event.candidate.candidate)
                socket.emit("icecandidate", event.candidate)
            }
        }

        peerConnection.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", peerConnection.iceConnectionState);
        };

        // console.log(peerConnection)
        return peerConnection;
    }

    return {
        getInstance: () => {
            if (!peerConnection) {
                peerConnection = createPeerConnection();
            }

            return peerConnection;
        }
    }
})();

const roomIdGenerator = () => {
    const room = Math.floor(Math.random() * 1000000).toString();
    currentRoomId = room;
    roomId.innerText = `Your room id: ${room}`
}

// joinBtn.addEventListener("click", () => {
//     const inputContainer = document.querySelector(".username-input")
//     if (username.value != "" && room.value != "") {
//         socket.emit("join room", ({ username: username.value, room: room.value }))
//     }
//     inputContainer.classList.add("hidden");

// })

createBtn.addEventListener("click", ()=>{
    const inputContainer = document.querySelector(".username-input")
    if(username.value != ""){
        socket.emit("join user",username.value)
    }
    inputContainer.style.display = 'none';

})

endCallBtn.addEventListener("click", () => {
    socket.emit("call-ended", caller)
})

// handle socket events
socket.on("joined", allusers => {
    console.log({ allusers });
    const createUsersHtml = () => {
        allUsersHtml.innerHTML = "";

        for (const user in allusers) {
            const li = document.createElement("li")
            li.textContent = `${user} ${user === username.value ? "(You)" : ""}`

            if (user !== username.value) {
                const button = document.createElement("button")
                button.classList.add("call-btn");
                button.addEventListener('click', () => {
                    StartCall(user);
                })
                const img = document.createElement("img");
                img.setAttribute("src", "/images/phone.png");
                img.setAttribute("width", 20);

                button.appendChild(img);

                li.appendChild(button);
            }

            allUsersHtml.appendChild(li);
        }
    }

    createUsersHtml();
})

socket.on("joined room", allusers => {
    console.log({ allusers });
    const createUsersHtml = () => {
        allUsersHtml.innerHTML = "";

        for (const room in allusers) {
            const li = document.createElement("li")
            li.textContent = `Room id: ${room}`
            li.className = "room";
            const div = document.createElement("div")
            div.className = "room-mem"
            for (const user in allusers[room]) {
                const button = document.createElement("button")
                button.style.height = "30px"
                button.style.width = "90%";

                button.innerText = `${user}`;
                div.appendChild(button);

            }
            li.appendChild(div);

            allUsersHtml.appendChild(li);
        }
    }

    createUsersHtml();
})

socket.on("offer", async ({ from, to, offer, room }) => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", ({ from, to, answer: pc.localDescription, room }))
    caller = [from, to]
})
socket.on("answer", async ({ from, to, answer, room }) => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(answer);
    // show end call button
    endCallBtn.style.display = "block"
    socket.emit("end-call", ({ from, to, room }))
    caller = [from, to]
});
socket.on("icecandidate", async candidate => {
    const pc = PeerConnection.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate))
})
socket.on("end-call", ({ from, to }) => {
    endCallBtn.style.display = "display";
})
socket.on("call-ended", caller => {
    EndCall();
})
// socket.on("start-call", ({ to, room }) => {
//     StartCall(to, room);
// })
socket.on("start-call", ({ to }) => {
    StartCall(to);
})
const StartCall = async (user) => {
    console.log("Calling to : ", user);
    const pc = PeerConnection.getInstance();
    const offer = await pc.createOffer();
    console.log({ offer })
    await pc.setLocalDescription(offer)
    socket.emit("offer", { from: username.value, to: user, offer: pc.localDescription })
    // socket.emit("offer", { from: username.value, to: user, offer: pc.localDescription, room })
}

const EndCall = async () => {
    const pc = PeerConnection.getInstance();
    if (pc) {
        pc.close();
        endCallBtn.style.display = "none"
    }
}

const StartMyCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    console.log({ stream })
    localStream = stream;
    localVideo.srcObject = stream;
}
StartMyCamera();
roomIdGenerator();

// .\cloudflared.exe tunnel --url http://localhost:3000