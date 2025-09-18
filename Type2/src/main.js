import AgoraRTC from "agora-rtc-sdk-ng"

let client = null;

let localVideoTrack = null;
let localAudioTrack = null;

let appId = import.meta.env.VITE_AppId;
let channel = import.meta.env.VITE_Channel;
let token = import.meta.env.VITE_Token;
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
  localPlayerContainer.id = uid;
  localPlayerContainer.textContent = `Local user ${uid}`;
  localPlayerContainer.style.width = "640px";
  localPlayerContainer.style.height = "480px";
  streams.appendChild(localPlayerContainer);
  localVideoTrack.play(localPlayerContainer)
  
}

function displayRemoteVideo(user) {
  const remoteVideoTrack = user.videoTrack;
  const streams = document.querySelector(".video-streams")
  const remotePlayerContainer = document.createElement("div")
  remotePlayerContainer.id = user.uid.toString();
  remotePlayerContainer.textContent = `Remote user ${user.uid}`;
  remotePlayerContainer.style.width = "640px";
  remotePlayerContainer.style.height = "480px";
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
  document.getElementById("join").onclick = joinChannel();
  document.getElementById("leave").onclick = leaveChannel();
}

function startBasicCall(){
  initializeClient();
  window.load = setupButtonHandlers;
}

startBasicCall();