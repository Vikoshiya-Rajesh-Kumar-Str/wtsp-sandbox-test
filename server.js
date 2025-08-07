const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Ensure required env vars are present
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error('❌ Missing Twilio credentials in .env file');
  process.exit(1);
}

// ✅ Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Middleware to parse x-www-form-urlencoded bodies (required for Twilio webhooks)
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp bot is running...');
});

// ✅ Webhook endpoint Twilio will POST to
app.post('/webhook', async (req, res) => {
  const msgBody = req.body.Body;
  const from = req.body.From;

  console.log(`📩 Message from ${from}: ${msgBody}`);

  try {
    let reply;

    // 🧠 Logic for bot replies
    switch (msgBody.toLowerCase()) {
      case 'hi':
        reply = '👋 Hello! Welcome to Ayyanar Rice Store.\n📦 Available Products:\n1. Ponni Rice 25kg\n2. Sona Masoori 10kg\n3. Basmati 5kg\nReply with the number to order.';
        break;
      case '1':
        reply = '✅ Order Confirmed:\nYour order is Ponni Rice 25kg.\nYou will receive your order within 48 hrs.\nThank you for purchasing with us.';
        break;
      case '2':
        reply = '✅ Order Confirmed:\nYour order is Sona Masoori 10kg.\nYou will receive your order within 48 hrs.\nThank you for purchasing with us.';
        break;
      case '3':
        reply = '✅ Order Confirmed:\nYour order is Basmati 5kg.\nYou will receive your order within 48 hrs.\nThank you for purchasing with us.';
        break;
      default:
        reply = '🤖 Sorry, I didn’t understand that. Please type "hi" or "menu".';
    }

    // 📤 Send message via Twilio
    const response = await client.messages.create({
      body: reply,
      from: 'whatsapp:+14155238886', 
      to: from
    });

    console.log(`✅ Sent reply to ${from}: ${reply}`);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error sending reply:', error.message);
    res.sendStatus(500);
  }
});

// 🏁 Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
