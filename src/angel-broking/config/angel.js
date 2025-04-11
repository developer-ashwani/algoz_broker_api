// Create Angel Broking API instance
// Authentication middleware for Angel Broking API.
const { SmartAPI, WebSocket } = require('smartapi-javascript');

// Create SmartAPI instance with configuration
const smartApi = new SmartAPI({
    api_key: process.env.ANGEL_API_KEY,
    access_token: process.env.ANGEL_ACCESS_TOKEN,
    refresh_token: process.env.ANGEL_REFRESH_TOKEN,
    // debug: process.env.NODE_ENV === 'development',
    timeout: 7000
});

// Authentication middleware
const angelAuth = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        
        if (!accessToken) {
            return res.status(401).json({
                status: 'error',
                message: 'Access token is missing',
                timestamp: new Date().toISOString()
            });
        }

        // Set token in SmartAPI instance
        smartApi.setAccessToken(accessToken);

        // Verify token by making a profile API call
        const profile = await smartApi.getProfile();

        // Attach angel instance to request
        req.angel = {
            smartApi: smartApi,
            client_code: profile.clientcode
        };

        next();
    } catch (error) {
        // Handle specific API errors
        if (error.message?.includes('token expired')) {
            return res.status(401).json({
                status: 'error',
                message: 'Token expired'
            });
        }

        if (error.message?.includes('invalid token')) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token'
            });
        }

        // Generic error response
        return res.status(500).json({
            status: 'error',
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// WebSocket connection factory
const createWebSocket = (feedToken) => {
    try {
        if (!feedToken) {
            throw new Error('Feed token is required');
        }

        return new WebSocket({
            client_code: process.env.ANGEL_CLIENT_CODE,
            feed_token: feedToken
        });
    } catch (error) {
        console.error('WebSocket creation failed:', error);
        throw error;
    }
};

module.exports = {
    smartApi,
    angelAuth,
    createWebSocket
};