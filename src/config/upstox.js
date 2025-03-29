const UpstoxClient = require('upstox-js-sdk');

const initializeUpstox = (token, isSandbox = false) => {
    const client = isSandbox ? new UpstoxClient.ApiClient(true) : new UpstoxClient.ApiClient();
    client.authentications['OAUTH2'].accessToken = token;
    return client;
};

module.exports = { initializeUpstox }; 