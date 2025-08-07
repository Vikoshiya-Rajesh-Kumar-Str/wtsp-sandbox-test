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
// Make sure your Twilio webhook is set to https://<your-domain>/webhook
app.post('/webhook', async (req, res) => {
  const msgBody = req.body.Body;
  const from = req.body.From;

  console.log(`📩 Message from ${from}: ${msgBody}`);

  try {
    // If user says "hi", send interactive template
    if (msgBody.toLowerCase() === 'hi') {
      await client.messages.create({
        from: 'whatsapp:+14155238886', // or your Twilio WhatsApp number
        to: from,
        contentSid: 'HXddf4bc621f3010dc5a98a7115e14ddd8', // <-- replace with your template SID
        // If your template has variables, add contentVariables here
      });
      console.log(`✅ Sent interactive menu to ${from}`);
    } else if (msgBody === 'Ponni Rice 25kg') {
      // Handle button reply for Ponni Rice
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: from,
        body: '✅ Order Confirmed:\nYour order is Ponni Rice 25kg.\nYou will receive your order within 48 hrs.\nThank you for purchasing with us.'
      });
    } else if (msgBody === 'Sona Masoori 10kg') {
      // Handle button reply for Sona Masoori
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: from,
        body: '✅ Order Confirmed:\nYour order is Sona Masoori 10kg.\nYou will receive your order within 48 hrs.\nThank you for purchasing with us.'
      });
    } else if (msgBody === 'Basmati 5kg') {
      // Handle button reply for Basmati
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: from,
        body: '✅ Order Confirmed:\nYour order is Basmati 5kg.\nYou will receive your order within 48 hrs.\nThank you for purchasing with us.'
      });
    } else {
      // Fallback
      await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: from,
        body: '🤖 Sorry, I didn’t understand that. Please type "hi" to see the menu.'
      });
    }

    // Always respond to Twilio webhook
    res.set('Content-Type', 'text/xml');
    res.send('<Response></Response>');
  } catch (error) {
    console.error('❌ Error sending reply:', error.message);
    res.sendStatus(500);
  }
});

// 🏁 Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
