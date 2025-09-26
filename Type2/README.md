# 📹 P2P Video Calling App  

A simple **peer-to-peer video calling app** built with **Agora Web SDK** and **Node.js (Express)**.  
Users can create or join rooms with a **Room ID** and **Password**, and securely connect using dynamically generated tokens.  

---

## Features  
- 🔒 Room creation with password protection  
- 🎥 Real-time audio/video streaming (powered by Agora)  
- 🎤 Toggle microphone and camera on/off    
- 👥 Automatic handling of local & remote video feeds  
- ❌ Leave room functionality  
- 🛠 Simple UI for quick testing  

---

## 📋 Prerequisites  

Before you run this project, make sure you have:  

1. **Node.js** installed.  
2. An **Agora Developer Account** → [Sign up here](https://www.agora.io/).  
3. An **Agora App ID** and **App Certificate** from the [Agora Console](https://console.agora.io/).    

---

## Tech Stack

- Frontend → Vanilla JavaScript + Agora Web SDK
- Backend → Node.js (Express)
- Environment Variables → dotenv

## Notes:

- Tokens are short-lived (default: 1 hour). You can adjust expiration in server.js.
- Rooms are stored in-memory (reset if server restarts). For production, use a database.
- Works best in modern browsers (Chrome, Edge, Firefox).

## ⚙️ Installation  

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/p2p-video-call.git
   cd p2p-video-call
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file in the project root:
   ```bash
   APP_ID=your-agora-app-id
   APP_CERTIFICATE=your-agora-app-certificate
4. Start server:
   ```bash
   node server
## License

MIT License © 2025