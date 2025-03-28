const UpstoxClient = require("upstox-js-sdk");

class UserService {
    constructor(accessToken) {
        // Initialize API client
        this.client = UpstoxClient.ApiClient.instance;
        this.client.authentications["OAUTH2"].accessToken = accessToken;
        
        // Initialize APIs
        this.userApi = new UpstoxClient.UserApi();
        this.portfolioApi = new UpstoxClient.PortfolioApi();
        this.orderApi = new UpstoxClient.OrderApi();
    }

    // Get user profile
    async getProfile() {
        return new Promise((resolve, reject) => {
            this.userApi.getProfile((error, data, response) => {
                if (error) reject(error);
                else resolve(data);
            });
        });
    }

    // Get user's portfolio
    async getPortfolio() {
        return new Promise((resolve, reject) => {
            this.portfolioApi.getHoldings((error, data, response) => {
                if (error) reject(error);
                else resolve(data);
            });
        });
    }

    // Get user's orders
    async getOrders() {
        return new Promise((resolve, reject) => {
            this.orderApi.getOrderBook((error, data, response) => {
                if (error) reject(error);
                else resolve(data);
            });
        });
    }
}

module.exports = UserService; 