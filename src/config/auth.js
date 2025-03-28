const UpstoxClient = require("upstox-js-sdk");
require('dotenv').config();

class UpstoxAuth {
    constructor() {
        this.apiClient = new UpstoxClient.ApiClient();
        this.authApi = new UpstoxClient.LoginApi();
    }

    // Get the login URL for OAuth
    getLoginUrl() {
        const params = {
            client_id: process.env.UPSTOX_API_KEY,
            redirect_uri: process.env.REDIRECT_URI,
            response_type: 'code'
        };
        
        return `https://api.upstox.com/v2/login/authorization/dialog?${new URLSearchParams(params)}`;
    }

    // Exchange authorization code for access token
    async getAccessToken(code) {
        const tokenRequest = new UpstoxClient.TokenRequest();
        tokenRequest.code = code;
        tokenRequest.client_id = process.env.UPSTOX_API_KEY;
        tokenRequest.client_secret = process.env.UPSTOX_API_SECRET;
        tokenRequest.redirect_uri = process.env.REDIRECT_URI;
        tokenRequest.grant_type = 'authorization_code';

        return new Promise((resolve, reject) => {
            this.authApi.token(tokenRequest, (error, data, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = new UpstoxAuth(); 