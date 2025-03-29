const UpstoxClient = require('upstox-js-sdk');

// Initialize Upstox client
function initializeUpstox(token) {
    const defaultClient = UpstoxClient.ApiClient.instance;
    const oauth2 = defaultClient.authentications['OAUTH2'];
    oauth2.accessToken = token;
    return defaultClient;
}

// Authentication middleware
const upstoxAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        if (!token) {
            return res.status(401).json({ 
                error: 'Authentication Failed',
                message: 'Authentication token required' 
            });
        }

        // Initialize Upstox client with token
        const client = initializeUpstox(token);
        
        // Attach client to request object for use in routes
        req.upstoxClient = client;
        
        next();
    } catch (error) {
        console.error('Upstox Authentication Error:', error);
        res.status(401).json({ 
            error: 'Authentication Failed',
            message: error.message 
        });
    }
};

module.exports = {
    initializeUpstox,
    upstoxAuth
}; 