// import AgoraRTC from "agora-rtc-sdk-ng"

let client = null;

let localVideoTrack = null;
let localAudioTrack = null;

console.log("124")

let appId = process.env.APP_ID;
const params = new URLSearchParams(window.location.search);
const channel = params.get("roomId");
const uid = params.get("uid");
const token = params.get("token");

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

  client.on("user-unpublished", (user) => {
    {
      const remotePlayerContainer = document.getElementById(user.uid);
      remotePlayerContainer && remotePlayerContainer.remove();
    }
  })
}

async function joinChannel() {
  // console.log("hello")
  await client.join(appId, channel, token, uid);
  await createLocalTracks();
  await publishLocalTracks();
  displayLocalVideo();
  console.log("Joined room")
}

async function createLocalTracks() {
  localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
}

async function publishLocalTracks() {
  await client.publish([localAudioTrack, localVideoTrack])
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

async function leaveChannel() {
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

function setupButtonHandlers() {
  document.getElementById("join").onclick = joinChannel();
  //   document.getElementById("join-room").addEventListener("click", async () => {
  //     channel = document.getElementById("roomId").value;
  //     token = document.getElementById("roomPass").value;
  //     console.log("Joining channel:", channel , " with password : ", token);
  //     const div1 = document.querySelector(".Room-box-outer");
  //     const div2 = document.querySelector(".video-streams")
  //     const div3 = document.querySelector(".row")
  //     div1.classList.add("hidden");
  //     div2.classList.toggle("hidden");
  //     div3.classList.toggle("hidden");
  //     await joinChannel();
  // });

  // console.log("Setting up button handlers...");

  // const joinBtn = document.getElementById("join-room");
  // console.log("joinBtn:", joinBtn);

  // joinBtn.addEventListener("click", async () => {
  //   console.log("Join button clicked!");
  //   channel = document.getElementById("roomId").value;
  //   token = document.getElementById("roomPass").value;
  //   console.log("Joining channel:", channel, "with token:", token);
  //   await joinChannel();
  // });


  document.getElementById("leave").onclick = leaveChannel();
}

function startBasicCall() {
  initializeClient();
  window.onload = setupButtonHandlers;
}

startBasicCall();
