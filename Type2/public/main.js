let client = null;

let localVideoTrack = null;
let localAudioTrack = null;

console.log("124")

let appId = "";
const params = new URLSearchParams(window.location.search);
const channel = params.get("roomId");
const uid = params.get("uid");
const token = params.get("token");

async function initializeClient() {
  client = await AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  setupEventListeners();
}

function setupEventListeners() {
  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType)
    console.log("user to mdt subscibe success")

    if (mediaType === "video") {
      const localPlayerContainer = document.querySelector(".local-video")
      localPlayerContainer.style.width = "";
      localPlayerContainer.style.height = "";
      // localPlayerContainer.style.left = "181px";
      displayRemoteVideo(user);
      console.log("remote user published")
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  })

  client.on("user-unpublished", (user) => {
    {
      const remotePlayerContainer = document.getElementById(user.uid);
      remotePlayerContainer && remotePlayerContainer.remove();
      const localPlayerContainer = document.querySelector(".local-video")
      localPlayerContainer.style.width = "100%";
      localPlayerContainer.style.height = "100%";
    }
  })
}

async function joinChannel() {
  console.log("join clicked")
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
  localPlayerContainer.className = "video local-video"
  localPlayerContainer.id = uid;
  localPlayerContainer.style.width = "100%";
  localPlayerContainer.style.height = "100%";
  streams.appendChild(localPlayerContainer);
  localVideoTrack.play(localPlayerContainer)

}

function displayRemoteVideo(user) {
  const remoteVideoTrack = user.videoTrack;
  const streams = document.querySelector(".video-streams")
  const remotePlayerContainer = document.createElement("div")
  remotePlayerContainer.className = "video remote-video"
  remotePlayerContainer.id = user.uid.toString();
  streams.appendChild(remotePlayerContainer);
  remoteVideoTrack.play(remotePlayerContainer)

}

async function leaveChannel() {
  console.log("Leave clicked")
  localAudioTrack.close()
  localVideoTrack.close()

  const localPlayerContainer = document.getElementById(uid);
  localPlayerContainer && localPlayerContainer.remove();

  client.remoteUsers.forEach((user) => {
    const playerContainer = document.getElementById(user.uid);
    playerContainer && playerContainer.remove();
  });
  alert("You left the room")
  await client.leave()
  window.location.href = "/";
}

async function toggleMic() {
  if (!localAudioTrack) return;

  if (localAudioTrack.enabled) {
    await localAudioTrack.setEnabled(false);
    console.log("Mic muted");
  } else {
    await localAudioTrack.setEnabled(true);
    console.log("Mic unmuted");
  }
}


async function toggleCamera() {
  if (!localVideoTrack) return;

  if (localVideoTrack.enabled) {
    await localVideoTrack.setEnabled(false);
    console.log("Camera turned OFF");
  } else {
    await localVideoTrack.setEnabled(true);
    console.log("Camera turned ON");
  }
}



let mute = false;
document.getElementById("mute").addEventListener("click", async () => {
  document.getElementById("mute").classList.toggle("on")
  if (!mute) {
    document.getElementById("mute").innerHTML = `<img src="audio.svg">`
    mute = true;
  } else {
    document.getElementById("mute").innerHTML = `<img src="mic.svg">`
    mute = false;
  }
  await toggleMic();
});

let videOff = false;
document.getElementById("video").addEventListener("click", async () => {
  document.getElementById("video").classList.toggle("on");
  if (!videOff) {
    document.getElementById("video").innerHTML = `<img src="video.svg">`
    videOff = true;
  } else {
    document.getElementById("video").innerHTML = `<img src="videoOn.svg">`
    videOff = false;
  }
  await toggleCamera();
});


function setupButtonHandlers() {
  document.getElementById("leave").onclick = leaveChannel;
  joinChannel();
}

function startBasicCall() {
  initializeClient();
  window.onload = setupButtonHandlers;
}

startBasicCall();
