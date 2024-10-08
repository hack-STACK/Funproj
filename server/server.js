require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const logger = require("morgan");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set");
}

const client = twilio(accountSid, authToken);

app.post("/submit", (req, res) => {
  const { sender, answers } = req.body;
  const message = `Sender: ${sender}\nAnswers: ${answers.join(", ")}`;

  client.messages
    .create({
      body: message,
      from: "whatsapp:+14155238886", // Your Twilio WhatsApp number
      to: "whatsapp:+6281234047522", // Your personal WhatsApp number
    })
    .then((message) => {
      console.log("Message sent: ", message.sid);
      res.json({ success: true });
    })
    .catch((error) => {
      console.error("Error sending SMS:", error);
      res.status(500).json({ error: error.message });
    });
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the homepage!');
});

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});