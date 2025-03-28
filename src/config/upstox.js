const UpstoxClient = require("upstox-js-sdk");

// Initialize the API client
const initializeUpstox = () => {
    try {
        // Get the default instance
        const defaultClient = UpstoxClient.ApiClient.instance;
        
        // Configure OAuth2 access token for authorization
        const oauth2 = defaultClient.authentications["OAUTH2"];
        oauth2.accessToken = process.env.ACCESS_TOKEN;

        return defaultClient;
    } catch (error) {
        console.error('Error initializing Upstox client:', error);
        throw error;
    }
};

// Initialize market data streamer
const initializeMarketDataStreamer = () => {
    try {
        const streamer = new UpstoxClient.MarketDataStreamer();
        
        // Configure auto-reconnect (optional)
        streamer.autoReconnect(true, 10, 3); // Enable auto-reconnect, 10s interval, 3 retries
        
        return streamer;
    } catch (error) {
        console.error('Error initializing market data streamer:', error);
        throw error;
    }
};

module.exports = {
    initializeUpstox,
    initializeMarketDataStreamer,
    UpstoxClient
};
