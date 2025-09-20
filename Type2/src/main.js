import AgoraRTC from "agora-rtc-sdk-ng"

let client = null;

let localVideoTrack = null;
let localAudioTrack = null;

let appId = import.meta.env.VITE_APPID
let channel = "Cars24";
let token = "007eJxTYKhP6az6tNiLac2/mtsWz3eJhkeZXT/2+JmnxOaah0sV5kUpMJinGacZJ5skpRqZJJmYpRkkJqYkGyabmlmamKSZmKaZibuey2gIZGTIbitlZGSAQBCfjcE5sajYyISBAQAZtCEr";
let uid = 0;

function initializeClient() {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  setupEventListeners();
}

function setupEventListeners() {
  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType)
    console.log("user to mdt subscibe success")

    if (mediaType === "video") {
    displayRemoteVideo(user);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  })

  client.on("user-unpublished", (user)=>{{
    const remotePlayerContainer = document.getElementById(user.uid);
    remotePlayerContainer && remotePlayerContainer.remove();
  }})
}

async function joinChannel (){
  // console.log("hello")
  await client.join(appId,channel,token,uid);
  await createLocalTracks();
  await publishLocalTracks();
  displayLocalVideo();
  console.log("Joined room")
}

async function createLocalTracks(){
  localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
}

async function publishLocalTracks(){
  await client.publish([localAudioTrack,localVideoTrack])
}

function displayLocalVideo() {
  const streams = document.querySelector(".video-streams")
  const localPlayerContainer = document.createElement("div")
  localPlayerContainer.className = "local-video"
  localPlayerContainer.id = uid;
  streams.appendChild(localPlayerContainer);
  localVideoTrack.play(localPlayerContainer)
  
}

function displayRemoteVideo(user) {
  const remoteVideoTrack = user.videoTrack;
  const streams = document.querySelector(".video-streams")
  const remotePlayerContainer = document.createElement("div")
  remotePlayerContainer.className = "remote-video"
  remotePlayerContainer.id = user.uid.toString();
  streams.appendChild(remotePlayerContainer);
  remoteVideoTrack.play(remotePlayerContainer)
  
}

async function leaveChannel(){
localAudioTrack.close()
localVideoTrack.close()

const localPlayerContainer = document.getElementById(uid);
localPlayerContainer && localPlayerContainer.remove();

client.remoteUsers.forEach((user) => {
  const playerContainer = document.getElementById(user.uid);
  playerContainer && playerContainer.remove();
});

await client.leave()
}

function setupButtonHandlers(){
  // document.getElementById("join").onclick = joinChannel();
  document.getElementById("join").addEventListener("click", async () => {
    channel = document.getElementById("room").value;
    console.log("Joining channel:", channel);
    // await joinChannel();
});


  document.getElementById("leave").onclick = leaveChannel();
}

function startBasicCall(){
  initializeClient();
  window.onload = setupButtonHandlers;
}

startBasicCall();
