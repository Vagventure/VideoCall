import dotenv from "dotenv"
dotenv.config();
import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;


const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3000

app.use(express.static("public"))

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const rooms = {};
app.get('/', (req, res) => {
  res.sendFile(join(__dirname + "/index.html"))
})

app.get('/room', (req, res) => {
  res.sendFile(join(__dirname + "/public/room.html"))

})

app.get('/Generate-Token', (req, res) => {
  const channel = req.query.channelName.trim()
  const pass = req.query.password.trim()

  console.log("Creating room: ",channel," with pass: ", pass);

  rooms[channel] = {password:pass};
  console.log(rooms)

  const uid = Math.floor(Math.random() * 100000);

  const role = RtcRole.PUBLISHER
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const tokenExpirationInSeconds = currentTimestamp + 3600;
  const privilegeExpireTs = currentTimestamp + tokenExpirationInSeconds;


  // console.log("App Id:", APP_ID);
  // console.log("App Certificate:", APP_CERTIFICATE);
  if (APP_ID == undefined || APP_ID == "" || APP_CERTIFICATE == undefined || APP_CERTIFICATE == "") {
    console.log("Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE");
    process.exit(1);
  }

  const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, role, tokenExpirationInSeconds, privilegeExpireTs);
  // console.log("Token is : ", tokenWithUid);

  res.send({ roomId: channel, uid: uid, token: tokenWithUid });
})


app.get('/Generate-Token-Join', (req, res) => {
  const channel = req.query.channelName.trim()
  const pass = req.query.password.trim()

  console.log("Joining room: ",channel," with pass: ", pass);

  if(!rooms[channel]){
   return res.send({
      success: false,
      message: "No such room exists"
    });
  }

  if(rooms[channel] && rooms[channel].password != pass){
   return res.send({
      success: false,
      message: "Invalid Password",
      pass: rooms[channel].password
    });
  }

  console.log(rooms)

  const uid = Math.floor(Math.random() * 100000);

  const role = RtcRole.PUBLISHER
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const tokenExpirationInSeconds = currentTimestamp + 3600;
  const privilegeExpireTs = currentTimestamp + tokenExpirationInSeconds;


  // console.log("App Id:", APP_ID);
  // console.log("App Certificate:", APP_CERTIFICATE);
  if (APP_ID == undefined || APP_ID == "" || APP_CERTIFICATE == undefined || APP_CERTIFICATE == "") {
    console.log("Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE");
    process.exit(1);
  }

  const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, role, tokenExpirationInSeconds, privilegeExpireTs);
  // console.log("Token is : ", tokenWithUid);

  res.send({ roomId: channel, uid: uid, token: tokenWithUid });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
