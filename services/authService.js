const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { auth } = require('google-auth-library');


const SERVICE_ACCOUNT_CREDENTIALS = path.join(process.cwd(), 'service-account.json');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/documents.readonly', 
  'https://www.googleapis.com/auth/spreadsheets'];
  
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

module.exports = {
  googleClient: async () => {
    try {
      const credentials = await fs.readFile(SERVICE_ACCOUNT_CREDENTIALS);    
      const keys = JSON.parse(credentials);
      const client = auth.fromJSON(keys);
      client.scopes = SCOPES;
      return client;
    } catch (error) {
      console.error(`Error reading google service account credentials: ${error}`);
      throw new Error(`Error reading google service account credentials: ${error}`);
    }
  },
  authorize: async () => {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
