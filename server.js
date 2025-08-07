// server.js
require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const app = express();

const PORT = process.env.PORT || 3000;

// Twilio credentials from environment variables
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Middleware to parse incoming form data (Twilio sends urlencoded)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Test route to check server
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Bot is Running!');
});

// Webhook route to handle incoming WhatsApp messages
app.post('/webhook', async (req, res) => {
  const incomingMsg = req.body.Body?.trim().toLowerCase();
  const from = req.body.From;

  console.log(`Message from ${from}: ${incomingMsg}`);

  let reply = "Sorry, I didn't understand that. Please reply with:\n1. View Products\n2. My Orders\n3. Contact Us";

  if (incomingMsg === 'hi' || incomingMsg === 'hello') {
    reply = '👋 Welcome to Ayyanar Rice Store!\nReply with:\n1. View Products\n2. My Orders\n3. Contact Us';
  } else if (incomingMsg === '1') {
    reply = '🛒 Available Rice Products:\n- Ponni Rice (25kg)\n- Sona Masoori (10kg)\nReply with product name for more.';
  } else if (incomingMsg === '2') {
    reply = '📦 You currently have 0 active orders. Please check back later!';
  } else if (incomingMsg === '3') {
    reply = '📞 Contact us at: +91 98765 43210\nEmail: support@ayyanarrice.com';
  }

  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio Sandbox number
      to: from,
      body: reply
    });
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Error sending message:', err.message);
    res.sendStatus(500);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
