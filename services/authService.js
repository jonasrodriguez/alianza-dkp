const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { auth } = require('google-auth-library');


const SERVICE_ACCOUNT_CREDENTIALS = path.join(process.cwd(), 'service-account.json');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/documents.readonly', 
  'https://www.googleapis.com/auth/spreadsheets'
];

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
  }  
}
