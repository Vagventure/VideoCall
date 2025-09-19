// import AgoraRTC from "agora-rtc-sdk-ng"

// let client = null;

// let localVideoTrack = null;
// let localAudioTrack = null;

// let appId = import.meta.env.VITE_AppId;
// let channel = import.meta.env.VITE_Channel;
// let token = import.meta.env.VITE_Token;
// let uid = 0;

// function initializeClient() {
//   client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//   setupEventListeners();
// }

// function setupEventListeners() {
//   client.on("user-published", async (user, mediaType) => {
//     await client.subscribe(user, mediaType)
//     console.log("user to mdt subscibe success")

//     if (mediaType === "video") {
//     displayRemoteVideo(user);
//     }
//     if (mediaType === "audio") {
//       user.audioTrack.play();
//     }
//   })

//   client.on("user-unpublished", (user)=>{{
//     const remotePlayerContainer = document.getElementById(user.uid);
//     remotePlayerContainer && remotePlayerContainer.remove();
//   }})
// }

// async function joinChannel (){
//   await client.join(appId,channel,token,uid);
//   await createLocalTracks();
//   await publishLocalTracks();
//   displayLocalVideo();
//   console.log("Joined room")
// }

// async function createLocalTracks(){
//   localVideoTrack = await AgoraRTC.createCameraVideoTrack();
//   localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
// }

// async function publishLocalTracks(){
//   await client.publish([localAudioTrack,localVideoTrack])
// }

// function displayLocalVideo() {
//   const streams = document.querySelector(".video-streams")
//   const localPlayerContainer = document.createElement("div")
//   localPlayerContainer.id = uid;
//   localPlayerContainer.textContent = `Local user ${uid}`;
//   localPlayerContainer.style.width = "640px";
//   localPlayerContainer.style.height = "480px";
//   streams.appendChild(localPlayerContainer);
//   localVideoTrack.play(localPlayerContainer)
  
// }

// function displayRemoteVideo(user) {
//   const remoteVideoTrack = user.videoTrack;
//   const streams = document.querySelector(".video-streams")
//   const remotePlayerContainer = document.createElement("div")
//   remotePlayerContainer.id = user.uid.toString();
//   remotePlayerContainer.textContent = `Remote user ${user.uid}`;
//   remotePlayerContainer.style.width = "640px";
//   remotePlayerContainer.style.height = "480px";
//   streams.appendChild(remotePlayerContainer);
//   remoteVideoTrack.play(remotePlayerContainer)
  
// }

// async function leaveChannel(){
// localAudioTrack.close()
// localVideoTrack.close()

// const localPlayerContainer = document.getElementById(uid);
// localPlayerContainer && localPlayerContainer.remove();

// client.remoteUsers.forEach((user) => {
//   const playerContainer = document.getElementById(user.uid);
//   playerContainer && playerContainer.remove();
// });

// await client.leave()
// }

// function setupButtonHandlers(){
//   document.getElementById("join").onclick = joinChannel();
//   document.getElementById("leave").onclick = leaveChannel();
// }

// function startBasicCall(){
//   initializeClient();
//   window.load = setupButtonHandlers;
// }

// startBasicCall();

import AgoraRTC from "agora-rtc-sdk-ng";

// RTC client instance
let client = null;

// Declare variables for the local tracks
let localAudioTrack = null; 
let localVideoTrack = null; 

// Connection parameters
let appId = "7f3f3c4be24b46f0aadc1c56944f45f6"
let channel = "OmniV12"
let token ="007eJxTYFBPn2HDYdpbcv86++v1Dz6uY+o5G6H38GYfnyF3uXq0yWcFBvM04zTjZJOkVCOTJBOzNIPExJRkw2RTM0sTkzQT0zQzk6+nMxoCGRncNQ4xMTJAIIjPzuCfm5cZZmjEwAAAmTYf9w=="
let uid = 0; // User ID

// Initialize the AgoraRTC client
function initializeClient() {
    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setupEventListeners();
}

// Handle client events
function setupEventListeners() {
    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");

        if (mediaType === "video") {
            displayRemoteVideo(user);
        }

        if (mediaType === "audio") {
            user.audioTrack.play();
        }
    });

    client.on("user-unpublished", (user) => {
        const remotePlayerContainer = document.getElementById(user.uid);
        remotePlayerContainer && remotePlayerContainer.remove();
    });
}

// Join a channel and publish local media
async function joinChannel() {
    await client.join(appId, channel, token, uid);
    await createLocalTracks();
    await publishLocalTracks();
    displayLocalVideo();
    console.log("Publish success!");
}

// Create local audio and video tracks
async function createLocalTracks() {
    localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localVideoTrack = await AgoraRTC.createCameraVideoTrack();
}

// Publish local audio and video tracks
async function publishLocalTracks() {
    await client.publish([localAudioTrack, localVideoTrack]);
}

// Display local video
function displayLocalVideo() {
  const streams = document.querySelector(".video-streams")
  const localPlayerContainer = document.createElement("div")
  localPlayerContainer.className = "local-video"
  localPlayerContainer.id = uid;
//   localPlayerContainer.textContent = `Local user ${uid}`;
//   localPlayerContainer.style.width = "640px";
//   localPlayerContainer.style.height = "480px";
  streams.appendChild(localPlayerContainer);
  localVideoTrack.play(localPlayerContainer)
  
}


// Display remote video
function displayRemoteVideo(user) {
  const remoteVideoTrack = user.videoTrack;
  const streams = document.querySelector(".video-streams")
  const remotePlayerContainer = document.createElement("div")
  remotePlayerContainer.className = "remote-video"
  remotePlayerContainer.id = user.uid.toString();
//   remotePlayerContainer.textContent = `Remote user ${user.uid}`;
//   remotePlayerContainer.style.width = "640px";
//   remotePlayerContainer.style.height = "480px";
  streams.appendChild(remotePlayerContainer);
  remoteVideoTrack.play(remotePlayerContainer)
  
}
// Leave the channel and clean up
async function leaveChannel() {
    // Close local tracks
    localAudioTrack.close();
    localVideoTrack.close();

    // Remove local video container
    const localPlayerContainer = document.getElementById(uid);
    localPlayerContainer && localPlayerContainer.remove();

    // Remove all remote video containers
    client.remoteUsers.forEach((user) => {
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
    });

    // Leave the channel
    await client.leave();
}

// Set up button click handlers
function setupButtonHandlers() {
    document.getElementById("join").onclick = joinChannel;
    document.getElementById("leave").onclick = leaveChannel;
}

// Start the basic call
function startBasicCall() {
    initializeClient();
    window.onload = setupButtonHandlers;
}

startBasicCall();