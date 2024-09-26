// Initialization
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());


//--------------------------------------------------------------------------------------------Sign UP---------------------------------------------------------------------------------------------


// Firebase Admin SDK Initialization
const serviceAccount = require('./skylynx-f89a9-firebase-adminsdk-o3eso-854eb8632c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skylynx-2027.firebaseio.com"
});

const db = admin.firestore();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));

// Load your OAuth 2.0 credentials
const CREDENTIALS_PATH = path.join(__dirname, 'gmailapicreds.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
// Scopes for Gmail API
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

let oAuth2Client;

// Load client secrets from a local file
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.error('Error loading client secret file:', err);
  authorize(JSON.parse(content));
});

// Authorize a client with credentials, then call the Gmail API
function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
  });
}

// Get new token if not available
function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
}

// Helper function to send email
async function sendWelcomeEmail(rEmail, username) {
  console.log('Email to be sent to:', rEmail);
  if (!rEmail) {
    throw new Error('Recipient email address is required');
  }

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  // Properly format the email message
  const message = [
    `From: "Skylynx" <noreply.skylynx@gmail.com>`,
    `To: ${rEmail}`,
    `Subject: Welcome to Our Website, ${username}!`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    `<html>`,
    `<head>`,
    `<style>`,
    `  body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }`,
    `  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }`,
    `  h1 { color: #333333; text-align: center; }`,
    `  p { font-size: 16px; line-height: 1.5; color: #555555; text-align: center; }`,
    `  .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #999999; }`,
    `</style>`,
    `</head>`,
    `<body>`,
    `  <div class="container">`,
    `    <h1>Welcome, ${username}!</h1>`,
    `    <p>Thank you for signing up on Skylynx. We're excited to have you on board and hope you enjoy our services.</p>`,
    `    <p>If you have any questions, feel free to reach out to our support team.</p>`,
    `  </div>`,
    `  <div class="footer">`,
    `    <p>&copy; 2024 Skylynx. All rights reserved.</p>`,
    `  </div>`,
    `</body>`,
    `</html>`
  ].join('\n');
  
  const encodedMessage = Buffer
    .from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // This line strips any trailing '=' padding

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Email sent:', res.data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
}


// Signup route
app.post('/signup', async (req, res) => {
  const { rEmail, rUsername, rPassword } = req.body;

  console.log('Received signup request:', { rEmail, rUsername, rPassword });

  try {
    // Create user with Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: rEmail,
      password: rPassword,
      displayName: rUsername
    });

    // Store user details in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      username: rUsername,
      email: rEmail,
    });

    // Log before sending email
    console.log('Sending welcome email to:', rEmail);
    await sendWelcomeEmail(rEmail, rUsername);

    res.status(201).json({ message: 'User created successfully and welcome email sent!', uid: userRecord.uid });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).json({ message: error.message });
  }
});




//------------------------------------------------------------------------------------------------Sign IN---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------Amadeus Auth---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Amadeus API credentials
const AMADEUS_API_KEY = "sUkpdyRISFaD2FkNGnoyJWIHLOlrOJTW";
const AMADEUS_API_SECRET = "EGlaY1bvl63DNVSZ";

let accessToken = '';

// Function to get the access token
const getAuthToken = async () => {
  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    accessToken = response.data.access_token;
    console.log('Access token retrieved:', accessToken);
  } catch (error) {
    console.error('Error fetching auth token:', error.response ? error.response.data : error.message);
  }
};

getAuthToken();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
