const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const from = req.body.From;
  const msg = req.body.Body?.toLowerCase() || '';

  console.log(`📩 Message from ${from}: ${msg}`);

  let reply = '👋 Welcome to Ayyanar Rice Store!\nChoose an option:\n1. View Products\n2. My Orders\n3. Contact';

  if (msg.includes('1')) {
    reply = '🛒 Here are our products:\n- Aachi Ponni 25kg\n- Ponni 10kg\n- India Gate 5kg\nReply with quantity to place an order.';
  } else if (msg.includes('2')) {
    reply = '📦 Your orders:\n1. Order #2025-001 - Aachi 25kg x2 - Delivered\n2. Order #2025-002 - Ponni 10kg x1 - Pending';
  } else if (msg.includes('3')) {
    reply = '📞 Contact us at +91-9876543210';
  }

  // Send message back via Twilio API
  await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
    new URLSearchParams({
      From: 'whatsapp:+14155238886',
      To: from,
      Body: reply,
    }),
    {
      auth: {
        username: process.env.TWILIO_SID,
        password: process.env.TWILIO_AUTH_TOKEN,
      },
    }
  );

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
