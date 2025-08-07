const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Parse incoming form-urlencoded requests from Twilio
app.use(bodyParser.urlencoded({ extended: false }));

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Root route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp bot is running...');
});

// Webhook route that Twilio hits when a WhatsApp message comes in
app.post('/webhook', async (req, res) => {
  const msgBody = req.body.Body;
  const from = req.body.From;

  console.log(`📩 Message from ${from}: ${msgBody}`);

  try {
    let reply;

    // Simple response logic
    if (msgBody.toLowerCase().includes('hi')) {
      reply = '👋 Hello! Welcome to Ayyanar Rice Store. Type "menu" to see our products.';
    } else if (msgBody.toLowerCase().includes('menu')) {
      reply = '📦 Available Products:\n1. Ponni Rice 25kg\n2. Sona Masoori 10kg\n3. Basmati 5kg\nReply with the number to order.';
    } else {
      reply = '🤖 Sorry, I didn’t understand that. Please type "hi" or "menu".';
    }

    // Send message back via Twilio
    const message = await client.messages.create({
      body: reply,
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: from
    });

    console.log(`✅ Sent reply to ${from}: ${reply}`);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error sending reply:', error);
    res.sendStatus(500);
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
