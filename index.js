import readline from 'readline';
import Mastodon from 'mastodon-api';

const askParameter = async (rl, label, defaultValue = null) => {
  let question = null;
  if (defaultValue != null) {
    question = `${label} [default=${defaultValue}]: `;
  } else {
    question = `${label}: `;
  }
  return new Promise((resolve) => {
    rl.question(question, value => {
      let finalValue = value;
      if (value == null || value.trim() === '') {
        finalValue = defaultValue;
      }
      resolve(finalValue);
    });
  });
};

const getToken = async (rl, instanceUrl, clientName, scopes = 'read write follow') => {
  const apiUrl = `${instanceUrl}/api/v1/apps`;

  const response = await Mastodon.createOAuthApp(apiUrl, clientName, scopes);
  console.log('OAuth data - ', response);

  const clientId = response.client_id;
  const clientSecret = response.client_secret;

  const authUrl = await Mastodon.getAuthorizationUrl(clientId, clientSecret, instanceUrl, scopes);
  console.log('This is the authorization URL. Open it in your browser and authorize with your account.');
  console.log(authUrl);

  const code = await askParameter(rl, 'Please enter the code from the website');

  const accessToken = await Mastodon.getAccessToken(clientId, clientSecret, code, instanceUrl);
  console.log('Congratulations! This is the access token. Save it!');
  console.log(accessToken);

  return accessToken;
};

const run = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const instanceUrl = await askParameter(rl, 'Please type the instance url (e.g., https://mastodon.social)');
  const clientName = await askParameter(rl, 'Please type the requester name');
  const scopes = await askParameter(rl, 'Please type a list of scopes', 'read write follow');

  if (instanceUrl == null || instanceUrl.trim() === '') {
    throw new Error('Instance url is mandatory');
  }
  if (clientName == null || clientName.trim() === '') {
    throw new Error('Requester name is mandatory');
  }

  const accessToken = await getToken(rl, instanceUrl, clientName, scopes || 'read write follow');

  rl.close();

  return {
    accessToken,
    instanceUrl,
  };
};

run()
  .then(() => {})
  .catch(e => console.log(e));
